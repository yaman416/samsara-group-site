"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { LEAGUE_TZ } from "@/lib/utils";
import { leagueDateKey, pickMatchday, type CardType, type MatchSheet } from "@/lib/matchday";
import { matchClock } from "@/lib/live";
import { formatPlayerName } from "@/lib/playerName";
import { BroadcastControls, LiveControl, liveApi, type BroadcastState, type LiveRow } from "./LivePanel";

type Club = { id: string; name: string; short_code: string };
type Fixture = {
  id: string; season_id: string; week: number; venue: string | null; played_at: string | null; status: string;
  home_club: Club; away_club: Club;
  results: { home_score: number; away_score: number }[] | { home_score: number; away_score: number } | null;
};
type SquadPlayer = { id: string; club_id: string; full_name: string; jersey_number: number | null; position: string | null };
type SavedGoal = { player_id: string; club_id: string; minute: number | null; is_own_goal: boolean; is_penalty: boolean };
type SavedCard = { player_id: string | null; player_name: string; card_type: string; minute: number | null; reason: string | null };

type Side = "home" | "away";
type GoalKind = "goal" | "pen" | "og";
// `side` is the team the goal counts for. An own goal's scorer comes from the other squad.
type GoalRow = { key: number; side: Side; kind: GoalKind; player_id: string; typed: string; minute: number | null };
type CardRow = { key: number; side: Side; card_type: CardType; player_id: string; typed: string; minute: number | null; reason: string | null };

const F = "'DM Sans',system-ui,sans-serif";
const MUTED = "#5b6470";
const RED = "#c8102e";
const GREEN = "#1f6b37";
const field: React.CSSProperties = { border: "1px solid rgba(17,24,39,.18)", borderRadius: 8, fontSize: 16, padding: "8px 10px", fontFamily: F, color: "#101820", background: "#fff", minWidth: 0 };
const pill = (bg: string, color: string): React.CSSProperties => ({ background: bg, color, fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 6, whiteSpace: "nowrap", letterSpacing: ".02em" });
const sectionLabel: React.CSSProperties = { fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED };
const bigBtn = (bg: string): React.CSSProperties => ({ background: bg, color: "#fff", border: 0, borderRadius: 16, height: 60, fontSize: 18, fontWeight: 700, fontFamily: F, cursor: "pointer", width: "100%" });
const ghostBtn: React.CSSProperties = { background: "#fff", border: "1px solid rgba(17,24,39,.18)", borderRadius: 12, minHeight: 48, padding: "0 12px", fontSize: 14, fontWeight: 600, fontFamily: F, cursor: "pointer", color: "#101820" };

function api(path: string, opts: RequestInit = {}) {
  const key = typeof window !== "undefined" ? localStorage.getItem("spl_admin") || "" : "";
  return fetch(path, { ...opts, headers: { "Content-Type": "application/json", "x-admin-key": key } });
}

let rowKey = 0;
const nextKey = () => ++rowKey;
const other = (s: Side): Side => (s === "home" ? "away" : "home");
const resultOf = (f: Fixture) => (Array.isArray(f.results) ? f.results[0] ?? null : f.results ?? null);
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", timeZone: LEAGUE_TZ });
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: LEAGUE_TZ });

// Only Ground 1 is scored live on match day. Other grounds enter the result after full time.
// If no fixture that day names Ground 1, every match gets live scoring.
const isGround1 = (venue: string | null) => /ground\s*1\b/i.test(venue ?? "");

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

export default function MatchdayScreen() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [view, setView] = useState<{ id: string; mode: "live" | "sheet" } | null>(null);

  // Fixtures come from the active season only.
  const load = useCallback(async () => {
    const seasons = await api("/api/admin/seasons");
    const active = seasons.ok ? ((await seasons.json()) as { id: string; is_active: boolean }[]).find(s => s.is_active) : null;
    const fr = await api("/api/admin/fixtures");
    if (fr.ok) setFixtures(((await fr.json()) as Fixture[]).filter(f => !active || f.season_id === active.id));
    setLoaded(true);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch data for this screen
  useEffect(() => { load(); }, [load]);

  const [todayKey] = useState(() => leagueDateKey(Date.now()));
  const days = useMemo(() => {
    const map = new Map<string, { key: string; label: string; weeks: Set<number>; count: number }>();
    for (const f of fixtures) {
      if (!f.played_at) continue;
      const key = leagueDateKey(f.played_at);
      const d = map.get(key) ?? { key, label: dayLabel(f.played_at), weeks: new Set<number>(), count: 0 };
      d.weeks.add(f.week); d.count++;
      map.set(key, d);
    }
    return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
  }, [fixtures]);

  const selected = picked ?? pickMatchday(days.map(d => d.key), todayKey);
  const day = days.find(d => d.key === selected);
  const dayFixtures = fixtures
    .filter(f => f.played_at && leagueDateKey(f.played_at) === selected)
    .sort((a, b) => (a.played_at ?? "").localeCompare(b.played_at ?? "") || (a.venue ?? "").localeCompare(b.venue ?? ""));
  const done = dayFixtures.filter(f => f.status === "completed").length;
  const when = selected === todayKey ? "Today" : selected && selected > todayKey ? "Next matchday" : "Past matchday";
  const unscheduled = fixtures.filter(f => !f.played_at).length;
  const anyGround1 = dayFixtures.some(f => isGround1(f.venue));
  const isLiveMatch = (f: Fixture) => !anyGround1 || isGround1(f.venue);

  // Live scores for this matchday's fixtures, refreshed every 5 seconds so two phones stay in step.
  const [live, setLive] = useState<Record<string, LiveRow>>({});
  const [bstate, setBstate] = useState<BroadcastState | null>(null);
  const dayIds = dayFixtures.map(f => f.id).join(",");
  useEffect(() => {
    if (!dayIds) return;
    let stop = false;
    const pull = async () => {
      try {
        const r = await liveApi(undefined, `?fixture_ids=${dayIds}`);
        if (!r.ok || stop) return;
        const d: { live: LiveRow[]; state: BroadcastState | null } = await r.json();
        setLive(Object.fromEntries(d.live.map(x => [x.fixture_id, x])));
        setBstate(d.state);
      } catch { /* keep the last values; the next pull retries */ }
    };
    pull();
    const t = setInterval(pull, 5000);
    return () => { stop = true; clearInterval(t); };
  }, [dayIds]);
  async function setOnAir(id: string) {
    const r = await liveApi({ on_air: id });
    if (r.ok) setBstate(s => ({ ...(s ?? { lt_name: null, lt_role: null, lt_club_id: null, lt_visible: false }), fixture_id: id }));
  }

  const open = view ? fixtures.find(f => f.id === view.id) ?? null : null;
  useEffect(() => { if (typeof window !== "undefined") window.scrollTo({ top: 0 }); }, [view]);

  if (open && view?.mode === "live") {
    return (
      <LiveControl fixture={open} live={live[open.id] ?? null} onAir={bstate?.fixture_id === open.id}
        onChange={row => setLive(l => ({ ...l, [open.id]: row }))} onSetOnAir={() => setOnAir(open.id)}
        onBack={() => setView(null)} onFullTime={() => setView({ id: open.id, mode: "sheet" })} />
    );
  }
  if (open && view?.mode === "sheet") {
    return (
      <MatchSheetView key={open.id} fixture={open} live={live[open.id] ?? null} liveMatch={isLiveMatch(open)}
        onBack={() => setView(null)} onLive={() => setView({ id: open.id, mode: "live" })} onSaved={load} />
    );
  }

  // Group the day's matches by ground, Ground 1 first.
  const grounds = [...new Set(dayFixtures.map(f => f.venue || "Ground TBC"))].sort((a, b) => Number(isGround1(b)) - Number(isGround1(a)) || a.localeCompare(b));
  const nextUp = dayFixtures.find(f => f.status !== "completed" && !(live[f.id] && live[f.id].period !== "pre"));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ background: "#101820", color: "#fff", borderRadius: 16, padding: "16px 18px", display: "grid", gap: 4 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={pill(when === "Today" ? RED : "rgba(255,255,255,.16)", "#fff")}>{when}</span>
          {day && <span style={{ fontSize: 13, color: "#c7ccd2" }}>{done} of {day.count} results saved</span>}
        </div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          {day ? `${day.label} · Week ${[...day.weeks].join(", ")}` : loaded ? "No matchdays scheduled" : "Loading..."}
        </div>
        {days.length > 1 && (
          <label style={{ fontSize: 13, color: "#c7ccd2", display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
            Show another day
            <select value={selected ?? ""} onChange={e => { setPicked(e.target.value); setView(null); }} style={{ ...field, fontSize: 14, padding: "6px 8px", maxWidth: "100%" }}>
              {days.map(d => (
                <option key={d.key} value={d.key}>{d.label} · Week {[...d.weeks].join(", ")}{d.key === todayKey ? " (today)" : ""}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {loaded && days.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: MUTED }}>No fixtures with a date yet. Add them in Fixtures first.</div>
      )}

      {grounds.map(g => (
        <div key={g} style={{ display: "grid", gap: 10 }}>
          <div style={sectionLabel}>{g}{anyGround1 ? (isGround1(g) ? " · live scoring" : " · result after full time") : ""}</div>
          {dayFixtures.filter(f => (f.venue || "Ground TBC") === g).map(f => (
            <MatchTile key={f.id} fixture={f} live={live[f.id] ?? null} liveMatch={isLiveMatch(f)} onAir={bstate?.fixture_id === f.id} nextUp={nextUp?.id === f.id}
              onOpen={() => setView({ id: f.id, mode: isLiveMatch(f) && f.status !== "completed" && live[f.id]?.period !== "FT" ? "live" : "sheet" })} />
          ))}
        </div>
      ))}

      {unscheduled > 0 && (
        <div style={{ fontSize: 13, color: "#8a5a12" }}>{unscheduled} fixture{unscheduled === 1 ? " has" : "s have"} no date and {unscheduled === 1 ? "is" : "are"} not shown here. Set the date in Fixtures.</div>
      )}

      {dayFixtures.length > 0 && (
        <details className="card" style={{ padding: "4px 18px" }}>
          <summary style={{ cursor: "pointer", fontSize: 15, fontWeight: 600, padding: "14px 0", minHeight: 24 }}>Stream and lower third</summary>
          <div style={{ margin: "0 -18px" }}>
            <BroadcastControls key={bstate ? "s" : "n"} fixtures={dayFixtures} state={bstate} onState={setBstate} />
          </div>
        </details>
      )}
    </div>
  );
}

function MatchTile({ fixture: f, live, liveMatch, onAir, nextUp, onOpen }: {
  fixture: Fixture; live: LiveRow | null; liveMatch: boolean; onAir: boolean; nextUp: boolean; onOpen: () => void;
}) {
  const now = useNow();
  const saved = resultOf(f);
  const completed = f.status === "completed" && !!saved;
  const period = live?.period ?? "pre";
  const inPlay = !completed && liveMatch && (period === "1H" || period === "2H");
  const score = completed ? `${saved!.home_score} - ${saved!.away_score}` : liveMatch && live && period !== "pre" ? `${live.home_score} - ${live.away_score}` : null;

  let badge: React.ReactNode;
  let hint: string;
  if (completed) { badge = <span style={pill("#eef7f0", GREEN)}>Result saved</span>; hint = "Tap to check or edit"; }
  else if (liveMatch && period === "FT") { badge = <span style={pill("#fff3e0", "#8a4b00")}>Full time</span>; hint = "Tap to add scorers and cards, then save"; }
  else if (liveMatch && period === "HT") { badge = <span style={pill("#fff3e0", "#8a4b00")}>Half time</span>; hint = "Tap to control"; }
  else if (inPlay) { badge = <span style={pill(RED, "#fff")}>LIVE · {matchClock(live!, now)}</span>; hint = onAir ? "On stream · Tap to control" : "Tap to control"; }
  else if (liveMatch) { badge = nextUp ? <span style={pill("#f0f1f3", MUTED)}>Next up</span> : null; hint = "Tap to open live scoring"; }
  else { badge = <span style={pill("#f0f1f3", MUTED)}>Result after match</span>; hint = "Tap to enter the final score"; }

  return (
    <button type="button" onClick={onOpen}
      style={{ all: "unset", boxSizing: "border-box", cursor: "pointer", background: "#fff", border: inPlay ? `2px solid ${RED}` : "1px solid rgba(17,24,39,.12)", borderRadius: 16, padding: "14px 16px", display: "grid", gap: 8, width: "100%" }}>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: MUTED }}>{f.played_at ? timeLabel(f.played_at) : "Time TBC"} · Week {f.week}</span>
        {badge}
      </span>
      <span style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 16, fontWeight: 600, textAlign: "right", lineHeight: 1.25 }}>{f.home_club.name}</span>
        <span style={{ fontSize: score ? 26 : 18, fontWeight: 700, color: score ? "#101820" : MUTED, whiteSpace: "nowrap" }}>{score ?? "v"}</span>
        <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.25 }}>{f.away_club.name}</span>
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, textAlign: "center", color: inPlay ? RED : "#101820" }}>{hint}</span>
    </button>
  );
}

/** Finds the player wearing a number. */
/** Everyone wearing a number. Two players can share one, so the caller must not guess between them. */
const wearing = (pool: SquadPlayer[], typed: string) => (typed === "" ? [] : pool.filter(p => p.jersey_number === Number(typed)));
/** True when another player's number starts with what was typed, so a second digit may follow. */
const mayGrow = (pool: SquadPlayer[], typed: string) => pool.some(p => p.jersey_number != null && String(p.jersey_number).length > typed.length && String(p.jersey_number).startsWith(typed));

/**
 * After full time: final score, then a jersey number for each goal and card.
 * Goal rows always match the score: changing the score adds or removes rows.
 */
function MatchSheetView({ fixture, live, liveMatch, onBack, onLive, onSaved }: {
  fixture: Fixture; live: LiveRow | null; liveMatch: boolean; onBack: () => void; onLive: () => void; onSaved: () => void;
}) {
  const saved = resultOf(fixture);
  const completed = fixture.status === "completed" && !!saved;
  const homeId = fixture.home_club.id;
  const clubOf = (s: Side) => (s === "home" ? fixture.home_club : fixture.away_club);

  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [squads, setSquads] = useState<Record<Side, SquadPlayer[]>>({ home: [], away: [] });
  const [score, setScore] = useState<Record<Side, number>>({ home: 0, away: 0 });
  const [goals, setGoals] = useState<GoalRow[]>([]);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [armClear, setArmClear] = useState(false);
  const [dirty, setDirty] = useState(false);
  // The live score at the moment the sheet opened. Later live updates must not wipe what is being typed.
  const [startLive] = useState(live);

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const r = await api(`/api/admin/match-sheet?fixture_id=${fixture.id}`);
        if (stop) return;
        if (!r.ok) { setLoadErr((await r.json().catch(() => ({}))).error ?? "Could not load the match sheet."); setLoading(false); return; }
        const d: { result: { home_score: number; away_score: number } | null; goals: SavedGoal[]; cards: SavedCard[]; home_players: SquadPlayer[]; away_players: SquadPlayer[] } = await r.json();
        if (stop) return;
        const pools = { home: d.home_players, away: d.away_players };
        setSquads(pools);
        const sc = d.result ? { home: d.result.home_score, away: d.result.away_score } : startLive ? { home: startLive.home_score, away: startLive.away_score } : { home: 0, away: 0 };
        setScore(sc);
        const numOf = (pool: SquadPlayer[], id: string | null) => { const p = pool.find(x => x.id === id); return p?.jersey_number != null ? String(p.jersey_number) : ""; };
        const rows: GoalRow[] = d.goals.map(g => {
          const playerSide: Side = g.club_id === homeId ? "home" : "away";
          return { key: nextKey(), side: g.is_own_goal ? other(playerSide) : playerSide, kind: g.is_own_goal ? "og" : g.is_penalty ? "pen" : "goal", player_id: g.player_id, typed: numOf(pools[playerSide], g.player_id), minute: g.minute };
        });
        // Fill up with blank rows so each team has one row per goal.
        for (const s of ["home", "away"] as Side[]) {
          const have = rows.filter(g => g.side === s).length;
          for (let i = have; i < sc[s]; i++) rows.push({ key: nextKey(), side: s, kind: "goal", player_id: "", typed: "", minute: null });
        }
        rows.sort((a, b) => (a.side === b.side ? 0 : a.side === "home" ? -1 : 1));
        setGoals(rows);
        const sideOfPlayer = (id: string | null): Side => (d.away_players.some(p => p.id === id) ? "away" : "home");
        setCards(d.cards.map(c => {
          const side = sideOfPlayer(c.player_id);
          const type: CardType = c.card_type === "yellow" || c.card_type === "yellow_red" || c.card_type === "red" ? c.card_type : c.card_type === "second_yellow" ? "yellow_red" : "yellow";
          return { key: nextKey(), side, player_id: c.player_id ?? "", typed: numOf(pools[side], c.player_id), card_type: type, minute: c.minute, reason: c.reason };
        }));
        setSel(rows.find(g => !g.player_id)?.key ?? null);
      } catch {
        if (!stop) setLoadErr("No connection. Go back and open the match again.");
      }
      if (!stop) setLoading(false);
    })();
    return () => { stop = true; };
  }, [fixture.id, homeId, startLive]);

  const poolForGoal = (g: GoalRow) => (g.kind === "og" ? squads[other(g.side)] : squads[g.side]);
  const allRows = [...goals.map(g => ({ key: g.key, pool: poolForGoal(g), typed: g.typed })), ...cards.map(c => ({ key: c.key, pool: squads[c.side], typed: c.typed }))];

  function setTyped(key: number, typed: string) {
    setDirty(true); setMsg(null);
    const row = allRows.find(r => r.key === key);
    if (!row) return;
    const all = wearing(row.pool, typed);
    const hit = all.length === 1 ? all[0] : undefined;
    setGoals(gs => gs.map(g => (g.key === key ? { ...g, typed, player_id: hit?.id ?? "" } : g)));
    setCards(cs => cs.map(c => (c.key === key ? { ...c, typed, player_id: hit?.id ?? "" } : c)));
    // Move on once the number is complete and names exactly one player.
    if (hit && !mayGrow(row.pool, typed)) advance(key);
  }
  function advance(from: number) {
    const keys = allRows.map(r => r.key);
    const i = keys.indexOf(from);
    const nextBlank = allRows.slice(i + 1).find(r => r.typed === "");
    setSel(nextBlank?.key ?? null);
  }
  function press(k: string) {
    if (sel == null) return;
    const row = allRows.find(r => r.key === sel);
    if (!row) return;
    if (k === "del") setTyped(sel, row.typed.slice(0, -1));
    else if (k === "unknown") { setTyped(sel, ""); advance(sel); }
    else if (row.typed.length < 2) setTyped(sel, row.typed + k);
  }

  function pickPlayer(key: number, p: SquadPlayer) {
    setDirty(true); setMsg(null);
    const typed = p.jersey_number != null ? String(p.jersey_number) : "";
    setGoals(gs => gs.map(g => (g.key === key ? { ...g, typed, player_id: p.id } : g)));
    setCards(cs => cs.map(c => (c.key === key ? { ...c, typed, player_id: p.id } : c)));
    advance(key);
  }

  function changeScore(side: Side, delta: number) {
    const n = Math.max(0, Math.min(99, score[side] + delta));
    if (n === score[side]) return;
    setDirty(true); setMsg(null);
    setScore(s => ({ ...s, [side]: n }));
    if (delta > 0) {
      const row: GoalRow = { key: nextKey(), side, kind: "goal", player_id: "", typed: "", minute: null };
      setGoals(gs => {
        const lastIdx = gs.map(g => g.side).lastIndexOf(side);
        const at = lastIdx >= 0 ? lastIdx + 1 : side === "home" ? 0 : gs.length;
        return [...gs.slice(0, at), row, ...gs.slice(at)];
      });
      setSel(row.key);
    } else {
      // Remove a blank row for that team if there is one, else its last row.
      setGoals(gs => {
        const mine = gs.filter(g => g.side === side);
        const drop = [...mine].reverse().find(g => !g.player_id) ?? mine[mine.length - 1];
        return drop ? gs.filter(g => g.key !== drop.key) : gs;
      });
    }
  }
  function addCard(side: Side, card_type: CardType) {
    const row: CardRow = { key: nextKey(), side, card_type, player_id: "", typed: "", minute: null, reason: null };
    setCards(cs => [...cs, row]);
    setSel(row.key); setDirty(true); setMsg(null);
  }

  async function save() {
    setMsg(null);
    if (cards.some(c => !c.player_id)) { setMsg({ ok: false, text: "Every card needs the player's jersey number. Remove the card if you are not sure." }); return; }
    const sheet: MatchSheet = {
      fixture_id: fixture.id, home_score: score.home, away_score: score.away,
      // Goal rows left blank are saved as unknown scorers: the score still counts.
      goals: goals.filter(g => g.player_id).map(g => ({
        player_id: g.player_id,
        club_id: g.kind === "og" ? clubOf(other(g.side)).id : clubOf(g.side).id,
        minute: g.minute, is_own_goal: g.kind === "og", is_penalty: g.kind === "pen",
      })),
      cards: cards.map(c => ({ player_id: c.player_id, card_type: c.card_type, minute: c.minute, reason: c.reason ?? null })),
    };
    setBusy(true);
    try {
      const r = await api("/api/admin/match-sheet", { method: "POST", body: JSON.stringify(sheet) });
      if (!r.ok) { setMsg({ ok: false, text: (await r.json().catch(() => ({}))).error ?? "Save failed. Tap Save again." }); return; }
      setMsg({ ok: true, text: "Saved. The league table is updated." });
      setDirty(false);
      onSaved();
    } catch {
      setMsg({ ok: false, text: "No connection. Nothing was saved. Tap Save again when you have signal." });
    } finally {
      setBusy(false);
    }
  }

  async function clear() {
    if (!armClear) { setArmClear(true); setTimeout(() => setArmClear(false), 3000); return; }
    setArmClear(false); setBusy(true);
    const r = await api("/api/admin/match-sheet", { method: "DELETE", body: JSON.stringify({ fixture_id: fixture.id }) }).catch(() => null);
    setBusy(false);
    if (!r || !r.ok) { setMsg({ ok: false, text: "Could not clear the result." }); return; }
    setScore({ home: 0, away: 0 }); setGoals([]); setCards([]);
    setMsg({ ok: true, text: "Result cleared." });
    onSaved();
  }

  // A laptop keyboard works too: digits and Backspace go to the selected row.
  useEffect(() => {
    if (sel == null) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA")) return;
      if (/^[0-9]$/.test(e.key)) { e.preventDefault(); press(e.key); }
      else if (e.key === "Backspace") { e.preventDefault(); press("del"); }
      else if (e.key === "Escape") setSel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const blanks = goals.filter(g => !g.player_id).length;
  const selRow = allRows.find(r => r.key === sel);

  const rowStyle = (key: number): React.CSSProperties => ({
    all: "unset", boxSizing: "border-box", cursor: "pointer", display: "grid", gridTemplateColumns: "72px 56px minmax(0,1fr) auto", gap: 8, alignItems: "center",
    padding: "8px 12px", minHeight: 52, width: "100%", borderTop: "1px solid rgba(17,24,39,.08)",
    background: sel === key ? "#fff5f6" : "#fff", outline: sel === key ? `2px solid ${RED}` : "none", outlineOffset: -2,
  });
  const nameFor = (pool: SquadPlayer[], typed: string, player_id: string, blank: string) => {
    const p = pool.find(x => x.id === player_id);
    if (p) return <span style={{ color: GREEN, fontWeight: 600 }}>{formatPlayerName(p.full_name)} ✓</span>;
    if (typed && wearing(pool, typed).length > 1) return <span style={{ color: "#8a5a12", fontWeight: 600 }}>{wearing(pool, typed).length} players wear #{typed}. Pick one below</span>;
    if (typed) return mayGrow(pool, typed) ? <span style={{ color: MUTED }}>Keep typing...</span> : <span style={{ color: "#a3211a", fontWeight: 600 }}>No #{typed} in squad</span>;
    return <span style={{ color: "#8b939c" }}>{blank}</span>;
  };

  return (
    <div style={{ display: "grid", gap: 14, paddingBottom: sel != null ? 300 : 0 }}>
      <div style={{ background: "#101820", color: "#fff", borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button type="button" onClick={onBack} aria-label="Back to all matches" style={{ background: "none", border: 0, color: "#fff", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginLeft: -6 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{completed ? "Result saved" : liveMatch && live?.period === "FT" ? "Full time" : "Enter result"}</div>
          <div style={{ fontSize: 13, color: "#c7ccd2" }}>{[fixture.venue, fixture.played_at ? timeLabel(fixture.played_at) : null, `Week ${fixture.week}`].filter(Boolean).join(" · ")}</div>
        </div>
        {liveMatch && !completed && live?.period !== "FT" && (
          <button type="button" onClick={onLive} style={{ background: "none", border: "1px solid rgba(255,255,255,.4)", color: "#fff", borderRadius: 999, height: 36, padding: "0 12px", fontSize: 13, fontWeight: 600, fontFamily: F, cursor: "pointer" }}>Live control</button>
        )}
      </div>

      {loading ? <div style={{ color: MUTED, fontSize: 14, padding: 20 }}>Loading squads...</div>
        : loadErr ? <div role="alert" style={{ color: "#a3211a", fontSize: 14, padding: 20 }}>{loadErr}</div> : (
        <>
          <div className="card" style={{ padding: 16, display: "grid", gap: 8 }}>
            <div style={sectionLabel}>Final score</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
              {(["home", "away"] as Side[]).map(side => (
                <div key={side} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, textAlign: "center", minHeight: 38, display: "flex", alignItems: "center" }}>{clubOf(side).name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button type="button" aria-label={`One goal less for ${clubOf(side).name}`} onClick={() => changeScore(side, -1)} disabled={score[side] === 0} style={{ ...ghostBtn, width: 48, padding: 0, fontSize: 22, borderRadius: 999, opacity: score[side] === 0 ? 0.4 : 1 }}>−</button>
                    <span style={{ fontSize: 48, fontWeight: 700, minWidth: 44, textAlign: "center", lineHeight: 1 }} aria-live="polite">{score[side]}</span>
                    <button type="button" aria-label={`One goal more for ${clubOf(side).name}`} onClick={() => changeScore(side, 1)} style={{ ...ghostBtn, width: 48, padding: 0, fontSize: 22, borderRadius: 999 }}>+</button>
                  </div>
                </div>
              ))}
            </div>
            {liveMatch && live && !completed && (live.home_score !== score.home || live.away_score !== score.away) && (
              <div style={{ fontSize: 13, color: "#8a5a12", textAlign: "center" }}>The live score was {live.home_score} - {live.away_score}. The score you save here is the one that counts.</div>
            )}
          </div>

          {(squads.home.length === 0 || squads.away.length === 0) && (
            <div style={{ fontSize: 13, color: "#8a5a12", background: "#fff9ec", borderRadius: 10, padding: "10px 12px" }}>
              {[squads.home.length === 0 ? fixture.home_club.name : null, squads.away.length === 0 ? fixture.away_club.name : null].filter(Boolean).join(" and ")} {squads.home.length === 0 && squads.away.length === 0 ? "have" : "has"} no registered players yet. You can still save the score.
            </div>
          )}

          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 16px 10px", display: "grid", gap: 2 }}>
              <div style={sectionLabel}>Goals · tap a row, type the jersey number</div>
              {goals.length === 0 && <div style={{ fontSize: 14, color: MUTED, paddingTop: 6 }}>No goals. Use + above if a team scored.</div>}
            </div>
            {goals.map(g => {
              const pool = poolForGoal(g);
              return (
                <div key={g.key}><div style={{ position: "relative" }}>
                  <button type="button" onClick={() => setSel(g.key)} style={rowStyle(g.key)} aria-label={`Goal for ${clubOf(g.side).name}, jersey number`}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clubOf(g.side).short_code || clubOf(g.side).name}</span>
                    <span style={{ fontSize: 17, fontWeight: 700 }}>#{g.typed || <span style={{ color: "#b3b9c0" }}>__</span>}</span>
                    <span style={{ fontSize: 14, minWidth: 0 }}>{nameFor(pool, g.typed, g.player_id, g.kind === "og" ? `Own goal by ${clubOf(other(g.side)).short_code || "opponent"} player` : "Scorer unknown")}</span>
                    <span style={{ width: 96 }} />
                  </button>
                  <select aria-label="Goal type" value={g.kind}
                    onChange={e => { const kind = e.target.value as GoalKind; setDirty(true); setGoals(gs => gs.map(x => (x.key === g.key ? { ...x, kind, ...((kind === "og") !== (x.kind === "og") ? { player_id: "", typed: "" } : {}) } : x))); setSel(g.key); }}
                    style={{ ...field, fontSize: 13, padding: "6px 6px", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 96 }}>
                    <option value="goal">Goal</option>
                    <option value="pen">Penalty</option>
                    <option value="og">Own goal</option>
                  </select>
                </div>
                {sel === g.key && <PickByName pool={pool} value={g.player_id} typed={g.typed} onPick={p => pickPlayer(g.key, p)} />}
                </div>
              );
            })}
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "14px 16px 10px", display: "grid", gap: 10 }}>
              <div style={sectionLabel}>Cards</div>
              {(["home", "away"] as Side[]).map(side => (
                <div key={side} style={{ display: "grid", gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{clubOf(side).name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
                    {([["yellow", "Yellow", "#f0b429"], ["yellow_red", "2nd yellow", "#f0b429"], ["red", "Red", "#cf2e24"]] as [CardType, string, string][]).map(([t, label, color]) => (
                      <button key={t} type="button" onClick={() => addCard(side, t)} style={{ ...ghostBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 6px" }}>
                        <span aria-hidden style={{ width: 10, height: 14, borderRadius: 2, background: color, boxShadow: t === "yellow_red" ? "4px 0 0 #cf2e24" : "none" }} />+ {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {cards.map(c => (
              <div key={c.key}><div style={{ position: "relative" }}>
                <button type="button" onClick={() => setSel(c.key)} style={rowStyle(c.key)} aria-label={`${c.card_type} card for ${clubOf(c.side).name}, jersey number`}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: MUTED, display: "flex", gap: 6, alignItems: "center" }}>
                    <span aria-hidden style={{ width: 10, height: 14, borderRadius: 2, flexShrink: 0, background: c.card_type === "red" ? "#cf2e24" : "#f0b429", boxShadow: c.card_type === "yellow_red" ? "4px 0 0 #cf2e24" : "none" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginLeft: c.card_type === "yellow_red" ? 4 : 0 }}>{clubOf(c.side).short_code || clubOf(c.side).name}</span>
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 700 }}>#{c.typed || <span style={{ color: "#b3b9c0" }}>__</span>}</span>
                  <span style={{ fontSize: 14, minWidth: 0 }}>{nameFor(squads[c.side], c.typed, c.player_id, "Type the jersey number")}</span>
                  <span style={{ width: 70 }} />
                </button>
                <button type="button" onClick={() => { setCards(cs => cs.filter(x => x.key !== c.key)); setDirty(true); if (sel === c.key) setSel(null); }}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: 0, color: "#a3211a", fontSize: 13, fontWeight: 600, fontFamily: F, cursor: "pointer", height: 44, padding: "0 6px" }}>Remove</button>
              </div>
              {sel === c.key && <PickByName pool={squads[c.side]} value={c.player_id} typed={c.typed} onPick={p => pickPlayer(c.key, p)} />}
              </div>
            ))}
          </div>

          {msg && <div role="status" style={{ fontSize: 15, fontWeight: 600, color: msg.ok ? GREEN : "#a3211a", background: msg.ok ? "#eef7f0" : "#fdecea", borderRadius: 10, padding: "12px 14px" }}>{msg.text}</div>}

          <div style={{ display: "grid", gap: 8 }}>
            {blanks > 0 && <div style={{ fontSize: 13, color: MUTED, textAlign: "center" }}>{blanks} goal{blanks === 1 ? "" : "s"} without a scorer. That is fine if you do not know. The score still counts.</div>}
            <button type="button" onClick={save} disabled={busy} style={{ ...bigBtn(GREEN), opacity: busy ? 0.6 : 1 }}>
              {busy ? "Saving..." : completed && !dirty ? "Save again" : completed ? "Update result" : "Save result and update table"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <button type="button" onClick={onBack} style={{ background: "none", border: 0, height: 44, fontSize: 14, color: MUTED, cursor: "pointer", fontFamily: F }}>Back to all matches</button>
              {completed && (
                <button type="button" onClick={clear} disabled={busy} style={{ background: "none", border: 0, height: 44, fontSize: 14, fontWeight: armClear ? 700 : 500, color: "#a3211a", cursor: "pointer", fontFamily: F }}>
                  {armClear ? "Tap again to clear the result" : "Clear result"}
                </button>
              )}
            </div>
          </div>

          {sel != null && selRow && (
            <div role="group" aria-label="Jersey number keypad" className="admin-keypad" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60, background: "#fff", borderTop: "1px solid rgba(17,24,39,.15)", boxShadow: "0 -8px 24px rgba(16,24,32,.12)", padding: "10px 12px calc(12px + env(safe-area-inset-bottom))" }}>
              <div style={{ maxWidth: 480, margin: "0 auto", display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Jersey number: <span style={{ fontSize: 18 }}>#{selRow.typed || "__"}</span></span>
                  <button type="button" onClick={() => setSel(null)} style={{ background: "none", border: 0, fontSize: 14, fontWeight: 600, color: MUTED, height: 40, cursor: "pointer", fontFamily: F }}>Done</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "unknown", "0", "del"].map(k => (
                    <button key={k} type="button" onClick={() => press(k)} aria-label={k === "del" ? "Delete digit" : k === "unknown" ? "Scorer unknown, skip" : k}
                      style={{ height: 52, borderRadius: 12, border: 0, background: "#eef0f2", fontSize: k.length > 1 ? 15 : 22, fontWeight: 600, fontFamily: F, cursor: "pointer", color: "#101820", touchAction: "manipulation" }}>
                      {k === "del" ? "⌫" : k === "unknown" ? "Unknown" : k}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Under the selected row: pick by name when two players share a number, or a player has none. */
function PickByName({ pool, value, typed, onPick }: { pool: SquadPlayer[]; value: string; typed: string; onPick: (p: SquadPlayer) => void }) {
  const dupes = wearing(pool, typed);
  const sorted = [...pool].sort((a, b) => (a.jersey_number ?? 999) - (b.jersey_number ?? 999) || a.full_name.localeCompare(b.full_name));
  return (
    <div style={{ padding: "8px 12px 12px", background: "#fff5f6", display: "grid", gap: 8 }}>
      {dupes.length > 1 && !value && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {dupes.map(p => (
            <button key={p.id} type="button" onClick={() => onPick(p)} style={{ ...ghostBtn, minHeight: 44 }}>#{p.jersey_number} {formatPlayerName(p.full_name)}</button>
          ))}
        </div>
      )}
      {pool.length > 0 && (
        <label style={{ fontSize: 13, color: MUTED, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          Or pick by name
          <select value={value} onChange={e => { const p = pool.find(x => x.id === e.target.value); if (p) onPick(p); }} style={{ ...field, fontSize: 14, padding: "6px 8px", flex: "1 1 180px" }}>
            <option value="">Choose a player...</option>
            {sorted.map(p => <option key={p.id} value={p.id}>{p.jersey_number != null ? `#${p.jersey_number} ` : ""}{formatPlayerName(p.full_name)}</option>)}
          </select>
        </label>
      )}
    </div>
  );
}
