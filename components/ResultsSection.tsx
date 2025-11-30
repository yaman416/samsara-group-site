// components/ResultsSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, RESULTS } from "@/lib/splData";

export default function ResultsSection() {
  const fixtureMap = useMemo(
    () => Object.fromEntries(FIXTURES.map((f) => [f.id, f])),
    []
  );

  const resultRows = RESULTS.map((r) => {
    const f = fixtureMap[r.fixtureId];
    if (!f) return null;

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
  }).filter(Boolean) as any[];

  const weeks = Array.from(new Set(resultRows.map((r) => r.week))).sort((a, b) => a - b);
  const latestWeek = weeks[weeks.length - 1] || 1;

  const [selectedWeek, setSelectedWeek] = useState(latestWeek);

  const rowsForWeek = resultRows.filter((r) => r.week === selectedWeek);

  return (
    <section id="results" className="mt-10 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold">Match Results</h2>
        <p className="text-xs md:text-sm text-gray-500">
          Latest Week:{" "}
          <span className="font-semibold text-emerald-700">Week {latestWeek}</span>
        </p>
      </div>

      {/* Week selector */}
      <div className="flex flex-wrap gap-2">
        {weeks.map((w) => (
          <button
            key={w}
            onClick={() => setSelectedWeek(w)}
            className={`px-3 py-1 rounded-full text-xs md:text-sm border transition ${
              selectedWeek === w
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white border-gray-300 text-gray-700 hover:bg-emerald-50"
            }`}
          >
            Week {w}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Home</th>
              <th className="py-2 px-3 text-center"></th>
              <th className="py-2 px-3">Away</th>
              <th className="py-2 px-3">Ground</th>
            </tr>
          </thead>
          <tbody>
            {rowsForWeek.map((m, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 px-3">{new Date(m.date).toLocaleDateString("en-AU")}</td>
                <td className="py-2 px-3">{m.time}</td>
                <td className="py-2 px-3 font-medium">{m.home}</td>
                <td className="py-2 px-3 text-center font-semibold">
                  {m.homeGoals} - {m.awayGoals}
                </td>
                <td className="py-2 px-3">{m.away}</td>
                <td className="py-2 px-3">{m.ground}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
