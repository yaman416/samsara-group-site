import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: club, error } = await supabaseAdmin
    .from("clubs")
    .select("id, name, short_code, home_color, away_color, home_ground, founded, community, logo_url")
    .eq("id", id)
    .single();

  if (error || !club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  const { data: players } = await supabaseAdmin
    .from("players")
    .select("id, full_name, jersey_number, position, date_of_birth")
    .eq("club_id", id)
    .order("jersey_number", { ascending: true });

  return NextResponse.json({ ...club, players: players ?? [] });
}
