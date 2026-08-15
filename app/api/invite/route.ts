import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  const clean = String(code).trim().toUpperCase().replace(/\s/g, "");

  const { data, error } = await supabaseAdmin
    .from("invites")
    .select("code, club_name, used, community")
    .eq("code", clean)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "That code is not recognised, or has already been used." }, { status: 404 });
  }
  if (data.used) {
    return NextResponse.json({ error: "That code has already been used to register a club." }, { status: 409 });
  }

  return NextResponse.json({ clubName: data.club_name, community: data.community ?? "Nepalese", code: clean });
}
