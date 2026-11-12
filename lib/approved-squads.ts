import "server-only";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

// A club's squad is shown publicly only after an admin approves its squad registration.
// Dates of birth are never part of any public player query.
export async function approvedClubIds(): Promise<Set<string>> {
  const { data } = await supabaseAdmin.from("registrations").select("club_id").eq("status", "approved");
  return new Set((data ?? []).map(r => r.club_id).filter(Boolean) as string[]);
}

export async function isSquadApproved(clubId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("registrations")
    .select("id")
    .eq("club_id", clubId)
    .eq("status", "approved")
    .limit(1);
  return (data?.length ?? 0) > 0;
}

// Refresh a club's public page (and the clubs list) after its squad or approval status changes.
export async function revalidateClubPage(clubId: string): Promise<void> {
  const { data } = await supabaseAdmin.from("clubs").select("short_code").eq("id", clubId).single();
  if (data?.short_code) revalidatePath(`/clubs/${data.short_code.toLowerCase()}`);
  revalidatePath("/clubs");
}
