import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendInviteEmail } from "@/lib/email";

function generateCode(clubShort: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 4; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  const prefix = clubShort.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4).padEnd(4, "X");
  return `SPL3-${prefix}`;
}

export async function POST(req: NextRequest) {
  const { clubName, managerEmail, season = 3 } = await req.json();
  if (!clubName || !managerEmail) {
    return NextResponse.json({ error: "Club name and manager email required" }, { status: 400 });
  }

  // derive short from first letters of club name words
  const words = clubName.trim().split(/\s+/);
  const short = words.map((w: string) => w[0]).join("").toUpperCase().slice(0, 4);
  let code = generateCode(short);

  // ensure uniqueness
  let attempts = 0;
  while (attempts < 10) {
    const { data } = await supabaseAdmin.from("invites").select("code").eq("code", code).single();
    if (!data) break;
    const rand4 = Math.random().toString(36).slice(2, 6).toUpperCase();
    code = `SPL3-${rand4}`;
    attempts++;
  }

  const { error } = await supabaseAdmin.from("invites").insert({
    code,
    club_name: clubName,
    manager_email: managerEmail,
    season,
    used: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Email disabled until domain verified in Resend — enable before launch
  // try {
  //   await sendInviteEmail({ to: managerEmail, clubName, code, season });
  // } catch (emailErr) {
  //   console.error("Email send failed:", emailErr);
  //   return NextResponse.json({ code, clubName, managerEmail, emailWarning: "Invite saved but email failed to send." });
  // }

  return NextResponse.json({ code, clubName, managerEmail, note: "Email not sent — enable Resend before launch." });
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("invites")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { code } = await req.json();
  const { error } = await supabaseAdmin.from("invites").delete().eq("code", code);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
