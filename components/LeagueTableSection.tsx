// components/LeagueTableSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeLeagueTable, TEAM_LOGOS } from "@/lib/splData";
import { Trophy } from "lucide-react";

export default function LeagueTableSection() {
  const table = computeLeagueTable();

  return (
    <section id="league-table" className="mt-10 space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
        <Trophy size={20} />
        League Table
      </h2>

      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            SPL 2025-26 Standings
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="text-gray-500 text-left">
                <tr>
                  <th className="py-2 pr-2">Pos</th>
                  <th className="py-2 pr-2">Club</th>
                  <th className="py-2 pr-2">P</th>
                  <th className="py-2 pr-2">W</th>
                  <th className="py-2 pr-2">D</th>
                  <th className="py-2 pr-2">L</th>
                  <th className="py-2 pr-2">GF</th>
                  <th className="py-2 pr-2">GA</th>
                  <th className="py-2 pr-2">GD</th>
                  <th className="py-2 pr-0">Pts</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row, i) => {
                  const position = i + 1;
                  const knockout = position <= 4;     // top 4
                  const relegation = position >= 11;  // positions 11 and 12

                  let rowClass = "border-t ";
                  if (knockout) rowClass += "bg-amber-50/70 ";
                  if (relegation) rowClass += "bg-red-50/80 ";

                  return (
                    <tr key={row.name} className={rowClass}>
                      <td className="py-1.5 pr-2 font-semibold">
                        {position}
                      </td>

                      <td className="py-1.5 pr-2">
                        <div className="flex items-center gap-2">
                          {TEAM_LOGOS[row.name] && (
                            <img
                              src={TEAM_LOGOS[row.name]}
                              alt={row.name}
                              className="h-6 w-6 rounded-full border object-cover"
                            />
                          )}
                          <span className="font-medium">{row.name}</span>
                          {knockout && (
                            <span className="ml-1 rounded-full bg-amber-100 text-[10px] px-2 py-0.5 text-amber-700">
                              Knockout position
                            </span>
                          )}
                          {relegation && (
                            <span className="ml-1 rounded-full bg-red-100 text-[10px] px-2 py-0.5 text-red-700">
                              Relegation position
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-1.5 pr-2">{row.played}</td>
                      <td className="py-1.5 pr-2">{row.won}</td>
                      <td className="py-1.5 pr-2">{row.drawn}</td>
                      <td className="py-1.5 pr-2">{row.lost}</td>
                      <td className="py-1.5 pr-2">{row.goalsFor}</td>
                      <td className="py-1.5 pr-2">{row.goalsAgainst}</td>
                      <td className="py-1.5 pr-2">{row.goalDiff}</td>
                      <td className="py-1.5 pr-0 font-semibold">
                        {row.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] md:text-xs text-gray-500 mt-3 space-y-1">
            <span className="block">
              Top four clubs qualify for the SPL knockout stage after the league phase.
            </span>
            <span className="block">
              Positions 11 and 12 are relegation positions.
            </span>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
