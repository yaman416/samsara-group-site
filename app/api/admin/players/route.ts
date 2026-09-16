import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const clubId = req.nextUrl.searchParams.get("club_id");
  if (!clubId) return NextResponse.json({ error: "club_id required" }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from("players")
    .select("*")
    .eq("club_id", clubId)
    .order("jersey_number");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from("players").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id, ...updates } = await req.json();
  const { error } = await supabaseAdmin.from("players").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("players").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
