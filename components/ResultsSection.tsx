// components/ResultsSection.tsx
"use client";

import { useMemo, useState } from "react";
import {
  FIXTURES,
  RESULTS,
  TEAM_LOGOS,
  MATCH_FACTS,
  type Fixture,
  type GoalEvent,
  type CardEvent,
} from "@/lib/splData";

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

  const [openFixtureId, setOpenFixtureId] = useState<string | null>(
    null,
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
            Choose a week to view full time scores and match facts.
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
              onClick={() => {
                setSelectedRound(tab.round);
                setOpenFixtureId(null);
              }}
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

      {/* Results list with logos and match facts */}
      <div className="mt-4 space-y-2">
        {fixturesWithResults.length === 0 ? (
          <p className="text-xs text-gray-500">
            No recorded results for this week yet.
          </p>
        ) : (
          fixturesWithResults.map(
            ({ fixture, homeGoals, awayGoals }) => {
              const homeWon = homeGoals > awayGoals;
              const awayWon = awayGoals > homeGoals;
              const homeLogo = TEAM_LOGOS[fixture.home];
              const awayLogo = TEAM_LOGOS[fixture.away];

              const facts = MATCH_FACTS[fixture.id];
              const hasFacts = !!facts;
              const isOpen = openFixtureId === fixture.id;

              return (
                <div
                  key={fixture.id}
                  className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs md:text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {/* Home */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {homeLogo && (
                            <img
                              src={homeLogo}
                              alt={fixture.home}
                              className="h-6 w-6 rounded-full border border-gray-200 bg-white object-contain"
                            />
                          )}
                          <span
                            className={
                              homeWon
                                ? "font-semibold text-gray-900"
                                : "font-medium text-gray-700"
                            }
                          >
                            {fixture.home}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {homeGoals}
                        </span>
                      </div>

                      {/* Away */}
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {awayLogo && (
                            <img
                              src={awayLogo}
                              alt={fixture.away}
                              className="h-6 w-6 rounded-full border border-gray-200 bg-white object-contain"
                            />
                          )}
                          <span
                            className={
                              awayWon
                                ? "font-semibold text-gray-900"
                                : "font-medium text-gray-700"
                            }
                          >
                            {fixture.away}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {awayGoals}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-[11px] text-gray-500 whitespace-nowrap">
                      <div>{fixture.date}</div>
                      <div>{fixture.time}</div>
                      <div>Round {fixture.round}</div>
                      <button
                        type="button"
                        disabled={!hasFacts}
                        onClick={() =>
                          setOpenFixtureId(
                            isOpen ? null : fixture.id,
                          )
                        }
                        className={[
                          "mt-1 inline-flex items-center rounded-full px-2 py-[3px] text-[10px] font-semibold border transition-colors",
                          hasFacts
                            ? isOpen
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-blue-600 text-blue-600 hover:bg-blue-50"
                            : "border-gray-300 text-gray-300 cursor-not-allowed",
                        ].join(" ")}
                      >
                        Match facts
                      </button>
                    </div>
                  </div>

                  {/* Facts panel */}
                  {isOpen && hasFacts && (
                    <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-700">
                      {facts.goals.length > 0 && (
                        <div className="mb-2">
                          <div className="mb-1 font-semibold">
                            Goals
                          </div>
                          <ul className="space-y-1">
                            {facts.goals.map(
                              (g: GoalEvent, idx: number) => (
                                <li key={idx}>
                                  <span className="font-medium">
                                    {g.team}
                                  </span>
                                  {": "}
                                  {g.player}
                                  {g.info ? ` (${g.info})` : ""}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {facts.cards.length > 0 && (
                        <div>
                          <div className="mb-1 font-semibold">
                            Cards
                          </div>
                          <ul className="space-y-1">
                            {facts.cards.map(
                              (c: CardEvent, idx: number) => (
                                <li key={idx}>
                                  <span className="font-medium">
                                    {c.team}
                                  </span>
                                  {": "}
                                  {c.player}{" "}
                                  <span
                                    className={
                                      c.type === "Red" ||
                                      c.type === "Second Yellow"
                                        ? "text-red-600 font-semibold"
                                        : "text-yellow-600 font-semibold"
                                    }
                                  >
                                    [{c.type}]
                                  </span>
                                  {c.info ? ` - ${c.info}` : ""}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {facts.goals.length === 0 &&
                        facts.cards.length === 0 && (
                          <p className="text-gray-500">
                            Match facts are recorded, but no goals or
                            cards have been added yet.
                          </p>
                        )}
                    </div>
                  )}
                </div>
              );
            },
          )
        )}
      </div>
    </section>
  );
}
