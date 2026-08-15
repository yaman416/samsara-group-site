import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function getClubId(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  const { data: userData } = await supabaseAdmin.auth.getUser(token);
  const userId = userData.user?.id;
  if (!userId) return null;
  const { data } = await supabaseAdmin.from("clubs").select("id").eq("manager_id", userId).single();
  return data?.id ?? null;
}

async function resetRegistration(clubId: string) {
  // If a registration exists (any status), reset to pending so admin re-reviews
  await supabaseAdmin
    .from("registrations")
    .update({ status: "pending", submitted_at: new Date().toISOString(), reviewer_notes: null })
    .eq("club_id", clubId);
}

export async function GET(req: NextRequest) {
  const clubId = await getClubId(req);
  if (!clubId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("players")
    .select("*")
    .eq("club_id", clubId)
    .order("jersey_number");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const clubId = await getClubId(req);
  if (!clubId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const player = await req.json();
  const { data, error } = await supabaseAdmin
    .from("players")
    .insert({ ...player, club_id: clubId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await resetRegistration(clubId);
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const clubId = await getClubId(req);
  if (!clubId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...updates } = await req.json();
  const { error } = await supabaseAdmin
    .from("players")
    .update(updates)
    .eq("id", id)
    .eq("club_id", clubId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await resetRegistration(clubId);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const clubId = await getClubId(req);
  if (!clubId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  const { error } = await supabaseAdmin
    .from("players")
    .delete()
    .eq("id", id)
    .eq("club_id", clubId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await resetRegistration(clubId);
  return NextResponse.json({ success: true });
}
