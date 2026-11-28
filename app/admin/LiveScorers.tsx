"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { inKit, playerLabel, playersWearing, type Kit } from "@/lib/jersey";
import { KitToggle } from "./KitToggle";
import type { LiveGoalKind } from "@/lib/matchday";

// Goal scorers and Player of the Match during a live match.
// Each scorer is saved the moment it's entered, so nothing waits for full time.

type Club = { id: string; name: string; short_code: string };
type Fx = { id: string; home_club: Club; away_club: Club };
type Side = "home" | "away";
export type SquadPlayer = { id: string; club_id: string; full_name: string; jersey_number: number | null; alt_jersey_number?: number | null };
export type LiveGoal = { id: string; player_id: string; club_id: string; minute: number | null; is_own_goal: boolean; is_penalty: boolean };

const F = "'DM Sans',system-ui,sans-serif";
const MUTED = "#66707d";
const RED = "#c8102e";
const field: React.CSSProperties = { border: "1px solid rgba(17,24,39,.18)", borderRadius: 8, fontSize: 16, padding: "8px 10px", fontFamily: F, color: "#101820", background: "#fff", minWidth: 0 };
const label11: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED, marginBottom: 6 };
const chip = (on: boolean): React.CSSProperties => ({
  background: on ? "#101820" : "#fff", color: on ? "#fff" : "#101820", border: "1px solid rgba(17,24,39,.18)",
  fontSize: 14, fontWeight: 600, padding: "10px 14px", borderRadius: 999, cursor: "pointer", fontFamily: F,
});
const linkBtn = (color: string): React.CSSProperties => ({ background: "none", border: "none", color, fontSize: 14, cursor: "pointer", fontFamily: F, padding: "6px 4px" });

function api(path: string, method = "GET", body?: unknown) {
  const key = typeof window !== "undefined" ? localStorage.getItem("spl_admin") || "" : "";
  return fetch(path, { method, headers: { "Content-Type": "application/json", "x-admin-key": key }, body: body ? JSON.stringify(body) : undefined });
}
const errOf = async (r: Response, fallback: string) => (await r.json().catch(() => ({}))).error ?? fallback;

export { playerLabel };

/** Which team a saved goal counts for. An own goal counts for the other team. */
export const goalSide = (g: LiveGoal, f: Fx): Side => {
  const byHome = g.club_id === f.home_club.id;
  return g.is_own_goal ? (byHome ? "away" : "home") : byHome ? "home" : "away";
};

/** Squads, saved scorers and Player of the Match for one fixture, refreshed every 8 seconds. */
export function useLiveGoals(fixtureId: string) {
  const [rawSquads, setSquads] = useState<Record<Side, SquadPlayer[]>>({ home: [], away: [] });
  const [kits, setKits] = useState<Record<Side, KitInfo>>({ home: NO_KIT, away: NO_KIT });
  const squads: Record<Side, SquadPlayer[]> = { home: inKit(rawSquads.home, kits.home.kit), away: inKit(rawSquads.away, kits.away.kit) };
  const [goals, setGoals] = useState<LiveGoal[]>([]);
  const [potm, setPotm] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const r = await api(`/api/admin/live-goals?fixture_id=${fixtureId}`);
    if (!r.ok) return;
    const d: { goals: LiveGoal[]; potm_player_id: string | null } = await r.json();
    setGoals(d.goals); setPotm(d.potm_player_id);
  }, [fixtureId]);

  useEffect(() => {
    let stop = false;
    (async () => {
      const r = await api(`/api/admin/match-sheet?fixture_id=${fixtureId}`);
      if (!r.ok || stop) return;
      const d: { home_players: SquadPlayer[]; away_players: SquadPlayer[]; goals: LiveGoal[]; potm_player_id: string | null; kits?: Record<Side, KitInfo> } = await r.json();
      setSquads({ home: d.home_players, away: d.away_players });
      if (d.kits) setKits(d.kits);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch saved scorers for this match
    refresh();
    const t = setInterval(refresh, 8000);
    return () => { stop = true; clearInterval(t); };
  }, [fixtureId, refresh]);

  // Which kit each team wore: saved on the fixture so the live panel and match sheet agree.
  const setKit = useCallback(async (side: Side, kit: Kit) => {
    setKits(k => ({ ...k, [side]: { ...k[side], kit } }));
    await api("/api/admin/fixtures", "PATCH", { id: fixtureId, [side === "home" ? "home_kit" : "away_kit"]: kit });
  }, [fixtureId]);

  return { squads, goals, setGoals, potm, setPotm, ready, refresh, kits, setKit };
}

export type KitInfo = { kit: Kit; names: { home: string; alt: string }; colours: { home: string | null; alt: string | null } };
export const NO_KIT: KitInfo = { kit: "home", names: { home: "Home", alt: "Other" }, colours: { home: null, alt: null } };

type Draft = { id?: string; side: Side; kind: LiveGoalKind; player_id: string; minute: string };

/** Scorers list, the "who scored?" picker, and Player of the Match. */
export function LiveScorers({ fixture, scores, data, ask, onAsked, minuteNow }: {
  fixture: Fx; scores: Record<Side, number>; data: ReturnType<typeof useLiveGoals>;
  ask: Side | null; onAsked: () => void; minuteNow: () => number | null;
}) {
  const { squads, goals, setGoals, potm, setPotm, refresh, kits, setKit } = data;
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const clubOf = (s: Side) => (s === "home" ? fixture.home_club : fixture.away_club);
  const everyone = [...squads.home, ...squads.away];
  const byId = new Map(everyone.map(p => [p.id, p]));

  // A + Goal tap opens the picker for that team, with the minute from the clock.
  useEffect(() => {
    if (!ask) return;
    const m = minuteNow();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open the picker after a goal tap
    setDraft({ side: ask, kind: "goal", player_id: "", minute: m != null ? String(m) : "" });
    setErr(null);
    onAsked();
  }, [ask, minuteNow, onAsked]);

  async function saveDraft() {
    if (!draft) return;
    if (!draft.player_id) { setErr("Type the scorer's jersey number or pick them from the list."); return; }
    setBusy(true); setErr(null);
    const body = { fixture_id: fixture.id, side: draft.side, kind: draft.kind, player_id: draft.player_id, minute: draft.minute.trim() === "" ? null : Number(draft.minute), ...(draft.id ? { id: draft.id } : {}) };
    const r = await api("/api/admin/live-goals", draft.id ? "PATCH" : "POST", body);
    setBusy(false);
    if (!r.ok) { setErr(await errOf(r, "Could not save the scorer.")); return; }
    const row: LiveGoal = await r.json();
    setGoals(g => (draft.id ? g.map(x => (x.id === row.id ? row : x)) : [...g, row]));
    setDraft(null);
  }

  async function remove(g: LiveGoal) {
    const p = byId.get(g.player_id);
    if (!confirm(`Remove ${p ? playerLabel(p) : "this scorer"}? The goal stays on the score; only the scorer is removed.`)) return;
    const r = await api("/api/admin/live-goals", "DELETE", { id: g.id, fixture_id: fixture.id });
    if (!r.ok) { setErr(await errOf(r, "Could not remove the scorer.")); return; }
    setGoals(x => x.filter(y => y.id !== g.id));
    refresh();
  }

  async function savePotm(id: string) {
    setErr(null);
    const r = await api("/api/admin/live-goals", "POST", { fixture_id: fixture.id, potm_player_id: id || null });
    if (!r.ok) { setErr(await errOf(r, "Could not save Player of the Match.")); return; }
    setPotm(id || null);
  }

  const sides: Side[] = ["home", "away"];
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {draft && (
        <ScorerPicker key={`${draft.id ?? "new"}-${draft.side}`} draft={draft} setDraft={setDraft} squads={squads} clubOf={clubOf} busy={busy} onSave={saveDraft} onCancel={() => { setDraft(null); setErr(null); }} />
      )}

      <div style={{ border: "1px solid rgba(17,24,39,.14)", borderRadius: 14, background: "#fff", padding: 14, display: "grid", gap: 12 }}>
        <span style={label11}>Goal scorers (saved as you go)</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: 14 }}>
          {sides.map(side => {
            const mine = goals.filter(g => goalSide(g, fixture) === side);
            const missing = Math.max(0, scores[side] - mine.length);
            return (
              <div key={side} style={{ display: "grid", gap: 6, alignContent: "start" }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{clubOf(side).name}</div>
                <KitToggle club={clubOf(side).name} kit={kits[side].kit} names={kits[side].names} colours={kits[side].colours} onChange={k => setKit(side, k)} />
                {mine.length === 0 && missing === 0 && <div style={{ fontSize: 13, color: MUTED }}>No goals yet.</div>}
                {mine.map(g => {
                  const p = byId.get(g.player_id);
                  return (
                    <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 15 }}>
                      <span style={{ fontVariantNumeric: "tabular-nums", color: MUTED, minWidth: 34 }}>{g.minute != null ? `${g.minute}'` : "--"}</span>
                      <span style={{ fontWeight: 600 }}>{p ? playerLabel(p) : "Unknown player"}</span>
                      {g.is_penalty && <span style={{ fontSize: 12, color: MUTED }}>(pen)</span>}
                      {g.is_own_goal && <span style={{ fontSize: 12, color: MUTED }}>(own goal)</span>}
                      <span style={{ marginLeft: "auto", display: "flex" }}>
                        <button type="button" style={linkBtn("#101820")} onClick={() => setDraft({ id: g.id, side, kind: g.is_own_goal ? "og" : g.is_penalty ? "pen" : "goal", player_id: g.player_id, minute: g.minute != null ? String(g.minute) : "" })}>Edit</button>
                        <button type="button" style={linkBtn("#a3211a")} onClick={() => remove(g)}>Remove</button>
                      </span>
                    </div>
                  );
                })}
                {missing > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: "#8a5a12" }}>{missing} goal{missing === 1 ? "" : "s"} without a scorer</span>
                    <button type="button" style={chip(false)} onClick={() => setDraft({ side, kind: "goal", player_id: "", minute: "" })}>+ Add scorer</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <PotmBox squads={squads} clubOf={clubOf} value={potm} onPick={savePotm} />
      {err && <div role="status" style={{ fontSize: 14, color: "#a3211a", fontWeight: 500 }}>{err}</div>}
    </div>
  );
}

function ScorerPicker({ draft, setDraft, squads, clubOf, busy, onSave, onCancel }: {
  draft: Draft; setDraft: (d: Draft) => void; squads: Record<Side, SquadPlayer[]>; clubOf: (s: Side) => Club;
  busy: boolean; onSave: () => void; onCancel: () => void;
}) {
  const other: Side = draft.side === "home" ? "away" : "home";
  const pool = draft.kind === "og" ? squads[other] : squads[draft.side];
  const picked = pool.find(p => p.id === draft.player_id);
  const [num, setNum] = useState(picked?.jersey_number != null ? String(picked.jersey_number) : "");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.scrollIntoView({ block: "center", behavior: "smooth" }); }, []);
  const wearing = playersWearing(pool, num);
  const typedMiss = num.trim() !== "" && wearing.length === 0;
  const typedClash = wearing.length > 1 && !wearing.some(p => p.id === draft.player_id);
  const setKind = (kind: LiveGoalKind) => {
    const keep = (kind === "og") === (draft.kind === "og");
    setDraft({ ...draft, kind, player_id: keep ? draft.player_id : "" });
    if (!keep) setNum("");
  };
  return (
    <div ref={box} style={{ border: `2px solid ${RED}`, borderRadius: 14, background: "#fff", padding: 14, display: "grid", gap: 12 }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{draft.id ? "Edit scorer" : "Who scored?"} · {clubOf(draft.side).name}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {([["goal", "Goal"], ["pen", "Penalty"], ["og", `Own goal (${clubOf(other).name} player)`]] as [LiveGoalKind, string][]).map(([k, l]) => (
          <button key={k} type="button" style={chip(draft.kind === k)} onClick={() => setKind(k)}>{l}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <label style={label11} htmlFor={`jn-${draft.side}`}>Jersey no.</label>
          <input id={`jn-${draft.side}`} autoFocus type="number" inputMode="numeric" min={0} max={99} value={num} placeholder="No."
            onChange={e => {
              const v = e.target.value; setNum(v);
              const hits = playersWearing(pool, v);
              setDraft({ ...draft, player_id: hits.length === 1 ? hits[0].id : "" });
            }}
            style={{ ...field, width: 96, fontSize: 28, fontWeight: 700, textAlign: "center", borderColor: typedMiss ? "#a3211a" : undefined }} />
        </div>
        <div style={{ flex: "1 1 180px", minWidth: 0 }}>
          <label style={label11} htmlFor={`jp-${draft.side}`}>Player</label>
          <select id={`jp-${draft.side}`} value={draft.player_id} onChange={e => { const p = pool.find(x => x.id === e.target.value); setNum(p?.jersey_number != null ? String(p.jersey_number) : ""); setDraft({ ...draft, player_id: e.target.value }); }} style={{ ...field, width: "100%" }}>
            <option value="">{pool.length ? "Pick from squad..." : "No registered players"}</option>
            {pool.map(p => <option key={p.id} value={p.id}>{playerLabel(p)}</option>)}
          </select>
        </div>
        <div>
          <label style={label11} htmlFor={`jm-${draft.side}`}>Minute</label>
          <input id={`jm-${draft.side}`} type="number" inputMode="numeric" min={0} max={130} value={draft.minute} placeholder="Min" onChange={e => setDraft({ ...draft, minute: e.target.value })} style={{ ...field, width: 76 }} />
        </div>
      </div>
      {typedMiss && <div style={{ fontSize: 13, color: "#a3211a" }}>No player wears #{num} in this squad. Pick from the list instead.</div>}
      {typedClash && (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 13, color: "#8a5a12" }}>{wearing.length} players wear #{num}. Who scored?</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {wearing.map(p => <button key={p.id} type="button" style={chip(false)} onClick={() => setDraft({ ...draft, player_id: p.id })}>{playerLabel(p)}</button>)}
          </div>
        </div>
      )}
      {picked && <div style={{ fontSize: 15, fontWeight: 600 }}>{playerLabel(picked)}</div>}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button type="button" disabled={busy || !draft.player_id} onClick={onSave}
          style={{ background: "#1f6b37", color: "#fff", border: 0, borderRadius: 12, padding: "14px 20px", fontSize: 17, fontWeight: 700, fontFamily: F, cursor: "pointer", opacity: busy || !draft.player_id ? 0.5 : 1, flex: "1 1 160px" }}>
          {busy ? "Saving..." : "Save scorer"}
        </button>
        <button type="button" onClick={onCancel} style={{ ...chip(false), flex: "0 1 auto" }}>{draft.id ? "Cancel" : "Later"}</button>
      </div>
    </div>
  );
}

/** Player of the Match: type a jersey number or pick from either squad. Saves on pick. */
export function PotmBox({ squads, clubOf, value, onPick }: {
  squads: Record<Side, SquadPlayer[]>; clubOf: (s: Side) => Club; value: string | null; onPick: (id: string) => void;
}) {
  const all = [...squads.home, ...squads.away];
  const current = all.find(p => p.id === value);
  const currentSide: Side = current && squads.away.some(p => p.id === current.id) ? "away" : "home";
  return (
    <div style={{ border: "1px solid rgba(17,24,39,.14)", borderRadius: 14, background: "#fff", padding: 14, display: "grid", gap: 10 }}>
      <span style={label11}>Player of the Match</span>
      {current
        ? <div style={{ fontSize: 16, fontWeight: 700 }}>★ {playerLabel(current)} <span style={{ fontWeight: 500, color: MUTED, fontSize: 14 }}>· {clubOf(currentSide).name}</span></div>
        : <div style={{ fontSize: 13, color: MUTED }}>Not picked yet.</div>}
      <select aria-label="Player of the Match" value={value ?? ""} onChange={e => onPick(e.target.value)} style={{ ...field, width: "100%" }}>
        <option value="">{current ? "Clear Player of the Match" : "Pick Player of the Match..."}</option>
        {(["home", "away"] as Side[]).map(s => (
          <optgroup key={s} label={clubOf(s).name}>
            {squads[s].map(p => <option key={p.id} value={p.id}>{playerLabel(p)}</option>)}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
