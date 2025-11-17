// components/UpcomingFixturesSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUpcomingFixtures } from "@/lib/splData";
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
                  <th className="py-2 pr-2">Away</th>
                  <th className="py-2 pr-0">Ground</th>
                </tr>
              </thead>
              <tbody>
                {fixtures.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="py-1.5 pr-2">{new Date(f.date).toLocaleDateString()}</td>
                    <td className="py-1.5 pr-2">{f.time}</td>
                    <td className="py-1.5 pr-2 font-medium">{f.home}</td>
                    <td className="py-1.5 pr-2">{f.away}</td>
                    <td className="py-1.5 pr-0">{f.ground}</td>
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
