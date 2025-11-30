// components/ResultsSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, RESULTS, type Fixture } from "@/lib/splData";

type RoundTab = {
  round: number;
  label: string;
  dateLabel: string;
};

type ResultMapValue = {
  homeGoals: number;
  awayGoals: number;
};

function buildRoundTabs(): RoundTab[] {
  const rounds = Array.from(new Set(FIXTURES.map((f) => f.round))).sort(
    (a, b) => a - b,
  );

  return rounds.map((round) => {
    const fixtures = FIXTURES.filter((f) => f.round === round);
    const first = fixtures[0];
    let dateLabel = `Week ${round}`;
    if (first) {
      const d = new Date(first.date + "T00:00:00");
      dateLabel = d.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    }
    return {
      round,
      label: `Week ${round}`,
      dateLabel,
    };
  });
}

export default function ResultsSection() {
  const tabs = useMemo(() => buildRoundTabs(), []);

  const resultMap = useMemo(() => {
    const map = new Map<string, ResultMapValue>();
    for (const r of RESULTS) {
      map.set(r.fixtureId, {
        homeGoals: r.homeGoals,
        awayGoals: r.awayGoals,
      });
    }
    return map;
  }, []);

  // Find latest completed round (at least one result in that round)
  const latestCompletedRound = useMemo(() => {
    let latest = 1;
    for (const tab of tabs) {
      const hasResult = FIXTURES.some(
        (f) => f.round === tab.round && resultMap.has(f.id),
      );
      if (hasResult) latest = tab.round;
    }
    return latest;
  }, [tabs, resultMap]);

  const [selectedRound, setSelectedRound] = useState<number>(
    latestCompletedRound,
  );

  const fixturesWithResults = useMemo(() => {
    const fixturesForRound = FIXTURES.filter(
      (f) => f.round === selectedRound,
    );
    return fixturesForRound
      .map((f) => {
        const r = resultMap.get(f.id);
        if (!r) return null;
        return { fixture: f, ...r };
      })
      .filter(Boolean) as {
      fixture: Fixture;
      homeGoals: number;
      awayGoals: number;
    }[];
  }, [selectedRound, resultMap]);

  const selectedTab = tabs.find((t) => t.round === selectedRound);

  return (
    <section
      id="results"
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Match Results
          </h2>
          <p className="text-xs text-gray-500">
            Choose a week to view full time scores.
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end text-[11px] text-gray-500">
          <span className="font-medium">
            Latest completed: Week {latestCompletedRound}
          </span>
          {selectedTab && (
            <span>Selected: {selectedTab.dateLabel}</span>
          )}
        </div>
      </div>

      {/* Week tabs */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = tab.round === selectedRound;
          const isLatest = tab.round === latestCompletedRound;
          return (
            <button
              key={tab.round}
              onClick={() => setSelectedRound(tab.round)}
              className={[
                "flex flex-col items-start rounded-xl border px-3 py-2 min-w-[90px] text-left text-xs transition-colors",
                isActive
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-400 hover:bg-blue-50/60",
              ].join(" ")}
            >
              <span className="font-semibold">{tab.label}</span>
              <span className="text-[11px] text-gray-500">
                {tab.dateLabel}
              </span>
              {isLatest && (
                <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100 px-2 py-[2px] text-[10px] font-semibold text-emerald-700">
                  Latest
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Results list */}
      <div className="mt-4 space-y-2">
        {fixturesWithResults.length === 0 ? (
          <p className="text-xs text-gray-500">
            No recorded results for this week yet.
          </p>
        ) : (
          fixturesWithResults.map(({ fixture, homeGoals, awayGoals }) => {
            const homeWon = homeGoals > awayGoals;
            const awayWon = awayGoals > homeGoals;
            return (
              <div
                key={fixture.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs md:text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={
                          homeWon
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-700"
                        }
                      >
                        {fixture.home}
                      </span>
                      <span className="font-semibold">
                        {homeGoals}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span
                        className={
                          awayWon
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-700"
                        }
                      >
                        {fixture.away}
                      </span>
                      <span className="font-semibold">
                        {awayGoals}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-gray-500 text-right whitespace-nowrap">
                    <div>{fixture.date}</div>
                    <div>{fixture.time}</div>
                    <div>Round {fixture.round}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
