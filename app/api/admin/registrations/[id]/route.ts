import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";
import { revalidateClubPage } from "@/lib/approved-squads";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = checkAdminKey(req);
  if (deny) return deny;
  const { id } = await params;
  const { status, notes } = await req.json();

  if (!["approved", "changes_requested", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("registrations")
    .update({ status, reviewer_notes: notes || null, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Approving (or un-approving) a squad changes what the public club page shows: refresh it now.
  const { data: reg } = await supabaseAdmin.from("registrations").select("club_id").eq("id", id).single();
  if (reg?.club_id) await revalidateClubPage(reg.club_id);

  return NextResponse.json({ success: true });
}
