import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("goal_scorers")
    .select("player_id, players(full_name, jersey_number), clubs(id, name, short_code), is_own_goal, is_penalty")
    .eq("is_own_goal", false);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // aggregate by player
  const map: Record<string, { player_id: string; full_name: string; jersey_number: number; club_name: string; club_short: string; goals: number; penalties: number }> = {};
  for (const g of data ?? []) {
    const pid = g.player_id ?? "unknown";
    if (!map[pid]) {
      const p = g.players as unknown as { full_name: string; jersey_number: number } | null;
      const c = g.clubs as unknown as { name: string; short_code: string } | null;
      map[pid] = { player_id: pid, full_name: p?.full_name ?? "Unknown", jersey_number: p?.jersey_number ?? 0, club_name: c?.name ?? "", club_short: c?.short_code ?? "", goals: 0, penalties: 0 };
    }
    map[pid].goals++;
    if (g.is_penalty) map[pid].penalties++;
  }

  const sorted = Object.values(map).sort((a, b) => b.goals - a.goals).slice(0, 20);
  return NextResponse.json(sorted);
}
