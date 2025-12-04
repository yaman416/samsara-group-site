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
      <div className="rounded-3xl border bg-white px-4 py-7 shadow-sm sm:px-6 md:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="inline-flex items-center justify-center gap-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
            <Building2 size={22} className="text-orange-600" />
            <span>Our Sponsors</span>
          </h2>
          <p className="mt-2 text-xs md:text-sm text-gray-600 max-w-2xl mx-auto">
            Thank you to the businesses and partners who support the Samsara
            Premier League and help make community football possible in Canberra.
          </p>
        </div>

        {/* Horizontal slider */}
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
                  className="snap-center flex h-32 w-52 flex-col items-center justify-center rounded-2xl border bg-white px-3 text-center text-xs md:text-sm text-gray-800 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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

                  <span className="line-clamp-1 text-[11px] text-gray-700">
                    {s.name}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold uppercase text-orange-600">
                    {s.tier}
                  </span>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Small note */}
        <p className="mt-2 text-[11px] text-center text-gray-500">
          Swipe sideways on mobile or scroll horizontally to view all sponsors.
        </p>
      </div>
    </section>
  );
}
