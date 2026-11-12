import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidateClubPage } from "@/lib/approved-squads";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = auth.replace("Bearer ", "");
  const { data: userData } = await supabaseAdmin.auth.getUser(token);
  const userId = userData.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select("id")
    .eq("manager_id", userId)
    .single();

  if (!club) return NextResponse.json({ error: "No club found" }, { status: 404 });

  // count players
  const { count } = await supabaseAdmin
    .from("players")
    .select("id", { count: "exact", head: true })
    .eq("club_id", club.id);

  if (!count || count < 11) {
    return NextResponse.json({ error: "At least 11 players required to submit." }, { status: 400 });
  }

  // registrations.club_id has no unique constraint, so an upsert with
  // onConflict fails. Update the club's existing row, or insert a new one.
  const submittedAt = new Date().toISOString();
  const { data: existing } = await supabaseAdmin
    .from("registrations")
    .select("id")
    .eq("club_id", club.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = existing
    ? await supabaseAdmin
        .from("registrations")
        .update({ status: "pending", submitted_at: submittedAt, reviewed_at: null })
        .eq("id", existing.id)
    : await supabaseAdmin
        .from("registrations")
        .insert({ club_id: club.id, submitted_by: userId, status: "pending", submitted_at: submittedAt });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await revalidateClubPage(club.id);
  return NextResponse.json({ success: true });
}
