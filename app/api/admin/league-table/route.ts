import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const seasonId = req.nextUrl.searchParams.get("season_id");

  let query = supabaseAdmin.from("league_table").select("*").order("position", { ascending: true });
  if (seasonId) query = query.eq("season_id", seasonId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
