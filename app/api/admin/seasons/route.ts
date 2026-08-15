import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin.from("seasons").select("*").order("year", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id, squad_deadline } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error } = await supabaseAdmin.from("seasons").update({ squad_deadline }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
