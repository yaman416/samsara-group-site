"use client";
import { useState } from "react";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

type SeasonTab = "s2" | "s1" | "cup";

const S2_TABLE = [
  { pos: 1, marker: "R", crest: "/team logos/Thuenlam.png", name: "Thuenlam FC", P: 10, W: 8, D: 0, L: 2, GF: 25, GA: 15, GD: 10, Pts: 24, form: ["L","W","W","L","W"] },
  { pos: 2, marker: "C", crest: "/team logos/Khukuri.png", name: "Khukuri Canberra FC", P: 10, W: 7, D: 2, L: 1, GF: 33, GA: 4, GD: 29, Pts: 23, form: ["W","W","W","D","W"] },
  { pos: 3, marker: "", crest: "/team logos/azhas.png", name: "Azhas FC", P: 10, W: 6, D: 4, L: 0, GF: 18, GA: 7, GD: 11, Pts: 22, form: ["W","W","W","D","D"] },
  { pos: 4, marker: "", crest: "/team logos/Achos.png", name: "Achos FC", P: 10, W: 7, D: 0, L: 3, GF: 26, GA: 11, GD: 15, Pts: 21, form: ["L","W","W","W","W"] },
  { pos: 5, marker: "", crest: "/team logos/JA.png", name: "JA Brothers FC", P: 10, W: 4, D: 3, L: 3, GF: 14, GA: 10, GD: 4, Pts: 15, form: ["W","W","L","D","W"] },
  { pos: 6, marker: "", crest: "/team logos/Queanbeyan.png", name: "Queanbeyan NUFC", P: 10, W: 3, D: 4, L: 3, GF: 19, GA: 13, GD: 6, Pts: 13, form: ["D","D","W","D","L"] },
  { pos: 7, marker: "", crest: "/team logos/Everest.png", name: "Everest FC", P: 10, W: 3, D: 3, L: 4, GF: 15, GA: 15, GD: 0, Pts: 12, form: ["W","W","L","D","W"] },
  { pos: 8, marker: "", crest: "/team logos/phuensum.png", name: "Phuensum FC", P: 10, W: 2, D: 4, L: 4, GF: 13, GA: 17, GD: -4, Pts: 10, form: ["D","D","W","L","D"] },
  { pos: 9, marker: "", crest: "/team logos/CNFC.png", name: "CNFC", P: 10, W: 2, D: 1, L: 7, GF: 11, GA: 30, GD: -19, Pts: 7, form: ["L","L","L","L","D"] },
  { pos: 10, marker: "", crest: "/team logos/Druk.png", name: "Druk FC", P: 10, W: 1, D: 2, L: 7, GF: 14, GA: 32, GD: -18, Pts: 5, form: ["L","L","L","W","D"] },
  { pos: 11, marker: "", crest: "/team logos/Unity Stars.png", name: "Unity Stars", P: 10, W: 0, D: 1, L: 9, GF: 8, GA: 42, GD: -34, Pts: 1, form: ["L","D","L","L","L"] },
];

const S2_SCORERS = [
  { name: "Roshan Lamichhane", club: "Khukuri Canberra FC", goals: 13 },
  { name: "Tshering Tobgyel", club: "Achos FC", goals: 10 },
  { name: "Sushant Shrestha", club: "Queanbeyan NUFC", goals: 10 },
  { name: "Abhishek Chapagain", club: "Khukuri Canberra FC", goals: 8 },
  { name: "Kunzang Thinley", club: "Thuenlam FC", goals: 7 },
  { name: "Karma Nima", club: "Azhas FC", goals: 6 },
];

const S2_STATS = [
  { label: "Clubs", value: "11" },
  { label: "Matches", value: "55" },
  { label: "Goals", value: "196" },
  { label: "Avg goals / match", value: "3.6" },
];

function FormPill({ result }: { result: string }) {
  const bg = result === "W" ? "#1f6b37" : result === "D" ? "#f5a623" : "#c22b20";
  return (
    <span style={{ width: 20, height: 20, borderRadius: "50%", background: bg, color: "#fff", fontSize: 10, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {result}
    </span>
  );
}

export default function ArchivePage() {
  const [tab, setTab] = useState<SeasonTab>("s2");

  const tabs: [SeasonTab, string][] = [
    ["s2", "Season 2 · 2025-26"],
    ["s1", "Season 1 · 2024-25"],
    ["cup", "Nepalese New Year Cup 2083"],
  ];

  const maxGoals = Math.max(...S2_SCORERS.map(s => s.goals));

  return (
    <SiteLayout>
      <style>{`
        .archive-tab { background: none; border: none; cursor: pointer; font-family: 'DM Sans',system-ui,sans-serif; }
        .archive-tab:hover { color: #101820 !important; }
        .tbl th { font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: #66707d; padding: 10px 8px; text-align: right; }
        .tbl th:first-child, .tbl th:nth-child(2), .tbl th:nth-child(3) { text-align: left; }
        .tbl td { padding: 12px 8px; font-size: 14px; font-variant-numeric: tabular-nums; text-align: right; border-top: 1px solid rgba(17,24,39,.07); }
        .tbl td:first-child, .tbl td:nth-child(2), .tbl td:nth-child(3) { text-align: left; }
        .tbl tr:hover td { background: rgba(17,24,39,.025); }
        .honours-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 16px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(45%, 140px), 1fr)); gap: 12px; }
        @media (max-width: 480px) { .tbl th:nth-child(5), .tbl td:nth-child(5), .tbl th:nth-child(6), .tbl td:nth-child(6), .tbl th:nth-child(12), .tbl td:nth-child(12) { display: none; } }
      `}</style>

      {/* Hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "64px 0 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
            <Image src="/other logos/spl-logo-main.png" alt="SPL" width={56} height={56} style={{ width: 56, height: 56, objectFit: "contain" }} />
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#98a1ab" }}>Samsara Premier League</div>
          </div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.06, letterSpacing: "-.02em", margin: "0" }}>Season archive</h1>
          <p style={{ margin: "20px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab" }}>
            Tables, scorers, records and results from every Samsara Premier League season.
          </p>
        </div>
      </section>

      {/* Tab bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(17,24,39,.10)", position: "sticky", top: 76, zIndex: 40 }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0, overflowX: "auto" }}>
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="archive-tab"
              onClick={() => setTab(key)}
              style={{
                fontSize: 14, fontWeight: 500, padding: "18px 20px",
                color: tab === key ? "#101820" : "#66707d",
                borderBottom: tab === key ? "2px solid #e2372b" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >{label}</button>
          ))}
        </div>
      </div>

      {tab === "s2" && (
        <div style={{ background: "#f4f4f1", padding: "56px 0 96px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gap: 48 }}>

            {/* Honours */}
            <div className="honours-grid">
              <div style={{ background: "#101820", color: "#fff", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src="/gallery/TEAM Photos/Khukuri Canberra FC.jpg" alt="Khukuri Canberra FC" fill style={{ objectFit: "cover", opacity: .7 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 30%,rgba(16,24,32,.9) 100%)" }} />
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Champions &#127942;</div>
                  <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 22, lineHeight: 1.2, marginTop: 8 }}>Khukuri Canberra FC</div>
                </div>
              </div>
              <div style={{ background: "#101820", color: "#fff", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src="/gallery/TEAM Photos/Thuenlam.jpg" alt="Thuenlam FC" fill style={{ objectFit: "cover", opacity: .7 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 30%,rgba(16,24,32,.9) 100%)" }} />
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Running Shield · #1</div>
                  <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 22, lineHeight: 1.2, marginTop: 8 }}>Thuenlam FC</div>
                  <div style={{ fontSize: 13, color: "#66707d", marginTop: 6 }}>24 pts, league stage</div>
                </div>
              </div>
            </div>

            {/* At-a-glance */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 18 }}>Season at a glance</div>
              <div className="stats-grid">
                {S2_STATS.map(s => (
                  <div key={s.label} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 14, padding: "20px 18px" }}>
                    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-.02em", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: "#66707d", marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* League table */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 18 }}>Final standings</div>
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden", overflowX: "auto" }}>
                <table className="tbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(17,24,39,.03)" }}>
                      <th style={{ width: 36 }}>#</th>
                      <th style={{ minWidth: 40 }}></th>
                      <th style={{ minWidth: 180 }}>Club</th>
                      <th>P</th><th>W</th><th>D</th><th>L</th>
                      <th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
                      <th style={{ minWidth: 120 }}>Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {S2_TABLE.map(row => (
                      <tr key={row.pos}>
                        <td style={{ color: "#66707d", fontWeight: 500 }}>{row.pos}</td>
                        <td>
                          <div style={{ width: 28, height: 28, position: "relative" }}>
                            <Image src={row.crest} alt={row.name} fill style={{ objectFit: "contain" }} />
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: row.marker ? 600 : 400 }}>{row.name}</span>
                          {row.marker === "C" && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, letterSpacing: ".08em", background: "#f0b429", color: "#101820", borderRadius: 4, padding: "2px 6px" }}>C</span>}
                          {row.marker === "R" && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, letterSpacing: ".08em", background: "#e2372b", color: "#fff", borderRadius: 4, padding: "2px 6px" }}>R</span>}
                        </td>
                        <td>{row.P}</td><td>{row.W}</td><td>{row.D}</td><td>{row.L}</td>
                        <td>{row.GF}</td><td>{row.GA}</td>
                        <td style={{ color: row.GD > 0 ? "#1f6b37" : row.GD < 0 ? "#c22b20" : "#66707d" }}>
                          {row.GD > 0 ? "+" : ""}{row.GD}
                        </td>
                        <td style={{ fontWeight: 600 }}>{row.Pts}</td>
                        <td>
                          <div style={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
                            {row.form.map((r, i) => <FormPill key={i} result={r} />)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "12px 16px", fontSize: 12, color: "#98a1ab", borderTop: "1px solid rgba(17,24,39,.07)", display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <span><strong style={{ color: "#101820" }}>C</strong> Champions</span>
                  <span><strong style={{ color: "#101820" }}>R</strong> Running Shield</span>
                </div>
              </div>
            </div>

            {/* Leading scorers */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 18 }}>Leading scorers</div>
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden" }}>
                {S2_SCORERS.map((s, i) => (
                  <div key={i} style={{ padding: "18px 24px", borderTop: i ? "1px solid rgba(17,24,39,.07)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 500 }}>{s.name}</span>
                        <span style={{ fontSize: 13, color: "#66707d", marginLeft: 10 }}>{s.club}</span>
                      </div>
                      <span style={{ fontSize: 20, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{s.goals}</span>
                    </div>
                    <div style={{ height: 6, background: "rgba(17,24,39,.08)", borderRadius: 99 }}>
                      <div style={{ width: `${(s.goals / maxGoals) * 100}%`, height: "100%", background: "#e2372b", borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Season records */}
            <div style={{ background: "#101820", color: "#fff", borderRadius: 18, padding: "32px 36px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Season records</div>
              <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
                {[
                  ["Biggest win", "Khukuri 9-1 Unity Stars, R9"],
                  ["Highest scoring", "Khukuri 9-1 Unity Stars (10 goals), R9"],
                  ["Most goals by one team", "Khukuri Canberra FC (33 goals)"],
                  ["Fewest goals conceded", "Khukuri Canberra FC (4 goals)"],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d" }}>{label}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, marginTop: 8, color: "#c3cad2" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {tab === "s1" && (
        <div style={{ background: "#f4f4f1", padding: "56px 0 96px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gap: 48 }}>

            {/* Season intro */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "32px 64px", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b", marginBottom: 14 }}>Season 1 · 2024-25</div>
                <h2 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(26px,3vw,42px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 20px" }}>Where it all began</h2>
                <p style={{ fontSize: 16, lineHeight: 1.85, color: "#66707d", margin: 0 }}>
                  The inaugural season of the Samsara Premier League brought together eight clubs from Canberra's Nepalese and Bhutanese communities for seven match weeks of competition at Nicholls Synthetic Field. Nepal United FC claimed the first ever SPL title.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["8", "Clubs"], ["7", "Match weeks"], ["2024", "Inaugural year"], ["Nicholls", "Venue"]].map(([v, l]) => (
                  <div key={l} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 14, padding: "22px 20px" }}>
                    <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.02em", color: "#101820" }}>{v}</div>
                    <div style={{ fontSize: 13, color: "#66707d", marginTop: 6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Champions card */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 18 }}>Honours</div>
              <div style={{ background: "#101820", color: "#fff", borderRadius: 20, overflow: "hidden", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))" }}>
                <div style={{ position: "relative", minHeight: 300 }}>
                  <Image src="/gallery/TEAM Photos/Nepal United FC.jpg" alt="Nepal United FC" fill style={{ objectFit: "cover", opacity: .75 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent 50%,rgba(16,24,32,.95) 100%)" }} />
                </div>
                <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b" }}>Season 1 Champions &#127942;</div>
                  <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(28px,3vw,42px)", lineHeight: 1.1, fontWeight: 600 }}>Nepal United FC</div>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#98a1ab", margin: 0, maxWidth: "36ch" }}>
                    Nepal United FC lifted the inaugural SPL shield, becoming the first champions in the league's history.
                  </p>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
                    {[["Season", "2024-25"], ["Competition", "Round robin"]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d" }}>{l}</div>
                        <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4, color: "#c3cad2" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Records banner */}
            <div style={{ background: "#101820", color: "#fff", borderRadius: 18, padding: "32px 36px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab", marginBottom: 24 }}>Season records</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24 }}>
                {[
                  ["First ever SPL goal", "Season 1, Round 1"],
                  ["First champions", "Nepal United FC"],
                  ["Clubs", "8 founding clubs"],
                  ["Venue", "Nicholls Synthetic Field, Canberra"],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d" }}>{label}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.5, marginTop: 8, color: "#c3cad2" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {tab === "cup" && (
        <div style={{ background: "#f4f4f1", padding: "56px 0 96px" }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gap: 48 }}>

            {/* Intro */}
            <div style={{ maxWidth: "64ch" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b", marginBottom: 14 }}>Nepalese New Year Cup 2083</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(26px,3vw,42px)", lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 20px" }}>Celebrating 2083 Bikram Sambat</h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "#66707d", margin: 0 }}>
                Sixteen clubs competed across two match days at Nicholls Synthetic Field to mark the Nepalese New Year. Canberra City FC lifted the trophy in a festival of football, culture, and community.
              </p>
            </div>

            {/* Champions + Runner-up photo cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 20 }}>
              <div style={{ background: "#101820", borderRadius: 20, overflow: "hidden", color: "#fff" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src="/gallery/Nepalese New Year Cup/nnyc-champions.jpg" alt="Canberra City FC" fill style={{ objectFit: "cover", opacity: .8 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 40%,rgba(16,24,32,.95) 100%)" }} />
                  <div style={{ position: "absolute", top: 16, left: 16, background: "#e2372b", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 999 }}>Champions &#127942;</div>
                </div>
                <div style={{ padding: "22px 26px 28px" }}>
                  <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 26, fontWeight: 600, lineHeight: 1.15 }}>Canberra City FC</div>
                  <div style={{ fontSize: 14, color: "#98a1ab", marginTop: 8 }}>NNYC 2083 Winners</div>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 20, overflow: "hidden", color: "#101820" }}>
                <div style={{ position: "relative", aspectRatio: "4/3" }}>
                  <Image src="/gallery/Nepalese New Year Cup/nnyc-runnerup.jpg" alt="FC Yeedzin" fill style={{ objectFit: "cover", opacity: .9 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 40%,rgba(244,244,241,.95) 100%)" }} />
                  <div style={{ position: "absolute", top: 16, left: 16, background: "#101820", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 999 }}>Runner-up</div>
                </div>
                <div style={{ padding: "22px 26px 28px" }}>
                  <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 26, fontWeight: 600, lineHeight: 1.15 }}>FC Yeedzin</div>
                  <div style={{ fontSize: 14, color: "#66707d", marginTop: 8 }}>NNYC 2083 Finalists</div>
                </div>
              </div>
            </div>

            {/* Facts strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(160px,100%),1fr))", gap: 12 }}>
              {[["Date", "4 Apr and 11 Apr 2026"], ["Venue", "Nicholls Synthetic Field"], ["Format", "16 teams, 4 groups, knockout"], ["Edition", "2nd NNYC"]].map(([l, v]) => (
                <div key={l} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 14, padding: "20px 18px" }}>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 8 }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.4, color: "#101820" }}>{v}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </SiteLayout>
  );
}
