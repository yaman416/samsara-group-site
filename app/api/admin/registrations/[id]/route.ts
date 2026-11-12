import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdminKey } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

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
  const { data: reg } = await supabaseAdmin.from("registrations").select("clubs(short_code)").eq("id", id).single();
  const club = (Array.isArray(reg?.clubs) ? reg?.clubs[0] : reg?.clubs) as { short_code?: string } | undefined;
  if (club?.short_code) revalidatePath(`/clubs/${club.short_code.toLowerCase()}`);
  revalidatePath("/clubs");

  return NextResponse.json({ success: true });
}
