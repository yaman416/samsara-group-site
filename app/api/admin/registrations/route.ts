import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

// One row per club in the active season, so admins can see every club's
// registration progress (invite, manager account, squad size, submission)
// even before the club presses "Submit squad".
export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;

  const { data: season } = await supabaseAdmin
    .from("seasons")
    .select("id, year")
    .eq("is_active", true)
    .maybeSingle();

  let clubQuery = supabaseAdmin
    .from("clubs")
    .select("id, name, short_code, community, logo_url, home_color, away_color, manager_id")
    .order("name");
  if (season) clubQuery = clubQuery.eq("season_id", season.id);

  const [clubsRes, playersRes, regsRes, invitesRes, usersRes] = await Promise.all([
    clubQuery,
    supabaseAdmin.from("players").select("club_id, date_of_birth, jersey_number"),
    supabaseAdmin.from("registrations").select("id, club_id, status, submitted_at, reviewed_at, reviewer_notes").order("submitted_at", { ascending: false }),
    supabaseAdmin.from("invites").select("club_name, manager_email, used, used_at, created_at").order("created_at", { ascending: false }),
    supabaseAdmin.auth.admin.listUsers({ perPage: 200 }),
  ]);

  const failed = clubsRes.error || playersRes.error || regsRes.error || invitesRes.error || usersRes.error;
  if (failed) return NextResponse.json({ error: failed.message }, { status: 500 });

  const emailById = new Map((usersRes.data.users ?? []).map(u => [u.id, u.email ?? ""]));

  const rows = (clubsRes.data ?? []).map(club => {
    const players = (playersRes.data ?? []).filter(p => p.club_id === club.id);
    const reg = (regsRes.data ?? []).find(r => r.club_id === club.id) ?? null;
    const invite = (invitesRes.data ?? []).find(i => i.club_name.trim().toLowerCase() === club.name.trim().toLowerCase()) ?? null;
    return {
      club: {
        id: club.id, name: club.name, short_code: club.short_code, community: club.community,
        logo_url: club.logo_url, home_color: club.home_color, away_color: club.away_color,
      },
      manager_email: club.manager_id ? emailById.get(club.manager_id) ?? null : null,
      invite: invite ? { manager_email: invite.manager_email, used: !!invite.used, used_at: invite.used_at, created_at: invite.created_at } : null,
      player_count: players.length,
      missing_dob: players.filter(p => !p.date_of_birth).length,
      registration: reg,
    };
  });

  return NextResponse.json(rows);
}
