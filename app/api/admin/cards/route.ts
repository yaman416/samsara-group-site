import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const fixtureId = req.nextUrl.searchParams.get("fixture_id");
  if (!fixtureId) return NextResponse.json({ error: "fixture_id required" }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from("cards")
    .select("*")
    .eq("fixture_id", fixtureId)
    .order("minute");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Fallback team_id: "Unattributed" row satisfies the NOT NULL FK on cards.team_id
// until the DB schema is updated to make team_id nullable.
const FALLBACK_TEAM_ID = "07b51ddc-6bd1-43a5-b912-b13dfc5d6aa2";

export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { fixture_id, player_name, card_type, minute, reason, team_id } = await req.json();
  const { data, error } = await supabaseAdmin
    .from("cards")
    .insert({ fixture_id, player_name, card_type, minute: minute || null, reason: reason || null, team_id: team_id || FALLBACK_TEAM_ID })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("cards").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
