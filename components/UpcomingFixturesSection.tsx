// components/UpcomingFixturesSection.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIXTURES, TEAM_LOGOS } from "@/lib/splData";
import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FixtureRow = {
  round: number;
  date: string;
  time: string;
  ground: string;
  home: string;
  away: string;
};

function buildFixturesByRound(): Map<number, FixtureRow[]> {
  const byRound = new Map<number, FixtureRow[]>();

  for (const f of FIXTURES) {
    const row: FixtureRow = {
      round: f.round,
      date: f.date,
      time: f.time,
      ground: f.ground,
      home: f.home,
      away: f.away,
    };

    if (!byRound.has(f.round)) {
      byRound.set(f.round, []);
    }
    byRound.get(f.round)!.push(row);
  }

  // sort fixtures in each round by date and time
  for (const [round, matches] of byRound.entries()) {
    matches.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (da !== db) return da - db;
      return a.time.localeCompare(b.time);
    });
    byRound.set(round, matches);
  }

  return byRound;
}

export default function UpcomingFixturesSection() {
  const byRound = useMemo(() => buildFixturesByRound(), []);
  const roundsWithFixtures = Array.from(byRound.keys()).sort((a, b) => a - b);

  // choose default round as upcoming if possible, otherwise first round
  const now = new Date().getTime();
  let defaultRound = roundsWithFixtures[0] || 1;

  for (const r of roundsWithFixtures) {
    const matches = byRound.get(r) || [];
    const hasFuture = matches.some(
      (m) => new Date(m.date).getTime() >= now
    );
    if (hasFuture) {
      defaultRound = r;
      break;
    }
  }

  const [round, setRound] = useState<number>(defaultRound);
  const matches = byRound.get(round) || [];

  // Option list: use actual rounds that exist (should be 1 to 11)
  const weeks = roundsWithFixtures;

  return (
    <section id="upcoming-fixtures" className="mt-10 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <CalendarDays size={20} />
          Fixtures
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-gray-600">Match Week</span>
          <Select
            value={String(round)}
            onValueChange={(val) => setRound(Number(val))}
          >
            <SelectTrigger className="w-32 rounded-2xl h-8 text-xs md:text-sm">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {weeks.map((w) => (
                <SelectItem key={w} value={String(w)}>
                  Week {w}
                  {w === defaultRound && " (upcoming)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            Match Week {round} fixtures
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {matches.length === 0 ? (
            <p className="text-sm text-gray-600">
              No fixtures scheduled for this week.
            </p>
          ) : (
            <table className="w-full text-xs md:text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-2 pr-2">Date</th>
                  <th className="py-2 pr-2">Time</th>
                  <th className="py-2 pr-2">Home</th>
                  <th className="py-2 pr-2"></th>
                  <th className="py-2 pr-2">Away</th>
                  <th className="py-2 pr-0">Ground</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1.5 pr-2">
                      {new Date(m.date).toLocaleDateString()}
                    </td>
                    <td className="py-1.5 pr-2">{m.time}</td>

                    {/* Home */}
                    <td className="py-1.5 pr-2">
                      <div className="flex items-center gap-2">
                        {TEAM_LOGOS[m.home] && (
                          <img
                            src={TEAM_LOGOS[m.home]}
                            alt={m.home}
                            className="h-6 w-6 rounded-full border object-cover"
                          />
                        )}
                        <span className="font-medium">{m.home}</span>
                      </div>
                    </td>

                    {/* VS */}
                    <td className="py-1.5 pr-2 text-center font-semibold text-gray-500">
                      vs
                    </td>

                    {/* Away */}
                    <td className="py-1.5 pr-2">
                      <div className="flex items-center gap-2">
                        {TEAM_LOGOS[m.away] && (
                          <img
                            src={TEAM_LOGOS[m.away]}
                            alt={m.away}
                            className="h-6 w-6 rounded-full border object-cover"
                          />
                        )}
                        <span>{m.away}</span>
                      </div>
                    </td>

                    <td className="py-1.5 pr-0">{m.ground}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <p className="text-[11px] md:text-xs text-gray-500">
        Use the Match Week selector to view fixtures for any week of the SPL league stage.
      </p>
    </section>
  );
}
