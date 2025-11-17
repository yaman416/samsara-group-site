// components/UpcomingFixturesSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUpcomingFixtures, TEAM_LOGOS } from "@/lib/splData";
import { CalendarDays } from "lucide-react";

export default function UpcomingFixturesSection() {
  const fixtures = getUpcomingFixtures(6);

  return (
    <section id="upcoming-fixtures" className="mt-10 space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
        <CalendarDays size={20} />
        Upcoming Fixtures
      </h2>

      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            Next Matches
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {fixtures.length === 0 ? (
            <p className="text-sm text-gray-600">No upcoming fixtures listed.</p>
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
                {fixtures.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="py-2 pr-2">{new Date(f.date).toLocaleDateString()}</td>
                    <td className="py-2 pr-2">{f.time}</td>

                    {/* Home team */}
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        {TEAM_LOGOS[f.home] && (
                          <img
                            src={TEAM_LOGOS[f.home]}
                            alt={f.home}
                            className="h-6 w-6 rounded-full border object-cover"
                          />
                        )}
                        <span className="font-medium">{f.home}</span>
                      </div>
                    </td>

                    {/* VS */}
                    <td className="py-2 pr-2 text-center font-semibold text-gray-500">
                      vs
                    </td>

                    {/* Away team */}
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        {TEAM_LOGOS[f.away] && (
                          <img
                            src={TEAM_LOGOS[f.away]}
                            alt={f.away}
                            className="h-6 w-6 rounded-full border object-cover"
                          />
                        )}
                        <span>{f.away}</span>
                      </div>
                    </td>

                    <td className="py-2 pr-0">{f.ground}</td>
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
