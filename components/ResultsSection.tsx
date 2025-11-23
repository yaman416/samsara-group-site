// components/ResultsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FIXTURES, RESULTS, TEAM_LOGOS } from "@/lib/splData";
import { ListChecks } from "lucide-react";

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

function buildResults(): { round: number; matches: MatchResultRow[] }[] {
  const resultMap = new Map(
    RESULTS.map((r) => [r.fixtureId, r])
  );

  const completed: MatchResultRow[] = FIXTURES
    .filter((f) => resultMap.has(f.id))
    .map((f) => {
      const r = resultMap.get(f.id)!;
      return {
        round: f.round,
        date: f.date,
        time: f.time,
        ground: f.ground,
        home: f.home,
        away: f.away,
        homeGoals: r.homeGoals,
        awayGoals: r.awayGoals,
      };
    });

  // group by round
  const byRound = new Map<number, MatchResultRow[]>();
  for (const m of completed) {
    if (!byRound.has(m.round)) byRound.set(m.round, []);
    byRound.get(m.round)!.push(m);
  }

  // build sorted array
  const rounds = Array.from(byRound.keys()).sort((a, b) => a - b);
  return rounds.map((round) => {
    const matches = byRound.get(round)!;
    matches.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (da !== db) return da - db;
      return a.time.localeCompare(b.time);
    });
    return { round, matches };
  });
}

export default function ResultsSection() {
  const grouped = buildResults();
  if (grouped.length === 0) {
    return null;
  }

  const latestRound = grouped[grouped.length - 1]?.round;

  return (
    <section id="results" className="mt-10 space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
        <ListChecks size={20} />
        Match Results
      </h2>

      {grouped.map(({ round, matches }) => (
        <Card key={round} className="rounded-2xl border bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm md:text-base">
              Match Week {round}
            </CardTitle>
            {round === latestRound && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                Latest
              </span>
            )}
          </CardHeader>
          <CardContent className="overflow-x-auto">
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
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
