import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin
    .from("clubs")
    .select("*, players(count)")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id, ...updates } = await req.json();
  const { error } = await supabaseAdmin.from("clubs").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("clubs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
