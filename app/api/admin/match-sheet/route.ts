import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";
import { validateMatchSheet, type MatchSheet } from "@/lib/matchday";

// cards.team_id still points at the legacy teams table and is NOT NULL, so every
// card uses the "Unattributed" team row. The club comes from cards.player_id.
const FALLBACK_TEAM_ID = "07b51ddc-6bd1-43a5-b912-b13dfc5d6aa2";

type Fixture = { id: string; home_club_id: string; away_club_id: string };

async function loadFixture(id: string) {
  return supabaseAdmin.from("fixtures").select("id, home_club_id, away_club_id").eq("id", id).maybeSingle<Fixture>();
}

async function loadSquads(f: Fixture) {
  return supabaseAdmin
    .from("players")
    .select("id, club_id, full_name, jersey_number, position, is_active")
    .in("club_id", [f.home_club_id, f.away_club_id])
    .order("jersey_number", { ascending: true, nullsFirst: false })
    .order("full_name");
}

// Everything the match sheet needs for one fixture: saved result, goals,
// cards, and both clubs' registered players.
export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const fixtureId = req.nextUrl.searchParams.get("fixture_id");
  if (!fixtureId) return NextResponse.json({ error: "fixture_id required" }, { status: 400 });

  const { data: fixture, error: fErr } = await loadFixture(fixtureId);
  if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 });
  if (!fixture) return NextResponse.json({ error: "Fixture not found" }, { status: 404 });

  const [players, result, goals, cards] = await Promise.all([
    loadSquads(fixture),
    supabaseAdmin.from("results").select("home_score, away_score").eq("fixture_id", fixtureId).maybeSingle(),
    supabaseAdmin.from("goal_scorers").select("id, player_id, club_id, minute, is_own_goal, is_penalty").eq("fixture_id", fixtureId).order("minute", { nullsFirst: false }),
    supabaseAdmin.from("cards").select("id, player_id, player_name, card_type, minute, reason").eq("fixture_id", fixtureId).order("minute", { nullsFirst: false }),
  ]);
  const failed = players.error || result.error || goals.error || cards.error;
  if (failed) return NextResponse.json({ error: failed.message }, { status: 500 });

  const squad = (players.data ?? []).filter(p => p.is_active !== false);
  return NextResponse.json({
    result: result.data ?? null,
    goals: goals.data ?? [],
    cards: cards.data ?? [],
    home_players: squad.filter(p => p.club_id === fixture.home_club_id),
    away_players: squad.filter(p => p.club_id === fixture.away_club_id),
  });
}

// Saves the whole match sheet: final score, goal scorers and cards. The goals
// and cards sent replace any saved before, so re-saving corrects a sheet.
export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const sheet = (await req.json().catch(() => null)) as MatchSheet | null;
  if (!sheet?.fixture_id) return NextResponse.json({ error: "fixture_id required" }, { status: 400 });

  const { data: fixture, error: fErr } = await loadFixture(sheet.fixture_id);
  if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 });
  if (!fixture) return NextResponse.json({ error: "Fixture not found" }, { status: 404 });

  const { data: players, error: pErr } = await loadSquads(fixture);
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
  const playerClub = new Map((players ?? []).map(p => [p.id, p.club_id]));
  const playerName = new Map((players ?? []).map(p => [p.id, p.full_name]));

  const errors = validateMatchSheet(sheet, fixture.home_club_id, fixture.away_club_id, playerClub);
  if (errors.length) return NextResponse.json({ error: errors.join(" "), errors }, { status: 400 });

  const { error: rErr } = await supabaseAdmin.from("results").upsert(
    { fixture_id: fixture.id, home_score: sheet.home_score, away_score: sheet.away_score, entered_at: new Date().toISOString() },
    { onConflict: "fixture_id" },
  );
  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });

  const { error: gDel } = await supabaseAdmin.from("goal_scorers").delete().eq("fixture_id", fixture.id);
  if (gDel) return NextResponse.json({ error: gDel.message }, { status: 500 });
  if (sheet.goals.length) {
    const { error } = await supabaseAdmin.from("goal_scorers").insert(sheet.goals.map(g => ({
      fixture_id: fixture.id, player_id: g.player_id, club_id: g.club_id,
      minute: g.minute ?? null, is_own_goal: !!g.is_own_goal, is_penalty: !!g.is_penalty,
    })));
    if (error) return NextResponse.json({ error: `Score saved, but goal scorers failed: ${error.message}` }, { status: 500 });
  }

  const { error: cDel } = await supabaseAdmin.from("cards").delete().eq("fixture_id", fixture.id);
  if (cDel) return NextResponse.json({ error: cDel.message }, { status: 500 });
  if (sheet.cards.length) {
    const { error } = await supabaseAdmin.from("cards").insert(sheet.cards.map(c => ({
      fixture_id: fixture.id, player_id: c.player_id, player_name: playerName.get(c.player_id) ?? "Unknown",
      team_id: FALLBACK_TEAM_ID, card_type: c.card_type, minute: c.minute ?? null, reason: c.reason?.trim() || null,
    })));
    if (error) return NextResponse.json({ error: `Score saved, but cards failed: ${error.message}` }, { status: 500 });
  }

  // completed fixtures are what the league table counts
  const { error: sErr } = await supabaseAdmin.from("fixtures").update({ status: "completed" }).eq("id", fixture.id);
  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// Clears a match back to not played: removes the result, goals and cards.
export async function DELETE(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { fixture_id } = await req.json().catch(() => ({}));
  if (!fixture_id) return NextResponse.json({ error: "fixture_id required" }, { status: 400 });
  for (const table of ["results", "goal_scorers", "cards"]) {
    const { error } = await supabaseAdmin.from(table).delete().eq("fixture_id", fixture_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { error } = await supabaseAdmin.from("fixtures").update({ status: "scheduled" }).eq("id", fixture_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
