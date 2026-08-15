import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const seasonId = req.nextUrl.searchParams.get("season_id");

  let query = supabaseAdmin.from("league_table").select("*").order("position", { ascending: true });
  if (seasonId) query = query.eq("season_id", seasonId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
