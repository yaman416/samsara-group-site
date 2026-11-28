import { formatPlayerName } from "@/lib/playerName";

// A player has a main jersey number and, if their alternate kit carries a
// different one, an alt number (e.g. Azhas FC's red kit). Typing a number in the
// admin pickers finds players by either number.

export type NumberedPlayer = { id: string; full_name: string; jersey_number: number | null; alt_jersey_number?: number | null };

/** "#25 Radra Wangchuk (alt kit #7)" */
export const playerLabel = (p: NumberedPlayer) => {
  const main = p.jersey_number != null ? `#${p.jersey_number} ` : "";
  const alt = p.alt_jersey_number != null && p.alt_jersey_number !== p.jersey_number ? ` (alt kit #${p.alt_jersey_number})` : "";
  return `${main}${formatPlayerName(p.full_name)}${alt}`;
};

/** Everyone in the pool wearing this number in either kit, main-number matches first. */
export function playersWearing<T extends NumberedPlayer>(pool: T[], typed: string): T[] {
  if (typed.trim() === "") return [];
  const n = Number(typed);
  const main = pool.filter(p => p.jersey_number === n);
  const alt = pool.filter(p => p.alt_jersey_number === n && p.jersey_number !== n);
  return [...main, ...alt];
}
