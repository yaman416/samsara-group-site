"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

const CREST: Record<string, string> = {
  khukuri: "/team logos/Khukuri.png",
  thuenlam: "/team logos/Thuenlam.png",
  azhas: "/team logos/azhas.png",
  queanbeyan: "/team logos/Queanbeyan.png",
  jabrothers: "/team logos/JA.png",
  everest: "/team logos/Everest.png",
  phuensum: "/team logos/phuensum.png",
  yeedzin: "/team logos/Yeedzin.png",
  ace: "/team logos/Aces.png",
  bicchi: "/team logos/Bicchi.png",
  friends: "/team logos/Friends.png",
  brosandball: "/team logos/BrosnBall.png",
};

const ALL_CLUBS = [
  { slug: "khukuri", name: "Khukuri Canberra FC", country: "Nepal", note: "Season 2 champions", returning: true },
  { slug: "thuenlam", name: "Thuenlam FC", country: "Bhutan", note: "Running Shield holders", returning: true },
  { slug: "azhas", name: "Azhas FC", country: "Bhutan", note: "Third in Season 2", returning: true },
  { slug: "queanbeyan", name: "Queanbeyan Nepalese United FC", country: "Nepal", note: "Sixth in Season 2", returning: true },
  { slug: "jabrothers", name: "JA Brothers FC", country: "Nepal", note: "Fifth in Season 2", returning: true },
  { slug: "everest", name: "Everest FC", country: "Nepal", note: "Seventh in Season 2", returning: true },
  { slug: "phuensum", name: "Phuensum FC", country: "Bhutan", note: "Eighth in Season 2", returning: true },
  { slug: "yeedzin", name: "FC Yeedzin", country: "Bhutan", note: "New for Season 3", returning: false },
  { slug: "ace", name: "Aces FC", country: "Bhutan", note: "New for Season 3", returning: false },
  { slug: "bicchi", name: "Bicchi FC", country: "Nepal", note: "New for Season 3", returning: false },
  { slug: "friends", name: "Friends FC", country: "Nepal", note: "New for Season 3", returning: false },
  { slug: "brosandball", name: "Bros & Ball FC", country: "Nepal", note: "New for Season 3", returning: false },
];

const FILTERS = ["All clubs", "Returning", "New for Season 3"] as const;
type Filter = typeof FILTERS[number];

function initials(name: string) {
  return name.replace(/ (FC|Football Club)$/, "").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

export default function ClubsPage() {
  const [filter, setFilter] = useState<Filter>("All clubs");

  const clubs = ALL_CLUBS.filter(c =>
    filter === "All clubs" ? true : filter === "Returning" ? c.returning : !c.returning
  );

  return (
    <SiteLayout activeNav="clubs">
      {/* Hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "64px 24px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b" }}>Season 3 · 2026-27</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "16px 0 0" }}>The clubs</h1>
          <p style={{ margin: "20px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab" }}>
            Twelve clubs from Canberra and Queanbeyan, drawn from the Nepalese and Bhutanese communities. Seven return from Season 2; five join for the first time.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  fontSize: 14, fontWeight: 500,
                  padding: "11px 20px", borderRadius: 999, cursor: "pointer",
                  background: filter === f ? "#e2372b" : "transparent",
                  color: filter === f ? "#ffffff" : "#98a1ab",
                  border: `1px solid ${filter === f ? "#e2372b" : "rgba(255,255,255,.24)"}`,
                  transition: "background .25s ease, color .25s ease",
                }}
              >{f}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Club grid */}
      <section style={{ background: "#f4f4f1", padding: "56px 24px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(280px,100%),1fr))", gap: 16 }}>
            {clubs.map(c => {
              const crest = CREST[c.slug];
              return (
                <Link
                  key={c.slug}
                  href={`/clubs/${c.slug}`}
                  style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 22, color: "#101820", textDecoration: "none" }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    {crest ? (
                      <Image src={crest} alt="" width={64} height={64} style={{ width: 64, height: 64, objectFit: "contain", flex: "none" }} />
                    ) : (
                      <span style={{ width: 64, height: 64, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(17,24,39,.22)", borderRadius: 14, fontSize: 17, fontWeight: 500, color: "#98a1ab" }}>
                        {initials(c.name)}
                      </span>
                    )}
                    <span style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                      <span style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.35 }}>{c.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>{c.country}</span>
                    </span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid rgba(17,24,39,.08)", paddingTop: 18, fontSize: 14, color: "#66707d" }}>
                    <span>{c.note}</span>
                    <span style={{ color: "#e2372b", fontWeight: 500 }}>View club</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
