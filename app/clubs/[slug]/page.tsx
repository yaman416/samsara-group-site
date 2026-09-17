import Link from "next/link";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface Player {
  id: string;
  full_name: string;
  jersey_number: number;
  position: string;
  nationality: string;
  is_active: boolean;
}

interface StandingRow {
  club_id: string;
  club_name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
  position: number;
}

function initials(name: string) {
  return name.replace(/ (FC|Football Club)$/i, "").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

const POS_ORDER: Record<string, number> = { GK: 0, DF: 1, MF: 2, FW: 3 };
const POS_LABEL: Record<string, string> = { GK: "Goalkeeper", DF: "Defender", MF: "Midfielder", FW: "Forward" };

export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from("clubs").select("short_code");
  return (data ?? []).map(c => ({ slug: c.short_code.toLowerCase() }));
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Find club by short_code (case-insensitive)
  const { data: clubs } = await supabaseAdmin
    .from("clubs")
    .select("id, name, short_code, community, home_color, away_color, home_ground, founded, logo_url, season_id")
    .ilike("short_code", slug);

  const club = clubs?.[0];
  if (!club) notFound();

  // Fetch players
  const { data: players } = await supabaseAdmin
    .from("players")
    .select("id, full_name, jersey_number, position, nationality, is_active")
    .eq("club_id", club.id)
    .eq("is_active", true)
    .order("jersey_number");

  // Fetch current season standings
  const seasonId = club.season_id;
  let standing: StandingRow | null = null;
  if (seasonId) {
    const { data: fixtures } = await supabaseAdmin
      .from("fixtures")
      .select("id, season_id, home_club_id, away_club_id, results(home_score, away_score)")
      .eq("status", "completed")
      .eq("season_id", seasonId);

    if (fixtures) {
      const row: StandingRow = { club_id: club.id, club_name: club.name, played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, goal_diff: 0, points: 0, position: 0 };
      for (const f of fixtures) {
        const r = Array.isArray(f.results) ? f.results[0] : f.results;
        if (!r) continue;
        const { home_score: hs, away_score: as_ } = r as { home_score: number; away_score: number };
        const isHome = f.home_club_id === club.id;
        const isAway = f.away_club_id === club.id;
        if (!isHome && !isAway) continue;
        row.played++;
        const gf = isHome ? hs : as_;
        const ga = isHome ? as_ : hs;
        row.goals_for += gf;
        row.goals_against += ga;
        if (gf > ga) { row.won++; row.points += 3; }
        else if (gf < ga) { row.lost++; }
        else { row.drawn++; row.points++; }
      }
      row.goal_diff = row.goals_for - row.goals_against;
      if (row.played > 0) standing = row;
    }
  }

  const gdStr = standing ? (standing.goal_diff > 0 ? `+${standing.goal_diff}` : String(standing.goal_diff)) : "0";
  const sortedPlayers = (players ?? []).slice().sort((a, b) => (POS_ORDER[a.position] ?? 9) - (POS_ORDER[b.position] ?? 9) || a.jersey_number - b.jersey_number);

  return (
    <SiteLayout activeNav="clubs">
      {/* Club hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "56px 0 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#98a1ab" }}>
            <Link href="/season" style={{ color: "#98a1ab" }}>Season 3</Link>
            <span>/</span>
            <Link href="/clubs" style={{ color: "#98a1ab" }}>Clubs</Link>
            <span>/</span>
            <span style={{ color: "#fff" }}>{club.short_code}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginTop: 30 }}>
            {club.logo_url ? (
              <img src={club.logo_url} alt="" width={112} height={112} style={{ width: 112, height: 112, objectFit: "contain", flex: "none" }} />
            ) : (
              <span style={{ width: 112, height: 112, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 18, fontSize: 22, fontWeight: 700, color: "#fff", background: club.home_color || "#101820", border: "2px solid rgba(255,255,255,.14)" }}>
                {club.short_code}
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(32px,4.6vw,56px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: 0 }}>{club.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                <span style={{ border: "1px solid rgba(255,255,255,.26)", borderRadius: 999, padding: "7px 15px", fontSize: 12, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" }}>{club.community}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", borderTop: "1px solid rgba(255,255,255,.14)" }}>
            {[
              ["Founded", club.founded || "Unknown"],
              ["Home ground", club.home_ground || "Nicholls"],
              ["Squad size", String(players?.length ?? 0)],
              ["Season 3", "Confirmed"],
            ].map(([label, val]) => (
              <div key={label} style={{ padding: "22px 0" }}>
                <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>{label}</div>
                <div style={{ fontSize: 19, fontWeight: 500, marginTop: 8 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats cards */}
      <section style={{ background: "#f4f4f1", padding: "64px 0 40px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 24 }}>

          {/* Season 3 record */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 34 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Season 3 record</div>
            {standing ? (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontFamily: "Lora,Georgia,serif", fontSize: 44, lineHeight: 1 }}>{standing.points}</span>
                  <span style={{ fontSize: 15, color: "#66707d" }}>points</span>
                </div>
                <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 10, textAlign: "center" }}>
                  {[["P", standing.played], ["W", standing.won], ["D", standing.drawn], ["L", standing.lost], ["GD", gdStr]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 20, fontWeight: 500 }}>{v}</div>
                      <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d", marginTop: 5 }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ margin: "22px 0 0", fontSize: 16, lineHeight: 1.72, color: "#4a545f" }}>No completed matches yet. Stats build here as results are published.</p>
            )}
          </div>

          {/* Club colours */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 34 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Club colours</div>
            <div style={{ marginTop: 24, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ width: 64, height: 64, borderRadius: 12, background: club.home_color || "#101820", border: "1px solid rgba(17,24,39,.10)", display: "block" }} />
                <span style={{ fontSize: 12, color: "#66707d" }}>Home</span>
              </div>
              {club.away_color && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ width: 64, height: 64, borderRadius: 12, background: club.away_color, border: "1px solid rgba(17,24,39,.10)", display: "block" }} />
                  <span style={{ fontSize: 12, color: "#66707d" }}>Away</span>
                </div>
              )}
            </div>
            <p style={{ margin: "22px 0 0", fontSize: 15, lineHeight: 1.7, color: "#66707d" }}>Jersey colours are set by the club manager during registration.</p>
          </div>

          {/* Community */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 34 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Community</div>
            <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 28, marginTop: 18 }}>{club.community}</div>
            <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.7, color: "#66707d" }}>
              Part of Canberra&#39;s {club.community} football community, competing in the Samsara Premier League since Season {club.founded ? (parseInt(club.founded) < 2025 ? "1" : "3") : "3"}.
            </p>
          </div>
        </div>
      </section>

      {/* Squad */}
      <section style={{ background: "#f4f4f1", padding: "24px 0 40px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "30px 34px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Squad</div>
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 26, lineHeight: 1.24, marginTop: 8 }}>{players?.length ?? 0} registered players</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#edf7ed", border: "1px solid #b2deb2", borderRadius: 999, padding: "9px 18px", fontSize: 13, fontWeight: 500, color: "#2d6a2d" }}>Season 3 registered</span>
            </div>

            {sortedPlayers.length > 0 ? (
              <div style={{ padding: "24px 34px 34px" }}>
                {(["GK", "DF", "MF", "FW"] as const).map(pos => {
                  const posPlayers = sortedPlayers.filter(p => p.position === pos);
                  if (posPlayers.length === 0) return null;
                  return (
                    <div key={pos} style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab", marginBottom: 12 }}>{POS_LABEL[pos]}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(200px,100%),1fr))", gap: 8 }}>
                        {posPlayers.map(p => (
                          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(17,24,39,.08)" }}>
                            <span style={{ width: 30, height: 30, borderRadius: 8, background: club.home_color || "#101820", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flex: "none" }}>{p.jersey_number}</span>
                            <span style={{ fontSize: 14, lineHeight: 1.3 }}>{p.full_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "30px 34px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(56px,1fr))", gap: 10 }}>
                {Array.from({ length: 22 }, (_, i) => (
                  <span key={i} style={{ aspectRatio: "1/1", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 500, background: "transparent", color: "#98a1ab", border: "1px dashed rgba(17,24,39,.18)" }}>{i + 1}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Back link */}
      <section style={{ background: "#f4f4f1", padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto" }}>
          <Link href="/clubs" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#66707d", fontSize: 14, textDecoration: "none" }}>
            Back to all clubs
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
