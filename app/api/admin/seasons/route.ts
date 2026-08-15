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
