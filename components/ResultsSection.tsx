// components/ResultsSection.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIXTURES, RESULTS, TEAM_LOGOS } from "@/lib/splData";
import { ListChecks } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MatchResultRow = {
  round: number;
  date: string;
  time: string;
  ground: string;
  home: string;
  away: string;
  homeGoals: number;
  awayGoals: number;
};

function buildResultsByRound(): Map<number, MatchResultRow[]> {
  const resultMap = new Map(RESULTS.map((r) => [r.fixtureId, r]));
  const byRound = new Map<number, MatchResultRow[]>();

  for (const f of FIXTURES) {
    const r = resultMap.get(f.id);
    if (!r) continue;

    const row: MatchResultRow = {
      round: f.round,
      date: f.date,
      time: f.time,
      ground: f.ground,
      home: f.home,
      away: f.away,
      homeGoals: r.homeGoals,
      awayGoals: r.awayGoals,
    };

    if (!byRound.has(f.round)) {
      byRound.set(f.round, []);
    }
    byRound.get(f.round)!.push(row);
  }

  // sort each round by date and time
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

export default function ResultsSection() {
  const byRound = useMemo(() => buildResultsByRound(), []);
  const allRoundsWithResults = Array.from(byRound.keys()).sort((a, b) => a - b);

  // latest round that has results, otherwise 1
  const latestRound = allRoundsWithResults[allRoundsWithResults.length - 1] || 1;

  const [round, setRound] = useState<number>(latestRound);

  const matches = byRound.get(round) || [];
  const weeks = Array.from({ length: 11 }, (_, i) => i + 1); // 1 to 11

  return (
    <section id="results" className="mt-10 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ListChecks size={20} />
          Match Results
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
                  {w === latestRound && " (latest)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            Match Week {round} results
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {matches.length === 0 ? (
            <p className="text-sm text-gray-600">
              No results recorded for this week yet.
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

                    {/* Score */}
                    <td className="py-1.5 pr-2 text-center font-semibold">
                      {m.homeGoals} - {m.awayGoals}
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
    </section>
  );
}
