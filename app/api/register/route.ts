import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// converts dd/mm/yyyy to yyyy-mm-dd for Postgres date column
function parseDob(dob: string): string | null {
  const parts = dob.split("/");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  if (!d || !m || !y) return null;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid registration request." }, { status: 400 });
  }
  const { acct, club, kit, squad } = body;
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase().replace(/\s/g, "") : "";
  if (!code || typeof acct?.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(acct.email.trim()) ||
      typeof acct?.pass !== "string" || acct.pass.length < 8 ||
      typeof club?.short !== "string" || typeof kit?.hp !== "string" || typeof kit?.ap !== "string" ||
      !Array.isArray(squad) || squad.length > 100 || squad.some(p => !p ||
        typeof p.name !== "string" || typeof p.number !== "string" ||
        typeof p.pos !== "string" || typeof p.dob !== "string")) {
    return NextResponse.json({ error: "Enter valid registration details and a password of at least 8 characters." }, { status: 400 });
  }
  const email = acct.email.trim().toLowerCase();
  const { data: invite, error: inviteError } = await supabaseAdmin
    .from("invites").select("*").eq("code", code).single();
  if (inviteError || !invite || invite.used || invite.manager_email?.trim().toLowerCase() !== email) {
    return NextResponse.json({ error: "Use an unused invitation and the email address it was sent to." }, { status: 403 });
  }

  // 1. Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: acct.pass,
    email_confirm: true,
    user_metadata: { full_name: acct.name, phone: acct.phone },
  });
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }
  const userId = authData.user.id;

  // Claim once, including when two requests validate the same invite concurrently.
  const { data: claimed, error: claimError } = await supabaseAdmin
    .from("invites").update({ used: true, used_by: userId })
    .eq("code", code).eq("used", false).select("code").maybeSingle();
  if (claimError || !claimed) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Invitation could not be claimed. Please try again." }, { status: 409 });
  }

  async function rollback(clubId?: string) {
    if (clubId) {
      const { error } = await supabaseAdmin.from("clubs").delete().eq("id", clubId);
      if (error) { console.error("Registration cleanup failed", error.code); return; }
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) { console.error("Registration account cleanup failed", error.code); return; }
    await supabaseAdmin.from("invites").update({ used: false, used_by: null }).eq("code", code).eq("used_by", userId);
  }

  // 2. Create club record
  const { data: clubData, error: clubError } = await supabaseAdmin
    .from("clubs")
    .insert({
      name: invite.club_name,
      short_code: club.short.toUpperCase(),
      home_ground: club.ground,
      founded: parseInt(club.founded) || null,
      community: invite.community ?? "Nepalese",
      home_color: kit.hp,
      away_color: kit.ap,
      manager_id: userId,
      season: invite.season ?? 3,
    })
    .select("id")
    .single();

  if (clubError) {
    await rollback();
    return NextResponse.json({ error: clubError.message }, { status: 400 });
  }
  const clubId = clubData.id;

  // 3. Insert players
  if (squad.length > 0) {
    const playerRows = squad.map((p: { number: string; name: string; pos: string; dob: string }) => ({
      club_id: clubId,
      jersey_number: parseInt(p.number),
      full_name: p.name,
      position: p.pos,
      date_of_birth: p.dob ? parseDob(p.dob) : null,
    }));
    const { error: playersError } = await supabaseAdmin.from("players").insert(playerRows);
    if (playersError) {
      await rollback(clubId);
      return NextResponse.json({ error: "Could not save the squad. Please check the player details and try again." }, { status: 400 });
    }
  }

  return NextResponse.json({ success: true, clubId });
}
