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

async function checkDeadline(clubId: string): Promise<boolean> {
  const { data: club, error } = await supabaseAdmin.from("clubs").select("season_id, squad_deadline_override").eq("id", clubId).single();
  // Fail closed: if the lookup errors, treat the squad as locked rather than open.
  if (error || !club) return true;
  // A per-club extension (set by the committee) takes precedence over the season deadline.
  if (club.squad_deadline_override) return new Date() > new Date(club.squad_deadline_override);
  if (!club.season_id) return false;
  const { data: season } = await supabaseAdmin.from("seasons").select("squad_deadline").eq("id", club.season_id).single();
  if (!season?.squad_deadline) return false;
  return new Date() > new Date(season.squad_deadline);
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
  if (await checkDeadline(clubId)) return NextResponse.json({ error: "Squad registration deadline has passed." }, { status: 403 });

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
  if (await checkDeadline(clubId)) return NextResponse.json({ error: "Squad registration deadline has passed." }, { status: 403 });

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
  if (await checkDeadline(clubId)) return NextResponse.json({ error: "Squad registration deadline has passed." }, { status: 403 });

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
