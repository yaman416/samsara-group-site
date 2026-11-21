import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";
import { checkLiveGoal, tallyGoals, type LiveGoalInput } from "@/lib/matchday";

// Goal scorers saved one at a time while a match is being played (Matchday live panel).
// Each save goes straight into goal_scorers, so nothing waits for full time. The match
// sheet after full time loads these same rows and can still change or add to them.

type Fixture = { id: string; home_club_id: string; away_club_id: string; potm_player_id: string | null };
const GOAL_COLS = "id, player_id, club_id, minute, is_own_goal, is_penalty, created_at";

async function loadFixture(id: string) {
  return supabaseAdmin.from("fixtures").select("id, home_club_id, away_club_id, potm_player_id").eq("id", id).maybeSingle<Fixture>();
}
async function loadSquadMap(f: Fixture) {
  const { data, error } = await supabaseAdmin.from("players").select("id, club_id, is_active").in("club_id", [f.home_club_id, f.away_club_id]);
  return { map: new Map((data ?? []).filter(p => p.is_active !== false).map(p => [p.id as string, p.club_id as string])), error };
}
const loadGoals = (fixtureId: string) =>
  supabaseAdmin.from("goal_scorers").select(GOAL_COLS).eq("fixture_id", fixtureId).order("created_at").order("minute", { nullsFirst: false });

/** The score the scorers must fit inside: the saved result if there is one, else the live score. */
async function currentScore(fixtureId: string) {
  const [res, live] = await Promise.all([
    supabaseAdmin.from("results").select("home_score, away_score").eq("fixture_id", fixtureId).maybeSingle(),
    supabaseAdmin.from("live_matches").select("home_score, away_score").eq("fixture_id", fixtureId).maybeSingle(),
  ]);
  return res.data ?? live.data ?? { home_score: 0, away_score: 0 };
}

// GET ?fixture_id=  -> goals saved so far + Player of the Match
export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const id = req.nextUrl.searchParams.get("fixture_id");
  if (!id) return NextResponse.json({ error: "fixture_id required" }, { status: 400 });
  const [{ data: f }, goals] = await Promise.all([loadFixture(id), loadGoals(id)]);
  if (goals.error) return NextResponse.json({ error: goals.error.message }, { status: 500 });
  return NextResponse.json({ goals: goals.data ?? [], potm_player_id: f?.potm_player_id ?? null });
}

// POST { fixture_id, side, kind, player_id, minute }            -> add one scorer
// POST { fixture_id, potm_player_id }                           -> set / clear Player of the Match
export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const body = await req.json().catch(() => null);
  if (!body?.fixture_id) return NextResponse.json({ error: "fixture_id required" }, { status: 400 });
  const { data: f, error: fErr } = await loadFixture(body.fixture_id);
  if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 });
  if (!f) return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
  const { map, error: pErr } = await loadSquadMap(f);
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  if ("potm_player_id" in body) {
    const pid = body.potm_player_id || null;
    if (pid && !map.has(pid)) return NextResponse.json({ error: "Player of the Match must be in one of the two squads." }, { status: 400 });
    const { error } = await supabaseAdmin.from("fixtures").update({ potm_player_id: pid }).eq("id", f.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, potm_player_id: pid });
  }

  const row = checkLiveGoal(body as LiveGoalInput, f.home_club_id, f.away_club_id, map);
  if (typeof row === "string") return NextResponse.json({ error: row }, { status: 400 });

  const [goals, score] = await Promise.all([loadGoals(f.id), currentScore(f.id)]);
  if (goals.error) return NextResponse.json({ error: goals.error.message }, { status: 500 });
  const t = tallyGoals(goals.data ?? [], f.home_club_id, f.away_club_id);
  const have = body.side === "home" ? t.home : t.away;
  const max = body.side === "home" ? score.home_score : score.away_score;
  if (have >= max) return NextResponse.json({ error: "Every goal for this team already has a scorer. Tap + Goal first." }, { status: 400 });

  const { data, error } = await supabaseAdmin.from("goal_scorers").insert({ fixture_id: f.id, ...row }).select(GOAL_COLS).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Two phones saving the same goal at once can both pass the check above. Count again
  // after the insert and take this row back out if it went over.
  const after = await loadGoals(f.id);
  if (!after.error) {
    // Keep the earliest rows (by save time, then id) so exactly one of two clashing saves survives.
    const forClub = body.side === "home" ? f.home_club_id : f.away_club_id;
    const sideRows = (after.data ?? [])
      .filter(g => (g.is_own_goal ? g.club_id !== forClub : g.club_id === forClub))
      .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)) || String(a.id).localeCompare(String(b.id)));
    if (sideRows.findIndex(g => g.id === data.id) >= max) {
      await supabaseAdmin.from("goal_scorers").delete().eq("id", data.id);
      return NextResponse.json({ error: "Someone else just saved a scorer for this goal. Check the list." }, { status: 409 });
    }
  }
  return NextResponse.json(data);
}

// PATCH { id, fixture_id, side, kind, player_id, minute } -> correct one scorer
export async function PATCH(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.fixture_id) return NextResponse.json({ error: "id and fixture_id required" }, { status: 400 });
  const { data: f } = await loadFixture(body.fixture_id);
  if (!f) return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
  const { map } = await loadSquadMap(f);
  const row = checkLiveGoal(body as LiveGoalInput, f.home_club_id, f.away_club_id, map);
  if (typeof row === "string") return NextResponse.json({ error: row }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("goal_scorers").update(row).eq("id", body.id).eq("fixture_id", f.id).select(GOAL_COLS);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: "That goal was already removed." }, { status: 404 });
  return NextResponse.json(data[0]);
}

// DELETE { id, fixture_id } -> remove one scorer (the goal itself stays on the score)
export async function DELETE(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id, fixture_id } = await req.json().catch(() => ({}));
  if (!id || !fixture_id) return NextResponse.json({ error: "id and fixture_id required" }, { status: 400 });
  const { error } = await supabaseAdmin.from("goal_scorers").delete().eq("id", id).eq("fixture_id", fixture_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
