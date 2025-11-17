// components/FeaturedEventsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPL_SEASON, ORG } from "@/lib/splData";
import { Trophy } from "lucide-react";

export default function FeaturedEventsSection() {
  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
        <Trophy size={20} />
        Featured Event
      </h2>

      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 pb-3">
          {/* SPL logo */}
          <div className="h-14 w-14 md:h-16 md:w-16 flex items-center justify-center rounded-2xl border bg-gray-50 overflow-hidden">
            <img
              src="/spl-logo.png"
              alt="Samsara Premier League logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 border border-amber-100">
              <span>Samsara Premier League</span>
              <span className="text-[10px] uppercase tracking-wide">
                SPL 2025-26
              </span>
            </div>

            <CardTitle className="text-base md:text-lg">
              {SPL_SEASON.name}
            </CardTitle>
            <p className="text-xs md:text-sm text-gray-600">
              Organised by {ORG.name}
            </p>
          </div>
        </CardHeader>

        <CardContent className="text-sm text-gray-700 space-y-3">
          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Venue
              </p>
              <p className="font-medium">{SPL_SEASON.venue}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Season start
              </p>
              <p className="font-medium">
                {new Date(SPL_SEASON.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Format
              </p>
              <p className="font-medium">League fixtures and finals</p>
            </div>
          </div>

          <p className="text-xs md:text-sm text-gray-600">
            SPL brings together community clubs for a structured season of
            football in Canberra. Fixtures, league standings, and sponsor
            details are updated each match week to keep players and supporters
            informed.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
