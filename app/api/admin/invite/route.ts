import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendInviteEmail } from "@/lib/email";
import { checkAdminKey } from "@/lib/admin-auth";

function generateCode(clubShort: string): string {
  const prefix = clubShort.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4).padEnd(4, "X");
  return `SPL3-${prefix}-${randomBytes(8).toString("hex").toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { clubName, clubShortCode, managerEmail, season = 3, community = "Nepalese" } = await req.json();
  if (!clubName || !managerEmail) {
    return NextResponse.json({ error: "Club name and manager email required" }, { status: 400 });
  }

  // prefer explicit short_code, fall back to initials from club name
  const short = clubShortCode
    ? clubShortCode.toUpperCase().slice(0, 4)
    : clubName.trim().split(/\s+/).map((w: string) => w[0]).join("").toUpperCase().slice(0, 4);
  let code = generateCode(short);

  // ensure uniqueness
  let attempts = 0;
  while (attempts < 10) {
    const { data } = await supabaseAdmin.from("invites").select("code").eq("code", code).single();
    if (!data) break;
    const rand4 = randomBytes(8).toString("hex").toUpperCase();
    code = `SPL3-${rand4}`;
    attempts++;
  }

  const { error } = await supabaseAdmin.from("invites").insert({
    code,
    club_name: clubName,
    manager_email: managerEmail,
    season,
    community,
    used: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try {
    await sendInviteEmail({ to: managerEmail, clubName, code, season });
  } catch (emailErr) {
    console.error("Email send failed:", emailErr);
    return NextResponse.json({ code, clubName, managerEmail, emailWarning: "Invite saved but email failed to send. Copy the code manually." });
  }

  return NextResponse.json({ code, clubName, managerEmail });
}

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin
    .from("invites")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { code } = await req.json();
  const { error } = await supabaseAdmin.from("invites").delete().eq("code", code);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
