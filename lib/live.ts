// Live match state for the broadcast overlays. Kept free of imports so tests can load it directly.
// The overlay pages in public/broadcast/live.js use the same clock rule.

export const PERIODS = ["pre", "1H", "HT", "2H", "FT"] as const;
export type Period = (typeof PERIODS)[number];
export const PERIOD_LABELS: Record<Period, string> = { pre: "Not started", "1H": "1st half", HT: "Half-time", "2H": "2nd half", FT: "Full time" };

export type LiveState = {
  home_score: number; away_score: number; period: Period;
  period_started_at: string | null; half_minutes: number;
  last_goal_side: "home" | "away" | null; last_goal_at: string | null;
};

export type LiveAction =
  | { type: "goal"; side: "home" | "away" }
  | { type: "undo"; side: "home" | "away" }
  | { type: "period"; period: Period }
  | { type: "score"; home: number; away: number }
  | { type: "half_minutes"; minutes: number }
  | { type: "reset" };

export const emptyLive = (half_minutes = 30): LiveState => ({
  home_score: 0, away_score: 0, period: "pre", period_started_at: null, half_minutes,
  last_goal_side: null, last_goal_at: null,
});

const okScore = (n: unknown) => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 99;

/** Applies one admin tap. Returns the new state, or an error message. */
export function applyLiveAction(s: LiveState, a: LiveAction, nowIso: string): LiveState | string {
  switch (a.type) {
    case "goal": {
      if (a.side !== "home" && a.side !== "away") return "Unknown team.";
      const key = a.side === "home" ? "home_score" : "away_score";
      if (s[key] >= 99) return "Score is at the limit.";
      return { ...s, [key]: s[key] + 1, last_goal_side: a.side, last_goal_at: nowIso };
    }
    case "undo": {
      if (a.side !== "home" && a.side !== "away") return "Unknown team.";
      const key = a.side === "home" ? "home_score" : "away_score";
      if (s[key] === 0) return "That team has no goals to remove.";
      // Take the GOAL pop-up down if it was for this team.
      const clearPop = s.last_goal_side === a.side;
      return { ...s, [key]: s[key] - 1, ...(clearPop ? { last_goal_side: null, last_goal_at: null } : {}) };
    }
    case "period": {
      if (!PERIODS.includes(a.period)) return "Unknown period.";
      if (a.period === s.period) return s; // a repeat tap must not restart the clock
      const running = a.period === "1H" || a.period === "2H";
      return { ...s, period: a.period, period_started_at: running ? nowIso : null };
    }
    case "score":
      if (!okScore(a.home) || !okScore(a.away)) return "Scores must be whole numbers from 0 to 99.";
      return { ...s, home_score: a.home, away_score: a.away };
    case "half_minutes":
      if (!Number.isInteger(a.minutes) || a.minutes < 1 || a.minutes > 60) return "Half length must be 1 to 60 minutes.";
      return { ...s, half_minutes: a.minutes };
    case "reset":
      return emptyLive(s.half_minutes);
    default:
      return "Unknown action.";
  }
}

/** Match clock text: counts up from 00:00 in the 1st half and from the half length in the 2nd. */
export function matchClock(s: Pick<LiveState, "period" | "period_started_at" | "half_minutes">, nowMs: number): string {
  if (s.period === "HT") return "HT";
  if (s.period === "FT") return "FT";
  if (s.period === "pre" || !s.period_started_at) return "";
  const base = s.period === "2H" ? s.half_minutes * 60 : 0;
  const secs = base + Math.max(0, Math.floor((nowMs - Date.parse(s.period_started_at)) / 1000));
  return `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
}
