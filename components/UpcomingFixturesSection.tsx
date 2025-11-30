// components/UpcomingFixturesSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, TEAM_LOGOS } from "@/lib/splData";
import Modal from "@/components/Modal";

type Fixture = (typeof FIXTURES)[number];

function getAllRounds() {
  const set = new Set<number>();
  FIXTURES.forEach((f) => set.add(f.round));
  return Array.from(set).sort((a, b) => a - b);
}

function getNextRound(): number {
  const now = new Date();
  const futureRounds = FIXTURES.filter(
    (f) => new Date(f.date) >= now,
  ).map((f) => f.round);
  if (!futureRounds.length) {
    return getAllRounds()[0] ?? 1;
  }
  return Math.min(...futureRounds);
}

export default function UpcomingFixturesSection() {
  const allRounds = useMemo(getAllRounds, []);
  const [round, setRound] = useState<number>(getNextRound);
  const [selected, setSelected] = useState<Fixture | null>(null);

  const fixturesForRound = FIXTURES.filter((f) => f.round === round).sort(
    (a, b) => a.time.localeCompare(b.time),
  );

  const upcomingRound = getNextRound();

  return (
    <section id="fixtures" className="mt-10">
      <div className="rounded-3xl border bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Fixtures
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm">
              Select a week to see all fixtures. Next upcoming week is{" "}
              <span className="font-semibold">Week {upcomingRound}</span>.
            </p>
          </div>
        </div>

        {/* Week selector */}
        <div className="border-b px-4 pb-2 pt-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {allRounds.map((r) => {
              const isActive = r === round;
              const isUpcoming = r === upcomingRound;
              return (
                <button
                  key={r}
                  onClick={() => setRound(r)}
                  className={[
                    "min-w-[84px] rounded-full px-3 py-1.5 text-xs font-medium",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  ].join(" ")}
                >
                  Week {r}
                  {isUpcoming && (
                    <span className="ml-1 rounded-full bg-emerald-500 px-1.5 py-[1px] text-[9px] font-semibold text-white">
                      Upcoming
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="space-y-2 px-4 py-3 sm:px-6 sm:py-4">
          {fixturesForRound.map((f) => {
            const homeLogo = TEAM_LOGOS[f.home];
            const awayLogo = TEAM_LOGOS[f.away];

            return (
              <div
                key={f.id}
                className="flex items-center justify-between gap-3 rounded-2xl border bg-slate-50 px-3 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm"
              >
                <div className="flex flex-1 items-center gap-2">
                  {homeLogo && (
                    <img
                      src={homeLogo}
                      alt={f.home}
                      className="h-7 w-7 rounded-full border bg-white object-contain"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      {f.home}
                    </span>
                    <span className="text-[11px] text-slate-500 sm:text-xs">
                      Home
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-[11px] text-slate-500 sm:text-xs">
                  <span className="font-semibold text-slate-900">
                    vs
                  </span>
                  <span>
                    {f.date} · {f.time}
                  </span>
                  <span>Round {f.round}</span>
                  <span>{f.ground}</span>
                </div>

                <div className="flex flex-1 items-center justify-end gap-2">
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-slate-900">
                      {f.away}
                    </span>
                    <span className="text-[11px] text-slate-500 sm:text-xs">
                      Away
                    </span>
                  </div>
                  {awayLogo && (
                    <img
                      src={awayLogo}
                      alt={f.away}
                      className="h-7 w-7 rounded-full border bg-white object-contain"
                    />
                  )}
                </div>

                <button
                  onClick={() => setSelected(f)}
                  className="ml-1 whitespace-nowrap rounded-full border border-emerald-500 px-3 py-1 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 sm:text-xs"
                >
                  Match centre
                </button>
              </div>
            );
          })}

          {fixturesForRound.length === 0 && (
            <p className="py-3 text-center text-xs text-slate-500 sm:text-sm">
              Fixtures for this week will be added soon.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              {/* Home */}
              <div className="flex flex-1 flex-col items-center text-center">
                {TEAM_LOGOS[selected.home] && (
                  <img
                    src={TEAM_LOGOS[selected.home]}
                    alt={selected.home}
                    className="mb-2 h-12 w-12 rounded-full border bg-white object-contain"
                  />
                )}
                <span className="text-sm font-semibold">
                  {selected.home}
                </span>
                <span className="text-[11px] text-slate-300">Home</span>
              </div>

              {/* Score info */}
              <div className="flex flex-col items-center text-center">
                <span className="text-xs tracking-wide text-slate-300">
                  UPCOMING FIXTURE
                </span>
                <span className="mt-1 text-2xl font-semibold tracking-[0.25em]">
                  VS
                </span>
                <span className="mt-2 text-xs text-slate-200">
                  Round {selected.round} · {selected.date} ·{" "}
                  {selected.time}
                </span>
                <span className="text-xs text-slate-400">
                  {selected.ground}
                </span>
              </div>

              {/* Away */}
              <div className="flex flex-1 flex-col items-center text-center">
                {TEAM_LOGOS[selected.away] && (
                  <img
                    src={TEAM_LOGOS[selected.away]}
                    alt={selected.away}
                    className="mb-2 h-12 w-12 rounded-full border bg-white object-contain"
                  />
                )}
                <span className="text-sm font-semibold">
                  {selected.away}
                </span>
                <span className="text-[11px] text-slate-300">Away</span>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-800 px-4 py-3 text-xs text-slate-100 sm:text-sm">
              <p className="">
                This match is part of the Samsara Premier League regular
                season. Kick off is scheduled for {selected.time} on{" "}
                {selected.date} at {selected.ground}.
              </p>
              <p className="mt-2 text-slate-300">
                Line ups, live updates, and full match facts will appear
                here after the game has been played.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
