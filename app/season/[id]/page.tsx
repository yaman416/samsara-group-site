"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

type ClubRef = { id: string; name: string; short_code: string; home_color: string; away_color: string; logo_url: string | null };
type GoalScorer = { id: string; minute: number | null; is_own_goal: boolean; is_penalty: boolean; club_id: string; players: { full_name: string; jersey_number: number } | null; clubs: { name: string; short_code: string } | null };
type Card = { id: string; player_name: string; card_type: string; minute: number | null; reason: string | null };
type Fixture = {
  id: string; week: number; venue: string | null; played_at: string | null; status: string;
  home_club: ClubRef; away_club: ClubRef;
  results: { home_score: number; away_score: number }[] | { home_score: number; away_score: number } | null;
  goal_scorers: GoalScorer[];
  cards: Card[];
};

function initials(name: string) {
  return name.replace(/ (FC|Football Club)$/i, "").split(" ").map((w: string) => w[0]).join("").slice(0, 3).toUpperCase();
}

function ClubBadge({ club, size = 64 }: { club: ClubRef; size?: number }) {
  if (club.logo_url) return <Image src={club.logo_url} alt="" width={size} height={size} style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />;
  return (
    <span style={{ width: size, height: size, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: size * 0.2, background: club.home_color || "#101820", color: "#fff", fontSize: size * 0.3, fontWeight: 700 }}>
      {initials(club.name)}
    </span>
  );
}

const F = "'DM Sans',system-ui,sans-serif";

export default function MatchPage() {
  const { id } = useParams<{ id: string }>();
  const [fixture, setFixture] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/public/fixture?id=${id}`)
      .then(r => r.ok ? r.json() : Promise.reject("Not found"))
      .then(setFixture)
      .catch(() => setError("Match not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <SiteLayout activeNav="season">
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f1" }}>
        <div style={{ fontSize: 15, color: "#98a1ab", fontFamily: F }}>Loading...</div>
      </div>
    </SiteLayout>
  );

  if (error || !fixture) return (
    <SiteLayout activeNav="season">
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f1" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, color: "#98a1ab", fontFamily: F, marginBottom: 16 }}>Match not found.</div>
          <Link href="/season" style={{ fontFamily: F, fontSize: 14, color: "#101820" }}>Back to Season 3</Link>
        </div>
      </div>
    </SiteLayout>
  );

  const r = Array.isArray(fixture.results) ? (fixture.results[0] ?? null) : (fixture.results ?? null);
  const done = fixture.status === "completed";
  const d = fixture.played_at ? new Date(fixture.played_at) : null;
  const dateStr = d ? d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Date TBC";
  const timeStr = d ? d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }) : "";

  const homeGoals = (fixture.goal_scorers ?? []).filter(g => g.club_id === fixture.home_club.id && !g.is_own_goal)
    .concat((fixture.goal_scorers ?? []).filter(g => g.club_id === fixture.away_club.id && g.is_own_goal));
  const awayGoals = (fixture.goal_scorers ?? []).filter(g => g.club_id === fixture.away_club.id && !g.is_own_goal)
    .concat((fixture.goal_scorers ?? []).filter(g => g.club_id === fixture.home_club.id && g.is_own_goal));

  const homeWon = r && r.home_score > r.away_score;
  const awayWon = r && r.away_score > r.home_score;

  const allEvents: { minute: number | null; type: "goal" | "og" | "pen" | "yellow" | "red"; label: string; side: "home" | "away" }[] = [];
  for (const g of fixture.goal_scorers ?? []) {
    const isHome = g.club_id === fixture.home_club.id;
    const side = g.is_own_goal ? (isHome ? "away" : "home") : (isHome ? "home" : "away");
    allEvents.push({ minute: g.minute, type: g.is_own_goal ? "og" : g.is_penalty ? "pen" : "goal", label: g.players?.full_name ?? "Unknown", side });
  }
  for (const c of fixture.cards ?? []) {
    allEvents.push({ minute: c.minute, type: c.card_type === "red" || c.card_type === "second_yellow" ? "red" : "yellow", label: c.player_name, side: "home" });
  }
  allEvents.sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));

  return (
    <SiteLayout activeNav="season">
      {/* Hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "48px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#98a1ab", marginBottom: 36 }}>
            <Link href="/season" style={{ color: "#98a1ab" }}>Season 3</Link>
            <span>/</span>
            <span>Week {fixture.week}</span>
          </div>

          {/* Score block */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24 }}>
            {/* Home */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, textAlign: "right" }}>
              <ClubBadge club={fixture.home_club} size={72} />
              <div>
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(18px,3vw,26px)", fontWeight: 600, lineHeight: 1.2, textWrap: "balance" }}>{fixture.home_club.name}</div>
                {homeWon && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#f5a623", marginTop: 6 }}>Winner</div>}
              </div>
              {done && (
                <div style={{ fontSize: 13, color: "#66707d", lineHeight: 1.8 }}>
                  {homeGoals.map(g => (
                    <div key={g.id}>{g.players?.full_name}{g.minute ? ` ${g.minute}'` : ""}{g.is_own_goal ? " (OG)" : g.is_penalty ? " (P)" : ""}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Score */}
            <div style={{ textAlign: "center", padding: "0 8px" }}>
              {done && r ? (
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(48px,8vw,80px)", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1 }}>
                  {r.home_score}<span style={{ color: "#66707d", fontSize: "0.6em", margin: "0 8px" }}>:</span>{r.away_score}
                </div>
              ) : (
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 36, fontWeight: 500, color: "#66707d" }}>vs</div>
              )}
              <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,.18)", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 500, color: "#98a1ab" }}>
                {done ? "Full time" : "Scheduled"}
              </div>
            </div>

            {/* Away */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
              <ClubBadge club={fixture.away_club} size={72} />
              <div>
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(18px,3vw,26px)", fontWeight: 600, lineHeight: 1.2, textWrap: "balance" }}>{fixture.away_club.name}</div>
                {awayWon && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#f5a623", marginTop: 6 }}>Winner</div>}
              </div>
              {done && (
                <div style={{ fontSize: 13, color: "#66707d", lineHeight: 1.8 }}>
                  {awayGoals.map(g => (
                    <div key={g.id}>{g.players?.full_name}{g.minute ? ` ${g.minute}'` : ""}{g.is_own_goal ? " (OG)" : g.is_penalty ? " (P)" : ""}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,255,255,.10)", padding: "22px 0", display: "flex", gap: 32, flexWrap: "wrap", fontSize: 13, color: "#98a1ab" }}>
            <span>Week {fixture.week}</span>
            {d && <span>{dateStr} · {timeStr}</span>}
            {fixture.venue && <span>{fixture.venue}</span>}
          </div>
        </div>
      </section>

      {/* Match details */}
      <section style={{ background: "#f4f4f1", padding: "48px 0 96px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "grid", gap: 20 }}>

          {/* Timeline */}
          {done && allEvents.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 20 }}>Match events</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {allEvents.map((ev, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", alignItems: "center", gap: 12 }}>
                    <div style={{ textAlign: "right", fontSize: 14, fontWeight: 500 }}>
                      {ev.side === "home" ? ev.label : ""}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      {ev.type === "goal" || ev.type === "og" || ev.type === "pen" ? (
                        <span style={{ fontSize: 16 }}>⚽</span>
                      ) : (
                        <span style={{ display: "inline-block", width: 12, height: 16, borderRadius: 3, background: ev.type === "red" ? "#e2372b" : "#f0b429" }} />
                      )}
                      {ev.minute && <span style={{ fontSize: 11, color: "#98a1ab", fontWeight: 500 }}>{ev.minute}&apos;</span>}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {ev.side === "away" ? ev.label : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Club links */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[fixture.home_club, fixture.away_club].map(club => (
              <Link key={club.id} href={`/clubs/${club.short_code.toLowerCase()}`}
                style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14, color: "#101820", textDecoration: "none" }}>
                <ClubBadge club={club} size={40} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{club.name}</div>
                  <div style={{ fontSize: 12, color: "#98a1ab", marginTop: 3 }}>View club profile</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back */}
          <Link href="/season" style={{ fontFamily: F, fontSize: 14, color: "#66707d", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Back to Season 3
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
