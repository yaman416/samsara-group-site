import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Feed for the OBS overlay pages in public/broadcast/.
// Only club names, crests, score, period and the lower-third text: no player data.
// GET /api/public/live            -> the match set "on air" in the admin portal
// GET /api/public/live?fixture=ID -> a specific match (e.g. a second stream on the other ground)

export const dynamic = "force-dynamic";

type Club = { name: string; short_code: string; logo_url: string | null };
const club = (c: Club | Club[] | null) => {
  const x = Array.isArray(c) ? c[0] : c;
  return x ? { name: x.name, short: x.short_code, logo: x.logo_url } : null;
};
const FIX_COLS = "id, week, venue, played_at, status, season_id, home:clubs!home_club_id(name, short_code, logo_url), away:clubs!away_club_id(name, short_code, logo_url)";

export async function GET(req: NextRequest) {
  const { data: state, error: stErr } = await supabaseAdmin
    .from("broadcast_state")
    .select("fixture_id, lt_name, lt_role, lt_visible, lt_club:clubs!lt_club_id(name, short_code, logo_url)")
    .eq("id", 1)
    .maybeSingle();
  if (stErr) return NextResponse.json({ error: "Live feed unavailable" }, { status: 500 });

  const fixtureId = req.nextUrl.searchParams.get("fixture") || state?.fixture_id || null;
  let fixture = null, live = null, next = null, day: unknown[] = [];

  if (fixtureId && /^[0-9a-f-]{36}$/i.test(fixtureId)) {
    const [f, l, res] = await Promise.all([
      supabaseAdmin.from("fixtures").select(FIX_COLS).eq("id", fixtureId).maybeSingle(),
      supabaseAdmin.from("live_matches").select("home_score, away_score, period, period_started_at, half_minutes, last_goal_side, last_goal_at, paused_at").eq("fixture_id", fixtureId).maybeSingle(),
      supabaseAdmin.from("results").select("home_score, away_score").eq("fixture_id", fixtureId).maybeSingle(),
    ]);
    if (f.data) {
      fixture = { id: f.data.id, week: f.data.week, venue: f.data.venue, played_at: f.data.played_at, home: club(f.data.home as never), away: club(f.data.away as never) };
      live = l.data ?? null;
      // Once the result is saved, the saved score wins (it may correct the live one).
      if (f.data.status === "completed" && res.data) {
        live = { half_minutes: 30, period_started_at: null, last_goal_side: null, last_goal_at: null, ...(live ?? {}), paused_at: null,
          home_score: res.data.home_score, away_score: res.data.away_score, period: "FT" };
      }
      // Up next: the next scheduled match on the same ground, otherwise the next match anywhere.
      if (f.data.played_at) {
        const base = supabaseAdmin.from("fixtures").select(FIX_COLS).eq("season_id", f.data.season_id).eq("status", "scheduled")
          .gt("played_at", f.data.played_at).order("played_at").limit(1);
        let { data: n } = f.data.venue ? await base.eq("venue", f.data.venue) : await base;
        if (!n?.length && f.data.venue) ({ data: n } = await supabaseAdmin.from("fixtures").select(FIX_COLS).eq("season_id", f.data.season_id)
          .eq("status", "scheduled").gt("played_at", f.data.played_at).order("played_at").limit(1));
        const x = n?.[0];
        if (x) next = { played_at: x.played_at, venue: x.venue, home: club(x.home as never), away: club(x.away as never) };
        // The day's matches on the same ground, for the "Live now" screen (all kick-offs fall within 12 hours either side).
        const t = Date.parse(f.data.played_at), H12 = 12 * 3600 * 1000;
        let q = supabaseAdmin.from("fixtures").select(FIX_COLS).eq("season_id", f.data.season_id)
          .gte("played_at", new Date(t - H12).toISOString()).lte("played_at", new Date(t + H12).toISOString()).order("played_at").limit(8);
        if (f.data.venue) q = q.eq("venue", f.data.venue);
        const { data: d } = await q;
        day = (d ?? []).map(y => ({ id: y.id, played_at: y.played_at, home: club(y.home as never), away: club(y.away as never) }));
      }
    }
  }

  const lower = state
    ? { name: state.lt_name, role: state.lt_role, visible: state.lt_visible, club: club(state.lt_club as never) }
    : null;

  return NextResponse.json(
    { now: new Date().toISOString(), fixture, live, next, day, lower },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=1, stale-while-revalidate=1" } },
  );
}
