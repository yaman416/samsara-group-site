// Matchday helpers shared by the admin Matchday screen and the match sheet API.
// Kept free of imports so tests can load it directly.

const TZ = "Australia/Sydney"; // Canberra time, same as LEAGUE_TZ in lib/utils

export const CARD_TYPES = ["yellow", "yellow_red", "red"] as const;
export type CardType = (typeof CARD_TYPES)[number];
export const CARD_LABELS: Record<CardType, string> = { yellow: "Yellow", yellow_red: "Second yellow (red)", red: "Straight red" };

export type SheetGoal = { player_id: string; club_id: string; minute: number | null; is_own_goal: boolean; is_penalty: boolean };
export type SheetCard = { player_id: string; card_type: CardType; minute: number | null; reason?: string | null };
export type MatchSheet = { fixture_id: string; home_score: number; away_score: number; goals: SheetGoal[]; cards: SheetCard[] };

/** "YYYY-MM-DD" of a timestamp in Canberra time. */
export function leagueDateKey(value: string | number | Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

/**
 * The matchday to open by default: today if there are fixtures today,
 * otherwise the next matchday, otherwise the most recent one.
 */
export function pickMatchday(dateKeys: string[], todayKey: string): string | null {
  const keys = Array.from(new Set(dateKeys)).sort();
  if (keys.length === 0) return null;
  if (keys.includes(todayKey)) return todayKey;
  return keys.find(k => k > todayKey) ?? keys[keys.length - 1];
}

/** Goals credited to each side. A player's own goal counts for the other team. */
export function tallyGoals(goals: Pick<SheetGoal, "club_id" | "is_own_goal">[], homeId: string, awayId: string) {
  let home = 0, away = 0;
  for (const g of goals) {
    const forHome = g.is_own_goal ? g.club_id === awayId : g.club_id === homeId;
    if (forHome) home++; else away++;
  }
  return { home, away };
}

const isScore = (n: unknown) => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 99;
const isMinute = (n: unknown) => n === null || n === undefined || (typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 130);

/**
 * Checks a match sheet against the two clubs and their registered players.
 * `playerClub` maps each registered player id to their club id.
 * Returns a list of problems; empty means the sheet can be saved.
 */
export function validateMatchSheet(sheet: MatchSheet, homeId: string, awayId: string, playerClub: Map<string, string>): string[] {
  const errors: string[] = [];
  if (!isScore(sheet.home_score) || !isScore(sheet.away_score)) errors.push("Enter a final score for both teams (whole numbers, 0 or more).");

  const goals = Array.isArray(sheet.goals) ? sheet.goals : [];
  const cards = Array.isArray(sheet.cards) ? sheet.cards : [];
  if (!Array.isArray(sheet.goals) || !Array.isArray(sheet.cards)) errors.push("Goals and cards must be lists.");

  goals.forEach((g, i) => {
    const club = playerClub.get(g.player_id);
    if (!club) errors.push(`Goal ${i + 1}: pick a registered player.`);
    else if (club !== g.club_id || (club !== homeId && club !== awayId)) errors.push(`Goal ${i + 1}: that player is not in either squad for this match.`);
    if (!isMinute(g.minute)) errors.push(`Goal ${i + 1}: minute must be between 0 and 130.`);
    if (g.is_own_goal && g.is_penalty) errors.push(`Goal ${i + 1}: a goal cannot be both an own goal and a penalty.`);
  });

  if (errors.length === 0) {
    const t = tallyGoals(goals, homeId, awayId);
    if (t.home > sheet.home_score || t.away > sheet.away_score) {
      errors.push(`More goal scorers than goals: scorers give ${t.home}-${t.away} but the score is ${sheet.home_score}-${sheet.away_score}.`);
    }
  }

  cards.forEach((c, i) => {
    const club = playerClub.get(c.player_id);
    if (!club || (club !== homeId && club !== awayId)) errors.push(`Card ${i + 1}: pick a registered player from either squad.`);
    if (!CARD_TYPES.includes(c.card_type)) errors.push(`Card ${i + 1}: choose yellow, second yellow or red.`);
    if (!isMinute(c.minute)) errors.push(`Card ${i + 1}: minute must be between 0 and 130.`);
  });

  return errors;
}
