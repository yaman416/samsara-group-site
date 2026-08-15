import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("subscribers")
    .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email", ignoreDuplicates: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
