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

// The one big clock button: what to tap next.
const NEXT_STEP: Partial<Record<Period, { to: Period; label: string }>> = {
  pre: { to: "1H", label: "▶ Start clock (Kick-off)" },
  "1H": { to: "HT", label: "⏸ Half-time (stop clock)" },
  HT: { to: "2H", label: "▶ Start 2nd half" },
  "2H": { to: "FT", label: "■ Full time (stop clock)" },
};

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

/** Score buttons and period controls for one match. */
export function LivePanel({ fixture, live, onAir, onChange, onSetOnAir }: {
  fixture: Fx; live: LiveRow | null; onAir: boolean;
  onChange: (row: LiveRow) => void; onSetOnAir: () => void;
}) {
  const now = useNow();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const s: LiveState = live ?? { home_score: 0, away_score: 0, period: "pre", period_started_at: null, half_minutes: 30, last_goal_side: null, last_goal_at: null };

  async function act(action: LiveAction) {
    setBusy(true); setErr(null);
    const r = await liveApi({ fixture_id: fixture.id, action });
    setBusy(false);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { setErr(d.error ?? "Could not update the live score."); return; }
    onChange(d as LiveRow);
  }
  function setPeriod(p: Period) {
    if (p === "FT" && !confirm("Full time? The clock stops and the break screen shows FULL TIME.")) return;
    act({ type: "period", period: p });
  }

  const clock = matchClock(s, now);
  const sides = [
    { side: "home" as const, club: fixture.home_club, score: s.home_score },
    { side: "away" as const, club: fixture.away_club, score: s.away_score },
  ];

  return (
    <div style={{ borderTop: "1px solid rgba(17,24,39,.08)", padding: "16px 20px", display: "grid", gap: 14, background: onAir ? "#fff7f8" : "#fafaf8" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED }}>Live score</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: s.period === "1H" || s.period === "2H" ? RED : MUTED }}>
          {PERIOD_LABELS[s.period]}{clock && s.period !== "HT" && s.period !== "FT" ? ` · ${clock}` : ""}
        </span>
        <span style={{ marginLeft: "auto" }}>
          {onAir
            ? <span style={{ background: RED, color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6, letterSpacing: ".06em" }}>ON STREAM</span>
            : <button type="button" onClick={onSetOnAir} style={chip(false)}>Show on stream</button>}
        </span>
      </div>

      {NEXT_STEP[s.period] && (
        <button type="button" disabled={busy} onClick={() => setPeriod(NEXT_STEP[s.period]!.to)}
          style={{ background: "#1f6b37", color: "#fff", border: 0, borderRadius: 12, padding: "16px 12px", fontSize: 18, fontWeight: 700, fontFamily: F, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
          {NEXT_STEP[s.period]!.label}
        </button>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {sides.map(x => (
          <div key={x.side} style={{ display: "grid", gap: 8, justifyItems: "stretch" }}>
            <div style={{ fontSize: 13, fontWeight: 600, textAlign: "center", lineHeight: 1.25, minHeight: 32 }}>{x.club.name}</div>
            <div style={{ fontSize: 44, fontWeight: 700, textAlign: "center", lineHeight: 1 }}>{x.score}</div>
            <button type="button" disabled={busy} onClick={() => act({ type: "goal", side: x.side })}
              style={{ background: RED, color: "#fff", border: 0, borderRadius: 12, padding: "16px 8px", fontSize: 18, fontWeight: 700, fontFamily: F, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
              + Goal
            </button>
            <button type="button" disabled={busy || x.score === 0} onClick={() => act({ type: "undo", side: x.side })}
              style={{ background: "none", border: "1px solid rgba(17,24,39,.18)", borderRadius: 999, padding: "6px 8px", fontSize: 13, fontFamily: F, cursor: "pointer", color: "#101820", opacity: x.score === 0 ? 0.4 : 1 }}>
              Undo goal
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {([["1H", "Kick-off"], ["HT", "Half-time"], ["2H", "Restart"], ["FT", "Full time"]] as [Period, string][]).map(([p, label]) => (
          <button key={p} type="button" disabled={busy} onClick={() => setPeriod(p)} style={chip(s.period === p)}>{label}</button>
        ))}
        <select aria-label="Half length" value={s.half_minutes} onChange={e => act({ type: "half_minutes", minutes: Number(e.target.value) })} style={{ ...field, fontSize: 13, padding: "6px 8px", marginLeft: "auto" }}>
          {[20, 25, 30, 35, 40, 45].map(m => <option key={m} value={m}>{m} min halves</option>)}
        </select>
      </div>
      {s.period === "FT" && <div style={{ fontSize: 13, color: MUTED }}>Full time. Open the match sheet below to add scorers&apos; jersey numbers and cards, then save the result.</div>}
      {err && <div role="status" style={{ fontSize: 13, color: "#a3211a" }}>{err}</div>}
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
          <div style={{ fontSize: 13, color: MUTED, marginTop: 12, display: "grid", gap: 10 }}>
            <div>Overlays for OBS (Browser source, 1920 x 1080). Tap a name to preview it; paste the grey link into OBS:</div>
            {([
              ["1. Match scoreboard", "scoreboard.html", "Score, clock and partner bar over the main camera."],
              ["2. Break / marketing screen", "break.html", "Full screen for kick-off soon, half-time and full time, with partners."],
              ["3. Interview name strap", "lower-third.html", "Blank until you press Show on the right. Second camera."],
            ] as const).map(([title, file, note]) => (
              <div key={file}>
                <a href={`${link(file)}?preview=1`} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: RED, fontSize: 15 }}>{title} ↗</a>
                <div>{note}</div>
                <code style={{ fontSize: 12, wordBreak: "break-all" }}>{link(file)}</code>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <span style={label11}>Interview name strap (second camera)</span>
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
