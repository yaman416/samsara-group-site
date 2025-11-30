// components/UpcomingFixturesSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, type Fixture } from "@/lib/splData";

function getAllWeeks(fixtures: Fixture[]): number[] {
  const set = new Set<number>();
  fixtures.forEach((f) => set.add(f.round));
  return Array.from(set).sort((a, b) => a - b);
}

function getUpcomingWeek(fixtures: Fixture[]): number {
  const today = new Date();
  const upcoming = fixtures.filter((f) => new Date(f.date) >= today);
  if (upcoming.length === 0) return 1;
  return Math.min(...upcoming.map((f) => f.round));
}

export default function UpcomingFixturesSection() {
  const weeks = useMemo(() => getAllWeeks(FIXTURES), []);
  const upcomingWeek = useMemo(() => getUpcomingWeek(FIXTURES), []);
  const [selectedWeek, setSelectedWeek] = useState(upcomingWeek);

  const fixturesForWeek = FIXTURES.filter((f) => f.round === selectedWeek);

  return (
    <section id="fixtures" className="mt-10 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm">
              🗓
            </span>
            Fixtures
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Match schedule for all 11 weeks of Samsara Premier League.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-gray-500">Upcoming match week:</span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
              Week {upcomingWeek}
            </span>
          </div>

          {/* Week dropdown */}
          <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <span>View fixtures for</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {weeks.map((w) => (
                <option key={w} value={w}>
                  Week {w}
                  {w === upcomingWeek ? " - Upcoming" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Fixture cards */}
      <div className="rounded-2xl border bg-white shadow-sm p-3 md:p-4 space-y-3">
        <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
          <span>
            Week {selectedWeek} fixtures
          </span>
          <span className="hidden md:inline">
            Times in Canberra local time.
          </span>
        </div>

        {fixturesForWeek.length === 0 && (
          <p className="text-xs md:text-sm text-gray-500">
            No fixtures available for this week yet.
          </p>
        )}

        <div className="grid gap-3 md:gap-4">
          {fixturesForWeek.map((m) => (
            <div
              key={m.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gradient-to-r from-slate-50 to-white px-3 py-2 md:px-4 md:py-3"
            >
              {/* Time and date */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-2 md:w-40">
                <div className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] md:text-xs text-blue-700 font-medium">
                  {new Date(m.date).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <div className="text-xs md:text-sm text-gray-700 font-medium">
                  {m.time}
                </div>
                <div className="text-[11px] text-gray-500">
                  {m.ground}
                </div>
              </div>

              {/* Teams */}
              <div className="flex-1 flex flex-col md:flex-row items-center md:items-center justify-center gap-2 md:gap-4">
                <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                  <span className="hidden sm:inline-block h-7 w-7 rounded-full bg-blue-100" />
                  <span className="text-xs md:text-sm font-semibold text-gray-800 text-right">
                    {m.home}
                  </span>
                </div>

                <div className="text-[11px] md:text-xs text-gray-500 font-semibold">
                  vs
                </div>

                <div className="flex items-center justify-start gap-2 w-full md:w-auto">
                  <span className="text-xs md:text-sm font-semibold text-gray-800">
                    {m.away}
                  </span>
                  <span className="hidden sm:inline-block h-7 w-7 rounded-full bg-emerald-100" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] md:text-xs text-gray-400 pt-1">
          Fixture dates and times are subject to ground availability and weather.
        </p>
      </div>
    </section>
  );
}
