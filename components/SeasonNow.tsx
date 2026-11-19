"use client";

// Home page "This season" block: live match (if one is on), latest results, the table and the next matchday.
// Replaces the pre-season countdown. All data comes from the public APIs the Season page already uses.

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const RED = "#cf2e24";
const DARK = "#101820";
const MUTED = "#66707d";
const TZ = "Australia/Sydney";
const FACEBOOK = "https://www.facebook.com/samsaragroup.cbr";

type ClubRef = { id: string; name: string; short_code: string; home_color: string | null; logo_url: string | null };
type Fixture = {
  id: string; week: number; venue: string | null; played_at: string | null; status: string;
  home_club: ClubRef; away_club: ClubRef;
  results: { home_score: number; away_score: number }[] | { home_score: number; away_score: number } | null;
};
type Row = { position: number; club_name: string; logo_url: string | null; home_color: string | null; played: number; goal_diff: number; points: number };
type LiveClub = { name: string; short: string; logo: string | null } | null;
type Live = {
  fixture: { id: string; venue: string | null; home: LiveClub; away: LiveClub } | null;
  live: { home_score: number; away_score: number; period: string } | null;
};

const score = (f: Fixture) => (Array.isArray(f.results) ? f.results[0] : f.results) ?? null;
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", timeZone: TZ });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: TZ });
const byTime = (a: Fixture, b: Fixture) => (a.played_at ?? "").localeCompare(b.played_at ?? "");

function initials(name: string) {
  return name.replace(/ (FC|Football Club)$/i, "").replace(/^FC /i, "").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

function Badge({ name, logo, color, size = 26 }: { name: string; logo: string | null; color?: string | null; size?: number }) {
  if (logo) return <Image src={logo} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />;
  return (
    <span style={{ width: size, height: size, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: size * 0.22, background: color || DARK, color: "#fff", fontSize: size * 0.32, fontWeight: 700 }}>
      {initials(name)}
    </span>
  );
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "24px clamp(18px,4vw,26px) 16px", minWidth: 0 };
const eyebrow: React.CSSProperties = { fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: MUTED };
const linkStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: RED, textDecoration: "none", letterSpacing: ".04em", display: "inline-block", padding: "6px 0" };

function MatchLine({ f, showScore }: { f: Fixture; showScore: boolean }) {
  const r = score(f);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr)", gap: 12, alignItems: "center", padding: "12px 0", borderTop: "1px solid rgba(17,24,39,.08)" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, lineHeight: 1.35 }}>
        {f.played_at ? fmtTime(f.played_at) : "TBC"}
        {f.venue && <div style={{ fontWeight: 500, fontSize: 11 }}>{f.venue.replace("Ground ", "G")}</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 7, minWidth: 0 }}>
        {([[f.home_club, r?.home_score], [f.away_club, r?.away_score]] as const).map(([c, s], i) => {
          const won = showScore && r && (i === 0 ? r.home_score > r.away_score : r.away_score > r.home_score);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge name={c.name} logo={c.logo_url} color={c.home_color} size={22} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: won ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
              {showScore && r && <span style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{s}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SeasonNow() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [table, setTable] = useState<Row[]>([]);
  const [live, setLive] = useState<Live | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const seasons = await fetch("/api/public/seasons").then(r => (r.ok ? r.json() : []));
        const active = seasons.find((s: { is_active: boolean }) => s.is_active) ?? seasons[0];
        const sid = active?.id ? `?season_id=${active.id}` : "";
        const [fr, tr] = await Promise.all([fetch(`/api/public/fixtures${sid}`), fetch(`/api/public/league-table${sid}`)]);
        if (stop) return;
        if (fr.ok) setFixtures(await fr.json());
        if (tr.ok) setTable(await tr.json());
      } catch { /* sections fall back to links */ }
      if (!stop) setLoaded(true);
    })();
    // The live feed is polled so a match that kicks off while the page is open shows up.
    const pollLive = () => fetch("/api/public/live").then(r => (r.ok ? r.json() : null)).then(d => { if (!stop) setLive(d); }).catch(() => {});
    pollLive();
    const id = setInterval(pollLive, 30000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  const done = fixtures.filter(f => f.status === "completed" && score(f));
  const lastWeek = done.length ? Math.max(...done.map(f => f.week)) : null;
  const latest = lastWeek == null ? [] : done.filter(f => f.week === lastWeek).sort(byTime);
  const upcomingAll = fixtures.filter(f => f.status === "scheduled").sort(byTime);
  const nextWeek = upcomingAll[0]?.week ?? null;
  const next = nextWeek == null ? [] : upcomingAll.filter(f => f.week === nextWeek);
  const nextDate = next.find(f => f.played_at)?.played_at ?? null;

  const lv = live?.live;
  const isLive = !!(live?.fixture && lv && ["1H", "HT", "2H"].includes(lv.period));

  return (
    <section className="spl-section" style={{ background: "#fff", padding: "88px 0", borderTop: "1px solid rgba(17,24,39,.08)", borderBottom: "1px solid rgba(17,24,39,.08)" }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ ...eyebrow, color: RED }}>Season 3 · 2026-27</div>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(28px,3.4vw,42px)", lineHeight: 1.2, letterSpacing: "-.012em", margin: "14px 0 0" }}>
              {lastWeek ? `The season so far` : "Season 3 is under way"}
            </h2>
          </div>
          <Link href="/season" style={linkStyle}>Full season hub</Link>
        </div>

        {isLive && live?.fixture && lv && (
          <a href={FACEBOOK} target="_blank" rel="noreferrer" style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", background: DARK, color: "#fff", borderRadius: 16, padding: "18px 22px", textDecoration: "none" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: RED, borderRadius: 999, padding: "6px 12px", fontSize: 11, fontWeight: 600, letterSpacing: ".12em" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", animation: "spl-pulse 1.8s ease-in-out infinite" }} /> LIVE{lv.period === "HT" ? " · HT" : ""}
            </span>
            <span style={{ fontSize: 17, fontWeight: 600 }}>
              {live.fixture.home?.name} <span style={{ fontVariantNumeric: "tabular-nums", margin: "0 8px" }}>{lv.home_score} - {lv.away_score}</span> {live.fixture.away?.name}
            </span>
            <span style={{ marginLeft: "auto", fontSize: 14, color: "#c3cad2" }}>Watch on Facebook</span>
          </a>
        )}

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 16, alignItems: "start" }}>
          {/* Latest results */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
              <div style={eyebrow}>{lastWeek ? `Week ${lastWeek} results` : "Results"}</div>
              <Link href="/season#results" style={linkStyle}>All results</Link>
            </div>
            {latest.length ? latest.map(f => <MatchLine key={f.id} f={f} showScore />)
              : <p style={{ margin: "8px 0 14px", fontSize: 15, color: MUTED }}>{loaded ? "Results appear here after each matchday." : "Loading results..."}</p>}
          </div>

          {/* Table */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
              <div style={eyebrow}>League table</div>
              <Link href="/season#table" style={linkStyle}>Full table</Link>
            </div>
            {table.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, tableLayout: "fixed" }}>
                <thead>
                  <tr style={{ color: MUTED, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase" }}>
                    <th style={{ textAlign: "left", padding: "6px 0", fontWeight: 600, width: 26 }}>#</th>
                    <th style={{ textAlign: "left", padding: "6px 0", fontWeight: 600 }}>Club</th>
                    <th style={{ textAlign: "center", padding: "6px 4px", fontWeight: 600, width: 30 }}>P</th>
                    <th style={{ textAlign: "center", padding: "6px 4px", fontWeight: 600, width: 38 }}>GD</th>
                    <th style={{ textAlign: "center", padding: "6px 0", fontWeight: 600, width: 36 }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {table.map(r => (
                    <tr key={r.club_name} style={{ borderTop: "1px solid rgba(17,24,39,.08)" }}>
                      <td style={{ padding: "9px 0", width: 26, color: MUTED, fontVariantNumeric: "tabular-nums" }}>{r.position}</td>
                      <td style={{ padding: "9px 0" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                          <Badge name={r.club_name} logo={r.logo_url} color={r.home_color} size={20} />
                          <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.club_name}</span>
                        </span>
                      </td>
                      <td style={{ padding: "9px 4px", textAlign: "center", fontVariantNumeric: "tabular-nums", color: "#4a545f" }}>{r.played}</td>
                      <td style={{ padding: "9px 4px", textAlign: "center", fontVariantNumeric: "tabular-nums", color: "#4a545f" }}>{r.goal_diff > 0 ? `+${r.goal_diff}` : r.goal_diff}</td>
                      <td style={{ padding: "9px 0", textAlign: "center", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ margin: "8px 0 14px", fontSize: 15, color: MUTED }}>{loaded ? "Standings update after each matchday." : "Loading table..."}</p>}
          </div>

          {/* Next matchday */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
              <div style={{ ...eyebrow, color: RED }}>{nextWeek ? `Next up · Week ${nextWeek}` : "Next up"}</div>
              <Link href="/season#fixtures" style={linkStyle}>All fixtures</Link>
            </div>
            {nextDate && <div style={{ fontSize: 17, fontWeight: 600, margin: "2px 0 12px" }}>{fmtDay(nextDate)}</div>}
            {next.length ? next.sort(byTime).map(f => <MatchLine key={f.id} f={f} showScore={false} />)
              : <p style={{ margin: "8px 0 14px", fontSize: 15, color: MUTED }}>{loaded ? "Next fixtures will be published soon." : "Loading fixtures..."}</p>}
            <div style={{ borderTop: "1px solid rgba(17,24,39,.08)", padding: "14px 0 6px", fontSize: 14, color: MUTED }}>Nicholls Synthetic Field, Canberra</div>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 15, color: MUTED }}>
          <span>Ground 1 matches stream live on our Facebook page.</span>
          <a href={FACEBOOK} target="_blank" rel="noreferrer" style={{ ...linkStyle, fontSize: 15 }}>Follow Samsara Group on Facebook</a>
        </div>
      </div>
    </section>
  );
}
