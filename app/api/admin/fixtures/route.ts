import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const week = req.nextUrl.searchParams.get("week");
  let query = supabaseAdmin
    .from("fixtures")
    .select(`*, home_club:clubs!home_club_id(id,name,short_code), away_club:clubs!away_club_id(id,name,short_code), results(home_score,away_score)`)
    .order("week", { ascending: true })
    .order("played_at", { ascending: true });

  if (week) query = query.eq("week", parseInt(week));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { error, data } = await supabaseAdmin.from("fixtures").insert({
    season_id: body.season_id,
    week: body.week,
    home_club_id: body.home_club_id,
    away_club_id: body.away_club_id,
    venue: body.venue || null,
    played_at: body.played_at || null,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const { error } = await supabaseAdmin.from("fixtures").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("fixtures").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
