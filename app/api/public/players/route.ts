import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { approvedClubIds } from "@/lib/approved-squads";

// Public list of players from approved squads only. Never returns dates of birth.
export async function GET(req: NextRequest) {
  const clubId = req.nextUrl.searchParams.get("club_id");
  const approved = [...(await approvedClubIds())];
  if (clubId && !approved.includes(clubId)) return NextResponse.json([]);
  if (approved.length === 0) return NextResponse.json([]);

  let query = supabaseAdmin
    .from("players")
    .select("id, club_id, full_name, jersey_number, position, is_active")
    .eq("is_active", true)
    .order("jersey_number");
  query = clubId ? query.eq("club_id", clubId) : query.in("club_id", approved);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
