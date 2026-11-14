"use client";
import { useEffect, useState } from "react";
import { matchClock, PERIOD_LABELS, type LiveAction, type LiveState, type Period } from "@/lib/live";

// Live match controls for the broadcast scoreboard (Matchday screen).
// During play: tap +1 for the team that scored. Scorers and cards go in the match sheet after full time.

export type LiveRow = LiveState & { fixture_id: string; updated_at?: string };
export type BroadcastState = { fixture_id: string | null; lt_name: string | null; lt_role: string | null; lt_club_id: string | null; lt_visible: boolean };
type Club = { id: string; name: string; short_code: string };
type Fx = { id: string; home_club: Club; away_club: Club; played_at: string | null; venue: string | null };

const F = "'DM Sans',system-ui,sans-serif";
const MUTED = "#66707d";
const RED = "#c8102e";
const field: React.CSSProperties = { border: "1px solid rgba(17,24,39,.18)", borderRadius: 8, fontSize: 16, padding: "8px 10px", fontFamily: F, color: "#101820", background: "#fff", minWidth: 0 };
const label11: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED, marginBottom: 6 };
const chip = (on: boolean): React.CSSProperties => ({
  background: on ? "#101820" : "#fff", color: on ? "#fff" : "#101820", border: "1px solid rgba(17,24,39,.18)",
  fontSize: 13, fontWeight: 600, padding: "8px 14px", borderRadius: 999, cursor: "pointer", fontFamily: F,
});

export function liveApi(body?: unknown, query = "") {
  const key = typeof window !== "undefined" ? localStorage.getItem("spl_admin") || "" : "";
  return fetch(`/api/admin/live${query}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", "x-admin-key": key },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

/** Ask for a second tap within 3 seconds before a big step (full time, stepping back). */
function useTwoTap() {
  const [armed, setArmed] = useState<string | null>(null);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(null), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return { armed, tap: (key: string, run: () => void) => { if (armed === key) { setArmed(null); run(); } else setArmed(key); } };
}

const NEXT: Record<Period, { to: Period | null; label: string }> = {
  pre: { to: "1H", label: "Kick-off" },
  "1H": { to: "HT", label: "Next: Half time" },
  HT: { to: "2H", label: "Start 2nd half" },
  "2H": { to: "FT", label: "Next: Full time" },
  FT: { to: null, label: "Enter scorers and cards" },
};
const BACK: Record<Period, Period | null> = { pre: null, "1H": "pre", HT: "1H", "2H": "HT", FT: "2H" };
const STEPS: Period[] = ["pre", "1H", "HT", "2H", "FT"];
const STEP_NAMES: Record<Period, string> = { pre: "Kick-off", "1H": "1st half", HT: "Half time", "2H": "2nd half", FT: "Full time" };

/**
 * Full-screen live remote for one match: big +Goal buttons, one Next button for the clock,
 * and Undo for the last goal. Scorers and cards go in the match sheet after full time.
 */
export function LiveControl({ fixture, live, onAir, onChange, onSetOnAir, onBack, onFullTime }: {
  fixture: Fx; live: LiveRow | null; onAir: boolean;
  onChange: (row: LiveRow) => void; onSetOnAir: () => void; onBack: () => void; onFullTime: () => void;
}) {
  const now = useNow();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { armed, tap } = useTwoTap();
  const s: LiveState = live ?? { home_score: 0, away_score: 0, period: "pre", period_started_at: null, half_minutes: 30, last_goal_side: null, last_goal_at: null };

  async function act(action: LiveAction) {
    if (busy) return;
    setBusy(true); setErr(null);
    try {
      const r = await liveApi({ fixture_id: fixture.id, action });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(d.error ?? "Could not update the live score. Check the signal and tap again."); return; }
      onChange(d as LiveRow);
    } catch {
      setErr("No connection. Check the signal and tap again.");
    } finally {
      setBusy(false);
    }
  }

  const clock = matchClock(s, now);
  const running = s.period === "1H" || s.period === "2H";
  const next = NEXT[s.period];
  const back = BACK[s.period];
  const lastSide = s.last_goal_side;
  const lastClub = lastSide === "home" ? fixture.home_club : lastSide === "away" ? fixture.away_club : null;
  const time = fixture.played_at ? new Date(fixture.played_at).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Sydney" }) : "";
  const sides = [
    { side: "home" as const, club: fixture.home_club, score: s.home_score },
    { side: "away" as const, club: fixture.away_club, score: s.away_score },
  ];

  function onNext() {
    if (s.period === "FT") { onFullTime(); return; }
    if (next.to === "FT") { tap("ft", () => act({ type: "period", period: "FT" })); return; }
    if (next.to) act({ type: "period", period: next.to });
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "#101820", color: "#fff", borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button type="button" onClick={onBack} aria-label="Back to all matches" style={{ background: "none", border: 0, color: "#fff", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginLeft: -6 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{[fixture.venue, time].filter(Boolean).join(" · ") || "Live match"}</div>
          <div style={{ fontSize: 13, color: "#c7ccd2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fixture.home_club.name} v {fixture.away_club.name}</div>
        </div>
        {onAir
          ? <span style={{ background: RED, color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 6, letterSpacing: ".05em", whiteSpace: "nowrap" }}>ON STREAM</span>
          : <button type="button" onClick={onSetOnAir} style={{ background: "none", border: "1px solid rgba(255,255,255,.4)", color: "#fff", borderRadius: 999, height: 36, padding: "0 12px", fontSize: 13, fontWeight: 600, fontFamily: F, cursor: "pointer", whiteSpace: "nowrap" }}>Show on stream</button>}
      </div>

      <div style={{ textAlign: "center", display: "grid", gap: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: running ? RED : MUTED }}>{PERIOD_LABELS[s.period]}</div>
        <div style={{ fontSize: 44, fontWeight: 700, fontVariantNumeric: "tabular-nums", lineHeight: 1.1, minHeight: 48 }}>{running ? clock : s.period === "pre" ? "00:00" : s.period}</div>
        {s.period === "pre" ? (
          <label style={{ fontSize: 13, color: MUTED, display: "inline-flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
            Half length
            <select value={s.half_minutes} onChange={e => act({ type: "half_minutes", minutes: Number(e.target.value) })} style={{ ...field, fontSize: 14, padding: "4px 6px" }}>
              {[20, 25, 30, 35, 40, 45].map(m => <option key={m} value={m}>{m} min</option>)}
            </select>
          </label>
        ) : <div style={{ fontSize: 13, color: MUTED }}>{s.half_minutes} min halves</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
        {sides.map(x => (
          <div key={x.side} style={{ display: "grid", gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 600, textAlign: "center", lineHeight: 1.25, minHeight: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>{x.club.name}</div>
            <div style={{ fontSize: 72, fontWeight: 700, textAlign: "center", lineHeight: 1 }} aria-live="polite">{x.score}</div>
            <button type="button" disabled={busy || s.period === "FT"} onClick={() => act({ type: "goal", side: x.side })}
              aria-label={`Goal for ${x.club.name}`}
              style={{ background: RED, color: "#fff", border: 0, borderRadius: 18, height: 120, fontSize: 26, fontWeight: 700, fontFamily: F, cursor: "pointer", opacity: busy || s.period === "FT" ? 0.55 : 1, touchAction: "manipulation" }}>
              + Goal
            </button>
          </div>
        ))}
      </div>

      {(s.home_score > 0 || s.away_score > 0) && (
        <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.12)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {lastClub && lastSide ? (
            <>
              <span style={{ flex: 1, fontSize: 14 }}>Last goal: <b>{lastClub.name}</b></span>
              <button type="button" disabled={busy} onClick={() => act({ type: "undo", side: lastSide })} style={{ background: "none", border: "1px solid rgba(17,24,39,.25)", borderRadius: 999, height: 44, padding: "0 18px", fontSize: 14, fontWeight: 600, fontFamily: F, cursor: "pointer", color: "#101820" }}>Undo</button>
            </>
          ) : (
            <>
              <span style={{ flex: 1, fontSize: 14, color: MUTED }}>Take a goal off</span>
              {sides.filter(x => x.score > 0).map(x => (
                <button key={x.side} type="button" disabled={busy} onClick={() => act({ type: "undo", side: x.side })} style={{ background: "none", border: "1px solid rgba(17,24,39,.25)", borderRadius: 999, height: 44, padding: "0 14px", fontSize: 13, fontWeight: 600, fontFamily: F, cursor: "pointer", color: "#101820" }}>- {x.club.short_code || x.club.name}</button>
              ))}
            </>
          )}
        </div>
      )}

      {err && <div role="alert" style={{ fontSize: 14, fontWeight: 600, color: "#a3211a", background: "#fdecea", borderRadius: 10, padding: "10px 12px" }}>{err}</div>}

      <div style={{ display: "grid", gap: 8 }}>
        <div aria-label="Match progress" style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", fontSize: 12 }}>
          {STEPS.map((p, i) => {
            const idx = STEPS.indexOf(s.period);
            const st = i < idx ? "done" : i === idx ? "now" : "todo";
            return (
              <span key={p} style={{ display: "inline-flex", gap: 6 }}>
                {i > 0 && <span aria-hidden style={{ color: "#98a1ab" }}>›</span>}
                <span style={{ fontWeight: st === "todo" ? 500 : 700, color: st === "now" ? (running ? RED : "#101820") : st === "done" ? "#101820" : MUTED }}>{STEP_NAMES[p]}{st === "done" ? " ✓" : ""}</span>
              </span>
            );
          })}
        </div>
        <button type="button" disabled={busy && s.period !== "FT"} onClick={onNext}
          style={{ background: s.period === "FT" ? "#1f6b37" : armed === "ft" ? RED : "#101820", color: "#fff", border: 0, borderRadius: 16, height: 64, fontSize: 19, fontWeight: 700, fontFamily: F, cursor: "pointer", touchAction: "manipulation" }}>
          {armed === "ft" ? "Tap again to confirm Full time" : next.label}
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {back ? (
            <button type="button" disabled={busy} onClick={() => tap("back", () => act({ type: "period", period: back }))}
              style={{ background: "none", border: 0, height: 44, fontSize: 14, color: armed === "back" ? "#a3211a" : MUTED, fontWeight: armed === "back" ? 700 : 500, cursor: "pointer", fontFamily: F, padding: "0 4px" }}>
              {armed === "back" ? `Tap again: back to ${STEP_NAMES[back]}` : "Step back"}
            </button>
          ) : <span />}
          {s.period !== "FT" && (
            <button type="button" onClick={onFullTime} style={{ background: "none", border: 0, height: 44, fontSize: 14, color: MUTED, cursor: "pointer", fontFamily: F, padding: "0 4px" }}>Match sheet</button>
          )}
        </div>
      </div>
    </div>
  );
}

/** On-air match, overlay links and the second-camera lower third. */
export function BroadcastControls({ fixtures, state, onState }: { fixtures: Fx[]; state: BroadcastState | null; onState: (s: BroadcastState) => void }) {
  const [name, setName] = useState(state?.lt_name ?? "");
  const [role, setRole] = useState(state?.lt_role ?? "");
  const [clubId, setClubId] = useState(state?.lt_club_id ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- read the site address once on the client
  useEffect(() => { setOrigin(window.location.origin); }, []);

  const clubs = new Map<string, Club>();
  fixtures.forEach(f => { clubs.set(f.home_club.id, f.home_club); clubs.set(f.away_club.id, f.away_club); });

  async function setOnAir(id: string) {
    const r = await liveApi({ on_air: id || null });
    if (r.ok && state) onState({ ...state, fixture_id: id || null });
  }
  async function saveLower(visible: boolean) {
    setMsg(null);
    const r = await liveApi({ lower: { name, role, club_id: clubId || null, visible } });
    if (!r.ok) { setMsg("Could not update the lower third."); return; }
    onState({ ...(state ?? { fixture_id: null }), lt_name: name || null, lt_role: role || null, lt_club_id: clubId || null, lt_visible: visible } as BroadcastState);
    setMsg(visible ? "Lower third is showing on stream." : "Lower third hidden.");
  }

  const link = (p: string) => `${origin}/broadcast/${p}`;
  return (
    <div className="card admin-pad" style={{ padding: 24, display: "grid", gap: 18 }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>Live stream</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 18 }}>
        <div>
          <label htmlFor="onair" style={label11}>Match on stream</label>
          <select id="onair" value={state?.fixture_id ?? ""} onChange={e => setOnAir(e.target.value)} style={{ ...field, width: "100%" }}>
            <option value="">None</option>
            {fixtures.map(f => <option key={f.id} value={f.id}>{f.home_club.name} v {f.away_club.name}{f.venue ? ` · ${f.venue}` : ""}</option>)}
          </select>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>
            OBS browser sources (1920 x 1080):<br />
            <code>{link("scoreboard.html")}</code><br />
            <code>{link("break.html")}</code><br />
            <code>{link("lower-third.html")}</code>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <span style={label11}>Second camera lower third</span>
          <input aria-label="Name" placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={field} maxLength={60} />
          <input aria-label="Role" placeholder="Role, e.g. Captain or Guest" value={role} onChange={e => setRole(e.target.value)} style={field} maxLength={80} />
          <select aria-label="Club" value={clubId} onChange={e => setClubId(e.target.value)} style={field}>
            <option value="">No club (shows the SPL crest)</option>
            {[...clubs.values()].sort((a, b) => a.name.localeCompare(b.name)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" onClick={() => saveLower(true)} disabled={!name.trim()} style={{ ...chip(true), background: RED, border: 0, opacity: name.trim() ? 1 : 0.5 }}>Show</button>
            <button type="button" onClick={() => saveLower(false)} style={chip(false)}>Hide</button>
            <span style={{ fontSize: 13, color: state?.lt_visible ? RED : MUTED, fontWeight: 600 }}>{state?.lt_visible ? "Showing now" : "Hidden"}</span>
          </div>
          {msg && <div role="status" style={{ fontSize: 13, color: MUTED }}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}
