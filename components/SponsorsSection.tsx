// components/SponsorsSection.tsx
import { SPONSORS } from "@/lib/splData";
import { Building2 } from "lucide-react";

type SponsorItem = {
  name: string;
  url?: string;
  logo?: string;
  note?: string;
};

type Tier =
  | "Title Sponsor"
  | "Platinum Sponsor"
  | "Silver Sponsor"
  | "Media Partner"
  | "Merchandise Partner";

type SponsorWithTier = SponsorItem & { tier: Tier };

function buildSponsorList(): SponsorWithTier[] {
  const list: SponsorWithTier[] = [];

  SPONSORS.title.forEach((s) =>
    list.push({ ...s, tier: "Title Sponsor" })
  );
  SPONSORS.platinum.forEach((s) =>
    list.push({ ...s, tier: "Platinum Sponsor" })
  );
  SPONSORS.silver.forEach((s) =>
    list.push({ ...s, tier: "Silver Sponsor" })
  );
  SPONSORS.media.forEach((s) =>
    list.push({ ...s, tier: "Media Partner" })
  );
  SPONSORS.merch.forEach((s) =>
    list.push({ ...s, tier: "Merchandise Partner" })
  );

  return list;
}

const ALL_SPONSORS = buildSponsorList();
const TIER_ORDER: Tier[] = [
  "Title Sponsor",
  "Platinum Sponsor",
  "Silver Sponsor",
  "Media Partner",
  "Merchandise Partner",
];

export default function SponsorsSection() {
  if (!ALL_SPONSORS.length) return null;

  return (
    <section id="sponsors" className="mt-12 mb-4">
      <div className="shell-card px-4 py-7 sm:px-6 md:px-8">
        <div className="text-center">
          <p className="section-kicker">Partners</p>
          <h2 className="mt-2 inline-flex items-center justify-center gap-2 font-display text-3xl text-slate-900 md:text-4xl">
            <Building2 size={22} className="text-[#8a6a35]" />
            <span>Our Sponsors</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#526070]">
            Thank you to the businesses and partners who support the Samsara Premier League and
            help make community football possible in Canberra.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {TIER_ORDER.map((tier) => {
            const sponsors = ALL_SPONSORS.filter((sponsor) => sponsor.tier === tier);
            if (!sponsors.length) return null;

            return (
              <div key={tier} className="rounded-[1.75rem] border border-[#14324a]/10 bg-[#f9f4ec] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl text-[#182230]">{tier}</h3>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6a35]">
                    {sponsors.length} partner{sponsors.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {sponsors.map((s) => {
                    const clickable = s.url && s.url !== "#";
                    const Card = clickable ? "a" : "div";

                    return (
                      <Card
                        key={s.name}
                        href={clickable ? s.url : undefined}
                        target={clickable ? "_blank" : undefined}
                        rel={clickable ? "noreferrer" : undefined}
                        className="flex min-h-36 flex-col items-center justify-center rounded-[1.5rem] border border-[#14324a]/10 bg-[#fcfaf6] px-4 py-5 text-center text-sm text-[#1c2430] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        {s.logo ? (
                          <img
                            src={s.logo}
                            alt={s.name}
                            className="mb-3 max-h-12 max-w-[80%] object-contain"
                          />
                        ) : (
                          <span className="mb-2 font-semibold">{s.name}</span>
                        )}

                        <span className="line-clamp-2 text-xs leading-5 text-[#4f5e6e]">
                          {s.name}
                        </span>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
