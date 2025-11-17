// components/FeaturedEventsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPL_SEASON } from "@/lib/splData";
import { Trophy } from "lucide-react";

export default function FeaturedEventsSection() {
  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
        <Trophy size={20} />
        Featured Event
      </h2>
      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{SPL_SEASON.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-1">
          <p>Organised by {SPL_SEASON.organiser}</p>
          <p>Venue: {SPL_SEASON.venue}</p>
          <p>Season start: {new Date(SPL_SEASON.startDate).toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">
            Regular fixtures, standings, and sponsors updated each match week.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
