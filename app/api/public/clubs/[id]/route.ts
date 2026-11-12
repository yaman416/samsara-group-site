import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isSquadApproved } from "@/lib/approved-squads";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: club, error } = await supabaseAdmin
    .from("clubs")
    .select("id, name, short_code, home_color, away_color, home_ground, founded, community, logo_url")
    .eq("id", id)
    .single();

  if (error || !club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

  const approved = await isSquadApproved(id);
  // Public data only: never include date_of_birth or other personal details.
  const { data: players } = approved
    ? await supabaseAdmin
        .from("players")
        .select("id, full_name, jersey_number, position")
        .eq("club_id", id)
        .eq("is_active", true)
        .order("jersey_number", { ascending: true })
    : { data: [] };

  return NextResponse.json({ ...club, squad_approved: approved, players: players ?? [] });
}
