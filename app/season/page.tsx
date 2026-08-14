"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

const TABS = ["Overview", "Fixtures", "Results", "Table", "Clubs", "Statistics"] as const;
type Tab = typeof TABS[number];

type Club = { id: string; name: string; short_code: string; community: string; home_color: string; away_color: string; home_ground: string; founded: number | null; logo_url: string | null };
type ClubRef = { id: string; name: string; short_code: string; home_color: string; logo_url: string | null };
type Result = { home_score: number; away_score: number };
type GoalScorer = { id: string; minute: number | null; is_own_goal: boolean; is_penalty: boolean; club_id: string; players: { full_name: string; jersey_number: number } | null; clubs: { name: string } | null };
type Card = { id: string; player_name: string; card_type: string; minute: number | null };
type Fixture = { id: string; week: number; venue: string | null; played_at: string | null; status: string; home_club: ClubRef; away_club: ClubRef; results: Result[] | null };
type MatchResult = Fixture & { goal_scorers: GoalScorer[]; cards: Card[] };
type TableRow = { position: number; club_name: string; short_code: string; home_color: string; played: number; won: number; drawn: number; lost: number; goals_for: number; goals_against: number; goal_diff: number; points: number };
type TopScorer = { player_id: string; full_name: string; jersey_number: number; club_name: string; club_short: string; goals: number; penalties: number };

function initials(name: string) {
  return name.replace(/ (FC|Football Club)$/i, "").split(" ").map((w: string) => w[0]).join("").slice(0, 3).toUpperCase();
}

function ClubBadge({ club, size = 32 }: { club: ClubRef | Club; size?: number }) {
  if (club.logo_url) return <Image src={club.logo_url} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />;
  return (
    <span style={{ width: size, height: size, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: size * 0.22, background: (club as ClubRef).home_color || "#101820", color: "#fff", fontSize: size * 0.32, fontWeight: 700 }}>
      {initials(club.name)}
    </span>
  );
}

function ScoreCard({ f }: { f: Fixture }) {
  const r = f.results?.[0];
  const d = f.played_at ? new Date(f.played_at) : null;
  const dateStr = d ? d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" }) : "TBC";
  const timeStr = d ? d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }) : "";
  const done = f.status === "completed";
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "#98a1ab", marginBottom: 14 }}>Week {f.week} · {dateStr} {timeStr}{f.venue ? ` · ${f.venue}` : ""}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <ClubBadge club={f.home_club} size={28} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>{f.home_club.name}</span>
        </div>
        <div style={{ fontFamily: "ui-monospace,monospace", fontSize: done ? 22 : 16, fontWeight: 700, color: done ? "#101820" : "#98a1ab", minWidth: 70, textAlign: "center", letterSpacing: ".04em" }}>
          {done && r ? `${r.home_score} - ${r.away_score}` : "vs"}
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
          <span style={{ fontWeight: 600, fontSize: 15, textAlign: "right" }}>{f.away_club.name}</span>
          <ClubBadge club={f.away_club} size={28} />
        </div>
      </div>
    </div>
  );
}

export default function SeasonPage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [cd, setCd] = useState({ dd: "--", hh: "--", mm: "--" });

  const [clubs, setClubs] = useState<Club[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [table, setTable] = useState<TableRow[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [cr, fr, rr, tr, sr] = await Promise.all([
        fetch("/api/public/clubs"),
        fetch("/api/public/fixtures"),
        fetch("/api/public/results"),
        fetch("/api/public/league-table"),
        fetch("/api/public/top-scorers"),
      ]);
      if (cr.ok) setClubs(await cr.json());
      if (fr.ok) setFixtures(await fr.json());
      if (rr.ok) setResults(await rr.json());
      if (tr.ok) setTable(await tr.json());
      if (sr.ok) setTopScorers(await sr.json());
      setLoading(false);
    }
    load();
  }, []);

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

  const upcoming = fixtures.filter(f => f.status === "scheduled").slice(0, 6);
  const completedCount = results.length;
  const hasResults = completedCount > 0;
  const hasFixtures = fixtures.length > 0;
  const hasTable = table.length > 0;

  // group fixtures by week
  const fixturesByWeek: Record<number, Fixture[]> = {};
  for (const f of fixtures) { (fixturesByWeek[f.week] ??= []).push(f); }
  const resultsByWeek: Record<number, MatchResult[]> = {};
  for (const r of results) { (resultsByWeek[r.week] ??= []).push(r); }

  return (
    <SiteLayout activeNav="season">
      <style>{`@keyframes spl-pulse { 0%,100% { opacity:1; } 50% { opacity:.25; } }`}</style>

      {/* Hero */}
      <section style={{ position: "relative", background: "#101820", color: "#fff", overflow: "hidden" }}>
        <Image
          src="/gallery/FINAL%20SPL%202025-26/644195431_122200984940559639_7106563034665718509_n.jpg"
          alt="" fill
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
                  {hasResults ? "In progress" : "Pre-season"}
                </span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 32, paddingBottom: 6 }}>
              <div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Starts</div><div style={{ fontSize: 17, fontWeight: 500, marginTop: 6 }}>14 Nov 2026</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Venue</div><div style={{ fontSize: 17, fontWeight: 500, marginTop: 6 }}>Nicholls</div></div>
              <div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Clubs</div><div style={{ fontSize: 17, fontWeight: 500, marginTop: 6 }}>{loading ? "--" : clubs.length || 12}</div></div>
              {hasResults && <div><div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Played</div><div style={{ fontSize: 17, fontWeight: 500, marginTop: 6 }}>{completedCount}</div></div>}
            </div>
          </div>
          {/* Tabs */}
          <div style={{ marginTop: 40, display: "flex", gap: 4, overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,.14)" }}>
            {TABS.map(t => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 15, fontWeight: 500, whiteSpace: "nowrap", background: "none", border: 0, borderBottom: `2px solid ${tab === t ? "#e2372b" : "transparent"}`, color: tab === t ? "#ffffff" : "#98a1ab", padding: "16px 20px", cursor: "pointer" }}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#f4f4f1", padding: "64px 0 96px", minHeight: 400 }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>

          {/* OVERVIEW */}
          {tab === "Overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 36, gridColumn: "span 2", minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Current status</div>
                <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(26px,3vw,36px)", lineHeight: 1.2, letterSpacing: "-.012em", margin: "14px 0 0" }}>
                  {hasResults ? "Season underway" : "Squad registration is open"}
                </h2>
                <p style={{ margin: "16px 0 0", fontSize: 17, lineHeight: 1.72, color: "#4a545f", maxWidth: "62ch" }}>
                  {hasResults
                    ? `${completedCount} match${completedCount === 1 ? "" : "es"} played so far. Results and standings update live.`
                    : "All clubs have accepted their invitations. Managers are registering squads now; the fixture draw follows once every squad is approved."}
                </p>
                <div style={{ marginTop: 30, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setTab(hasResults ? "Table" : "Clubs")} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, cursor: "pointer" }}>
                    {hasResults ? "View standings" : "See the clubs"}
                  </button>
                  {hasFixtures && <button type="button" onClick={() => setTab("Fixtures")} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: "1px solid rgba(17,24,39,.18)", color: "#101820", fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, cursor: "pointer" }}>Fixtures</button>}
                </div>
              </div>

              <div style={{ background: "#101820", color: "#fff", borderRadius: 18, padding: 36 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Kick-off in</div>
                <div style={{ display: "flex", gap: 22, marginTop: 26 }}>
                  {[["dd", "Days"], ["hh", "Hrs"], ["mm", "Min"]].map(([k, label]) => (
                    <div key={k}>
                      <div style={{ fontSize: 40, fontWeight: 500, lineHeight: 1, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>{cd[k as keyof typeof cd]}</div>
                      <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab", marginTop: 8 }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "auto", paddingTop: 28, fontSize: 15, color: "#98a1ab", lineHeight: 1.6 }}>Saturday 14 November 2026<br />Nicholls Synthetic Field</div>
              </div>

              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 36 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Format</div>
                <div style={{ marginTop: 20, display: "grid", gap: 14, fontSize: 16, color: "#4a545f" }}>
                  {[["Teams", clubs.length ? String(clubs.length) : "12"], ["Format", "11-a-side"], ["Game days", "Saturdays 4-8 pm"], ["Structure", "11 weeks + finals"], ["Squad limit", "22 players"]].map(([k, v], i, arr) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: i < arr.length - 1 ? "1px solid rgba(17,24,39,.08)" : undefined, paddingBottom: i < arr.length - 1 ? 14 : 0 }}>
                      <span>{k}</span><span style={{ color: "#101820", fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 26 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Title sponsor</div>
                <Image src="/sponsor/sba.png" alt="SBA Property Group" width={220} height={60} style={{ maxWidth: 220, width: "100%", height: "auto", objectFit: "contain" }} />
                <div style={{ fontSize: 15, color: "#66707d" }}>SBA Property Group presents the Samsara Premier League</div>
              </div>

              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", aspectRatio: "16/10" }}>
                  <Image src="/gallery/FINAL%20SPL%202025-26/SPL%20Championship%20Trophies.jpg" alt="SPL Championship Trophies" fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ padding: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Holders</div>
                  <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 24, lineHeight: 1.24, marginTop: 10 }}>Khukuri Canberra FC</div>
                  <div style={{ fontSize: 15, color: "#66707d", marginTop: 6 }}>Season 2 champions</div>
                </div>
              </div>

              {upcoming.length > 0 && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#66707d", marginBottom: 16 }}>Upcoming fixtures</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 12 }}>
                    {upcoming.map(f => <ScoreCard key={f.id} f={f} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FIXTURES */}
          {tab === "Fixtures" && (
            hasFixtures ? (
              <div style={{ display: "grid", gap: 32 }}>
                {Object.entries(fixturesByWeek).sort(([a], [b]) => Number(a) - Number(b)).map(([week, wf]) => (
                  <div key={week}>
                    <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#66707d", marginBottom: 14 }}>Week {week}</div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {wf.map(f => <ScoreCard key={f.id} f={f} />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPane icon="01" title="Fixtures are not published yet" desc="The Season 3 draw runs once every squad is approved. The full matchweek schedule appears here the moment it is confirmed." onBack={() => setTab("Overview")} />
            )
          )}

          {/* RESULTS */}
          {tab === "Results" && (
            hasResults ? (
              <div style={{ display: "grid", gap: 32 }}>
                {Object.entries(resultsByWeek).sort(([a], [b]) => Number(b) - Number(a)).map(([week, wr]) => (
                  <div key={week}>
                    <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#66707d", marginBottom: 14 }}>Week {week}</div>
                    <div style={{ display: "grid", gap: 14 }}>
                      {wr.map(f => {
                        const r = f.results?.[0];
                        return (
                          <div key={f.id} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 14, overflow: "hidden" }}>
                            <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                                <ClubBadge club={f.home_club} size={28} />
                                <span style={{ fontWeight: 600, fontSize: 15 }}>{f.home_club.name}</span>
                              </div>
                              <div style={{ fontFamily: "ui-monospace,monospace", fontSize: 22, fontWeight: 700, minWidth: 80, textAlign: "center" }}>{r ? `${r.home_score} - ${r.away_score}` : "-"}</div>
                              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
                                <span style={{ fontWeight: 600, fontSize: 15, textAlign: "right" }}>{f.away_club.name}</span>
                                <ClubBadge club={f.away_club} size={28} />
                              </div>
                            </div>
                            {(f.goal_scorers?.length > 0 || f.cards?.length > 0) && (
                              <div style={{ borderTop: "1px solid rgba(17,24,39,.07)", padding: "12px 20px", display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13, color: "#66707d" }}>
                                {f.goal_scorers?.filter(g => !g.is_own_goal).map(g => (
                                  <span key={g.id}>⚽ {g.players?.full_name}{g.minute ? ` ${g.minute}'` : ""}{g.is_penalty ? " (P)" : ""}</span>
                                ))}
                                {f.goal_scorers?.filter(g => g.is_own_goal).map(g => (
                                  <span key={g.id} style={{ color: "#98a1ab" }}>OG: {g.players?.full_name}{g.minute ? ` ${g.minute}'` : ""}</span>
                                ))}
                                {f.cards?.map(c => (
                                  <span key={c.id}><span style={{ display: "inline-block", width: 10, height: 13, borderRadius: 2, background: c.card_type === "red" ? "#e2372b" : "#f0b429", verticalAlign: "middle", marginRight: 4 }} />{c.player_name}{c.minute ? ` ${c.minute}'` : ""}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPane icon="0-0" title="No results yet" desc="Results and match facts appear here as soon as the first matchweek is played and published." onBack={() => setTab("Overview")} />
            )
          )}

          {/* TABLE */}
          {tab === "Table" && (
            hasTable ? (
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                    <thead>
                      <tr style={{ background: "rgba(17,24,39,.03)", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
                        {["Pos", "Club", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((h, i) => (
                          <th key={h} style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d", textAlign: i < 2 ? "left" : "center", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.map((row, i) => (
                        <tr key={row.short_code} style={{ borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                          <td style={{ padding: "14px 16px", color: "#98a1ab", fontVariantNumeric: "tabular-nums", width: 48 }}>{row.position}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 20, height: 20, borderRadius: 4, background: row.home_color, flexShrink: 0, border: "1px solid rgba(17,24,39,.1)" }} />
                              <span style={{ fontWeight: 500 }}>{row.club_name}</span>
                            </div>
                          </td>
                          {[row.played, row.won, row.drawn, row.lost, row.goals_for, row.goals_against, row.goal_diff, row.points].map((v, j) => (
                            <td key={j} style={{ padding: "14px 16px", textAlign: "center", fontVariantNumeric: "tabular-nums", fontWeight: j === 7 ? 700 : 400, color: j === 7 ? "#101820" : "#4a545f" }}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff6ec", border: "1px solid #f0d7b8", borderRadius: 12, padding: "16px 22px", marginBottom: 24 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5a623", flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: "#4a545f" }}>Season 3 has not kicked off. Standings update automatically as results are published.</span>
                </div>
                {clubs.length > 0 && (
                  <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                        <thead>
                          <tr style={{ background: "rgba(17,24,39,.03)", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
                            {["Pos", "Club", "P", "W", "D", "L", "GD", "Pts"].map((h, i) => (
                              <th key={h} style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d", textAlign: i < 2 ? "left" : "center" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {clubs.map((c, i) => (
                            <tr key={c.id} style={{ borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                              <td style={{ padding: "14px 16px", color: "#98a1ab" }}>{i + 1}</td>
                              <td style={{ padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{ width: 20, height: 20, borderRadius: 4, background: c.home_color, flexShrink: 0, border: "1px solid rgba(17,24,39,.1)" }} />
                                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                                </div>
                              </td>
                              {["0","0","0","0","0","0"].map((v, j) => <td key={j} style={{ padding: "14px 16px", textAlign: "center", color: "#98a1ab" }}>{v}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {/* CLUBS */}
          {tab === "Clubs" && (
            clubs.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 16 }}>
                {clubs.map(c => (
                  <Link key={c.id} href={`/clubs/${c.id}`} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 16, padding: "30px 22px", display: "flex", alignItems: "center", gap: 18, color: "#101820", textDecoration: "none" }}>
                    <ClubBadge club={c} size={52} />
                    <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>{c.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>{c.community}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyPane icon="11" title="Clubs registering" desc="Club profiles appear here once registration is complete." onBack={() => setTab("Overview")} />
            )
          )}

          {/* STATISTICS */}
          {tab === "Statistics" && (
            topScorers.length > 0 ? (
              <div style={{ display: "grid", gap: 32 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#66707d", marginBottom: 16 }}>Top scorers</div>
                  <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(17,24,39,.03)", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
                          {["Rank", "Player", "Club", "Goals", "Pens"].map((h, i) => (
                            <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d", textAlign: i < 3 ? "left" : "center" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {topScorers.map((p, i) => (
                          <tr key={p.player_id} style={{ borderBottom: "1px solid rgba(17,24,39,.06)" }}>
                            <td style={{ padding: "12px 16px", color: i < 3 ? "#e2372b" : "#98a1ab", fontWeight: i < 3 ? 700 : 400 }}>{i + 1}</td>
                            <td style={{ padding: "12px 16px", fontWeight: 600 }}>#{p.jersey_number} {p.full_name}</td>
                            <td style={{ padding: "12px 16px", color: "#66707d" }}>{p.club_name}</td>
                            <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, fontSize: 16 }}>{p.goals}</td>
                            <td style={{ padding: "12px 16px", textAlign: "center", color: "#98a1ab" }}>{p.penalties || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyPane icon="%" title="Statistics start with matchweek one" desc="Top scorers, clean sheets and discipline records build automatically from published results." onBack={() => setTab("Overview")} />
            )
          )}

        </div>
      </section>
    </SiteLayout>
  );
}

function EmptyPane({ icon, title, desc, onBack }: { icon: string; title: string; desc: string; onBack: () => void }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(44px,7vw,88px) 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ width: 56, height: 56, borderRadius: "50%", border: "1px dashed rgba(17,24,39,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Lora,Georgia,serif", fontSize: 20, color: "#98a1ab" }}>{icon}</span>
      <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(24px,3vw,34px)", lineHeight: 1.24, letterSpacing: "-.012em", margin: "24px 0 0" }}>{title}</h2>
      <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.72, color: "#4a545f", maxWidth: "52ch" }}>{desc}</p>
      <button type="button" onClick={onBack} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 15, fontWeight: 500, padding: "14px 26px", borderRadius: 999, cursor: "pointer", marginTop: 30 }}>Season overview</button>
    </div>
  );
}
