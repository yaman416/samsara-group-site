import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

  // upsert registration
  const { error } = await supabaseAdmin
    .from("registrations")
    .upsert({ club_id: club.id, status: "pending", submitted_at: new Date().toISOString() }, { onConflict: "club_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
