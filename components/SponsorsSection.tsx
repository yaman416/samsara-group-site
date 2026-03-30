import { Building2 } from "lucide-react";
import { EVENT_PARTNERS } from "@/lib/siteContent";

const ITEMS = EVENT_PARTNERS.flatMap((group) =>
  group.names.map((name) => ({
    tier: group.tier,
    name,
  })),
);

export default function SponsorsSection() {
  const marqueeItems = [...ITEMS, ...ITEMS];

  return (
    <section id="sponsors" className="mt-12 mb-4">
      <div className="shell-card overflow-hidden px-4 py-7 sm:px-6 md:px-8">
        <div className="section-divider">
          <div>
            <p className="section-kicker">Sponsors & Partners</p>
            <h2 className="mt-2 inline-flex items-center gap-2 font-display text-3xl md:text-4xl">
              <Building2 size={22} className="text-[#ff8f62]" />
              <span className="text-[#15202b]">Thank you for supporting this community event</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#607181]">
              Platinum, diamond, gold, silver, and community partners helping make the Nepalese New Year Cup possible.
            </p>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="partner-marquee flex w-max gap-4">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.tier}-${item.name}-${index}`}
                className="flex min-h-[92px] min-w-[240px] flex-col items-start justify-center rounded-[1rem] border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b42318]">
                  {item.tier}
                </span>
                <span className="mt-2 text-sm font-semibold leading-6 text-[#15202b]">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
