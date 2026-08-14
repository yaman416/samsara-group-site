import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const week = req.nextUrl.searchParams.get("week");
  let query = supabaseAdmin
    .from("fixtures")
    .select("*")
    .order("match_week", { ascending: true })
    .order("kick_off", { ascending: true });

  if (week) query = query.eq("match_week", parseInt(week));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { error, data } = await supabaseAdmin.from("fixtures").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const { error } = await supabaseAdmin.from("fixtures").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
