// components/ResultsSection.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FIXTURE_MAP, RESULTS, TEAM_LOGOS } from "@/lib/splData";

function getRoundsWithResults(): number[] {
  const rounds = new Set<number>();
  for (const r of RESULTS) {
    const fixture = FIXTURE_MAP[r.fixtureId];
    if (fixture) rounds.add(fixture.round);
  }
  return Array.from(rounds).sort((a, b) => a - b);
}

export default function ResultsSection() {
  const rounds = getRoundsWithResults();
  const [round, setRound] = useState<number>(
    rounds.length > 0 ? rounds[rounds.length - 1] : 1,
  );

  const matches = useMemo(() => {
    return RESULTS.filter((r) => {
      const f = FIXTURE_MAP[r.fixtureId];
      return f && f.round === round;
    }).map((r) => {
      const f = FIXTURE_MAP[r.fixtureId];
      const homeLogo = TEAM_LOGOS[f.home] ?? "/team/everest.png";
      const awayLogo = TEAM_LOGOS[f.away] ?? "/team/everest.png";
      return {
        round: f.round,
        date: f.date,
        time: f.time,
        ground: f.ground,
        home: f.home,
        away: f.away,
        homeLogo,
        awayLogo,
        homeGoals: r.homeGoals,
        awayGoals: r.awayGoals,
      };
    });
  }, [round]);

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm border">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Match Results</h2>
          <p className="text-xs text-gray-500">
            Final scores for Samsara Premier League by matchweek.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="round-select" className="text-gray-600">
            Matchweek
          </label>
          <select
            id="round-select"
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

      {matches.length === 0 ? (
        <p className="text-sm text-gray-500">
          No results recorded for this week yet.
        </p>
      ) : (
        <div className="space-y-3">
          {matches.map((m, idx) => (
            <div
              key={`${m.round}-${m.home}-${m.away}-${idx}`}
              className="flex flex-col gap-2 rounded-2xl border bg-gray-50 p-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-1 items-center justify-between gap-2 md:justify-start">
                {/* Home team */}
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                    <Image
                      src={m.homeLogo}
                      alt={m.home}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="text-xs font-medium md:text-sm">
                    {m.home}
                  </span>
                </div>

                {/* Score */}
                <div className="text-center text-sm font-semibold md:text-base">
                  {m.homeGoals}{" "}
                  <span className="mx-1 text-[11px] font-normal text-gray-500">
                    vs
                  </span>{" "}
                  {m.awayGoals}
                </div>

                {/* Away team */}
                <div className="flex items-center gap-2 text-right">
                  <span className="hidden text-xs font-medium md:block md:text-sm">
                    {m.away}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                    <Image
                      src={m.awayLogo}
                      alt={m.away}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className="text-xs font-medium md:hidden">
                    {m.away}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end text-[11px] text-gray-500">
                <span>
                  Week {m.round} • {m.time}
                </span>
                <span>{m.ground}</span>
                <span className="text-gray-400">Date {m.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
