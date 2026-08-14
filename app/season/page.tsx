"use client";
import { useEffect, useState } from "react";
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

const CLUBS_RAW = [
  ["Khukuri FC", "khukuri", "NP"],
  ["Thuenlam FC", "thuenlam", "BT"],
  ["Azhas FC", "azhas", "BT"],
  ["Queanbeyan Nepalese United FC", "queanbeyan", "NP"],
  ["JA Brothers FC", "jabrothers", "NP"],
  ["Everest FC", "everest", "NP"],
  ["Phuensum FC", "phuensum", "BT"],
  ["FC Yeedzin", "yeedzin", "BT"],
  ["Aces FC", "ace", "BT"],
  ["Bicchi FC", "bicchi", "NP"],
  ["Friends FC", "friends", "NP"],
  ["Bros & Ball FC", "brosandball", "NP"],
] as const;

function initials(name: string) {
  return name.replace(/ (FC|Football Club)$/, "").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

const CLUBS = CLUBS_RAW.map(c => ({
  name: c[0], slug: c[1], country: c[2] === "NP" ? "Nepal" : "Bhutan",
  crest: CREST[c[1]] || null,
  initials: initials(c[0]),
  href: `/clubs/${c[1]}`,
}));

const TABS = ["Overview", "Fixtures", "Results", "Table", "Clubs", "Statistics"] as const;
type Tab = typeof TABS[number];

const EMPTIES: Partial<Record<Tab, [string, string, string]>> = {
  Fixtures: ["01", "Fixtures are not published yet", "The Season 3 draw runs once every squad is approved. The full matchweek schedule appears here the moment it is confirmed."],
  Results: ["0-0", "No results yet", "Results and match facts appear here as soon as the first matchweek is played and published."],
  Statistics: ["%", "Statistics start with matchweek one", "Top scorers, clean sheets and discipline records build automatically from published results."],
};

export default function SeasonPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [cd, setCd] = useState({ dd: "--", hh: "--", mm: "--" });

  useEffect(() => {
    function tick() {
      const target = new Date("2026-11-14T15:00:00+11:00").getTime();
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60);
      const pad = (n: number) => String(n).padStart(2, "0");
      setCd({ dd: pad(d), hh: pad(h), mm: pad(m) });
    }
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const empty = EMPTIES[tab];
  const isTable = tab === "Table";
  const isClubs = tab === "Clubs";
  const isOverview = tab === "Overview";

  return (
    <SiteLayout activeNav="season">
      <style>{`@keyframes spl-pulse { 0%,100% { opacity:1; } 50% { opacity:.25; } }`}</style>

      {/* Hero with photo bg */}
      <section style={{ position: "relative", background: "#101820", color: "#fff", overflow: "hidden" }}>
        <Image
          src="/gallery/FINAL%20SPL%202025-26/644195431_122200984940559639_7106563034665718509_n.jpg"
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "center 38%", opacity: 0.32 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(16,24,32,.7) 0%,rgba(16,24,32,.94) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1340, margin: "0 auto", padding: "64px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#98a1ab" }}>
            <Link href="/" style={{ color: "#98a1ab" }}>Competitions</Link>
            <span>/</span>
            <span style={{ color: "#fff" }}>Season 3</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap", marginTop: 22 }}>
            <div>
              <Image src="/other logos/spl-logo-main.png" alt="SPL" width={64} height={64} style={{ width: 64, height: 64, objectFit: "contain", marginBottom: 16 }} />
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,60px)", lineHeight: 1.08, letterSpacing: "-.02em", margin: 0 }}>Samsara Premier League</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, flexWrap: "wrap" }}>
                <span style={{ background: "#e2372b", color: "#fff", fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", padding: "8px 15px", borderRadius: 6 }}>Season 03 · 2026-27</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 9, border: "1px solid rgba(255,255,255,.28)", borderRadius: 999, padding: "7px 15px", fontSize: 12, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f5a623", animation: "spl-pulse 1.8s ease-in-out infinite" }} />
                  Pre-season
                </span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 32, paddingBottom: 6 }}>
              <div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Starts</div><div style={{ fontSize: 17, fontWeight: 500, marginTop: 6 }}>14 Nov 2026</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Venue</div><div style={{ fontSize: 17, fontWeight: 500, marginTop: 6 }}>Nicholls</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Clubs</div><div style={{ fontSize: 17, fontWeight: 500, marginTop: 6 }}>12</div></div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop: 40, display: "flex", gap: 4, overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,.14)" }}>
            {TABS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  fontSize: 15, fontWeight: 500, whiteSpace: "nowrap",
                  background: "none", border: 0,
                  borderBottom: `2px solid ${tab === t ? "#e2372b" : "transparent"}`,
                  color: tab === t ? "#ffffff" : "#98a1ab",
                  padding: "16px 20px", cursor: "pointer", transition: "color .2s ease",
                }}
              >{t}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      {isOverview && (
        <section style={{ background: "#f4f4f1", padding: "64px 0 96px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {/* Status card - wide */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 36, gridColumn: "span 2", minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Current status</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(26px,3vw,36px)", lineHeight: 1.2, letterSpacing: "-.012em", margin: "14px 0 0" }}>Squad registration is open</h2>
              <p style={{ margin: "16px 0 0", fontSize: 17, lineHeight: 1.72, color: "#4a545f", maxWidth: "62ch" }}>All twelve clubs have accepted their invitations. Managers are registering squads now; the fixture draw follows once every squad is approved.</p>
              <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/#register" style={{ background: "#101820", color: "#fff", fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, textDecoration: "none" }}>Register a club</Link>
                <button type="button" onClick={() => setTab("Clubs")} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: "1px solid rgba(17,24,39,.18)", color: "#101820", fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, cursor: "pointer" }}>See the clubs</button>
              </div>
            </div>

            {/* Countdown */}
            <div style={{ background: "#101820", color: "#fff", borderRadius: 18, padding: 36, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Kick-off in</div>
              <div style={{ display: "flex", gap: 22, marginTop: 26, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 40, fontWeight: 500, lineHeight: 1, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>{cd.dd}</div><div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab", marginTop: 8 }}>Days</div></div>
                <div><div style={{ fontSize: 40, fontWeight: 500, lineHeight: 1, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>{cd.hh}</div><div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab", marginTop: 8 }}>Hrs</div></div>
                <div><div style={{ fontSize: 40, fontWeight: 500, lineHeight: 1, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>{cd.mm}</div><div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab", marginTop: 8 }}>Min</div></div>
              </div>
              <div style={{ marginTop: "auto", paddingTop: 28, fontSize: 15, color: "#98a1ab", lineHeight: 1.6 }}>Saturday 14 November 2026<br />Nicholls Synthetic Field</div>
            </div>

            {/* Format */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Format</div>
              <div style={{ marginTop: 20, display: "grid", gap: 14, fontSize: 16, color: "#4a545f" }}>
                {[["Teams", "12"], ["Format", "11-a-side"], ["Game days", "Saturdays 4-8 pm"], ["Structure", "11 weeks + finals"], ["Squad limit", "22 players"]].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: i < arr.length - 1 ? "1px solid rgba(17,24,39,.08)" : undefined, paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
                    <span>{k}</span><span style={{ color: "#101820", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsor */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 26 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Title sponsor</div>
              <Image src="/sponsor/sba.png" alt="SBA Property Group" width={220} height={60} style={{ maxWidth: 220, width: "100%", height: "auto", objectFit: "contain" }} />
              <div style={{ fontSize: 15, color: "#66707d" }}>SBA Property Group presents the Samsara Premier League</div>
            </div>

            {/* Holders photo card */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", aspectRatio: "16/10" }}>
                <Image
                  src="/gallery/FINAL%20SPL%202025-26/SPL%20Championship%20Trophies.jpg"
                  alt="SPL Championship Trophies"
                  fill style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Holders</div>
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 24, lineHeight: 1.24, marginTop: 10 }}>Khukuri Canberra FC</div>
                <div style={{ fontSize: 15, color: "#66707d", marginTop: 6 }}>Season 2 champions</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty panes */}
      {empty && (
        <section style={{ background: "#f4f4f1", padding: "64px 0 120px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(44px,7vw,88px) 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ width: 56, height: 56, borderRadius: "50%", border: "1px dashed rgba(17,24,39,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Lora,Georgia,serif", fontSize: 22, color: "#98a1ab" }}>{empty[0]}</span>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(24px,3vw,34px)", lineHeight: 1.24, letterSpacing: "-.012em", margin: "24px 0 0" }}>{empty[1]}</h2>
              <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.72, color: "#4a545f", maxWidth: "52ch" }}>{empty[2]}</p>
              <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <button type="button" onClick={() => setTab("Overview")} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, cursor: "pointer" }}>Season overview</button>
                <Link href="/#updates" style={{ border: "1px solid rgba(17,24,39,.18)", color: "#101820", fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, textDecoration: "none" }}>Latest updates</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Table */}
      {isTable && (
        <section style={{ background: "#f4f4f1", padding: "64px 0 120px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff6ec", border: "1px solid #f0d7b8", borderRadius: 12, padding: "16px 22px", marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5a623", flex: "none" }} />
              <span style={{ fontSize: 15, color: "#4a545f" }}>Season 3 has not kicked off. Standings update automatically as results are published.</span>
            </div>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "56px minmax(0,1fr) 46px 46px 46px 46px 56px 56px", gap: 8, padding: "16px 26px", borderBottom: "1px solid rgba(17,24,39,.10)", fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d" }}>
                <span>Pos</span><span>Club</span><span style={{ textAlign: "center" }}>P</span><span style={{ textAlign: "center" }}>W</span><span style={{ textAlign: "center" }}>D</span><span style={{ textAlign: "center" }}>L</span><span style={{ textAlign: "center" }}>GD</span><span style={{ textAlign: "center" }}>Pts</span>
              </div>
              {[...CLUBS].sort((a, b) => a.name.localeCompare(b.name)).map((c, i) => (
                <div key={c.slug} style={{ display: "grid", gridTemplateColumns: "56px minmax(0,1fr) 46px 46px 46px 46px 56px 56px", gap: 8, padding: "14px 26px", borderBottom: "1px solid rgba(17,24,39,.06)", alignItems: "center", fontSize: 15 }}>
                  <span style={{ color: "#98a1ab", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    {c.crest ? <Image src={c.crest} alt="" width={26} height={26} style={{ width: 26, height: 26, objectFit: "contain", flex: "none" }} /> : <span style={{ width: 26, height: 26, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(17,24,39,.22)", borderRadius: 7, fontSize: 9, fontWeight: 500, color: "#98a1ab" }}>{c.initials}</span>}
                    <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                  </span>
                  {["0","0","0","0","0","0"].map((v, j) => <span key={j} style={{ textAlign: "center", color: j === 5 ? "#101820" : "#98a1ab", fontWeight: j === 5 ? 500 : 400, fontVariantNumeric: "tabular-nums" }}>{v}</span>)}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Clubs tab */}
      {isClubs && (
        <section style={{ background: "#f4f4f1", padding: "64px 0 120px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 16 }}>
              {CLUBS.map(c => (
                <Link key={c.slug} href={c.href} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 16, padding: "30px 22px", display: "flex", alignItems: "center", gap: 18, color: "#101820", textDecoration: "none" }}>
                  {c.crest ? (
                    <Image src={c.crest} alt="" width={56} height={56} style={{ width: 56, height: 56, objectFit: "contain", flex: "none" }} />
                  ) : (
                    <span style={{ width: 56, height: 56, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(17,24,39,.22)", borderRadius: 12, fontSize: 16, fontWeight: 500, color: "#98a1ab" }}>{c.initials}</span>
                  )}
                  <span style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>{c.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>{c.country}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
