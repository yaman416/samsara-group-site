"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";

interface Club {
  id: string;
  name: string;
  short_code: string;
  community: string;
  home_color: string | null;
  away_color: string | null;
  logo_url: string | null;
  founded: string | null;
}

function initials(name: string) {
  return name.replace(/ (FC|Football Club)$/i, "").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

function clubSlug(c: Club) {
  return c.short_code.toLowerCase();
}

const FILTERS = ["All clubs", "Nepalese", "Bhutanese"] as const;
type Filter = typeof FILTERS[number];

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filter, setFilter] = useState<Filter>("All clubs");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/clubs")
      .then(r => r.json())
      .then(data => { setClubs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const visible = clubs.filter(c =>
    filter === "All clubs" ? true :
    filter === "Nepalese" ? c.community === "Nepalese" :
    c.community === "Bhutanese"
  );

  return (
    <SiteLayout activeNav="clubs">
      {/* Hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "64px 24px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b" }}>Season 3 · 2026-27</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "16px 0 0" }}>The clubs</h1>
          <p style={{ margin: "20px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab" }}>
            Twelve clubs from the Nepalese and Bhutanese communities of Canberra, competing for the Season 3 title.
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
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#98a1ab", fontSize: 16 }}>Loading clubs...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(280px,100%),1fr))", gap: 16 }}>
              {visible.map(c => (
                <Link
                  key={c.id}
                  href={`/clubs/${clubSlug(c)}`}
                  style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 22, color: "#101820", textDecoration: "none" }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    {c.logo_url ? (
                      <img src={c.logo_url} alt="" width={64} height={64} style={{ width: 64, height: 64, objectFit: "contain", flex: "none" }} />
                    ) : (
                      <span style={{ width: 64, height: 64, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14, fontSize: 17, fontWeight: 600, color: "#fff", background: c.home_color || "#101820" }}>
                        {c.short_code}
                      </span>
                    )}
                    <span style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                      <span style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.35 }}>{c.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>{c.community}</span>
                    </span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid rgba(17,24,39,.08)", paddingTop: 18, fontSize: 14, color: "#66707d" }}>
                    <span style={{ display: "flex", gap: 8 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 3, background: c.home_color || "#ccc", display: "inline-block", verticalAlign: "middle" }} />
                      <span style={{ width: 14, height: 14, borderRadius: 3, background: c.away_color || "#eee", border: "1px solid rgba(17,24,39,.12)", display: "inline-block", verticalAlign: "middle" }} />
                    </span>
                    <span style={{ color: "#e2372b", fontWeight: 500 }}>View club</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
