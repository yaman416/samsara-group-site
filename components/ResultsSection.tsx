// components/ResultsSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, RESULTS } from "@/lib/splData";

type ResultRow = {
  week: number;
  date: string;
  time: string;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
  ground: string;
};

export default function ResultsSection() {
  const fixtureMap = useMemo(
    () => Object.fromEntries(FIXTURES.map((f) => [f.id, f])),
    []
  );

  const resultRows: ResultRow[] = RESULTS.map((r) => {
    const f = fixtureMap[r.fixtureId];
    if (!f) return null as any;
    return {
      week: f.round,
      date: f.date,
      time: f.time,
      home: f.home,
      away: f.away,
      homeGoals: r.homeGoals,
      awayGoals: r.awayGoals,
      ground: f.ground,
    };
  }).filter(Boolean);

  const weeks = Array.from(new Set(resultRows.map((r) => r.week))).sort(
    (a, b) => a - b
  );
  const latestWeek = weeks[weeks.length - 1] || 1;

  const [selectedWeek, setSelectedWeek] = useState(latestWeek);

  const rowsForWeek = resultRows.filter((r) => r.week === selectedWeek);

  function getResultBadge(row: ResultRow) {
    if (row.homeGoals > row.awayGoals) {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 font-semibold">
          Home win
        </span>
      );
    }
    if (row.homeGoals < row.awayGoals) {
      return (
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 font-semibold">
          Away win
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700 font-semibold">
        Draw
      </span>
    );
  }

  return (
    <section id="results" className="mt-10 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-sm">
              ⚽
            </span>
            Match Results
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Final scores for completed Samsara Premier League fixtures.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-gray-500">Latest completed week:</span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 font-medium">
              Week {latestWeek}
            </span>
          </div>

          {/* Week dropdown */}
          <label className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <span>View results for</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {weeks.map((w) => (
                <option key={w} value={w}>
                  Week {w}
                  {w === latestWeek ? " - Latest" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Result cards */}
      <div className="rounded-2xl border bg-white shadow-sm p-3 md:p-4 space-y-3">
        <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
          <span>Week {selectedWeek} results</span>
        </div>

        {rowsForWeek.length === 0 && (
          <p className="text-xs md:text-sm text-gray-500">
            No results recorded for this week yet.
          </p>
        )}

        <div className="grid gap-3 md:gap-4">
          {rowsForWeek.map((m, i) => (
            <div
              key={`${m.week}-${i}`}
              className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gradient-to-r from-emerald-50 to-white px-3 py-2 md:px-4 md:py-3"
            >
              {/* Left: date and time */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-2 md:w-40">
                <div className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] md:text-xs text-gray-700 border border-emerald-100">
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

              {/* Middle: teams and score */}
              <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                  <span className="text-xs md:text-sm font-semibold text-gray-800 text-right">
                    {m.home}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="inline-flex items-center justify-center rounded-full bg-white px-3 py-1 border border-emerald-200 text-xs md:text-sm font-semibold text-gray-900">
                    {m.homeGoals} - {m.awayGoals}
                  </div>
                  {getResultBadge(m)}
                </div>

                <div className="flex items-center justify-start gap-2 w-full md:w-auto">
                  <span className="text-xs md:text-sm font-semibold text-gray-800">
                    {m.away}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] md:text-xs text-gray-400 pt-1">
          Results are updated after each match week finishes.
        </p>
      </div>
    </section>
  );
}
