import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("registrations")
    .select(`
      id, status, submitted_at, reviewer_notes,
      clubs (id, name, short_code, community, home_ground, home_color, away_color,
        manager:manager_id (id, email, raw_user_meta_data)
      ),
      invites (code, manager_email)
    `)
    .order("submitted_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
