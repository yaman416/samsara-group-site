// components/SponsorsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPONSORS } from "@/lib/splData";
import { Building2 } from "lucide-react";

type SponsorItem = { name: string; url?: string };

function SponsorGroup({ title, items, badge }: { title: string; items: SponsorItem[]; badge: string }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm md:text-base font-semibold">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((s) => (
          <div key={s.name} className="rounded-2xl border bg-white p-4 shadow-sm text-sm">
            <div className="font-medium">{s.name}</div>
            <div className="text-[11px] text-gray-500 mt-1">{badge}</div>
            {s.url && s.url !== "#" && (
              <a href={s.url} className="text-[11px] text-blue-600 underline mt-2 inline-block" target="_blank" rel="noreferrer">
                Visit
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="mt-10 space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight flex items-center gap-2">
        <Building2 size={20} />
        Sponsors and Partners
      </h2>
      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            Samsara Premier League Partners
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-gray-700">
          <SponsorGroup title="Title Sponsor" items={SPONSORS.title} badge="Title Sponsor" />
          <SponsorGroup title="Platinum Sponsor" items={SPONSORS.platinum} badge="Platinum Sponsor" />
          <SponsorGroup title="Silver Sponsors" items={SPONSORS.silver} badge="Silver Sponsor" />
          <SponsorGroup title="Media and Creative Partners" items={SPONSORS.media} badge="Media Partner" />
        </CardContent>
      </Card>
    </section>
  );
}
