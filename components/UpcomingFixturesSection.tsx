// components/UpcomingFixturesSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, FIXTURE_MAP, RESULTS } from "@/lib/splData";

type FixtureView = {
  id: string;
  round: number;
  date: string;
  time: string;
  ground: string;
  home: string;
  away: string;
};

function getAllRounds(): number[] {
  const rounds = new Set<number>();
  for (const f of FIXTURES) {
    rounds.add(f.round);
  }
  return Array.from(rounds).sort((a, b) => a - b);
}

function getFixtureRoundFromResultFixtureId(fixtureId: string): number {
  const fixture = FIXTURE_MAP[fixtureId];
  return fixture?.round ?? 0;
}

// Based on results, guess the next upcoming round
function getNextRound(): number {
  const allRounds = getAllRounds();
  if (RESULTS.length === 0) {
    // No games played yet
    return allRounds[0];
  }

  const completedRounds = new Set<number>();
  for (const result of RESULTS) {
    const r = getFixtureRoundFromResultFixtureId(result.fixtureId);
    if (r > 0) completedRounds.add(r);
  }

  // First round that does not have any result yet
  for (const r of allRounds) {
    if (!completedRounds.has(r)) {
      return r;
    }
  }

  // If all rounds have some result, just show last one
  return allRounds[allRounds.length - 1];
}

export default function UpcomingFixturesSection() {
  const rounds = getAllRounds();
  const initialRound = getNextRound();

  const [round, setRound] = useState<number>(initialRound);

  const fixturesForRound: FixtureView[] = useMemo(() => {
    return FIXTURES.filter((f) => f.round === round)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      })
      .map((f) => ({
        id: f.id,
        round: f.round,
        date: f.date,
        time: f.time,
        ground: f.ground,
        home: f.home,
        away: f.away,
      }));
  }, [round]);

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm border">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Upcoming Fixtures</h2>
          <p className="text-xs text-gray-500">
            Full match schedule for the Samsara Premier League up to week 11.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="fixtures-round-select" className="text-gray-600">
            Matchweek
          </label>
          <select
            id="fixtures-round-select"
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            className="rounded-xl border border-gray-300 px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {rounds.map((r) => (
              <option key={r} value={r}>
                Week {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fixturesForRound.length === 0 ? (
        <p className="text-sm text-gray-500">
          No fixtures scheduled for this week.
        </p>
      ) : (
        <div className="space-y-3">
          {fixturesForRound.map((f) => (
            <div
              key={f.id}
              className="flex flex-col gap-2 rounded-2xl border bg-gray-50 p-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-3">
                <div className="flex flex-1 items-center justify-between gap-2 md:justify-start">
                  <span className="text-xs font-medium md:text-sm">
                    {f.home}
                  </span>
                  <span className="text-xs text-gray-500">vs</span>
                  <span className="text-xs font-medium md:text-sm">
                    {f.away}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end text-[11px] text-gray-500">
                <span>
                  Week {f.round} • {f.time}
                </span>
                <span>{f.ground}</span>
                <span className="text-gray-400">Date {f.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
