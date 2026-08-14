import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    user: { id: data.user.id, email: data.user.email },
  });
}
