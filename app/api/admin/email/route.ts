import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";
import { sendEmail, wrapEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;

  const { data, error } = await supabaseAdmin
    .from("subscribers")
    .select("id, email, subscribed_at")
    .order("subscribed_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;

  const { subject, body } = await req.json();
  if (!subject || !body) {
    return NextResponse.json({ error: "subject and body required" }, { status: 400 });
  }

  const { data: subs, error } = await supabaseAdmin
    .from("subscribers")
    .select("email, unsubscribe_token");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!subs || subs.length === 0) return NextResponse.json({ sent: 0 });

  let sent = 0;
  let failed = 0;

  for (const sub of subs) {
    const html = wrapEmail(subject, `<div>${body}</div>`, sub.unsubscribe_token);
    const { error: mailErr } = await sendEmail({ to: sub.email, subject, html });
    if (mailErr) failed++;
    else sent++;
  }

  return NextResponse.json({ sent, failed });
}
