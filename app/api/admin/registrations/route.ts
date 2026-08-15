import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { data, error } = await supabaseAdmin
    .from("registrations")
    .select(`
      id, status, submitted_at, reviewer_notes,
      clubs (id, name, short_code, community, home_ground, home_color, away_color,
        manager:manager_id (id, email)
      ),
      invites (code, manager_email)
    `)
    .order("submitted_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
