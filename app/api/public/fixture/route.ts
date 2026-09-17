import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const [{ data, error }, { data: cards }] = await Promise.all([
    supabaseAdmin
      .from("fixtures")
      .select(`
        id, week, venue, played_at, status, season_id,
        home_club:clubs!home_club_id(id, name, short_code, home_color, away_color, logo_url),
        away_club:clubs!away_club_id(id, name, short_code, home_color, away_color, logo_url),
        results(home_score, away_score),
        goal_scorers(id, minute, is_own_goal, is_penalty, club_id, players(full_name, jersey_number), clubs(name, short_code))
      `)
      .eq("id", id)
      .single(),
    supabaseAdmin
      .from("cards")
      .select("id, player_name, card_type, minute, reason")
      .eq("fixture_id", id)
      .order("minute"),
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ ...data, cards: cards ?? [] });
}
