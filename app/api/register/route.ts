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
  const { code, acct, club, community, kit, squad } = await req.json();

  // 1. Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: acct.email,
    password: acct.pass,
    email_confirm: true,
    user_metadata: { full_name: acct.name, phone: acct.phone },
  });
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }
  const userId = authData.user.id;

  // 2. Create club record
  const { data: clubData, error: clubError } = await supabaseAdmin
    .from("clubs")
    .insert({
      name: club.name,
      short_code: club.short.toUpperCase(),
      home_ground: club.ground,
      founded: parseInt(club.founded) || null,
      community,
      home_color: kit.hp,
      away_color: kit.ap,
      manager_id: userId,
      season: 3,
    })
    .select("id")
    .single();

  if (clubError) {
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
    await supabaseAdmin.from("players").insert(playerRows);
  }

  // 4. Mark invite as used
  await supabaseAdmin
    .from("invites")
    .update({ used: true, used_by: userId })
    .eq("code", code);

  return NextResponse.json({ success: true, clubId });
}
