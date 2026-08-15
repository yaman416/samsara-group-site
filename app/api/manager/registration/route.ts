import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
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

  if (!club) return NextResponse.json({ status: null });

  const { data: reg } = await supabaseAdmin
    .from("registrations")
    .select("status, submitted_at, reviewer_notes")
    .eq("club_id", club.id)
    .single();

  return NextResponse.json(reg ?? { status: null });
}
