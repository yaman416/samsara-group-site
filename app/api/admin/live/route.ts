import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";
import { applyLiveAction, emptyLive, type LiveAction, type LiveState } from "@/lib/live";

const LIVE_COLS = "fixture_id, home_score, away_score, period, period_started_at, half_minutes, last_goal_side, last_goal_at, paused_at, updated_at";
const STATE_COLS = "fixture_id, lt_name, lt_role, lt_club_id, lt_visible, updated_at";

// GET ?fixture_ids=a,b,c  -> live rows for those fixtures + the broadcast state (on-air match, lower third)
export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const ids = (req.nextUrl.searchParams.get("fixture_ids") ?? "").split(",").filter(Boolean);
  const [live, state] = await Promise.all([
    ids.length ? supabaseAdmin.from("live_matches").select(LIVE_COLS).in("fixture_id", ids) : Promise.resolve({ data: [], error: null }),
    supabaseAdmin.from("broadcast_state").select(STATE_COLS).eq("id", 1).maybeSingle(),
  ]);
  if (live.error || state.error) return NextResponse.json({ error: (live.error ?? state.error)!.message }, { status: 500 });
  return NextResponse.json({ live: live.data, state: state.data });
}

// POST one of:
//   { fixture_id, action: LiveAction }            -> score / period taps
//   { on_air: fixture_id | null }                 -> which match the overlays show
//   { lower: { name, role, club_id, visible } }   -> lower-third text for the second camera
export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const now = new Date().toISOString();

  if ("on_air" in body) {
    const { error } = await supabaseAdmin.from("broadcast_state").upsert({ id: 1, fixture_id: body.on_air || null, updated_at: now });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if ("lower" in body) {
    const l = body.lower ?? {};
    const clip = (v: unknown, n: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);
    const { error } = await supabaseAdmin.from("broadcast_state").upsert({
      id: 1, lt_name: clip(l.name, 60), lt_role: clip(l.role, 80), lt_club_id: l.club_id || null, lt_visible: !!l.visible, updated_at: now,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  const { fixture_id, action } = body as { fixture_id?: string; action?: LiveAction };
  if (!fixture_id || !action) return NextResponse.json({ error: "fixture_id and action required" }, { status: 400 });

  // Optimistic concurrency: write only if nobody else changed the row since we read it,
  // otherwise read again and re-apply, so taps from two phones are never lost.
  let data: unknown = null;
  for (let attempt = 0; attempt < 6 && !data; attempt++) {
    const stamp = new Date().toISOString();
    const { data: row, error: readErr } = await supabaseAdmin.from("live_matches").select(LIVE_COLS).eq("fixture_id", fixture_id).maybeSingle();
    if (readErr) return NextResponse.json({ error: readErr.message }, { status: 500 });
    const current: LiveState = row ? (row as LiveState) : emptyLive();
    const next = applyLiveAction(current, action, stamp);
    if (typeof next === "string") return NextResponse.json({ error: next }, { status: 400 });
    const fields = { ...next, updated_at: stamp };
    if (row) {
      const { data: upd, error } = await supabaseAdmin.from("live_matches").update(fields)
        .eq("fixture_id", fixture_id).eq("updated_at", row.updated_at).select(LIVE_COLS);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      if (upd && upd.length) data = upd[0];
    } else {
      const { data: ins, error } = await supabaseAdmin.from("live_matches").insert({ fixture_id, ...fields }).select(LIVE_COLS);
      if (error && error.code !== "23505") return NextResponse.json({ error: error.message }, { status: 500 });
      if (ins && ins.length) data = ins[0];
    }
  }
  if (!data) return NextResponse.json({ error: "Busy, please tap again." }, { status: 409 });

  // First tap on a match puts it on air if nothing else is.
  const { data: st } = await supabaseAdmin.from("broadcast_state").select("fixture_id").eq("id", 1).maybeSingle();
  if (!st?.fixture_id) await supabaseAdmin.from("broadcast_state").upsert({ id: 1, fixture_id, updated_at: now });

  return NextResponse.json(data);
}
