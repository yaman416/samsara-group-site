// components/UpcomingFixturesSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, type Fixture } from "@/lib/splData";

type RoundTab = {
  round: number;
  label: string;
  dateLabel: string;
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

function findUpcomingRound(): number {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();

  let upcoming = 1;
  let minFuture = Number.POSITIVE_INFINITY;

  for (const f of FIXTURES) {
    const t = new Date(f.date + "T00:00:00").getTime();
    if (t >= todayStart && t < minFuture) {
      minFuture = t;
      upcoming = f.round;
    }
  }

  return upcoming;
}

export default function UpcomingFixturesSection() {
  const tabs = useMemo(() => buildRoundTabs(), []);
  const upcomingRound = useMemo(() => findUpcomingRound(), []);
  const [selectedRound, setSelectedRound] = useState<number>(upcomingRound);

  const fixturesForRound = useMemo(
    () =>
      FIXTURES.filter((f) => f.round === selectedRound).sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      }),
    [selectedRound],
  );

  const selectedTab = tabs.find((t) => t.round === selectedRound);

  return (
    <section
      id="fixtures"
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Upcoming Fixtures
          </h2>
          <p className="text-xs text-gray-500">
            Highlighted week shows the next scheduled round.
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end text-[11px] text-gray-500">
          <span className="font-medium">
            Upcoming week: Week {upcomingRound}
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
          const isUpcoming = tab.round === upcomingRound;
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
              {isUpcoming && (
                <span className="mt-1 inline-flex items-center rounded-full bg-green-100 px-2 py-[2px] text-[10px] font-semibold text-green-700">
                  Upcoming
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fixtures list */}
      <div className="mt-4 space-y-2">
        {fixturesForRound.length === 0 ? (
          <p className="text-xs text-gray-500">
            No fixtures scheduled for this week.
          </p>
        ) : (
          fixturesForRound.map((f: Fixture) => (
            <div
              key={f.id}
              className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs md:text-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">
                  {f.home} <span className="text-gray-500">vs</span> {f.away}
                </div>
                <div className="text-[11px] text-gray-500">
                  {f.date} · {f.time}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px] text-gray-500">
                <span>Round {f.round}</span>
                <span>Ground: {f.ground}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
