import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("fixtures")
    .select(`
      id, week, venue, played_at, status,
      home_club:clubs!home_club_id(id, name, short_code, home_color, logo_url),
      away_club:clubs!away_club_id(id, name, short_code, home_color, logo_url),
      results(home_score, away_score)
    `)
    .order("week", { ascending: true })
    .order("played_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
