import { formatPlayerName } from "@/lib/playerName";

// A player has a main jersey number and, if their alternate kit carries a
// different one, an alt number (e.g. Azhas FC's red kit). Typing a number in the
// admin pickers finds players by either number.

export type NumberedPlayer = { id: string; full_name: string; jersey_number: number | null; alt_jersey_number?: number | null };

/** "#25 Radra Wangchuk (Red #7)" — the alt number shows only when it differs. */
export const playerLabel = (p: NumberedPlayer, altName?: string | null) => {
  const main = p.jersey_number != null ? `#${p.jersey_number} ` : "";
  const alt = p.alt_jersey_number != null && p.alt_jersey_number !== p.jersey_number ? ` (${altName?.trim() || "other jersey"} #${p.alt_jersey_number})` : "";
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

export type Kit = "home" | "alt";

/** The squad as numbered in the chosen kit. In the alt kit a player with an alt
 *  number wears that; everyone else keeps their main number. */
export function inKit<T extends NumberedPlayer>(pool: T[], kit: Kit): T[] {
  return pool.map(p => ({ ...p, jersey_number: kit === "alt" && p.alt_jersey_number != null ? p.alt_jersey_number : p.jersey_number, alt_jersey_number: null }));
}

// Named jersey colours, used when a club hasn't typed a name for a kit.
const NAMED: [string, number, number, number][] = [
  ["White", 255, 255, 255], ["Black", 16, 24, 32], ["Grey", 160, 160, 160], ["Red", 200, 20, 40], ["Maroon", 120, 20, 35],
  ["Blue", 40, 120, 220], ["Sky blue", 120, 190, 240], ["Navy", 26, 42, 76], ["Green", 30, 130, 60], ["Dark green", 20, 83, 45],
  ["Yellow", 240, 200, 40], ["Gold", 212, 175, 55], ["Orange", 240, 130, 30], ["Purple", 110, 50, 160], ["Pink", 230, 120, 170], ["Cream", 245, 240, 225],
];
export function colourName(hex: string | null | undefined): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex?.trim() ?? "");
  if (!m) return null;
  const v = parseInt(m[1], 16), r = v >> 16, g = (v >> 8) & 255, b = v & 255;
  let best = NAMED[0], d = Infinity;
  for (const c of NAMED) { const e = (c[1] - r) ** 2 + (c[2] - g) ** 2 + (c[3] - b) ** 2; if (e < d) { d = e; best = c; } }
  return best[0];
}

/** The two jersey colours a club can wear: typed names first, else named from the club colours. */
export function kitNames(c: { home_kit_name?: string | null; alt_kit_name?: string | null; home_color?: string | null; away_color?: string | null }) {
  const home = c.home_kit_name?.trim() || colourName(c.home_color) || "Home";
  let alt = c.alt_kit_name?.trim() || colourName(c.away_color) || "Other";
  if (alt.toLowerCase() === home.toLowerCase()) alt = `${alt} (2nd)`;
  return { home, alt };
}
