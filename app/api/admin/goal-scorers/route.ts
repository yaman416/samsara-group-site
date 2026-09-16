import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const fixtureId = req.nextUrl.searchParams.get("fixture_id");
  if (!fixtureId) return NextResponse.json({ error: "fixture_id required" }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from("goal_scorers")
    .select("*, players(full_name, jersey_number), clubs(name)")
    .eq("fixture_id", fixtureId)
    .order("minute");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from("goal_scorers").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("goal_scorers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
