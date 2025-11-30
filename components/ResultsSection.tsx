// components/ResultsSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, RESULTS, TEAM_LOGOS } from "@/lib/splData";
import Modal from "@/components/Modal";

type Fixture = (typeof FIXTURES)[number];
type Result = (typeof RESULTS)[number];

type MatchFacts = {
  fixtureId: string;
  homeGoals: string[];
  awayGoals: string[];
  cards: {
    team: "home" | "away";
    player: string;
    card: "Yellow" | "Red";
  }[];
};

// Example facts. Extend this as you record more games.
const MATCH_FACTS: MatchFacts[] = [
  {
    fixtureId: "R3-M1", // Everest 1 - 3 JA Brothers
    homeGoals: ["Kiran Gautam"],
    awayGoals: ["Dipesh Tamang", "Ajay Shrestha", "Alton Thakuri"],
    cards: [
      {
        team: "away",
        player: "Silas Tamang",
        card: "Yellow",
      },
      {
        team: "away",
        player: "Ajay Shrestha",
        card: "Yellow",
      },
      {
        team: "away",
        player: "Rahul Tamang",
        card: "Yellow",
      },
    ],
  },
  // Add Week 1 and Week 2 facts here when ready
];

function getAllRounds() {
  const set = new Set<number>();
  FIXTURES.forEach((f) => set.add(f.round));
  return Array.from(set).sort((a, b) => a - b);
}

function toRoundMap() {
  const byId = Object.fromEntries(FIXTURES.map((f) => [f.id, f]));
  const map = new Map<number, { fixture: Fixture; result: Result }[]>();

  for (const r of RESULTS) {
    const f = byId[r.fixtureId];
    if (!f) continue;
    if (!map.has(f.round)) map.set(f.round, []);
    map.get(f.round)!.push({ fixture: f, result: r });
  }

  for (const [round, arr] of map.entries()) {
    arr.sort((a, b) => a.fixture.time.localeCompare(b.fixture.time));
    map.set(round, arr);
  }

  return map;
}

export default function ResultsSection() {
  const allRounds = useMemo(getAllRounds, []);
  const roundMap = useMemo(toRoundMap, []);

  const latestRoundWithResult = useMemo(() => {
    const completed = Array.from(roundMap.keys()).sort((a, b) => a - b);
    return completed[completed.length - 1] ?? 1;
  }, [roundMap]);

  const [round, setRound] = useState<number>(latestRoundWithResult);
  const [selected, setSelected] = useState<{
    fixture: Fixture;
    result: Result;
  } | null>(null);

  const items = roundMap.get(round) ?? [];

  function getFactsForFixture(id: string) {
    return MATCH_FACTS.find((m) => m.fixtureId === id) || null;
  }

  return (
    <section id="results" className="mt-10">
      <div className="rounded-3xl border bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Match Results
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm">
              Select a week to view full time scores. Tap Match facts for
              detailed stats.
            </p>
          </div>
        </div>

        {/* Week selector */}
        <div className="border-b px-4 pb-2 pt-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {allRounds.map((r) => {
              const isActive = r === round;
              const hasData = roundMap.has(r);
              return (
                <button
                  key={r}
                  onClick={() => setRound(r)}
                  className={[
                    "min-w-[84px] rounded-full px-3 py-1.5 text-xs font-medium",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                    !hasData && "!bg-slate-100 !text-slate-400",
                  ].join(" ")}
                >
                  Week {r}
                  {!hasData && (
                    <span className="ml-1 text-[10px]">(TBC)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results list */}
        <div className="space-y-2 px-4 py-3 sm:px-6 sm:py-4">
          {items.map(({ fixture, result }) => {
            const homeLogo = TEAM_LOGOS[fixture.home];
            const awayLogo = TEAM_LOGOS[fixture.away];

            return (
              <div
                key={fixture.id}
                className="flex items-center justify-between gap-3 rounded-2xl border bg-slate-50 px-3 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm"
              >
                <div className="flex flex-1 items-center gap-2">
                  {homeLogo && (
                    <img
                      src={homeLogo}
                      alt={fixture.home}
                      className="h-7 w-7 rounded-full border bg-white object-contain"
                    />
                  )}
                  <span className="truncate font-semibold text-slate-900">
                    {fixture.home}
                  </span>
                </div>

                <div className="flex flex-col items-center text-[11px] text-slate-600 sm:text-xs">
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {result.homeGoals} - {result.awayGoals}
                  </span>
                  <span>Full time</span>
                  <span>
                    {fixture.date} · {fixture.time}
                  </span>
                  <span>Round {fixture.round}</span>
                </div>

                <div className="flex flex-1 items-center justify-end gap-2">
                  <span className="truncate text-right font-semibold text-slate-900">
                    {fixture.away}
                  </span>
                  {awayLogo && (
                    <img
                      src={awayLogo}
                      alt={fixture.away}
                      className="h-7 w-7 rounded-full border bg-white object-contain"
                    />
                  )}
                </div>

                <button
                  onClick={() => setSelected({ fixture, result })}
                  className="ml-1 whitespace-nowrap rounded-full border border-blue-600 px-3 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 sm:text-xs"
                >
                  Match facts
                </button>
              </div>
            );
          })}

          {items.length === 0 && (
            <p className="py-3 text-center text-xs text-slate-500 sm:text-sm">
              Results for this week will be added after the games.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <MatchFactsModalContent
            selected={selected}
            facts={getFactsForFixture(selected.fixture.id)}
          />
        )}
      </Modal>
    </section>
  );
}

type ModalProps = {
  selected: { fixture: Fixture; result: Result };
  facts: MatchFacts | null;
};

function MatchFactsModalContent({ selected, facts }: ModalProps) {
  const { fixture, result } = selected;
  const homeLogo = TEAM_LOGOS[fixture.home];
  const awayLogo = TEAM_LOGOS[fixture.away];

  const homeGoals = facts?.homeGoals ?? [];
  const awayGoals = facts?.awayGoals ?? [];
  const cards = facts?.cards ?? [];

  return (
    <div className="space-y-4 text-xs text-slate-100 sm:text-sm">
      {/* Score header */}
      <div className="flex items-center justify-between gap-4">
        {/* Home */}
        <div className="flex flex-1 flex-col items-center text-center">
          {homeLogo && (
            <img
              src={homeLogo}
              alt={fixture.home}
              className="mb-2 h-10 w-10 rounded-full border bg-white object-contain sm:h-12 sm:w-12"
            />
          )}
          <span className="text-sm font-semibold sm:text-base">
            {fixture.home}
          </span>
        </div>

        {/* Centre */}
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] tracking-wide text-slate-300">
            FULL TIME
          </span>
          <span className="mt-1 text-2xl font-semibold tracking-[0.35em] sm:text-3xl">
            {result.homeGoals} - {result.awayGoals}
          </span>
          <span className="mt-2 text-[11px] text-slate-200 sm:text-xs">
            Round {fixture.round} · {fixture.date} · {fixture.time}
          </span>
          <span className="text-[11px] text-slate-400 sm:text-xs">
            {fixture.ground}
          </span>
        </div>

        {/* Away */}
        <div className="flex flex-1 flex-col items-center text-center">
          {awayLogo && (
            <img
              src={awayLogo}
              alt={fixture.away}
              className="mb-2 h-10 w-10 rounded-full border bg-white object-contain sm:h-12 sm:w-12"
            />
          )}
          <span className="text-sm font-semibold sm:text-base">
            {fixture.away}
          </span>
        </div>
      </div>

      {/* Goals */}
      <div className="space-y-3 rounded-2xl bg-slate-800 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase text-slate-300 sm:text-xs">
            Goals - {fixture.home}
          </p>
          {homeGoals.length ? (
            <ul className="mt-1 list-disc pl-4">
              {homeGoals.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
              Goal scorers will be updated soon.
            </p>
          )}
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase text-slate-300 sm:text-xs">
            Goals - {fixture.away}
          </p>
          {awayGoals.length ? (
            <ul className="mt-1 list-disc pl-4">
              {awayGoals.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
              Goal scorers will be updated soon.
            </p>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="rounded-2xl bg-slate-800 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase text-slate-300 sm:text-xs">
          Cards
        </p>
        {cards.length === 0 ? (
          <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
            Card information will be added soon.
          </p>
        ) : (
          <ul className="mt-2 space-y-1 text-xs sm:text-sm">
            {cards.map((c, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate">
                  {c.team === "home" ? fixture.home : fixture.away}
                </span>
                <span className="truncate">{c.player}</span>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] font-semibold ${
                    c.card === "Yellow"
                      ? "bg-amber-400/20 text-amber-300"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-current" />
                  {c.card}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
