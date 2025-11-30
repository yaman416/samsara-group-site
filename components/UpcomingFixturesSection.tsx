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
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold">Fixtures</h2>
        <p className="text-xs md:text-sm text-gray-500">
          Next Match Week: <span className="font-semibold text-blue-600">Week {upcomingWeek}</span>
        </p>
      </div>

      {/* Week selector */}
      <div className="flex flex-wrap gap-2">
        {weeks.map((w) => {
          const isUpcoming = w === upcomingWeek;
          const isSelected = w === selectedWeek;

          return (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`px-3 py-1 rounded-full text-xs md:text-sm border transition ${
                isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
              }`}
            >
              Week {w}
              {isUpcoming && (
                <span className="ml-1 text-[10px] text-blue-700 bg-blue-100 px-1 rounded">
                  Upcoming
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Time</th>
              <th className="py-2 px-3">Home</th>
              <th className="py-2 px-3"></th>
              <th className="py-2 px-3">Away</th>
              <th className="py-2 px-3">Ground</th>
            </tr>
          </thead>
          <tbody>
            {fixturesForWeek.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="py-2 px-3">{new Date(m.date).toLocaleDateString("en-AU")}</td>
                <td className="py-2 px-3">{m.time}</td>
                <td className="py-2 px-3 font-medium">{m.home}</td>
                <td className="py-2 px-3 text-center">vs</td>
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
