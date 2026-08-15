import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail, wrapEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get active season
  const { data: season } = await supabaseAdmin
    .from("seasons")
    .select("id, name")
    .eq("is_active", true)
    .single();

  if (!season) return NextResponse.json({ error: "No active season" }, { status: 404 });

  // Get next week's fixtures (upcoming, not yet played)
  const now = new Date();
  const weekAhead = new Date(now);
  weekAhead.setDate(weekAhead.getDate() + 7);

  const { data: fixtures } = await supabaseAdmin
    .from("fixtures")
    .select("week, played_at, venue, home_club:clubs!fixtures_home_club_id_fkey(name), away_club:clubs!fixtures_away_club_id_fkey(name)")
    .eq("season_id", season.id)
    .is("home_score", null)
    .gte("played_at", now.toISOString())
    .lte("played_at", weekAhead.toISOString())
    .order("played_at");

  if (!fixtures || fixtures.length === 0) {
    return NextResponse.json({ sent: 0, reason: "No upcoming fixtures this week" });
  }

  // Build fixtures HTML
  const rows = fixtures.map(f => {
    const home = (f.home_club as unknown as { name: string } | null)?.name ?? "TBD";
    const away = (f.away_club as unknown as { name: string } | null)?.name ?? "TBD";
    const date = f.played_at
      ? new Date(f.played_at).toLocaleString("en-AU", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Australia/Sydney" })
      : "TBC";
    const venue = f.venue ? ` · ${f.venue}` : "";
    return `<tr>
      <td style="padding:10px 12px;font-weight:600;">${home} vs ${away}</td>
      <td style="padding:10px 12px;color:#555;">${date}${venue}</td>
    </tr>`;
  }).join("");

  const bodyHtml = `
<p>Here are the upcoming fixtures for <strong>${season.name}</strong>:</p>
<table style="border-collapse:collapse;width:100%;margin:16px 0;">
  <thead>
    <tr style="background:#f3f4f6;">
      <th style="padding:10px 12px;text-align:left;font-size:13px;color:#374151;">Match</th>
      <th style="padding:10px 12px;text-align:left;font-size:13px;color:#374151;">Date and Venue</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<p style="margin-top:16px;">Good luck to all teams!</p>`;

  const subject = `Upcoming fixtures: ${season.name}`;

  // Get subscribers
  const { data: subs } = await supabaseAdmin
    .from("subscribers")
    .select("email, unsubscribe_token");

  if (!subs || subs.length === 0) return NextResponse.json({ sent: 0, reason: "No subscribers" });

  let sent = 0;
  let failed = 0;
  for (const sub of subs) {
    const html = wrapEmail(subject, bodyHtml, sub.unsubscribe_token);
    const { error } = await sendEmail({ to: sub.email, subject, html });
    if (error) failed++;
    else sent++;
  }

  return NextResponse.json({ sent, failed });
}
