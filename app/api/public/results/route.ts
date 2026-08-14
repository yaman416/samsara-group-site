import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("fixtures")
    .select(`
      id, week, venue, played_at, status,
      home_club:clubs!home_club_id(id, name, short_code, home_color, logo_url),
      away_club:clubs!away_club_id(id, name, short_code, home_color, logo_url),
      results(home_score, away_score),
      goal_scorers(id, minute, is_own_goal, is_penalty, club_id, players(full_name, jersey_number), clubs(name)),
      cards(id, player_name, card_type, minute)
    `)
    .eq("status", "completed")
    .order("week", { ascending: true })
    .order("played_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
