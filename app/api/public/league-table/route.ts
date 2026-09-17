import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const seasonId = req.nextUrl.searchParams.get("season_id");

  // Fetch completed fixtures with results and club info
  let fixturesQuery = supabaseAdmin
    .from("fixtures")
    .select("id, season_id, home_club_id, away_club_id, results(home_score, away_score)")
    .eq("status", "completed");
  if (seasonId) fixturesQuery = fixturesQuery.eq("season_id", seasonId);

  const { data: fixtures, error: fErr } = await fixturesQuery;
  if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 });

  // Fetch clubs
  const { data: clubs, error: cErr } = await supabaseAdmin
    .from("clubs")
    .select("id, name, short_code, logo_url, home_color");
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });

  const clubMap = Object.fromEntries((clubs ?? []).map((c) => [c.id, c]));

  // Compute standings
  type Row = {
    season_id: string; club_id: string; club_name: string; short_code: string;
    logo_url: string | null; home_color: string | null;
    played: number; won: number; drawn: number; lost: number;
    goals_for: number; goals_against: number; goal_diff: number; points: number;
  };
  const table: Record<string, Row> = {};

  const ensure = (seasonId: string, clubId: string) => {
    const key = `${seasonId}:${clubId}`;
    if (!table[key]) {
      const c = clubMap[clubId] ?? { name: "Unknown", short_code: "", logo_url: null, home_color: null };
      table[key] = { season_id: seasonId, club_id: clubId, club_name: c.name, short_code: c.short_code, logo_url: c.logo_url, home_color: c.home_color, played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0 };
    }
    return table[key];
  };

  for (const f of fixtures ?? []) {
    const r = Array.isArray(f.results) ? f.results[0] : f.results;
    if (!r) continue;
    const { home_score: hs, away_score: as_ } = r as { home_score: number; away_score: number };
    const home = ensure(f.season_id, f.home_club_id);
    const away = ensure(f.season_id, f.away_club_id);
    home.played++; away.played++;
    home.goals_for += hs; home.goals_against += as_;
    away.goals_for += as_; away.goals_against += hs;
    if (hs > as_) { home.won++; home.points += 3; away.lost++; }
    else if (hs < as_) { away.won++; away.points += 3; home.lost++; }
    else { home.drawn++; home.points++; away.drawn++; away.points++; }
  }

  const rows = Object.values(table).map((r) => ({ ...r, goal_diff: r.goals_for - r.goals_against }));
  rows.sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff || b.goals_for - a.goals_for || a.club_name.localeCompare(b.club_name));
  const result = rows.map((r, i) => ({ ...r, position: i + 1 }));

  return NextResponse.json(result);
}
