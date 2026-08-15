import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { fixture_id, home_score, away_score, notes } = await req.json();
  if (!fixture_id || home_score == null || away_score == null) {
    return NextResponse.json({ error: "fixture_id, home_score, away_score required" }, { status: 400 });
  }

  // upsert — replace if result already exists for this fixture
  const { error } = await supabaseAdmin.from("results").upsert({
    fixture_id,
    home_score,
    away_score,
    notes: notes || null,
  }, { onConflict: "fixture_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { fixture_id } = await req.json();
  const { error } = await supabaseAdmin.from("results").delete().eq("fixture_id", fixture_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // revert fixture status back to scheduled
  await supabaseAdmin.from("fixtures").update({ status: "scheduled" }).eq("id", fixture_id);
  return NextResponse.json({ success: true });
}
