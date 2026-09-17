import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const clubId = req.nextUrl.searchParams.get("club_id");
  let query = supabaseAdmin
    .from("players")
    .select("id, full_name, jersey_number, position, nationality, is_active")
    .eq("is_active", true)
    .order("jersey_number");
  if (clubId) query = query.eq("club_id", clubId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
