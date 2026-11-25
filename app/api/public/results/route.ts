import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const seasonId = req.nextUrl.searchParams.get("season_id");
  let query = supabaseAdmin
    .from("fixtures")
    .select(`
      id, week, venue, played_at, status, season_id,
      home_club:clubs!home_club_id(id, name, short_code, home_color, logo_url),
      away_club:clubs!away_club_id(id, name, short_code, home_color, logo_url),
      results(home_score, away_score),
      goal_scorers(id, minute, is_own_goal, is_penalty, club_id, players(full_name, jersey_number), clubs(name))
    `)
    .eq("status", "completed")
    .order("week", { ascending: true })
    .order("played_at", { ascending: true });
  if (seasonId) query = query.eq("season_id", seasonId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Cards have no club column of their own, so each card's side comes from the booked player's club.
  const fixtureIds = (data ?? []).map(f => f.id as string);
  const { data: cards } = fixtureIds.length
    ? await supabaseAdmin.from("cards").select("id, fixture_id, player_id, player_name, card_type, minute").in("fixture_id", fixtureIds)
    : { data: [] as { id: string; fixture_id: string; player_id: string | null; player_name: string; card_type: string; minute: number | null }[] };
  const playerIds = [...new Set((cards ?? []).map(c => c.player_id).filter((x): x is string => !!x))];
  const { data: players } = playerIds.length
    ? await supabaseAdmin.from("players").select("id, club_id").in("id", playerIds)
    : { data: [] as { id: string; club_id: string }[] };
  const clubOf = new Map((players ?? []).map(p => [p.id as string, p.club_id as string]));

  const out = (data ?? []).map(f => ({
    ...f,
    cards: (cards ?? [])
      .filter(c => c.fixture_id === f.id)
      .map(c => ({ id: c.id, player_name: c.player_name, card_type: c.card_type, minute: c.minute, club_id: c.player_id ? clubOf.get(c.player_id) ?? null : null })),
  }));
  return NextResponse.json(out);
}
