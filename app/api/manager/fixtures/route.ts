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

export async function GET(req: NextRequest) {
  const clubId = await getClubId(req);
  if (!clubId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("fixtures")
    .select(`
      id, week, venue, played_at, status,
      home_club:clubs!home_club_id(id, name, short_code),
      away_club:clubs!away_club_id(id, name, short_code),
      results(home_score, away_score)
    `)
    .or(`home_club_id.eq.${clubId},away_club_id.eq.${clubId}`)
    .order("week", { ascending: true })
    .order("played_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
