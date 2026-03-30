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

        <div className="mt-5 overflow-x-auto">
          <div className="flex gap-4 pb-3 pr-2 snap-x snap-mandatory min-w-max">
            {ALL_SPONSORS.map((s) => {
              const clickable = s.url && s.url !== "#";
              const Card = clickable ? "a" : "div";

              return (
                <Card
                  key={s.name}
                  href={clickable ? s.url : undefined}
                  target={clickable ? "_blank" : undefined}
                  rel={clickable ? "noreferrer" : undefined}
                  className="snap-center flex h-36 w-56 flex-col items-center justify-center rounded-[1.5rem] border border-[#14324a]/10 bg-[#fcfaf6] px-4 text-center text-sm text-[#1c2430] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {s.logo ? (
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="mb-2 max-h-12 max-w-[80%] object-contain"
                    />
                  ) : (
                    <span className="mb-2 font-semibold">{s.name}</span>
                  )}

                  <span className="line-clamp-2 text-xs leading-5 text-[#4f5e6e]">
                    {s.name}
                  </span>
                  <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a6a35]">
                    {s.tier}
                  </span>
                </Card>
              );
            })}
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-[#6b7684]">
          Swipe sideways on mobile or scroll horizontally to view all sponsors.
        </p>
      </div>
    </section>
  );
}
