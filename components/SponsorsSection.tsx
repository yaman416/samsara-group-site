// components/SponsorsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPONSORS } from "@/lib/splData";
import { Building2 } from "lucide-react";

type SponsorItem = {
  name: string;
  url?: string;
  logo?: string;
  note?: string;
};

function SponsorGroup({
  title,
  items,
  badge,
}: {
  title: string;
  items: SponsorItem[];
  badge: string;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm md:text-base font-semibold">{title}</h3>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((s) => (
          <div
            key={s.name}
            className="rounded-2xl border bg-white p-4 shadow-sm text-sm flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {s.logo && (
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-50 border overflow-hidden">
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="font-medium">{s.name}</div>
                <div className="text-[11px] text-gray-500">{badge}</div>
              </div>
            </div>

            {s.note && (
              <p className="text-[11px] text-gray-600 leading-snug">{s.note}</p>
            )}

            {s.url && s.url !== "#" && (
              <a
                href={s.url}
                className="text-[11px] text-blue-600 underline"
                target="_blank"
                rel="noreferrer"
              >
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
        Sponsors & Partners
      </h2>

      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            Official Partners of SPL 2025-26
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-10 text-sm text-gray-700">
          <SponsorGroup
            title="Title Sponsor"
            items={SPONSORS.title}
            badge="Title Sponsor"
          />

          <SponsorGroup
            title="Platinum Sponsor"
            items={SPONSORS.platinum}
            badge="Platinum Sponsor"
          />

          <SponsorGroup
            title="Silver Sponsors"
            items={SPONSORS.silver}
            badge="Silver Sponsor"
          />

          <SponsorGroup
            title="Media & Creative Partners"
            items={SPONSORS.media}
            badge="Media Partner"
          />

          <SponsorGroup
            title="Merchandise Partner"
            items={SPONSORS.merch}
            badge="Merchandise Partner"
          />
        </CardContent>
      </Card>
    </section>
  );
}
