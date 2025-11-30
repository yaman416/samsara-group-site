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

type ActiveMatch = {
  fixture: Fixture;
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

function MatchFactsModal({
  match,
  onClose,
}: {
  match: ActiveMatch | null;
  onClose: () => void;
}) {
  if (!match) return null;

  const { fixture, homeGoals, awayGoals } = match;
  const facts = MATCH_FACTS[fixture.id];
  const homeLogo = TEAM_LOGOS[fixture.home];
  const awayLogo = TEAM_LOGOS[fixture.away];

  const hasFacts =
    facts && (facts.goals.length > 0 || facts.cards.length > 0);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-gray-900 text-gray-100 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700"
        >
          Close
        </button>

        {/* Main match banner */}
        <div className="px-6 pb-5 pt-6">
          <div className="flex items-center justify-between gap-4">
            {/* Home team */}
            <div className="flex flex-1 flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                {homeLogo && (
                  <img
                    src={homeLogo}
                    alt={fixture.home}
                    className="h-9 w-9 rounded-full border border-gray-700 bg-white object-contain"
                  />
                )}
                <span className="text-sm font-semibold">
                  {fixture.home}
                </span>
              </div>
            </div>

            {/* Centre score block */}
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <div className="flex items-center gap-3 text-2xl font-semibold">
                <span>{homeGoals}</span>
                <span className="text-gray-400">-</span>
                <span>{awayGoals}</span>
              </div>
              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                Full time
              </span>
              <div className="mt-1 text-[11px] text-gray-400">
                Round {fixture.round} · {fixture.date} · {fixture.time}
              </div>
              <div className="text-[11px] text-gray-500">
                {fixture.ground}
              </div>
            </div>

            {/* Away team */}
            <div className="flex flex-1 flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-right">
                  {fixture.away}
                </span>
                {awayLogo && (
                  <img
                    src={awayLogo}
                    alt={fixture.away}
                    className="h-9 w-9 rounded-full border border-gray-700 bg-white object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800" />

        {/* Facts content */}
        <div className="px-6 py-4 text-xs md:text-sm">
          {hasFacts ? (
            <>
              {/* Goals */}
              {facts.goals.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Home goals */}
                  <div>
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Goals – {fixture.home}
                    </div>
                    <ul className="space-y-1">
                      {facts.goals
                        .filter((g: GoalEvent) => g.team === fixture.home)
                        .map((g: GoalEvent, idx: number) => (
                          <li key={idx} className="text-gray-100">
                            {g.player}
                            {g.info ? (
                              <span className="text-gray-400">
                                {" "}
                                ({g.info})
                              </span>
                            ) : null}
                          </li>
                        ))}
                      {facts.goals.filter(
                        (g) => g.team === fixture.home,
                      ).length === 0 && (
                        <li className="text-gray-500">
                          No goals recorded.
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Away goals */}
                  <div className="md:text-right">
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Goals – {fixture.away}
                    </div>
                    <ul className="space-y-1">
                      {facts.goals
                        .filter((g: GoalEvent) => g.team === fixture.away)
                        .map((g: GoalEvent, idx: number) => (
                          <li key={idx} className="text-gray-100">
                            {g.player}
                            {g.info ? (
                              <span className="text-gray-400">
                                {" "}
                                ({g.info})
                              </span>
                            ) : null}
                          </li>
                        ))}
                      {facts.goals.filter(
                        (g) => g.team === fixture.away,
                      ).length === 0 && (
                        <li className="text-gray-500">
                          No goals recorded.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Cards */}
              {facts.cards.length > 0 && (
                <div className="mt-4 rounded-xl bg-gray-800/80 px-4 py-3">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-300">
                    Cards
                  </div>
                  <ul className="space-y-1 text-xs md:text-sm">
                    {facts.cards.map((c: CardEvent, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="text-gray-200">
                          {c.team}
                        </span>
                        <span className="flex-1 text-right text-gray-200">
                          {c.player}
                        </span>
                        <span
                          className={
                            c.type === "Yellow"
                              ? "ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-400"
                              : "ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-red-400"
                          }
                        >
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-current" />
                          {c.type}
                        </span>
                        {c.info && (
                          <span className="text-[11px] text-gray-400">
                            {c.info}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {facts.goals.length === 0 && facts.cards.length === 0 && (
                <p className="text-xs text-gray-400">
                  Match facts are recorded but no goals or cards have
                  been entered yet.
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-400">
              Detailed match facts have not been added for this game
              yet. Scoreline is still shown on the main results list.
            </p>
          )}
        </div>
      </div>
    </div>
  );
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

  const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(
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
            Select a week to view full-time scores. Tap Match facts for
            detailed stats.
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end text-[11px] text-gray-500">
          <span className="font-medium">
            Latest completed week: {latestCompletedRound}
          </span>
          {selectedTab && (
            <span>Showing: {selectedTab.label}</span>
          )}
        </div>
      </div>

      {/* Week selector */}
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
          fixturesWithResults.map(
            ({ fixture, homeGoals, awayGoals }) => {
              const homeWon = homeGoals > awayGoals;
              const awayWon = awayGoals > homeGoals;
              const homeLogo = TEAM_LOGOS[fixture.home];
              const awayLogo = TEAM_LOGOS[fixture.away];

              const facts = MATCH_FACTS[fixture.id];
              const hasFacts =
                facts &&
                (facts.goals.length > 0 || facts.cards.length > 0);

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
                        onClick={() =>
                          setActiveMatch({
                            fixture,
                            homeGoals,
                            awayGoals,
                          })
                        }
                        className={[
                          "mt-1 inline-flex items-center rounded-full px-2 py-[3px] text-[10px] font-semibold border transition-colors",
                          hasFacts
                            ? "border-blue-600 text-blue-600 hover:bg-blue-50"
                            : "border-gray-300 text-gray-400 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        Match facts
                      </button>
                    </div>
                  </div>
                </div>
              );
            },
          )
        )}
      </div>

      {/* Modal */}
      <MatchFactsModal
        match={activeMatch}
        onClose={() => setActiveMatch(null)}
      />
    </section>
  );
}
