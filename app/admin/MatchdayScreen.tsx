"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { LEAGUE_TZ } from "@/lib/utils";
import { CARD_LABELS, CARD_TYPES, leagueDateKey, pickMatchday, tallyGoals, type CardType, type MatchSheet } from "@/lib/matchday";

type Club = { id: string; name: string; short_code: string };
type Fixture = {
  id: string; season_id: string; week: number; venue: string | null; played_at: string | null; status: string;
  home_club: Club; away_club: Club;
  results: { home_score: number; away_score: number }[] | { home_score: number; away_score: number } | null;
};
type SquadPlayer = { id: string; club_id: string; full_name: string; jersey_number: number | null; position: string | null };
type SavedGoal = { player_id: string; club_id: string; minute: number | null; is_own_goal: boolean; is_penalty: boolean };
type SavedCard = { player_id: string | null; player_name: string; card_type: string; minute: number | null; reason: string | null };
type TableRow = { position: number; club_name: string; short_code: string; home_color: string | null; played: number; won: number; drawn: number; lost: number; goal_diff: number; points: number };

type Side = "home" | "away";
type GoalKind = "goal" | "pen" | "og";
type GoalRow = { key: number; side: Side; kind: GoalKind; player_id: string; minute: string };
type CardRow = { key: number; side: Side; card_type: CardType; player_id: string; minute: string; reason?: string | null };

const F = "'DM Sans',system-ui,sans-serif";
const MUTED = "#66707d";
const label11: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: MUTED, marginBottom: 6 };
const field: React.CSSProperties = { border: "1px solid rgba(17,24,39,.18)", borderRadius: 8, fontSize: 16, padding: "8px 10px", fontFamily: F, color: "#101820", background: "#fff", minWidth: 0 };
const pill = (bg: string, color: string): React.CSSProperties => ({ background: bg, color, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap" });
const btn = (dark: boolean, disabled = false): React.CSSProperties => ({
  background: dark ? "#101820" : "none", color: dark ? "#fff" : "#101820", border: dark ? 0 : "1px solid rgba(17,24,39,.18)",
  fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 999, cursor: disabled ? "default" : "pointer", fontFamily: F, opacity: disabled ? 0.5 : 1,
});
const linkBtn = (color: string): React.CSSProperties => ({ background: "none", border: "none", color, fontSize: 13, cursor: "pointer", fontFamily: F, padding: "4px 2px" });

function api(path: string, opts: RequestInit = {}) {
  const key = typeof window !== "undefined" ? localStorage.getItem("spl_admin") || "" : "";
  return fetch(path, { ...opts, headers: { "Content-Type": "application/json", "x-admin-key": key } });
}

let rowKey = 0;
const nextKey = () => ++rowKey;
const other = (s: Side): Side => (s === "home" ? "away" : "home");
const toMinute = (v: string) => (v.trim() === "" ? null : parseInt(v, 10));
const playerLabel = (p: SquadPlayer) => `${p.jersey_number != null ? `#${p.jersey_number} ` : ""}${p.full_name}`;
const resultOf = (f: Fixture) => (Array.isArray(f.results) ? f.results[0] ?? null : f.results ?? null);
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", timeZone: LEAGUE_TZ });
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: LEAGUE_TZ });

export default function MatchdayScreen() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [table, setTable] = useState<TableRow[]>([]);

  // Fixtures and table both come from the active season only.
  const load = useCallback(async () => {
    const seasons = await api("/api/admin/seasons");
    const active = seasons.ok ? ((await seasons.json()) as { id: string; is_active: boolean }[]).find(s => s.is_active) : null;
    const q = active ? `?season_id=${active.id}` : "";
    const [fr, tr] = await Promise.all([api("/api/admin/fixtures"), api(`/api/admin/league-table${q}`)]);
    if (fr.ok) setFixtures(((await fr.json()) as Fixture[]).filter(f => !active || f.season_id === active.id));
    if (tr.ok) setTable(await tr.json());
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

  function onSaved() { load(); }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="card admin-pad" style={{ padding: 24, display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
            <span style={pill(when === "Today" ? "#eef7f0" : "#f4f4f1", when === "Today" ? "#1f6b37" : MUTED)}>{when}</span>
            {day && <span style={{ fontSize: 13, color: MUTED }}>{done} of {day.count} results saved</span>}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {day ? `${day.label} · Week ${[...day.weeks].join(", ")}` : loaded ? "No matchdays scheduled" : "Loading..."}
          </div>
          <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>Only this matchday&apos;s fixtures are shown. Saving a result updates points and positions straight away.</div>
        </div>
        {days.length > 0 && (
          <div style={{ flex: "0 1 260px", minWidth: 0 }}>
            <label htmlFor="matchday-pick" style={label11}>Matchday</label>
            <select id="matchday-pick" value={selected ?? ""} onChange={e => setPicked(e.target.value)} style={{ ...field, width: "100%" }}>
              {days.map(d => (
                <option key={d.key} value={d.key}>{d.label} · Week {[...d.weeks].join(", ")}{d.key === todayKey ? " (today)" : ""}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loaded && days.length === 0 && (
        <div className="card" style={{ padding: 48, textAlign: "center", color: "#98a1ab" }}>No fixtures with a date yet. Add them in the Fixtures tab first.</div>
      )}
      {unscheduled > 0 && (
        <div style={{ fontSize: 13, color: "#8a5a12" }}>{unscheduled} fixture{unscheduled === 1 ? " has" : "s have"} no date and {unscheduled === 1 ? "is" : "are"} not shown here. Set the date in the Fixtures tab.</div>
      )}

      {dayFixtures.map(f => <MatchSheetCard key={f.id} fixture={f} onSaved={onSaved} />)}

      {table.length > 0 && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 4px", fontSize: 15, fontWeight: 600 }}>League table</div>
          <div style={{ overflowX: "auto" }}>
            <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
              <tbody>
                {table.map(r => (
                  <tr key={r.short_code + r.club_name}>
                    <td style={{ fontWeight: 700 }}>{r.position}</td>
                    <td style={{ fontWeight: 600 }}>{r.club_name}</td>
                    <td>{r.played}</td><td>{r.won}</td><td>{r.drawn}</td><td>{r.lost}</td>
                    <td>{r.goal_diff > 0 ? `+${r.goal_diff}` : r.goal_diff}</td>
                    <td style={{ fontWeight: 700 }}>{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchSheetCard({ fixture, onSaved }: { fixture: Fixture; onSaved: () => void }) {
  const saved = resultOf(fixture);
  const completed = fixture.status === "completed" && !!saved;
  const homeId = fixture.home_club.id, awayId = fixture.away_club.id;
  const clubOf = (s: Side) => (s === "home" ? fixture.home_club : fixture.away_club);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [squads, setSquads] = useState<Record<Side, SquadPlayer[]>>({ home: [], away: [] });
  const [score, setScore] = useState<Record<Side, string>>({ home: saved ? String(saved.home_score) : "", away: saved ? String(saved.away_score) : "" });
  const [goals, setGoals] = useState<GoalRow[]>([]);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function openSheet() {
    setOpen(true); setLoading(true); setMsg(null);
    const r = await api(`/api/admin/match-sheet?fixture_id=${fixture.id}`);
    setLoading(false);
    if (!r.ok) { setMsg({ ok: false, text: (await r.json().catch(() => ({}))).error ?? "Could not load the match sheet." }); return; }
    const d: { result: { home_score: number; away_score: number } | null; goals: SavedGoal[]; cards: SavedCard[]; home_players: SquadPlayer[]; away_players: SquadPlayer[] } = await r.json();
    setSquads({ home: d.home_players, away: d.away_players });
    if (d.result) setScore({ home: String(d.result.home_score), away: String(d.result.away_score) });
    setGoals(d.goals.map(g => {
      const playerSide: Side = g.club_id === homeId ? "home" : "away";
      return { key: nextKey(), side: g.is_own_goal ? other(playerSide) : playerSide, kind: g.is_own_goal ? "og" : g.is_penalty ? "pen" : "goal", player_id: g.player_id, minute: g.minute != null ? String(g.minute) : "" };
    }));
    const sideOfPlayer = (id: string | null): Side => (d.away_players.some(p => p.id === id) ? "away" : "home");
    setCards(d.cards.map(c => ({
      key: nextKey(), side: sideOfPlayer(c.player_id), player_id: c.player_id ?? "",
      card_type: (CARD_TYPES as readonly string[]).includes(c.card_type) ? (c.card_type as CardType) : c.card_type === "second_yellow" ? "yellow_red" : "yellow",
      minute: c.minute != null ? String(c.minute) : "", reason: c.reason,
    })));
  }

  const goalCount = (s: Side, rows = goals) => rows.filter(g => g.side === s).length;

  function addGoal(side: Side) {
    const n = goalCount(side) + 1;
    setGoals(g => [...g, { key: nextKey(), side, kind: "goal", player_id: "", minute: "" }]);
    setScore(sc => ((parseInt(sc[side], 10) || 0) < n ? { ...sc, [side]: String(n) } : sc));
  }
  function removeGoal(row: GoalRow) {
    const before = goalCount(row.side);
    setGoals(g => g.filter(x => x.key !== row.key));
    setScore(sc => (parseInt(sc[row.side], 10) === before ? { ...sc, [row.side]: String(before - 1) } : sc));
  }
  const patchGoal = (key: number, patch: Partial<GoalRow>) => setGoals(g => g.map(x => (x.key === key ? { ...x, ...patch } : x)));
  const patchCard = (key: number, patch: Partial<CardRow>) => setCards(c => c.map(x => (x.key === key ? { ...x, ...patch } : x)));

  async function save() {
    setMsg(null);
    const hs = score.home.trim() === "" ? NaN : Number(score.home), as_ = score.away.trim() === "" ? NaN : Number(score.away);
    if (!Number.isInteger(hs) || !Number.isInteger(as_) || hs < 0 || as_ < 0) { setMsg({ ok: false, text: "Enter the final score for both teams as whole numbers." }); return; }
    if (goals.some(g => !g.player_id) || cards.some(c => !c.player_id)) { setMsg({ ok: false, text: "Pick a player for every goal and card, or remove the empty rows." }); return; }
    const sheet: MatchSheet = {
      fixture_id: fixture.id, home_score: hs, away_score: as_,
      goals: goals.map(g => ({
        player_id: g.player_id,
        club_id: g.kind === "og" ? clubOf(other(g.side)).id : clubOf(g.side).id,
        minute: toMinute(g.minute), is_own_goal: g.kind === "og", is_penalty: g.kind === "pen",
      })),
      cards: cards.map(c => ({ player_id: c.player_id, card_type: c.card_type, minute: toMinute(c.minute), reason: c.reason ?? null })),
    };
    setBusy(true);
    const r = await api("/api/admin/match-sheet", { method: "POST", body: JSON.stringify(sheet) });
    setBusy(false);
    if (!r.ok) { setMsg({ ok: false, text: (await r.json().catch(() => ({}))).error ?? "Save failed." }); return; }
    setMsg({ ok: true, text: "Saved. League table updated." });
    onSaved();
  }

  async function clear() {
    if (!confirm(`Clear the result, goal scorers and cards for ${fixture.home_club.name} v ${fixture.away_club.name}?`)) return;
    setBusy(true);
    const r = await api("/api/admin/match-sheet", { method: "DELETE", body: JSON.stringify({ fixture_id: fixture.id }) });
    setBusy(false);
    if (!r.ok) { setMsg({ ok: false, text: "Could not clear the result." }); return; }
    setScore({ home: "", away: "" }); setGoals([]); setCards([]);
    setMsg({ ok: true, text: "Result cleared." });
    onSaved();
  }

  const tally = tallyGoals(goals.map(g => ({ club_id: g.kind === "og" ? clubOf(other(g.side)).id : clubOf(g.side).id, is_own_goal: g.kind === "og" })), homeId, awayId);
  const missing = (["home", "away"] as Side[]).map(s => ({ s, n: (parseInt(score[s], 10) || 0) - (s === "home" ? tally.home : tally.away) })).filter(x => x.n > 0);

  return (
    <div style={{ background: "#fff", border: `1px solid ${completed ? "rgba(31,107,55,.3)" : "rgba(17,24,39,.10)"}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px", display: "grid", gap: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span>{fixture.played_at ? timeLabel(fixture.played_at) : "Time TBC"}{fixture.venue ? ` · ${fixture.venue}` : ""}</span>
          {completed ? <span style={pill("#eef7f0", "#1f6b37")}>Result saved</span> : <span style={pill("#f4f4f1", MUTED)}>Not played</span>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right", fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{fixture.home_club.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {open ? (
              <>
                <input type="number" inputMode="numeric" min={0} value={score.home} onChange={e => setScore(s => ({ ...s, home: e.target.value }))} className="score-in" placeholder="0" aria-label={`${fixture.home_club.name} final score`} />
                <span style={{ fontWeight: 700, color: MUTED, fontSize: 18 }}>-</span>
                <input type="number" inputMode="numeric" min={0} value={score.away} onChange={e => setScore(s => ({ ...s, away: e.target.value }))} className="score-in" placeholder="0" aria-label={`${fixture.away_club.name} final score`} />
              </>
            ) : (
              <span style={{ fontSize: 18, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: completed ? "#101820" : "#f4f4f1", color: completed ? "#fff" : MUTED }}>
                {completed ? `${saved!.home_score} - ${saved!.away_score}` : "v"}
              </span>
            )}
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{fixture.away_club.name}</div>
        </div>
        {!open && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="button" onClick={openSheet} style={btn(true)}>{completed ? "Edit result" : "Enter result"}</button>
          </div>
        )}
      </div>

      {open && (
        <div style={{ borderTop: "1px solid rgba(17,24,39,.08)", padding: 20, display: "grid", gap: 20 }}>
          {loading ? <div style={{ color: MUTED, fontSize: 14 }}>Loading squads...</div> : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 20 }}>
                {(["home", "away"] as Side[]).map(side => {
                  const club = clubOf(side);
                  return (
                    <div key={side} style={{ display: "grid", gap: 16, alignContent: "start" }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{club.name}</div>
                      {squads[side].length === 0 && (
                        <div style={{ fontSize: 13, color: "#8a5a12", background: "#fff9ec", borderRadius: 8, padding: "8px 12px" }}>No registered players yet. You can still save the score.</div>
                      )}

                      <div>
                        <div style={label11}>Goals</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {goals.filter(g => g.side === side).map(g => {
                            const pool = g.kind === "og" ? squads[other(side)] : squads[side];
                            return (
                              <div key={g.key} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                <select aria-label="Goal scorer" value={g.player_id} onChange={e => patchGoal(g.key, { player_id: e.target.value })} style={{ ...field, flex: "1 1 160px" }}>
                                  <option value="">{g.kind === "og" ? `${clubOf(other(side)).name} player...` : "Scorer..."}</option>
                                  {pool.map(p => <option key={p.id} value={p.id}>{playerLabel(p)}</option>)}
                                </select>
                                <select aria-label="Goal type" value={g.kind} onChange={e => patchGoal(g.key, { kind: e.target.value as GoalKind, player_id: (e.target.value === "og") !== (g.kind === "og") ? "" : g.player_id })} style={{ ...field, flex: "0 0 auto" }}>
                                  <option value="goal">Goal</option>
                                  <option value="pen">Penalty</option>
                                  <option value="og">Own goal</option>
                                </select>
                                <input aria-label="Goal minute" type="number" inputMode="numeric" min={0} max={130} placeholder="Min" value={g.minute} onChange={e => patchGoal(g.key, { minute: e.target.value })} style={{ ...field, width: 72 }} />
                                <button type="button" onClick={() => removeGoal(g)} style={linkBtn("#a3211a")} aria-label="Remove goal">Remove</button>
                              </div>
                            );
                          })}
                          <div><button type="button" onClick={() => addGoal(side)} style={btn(false)}>+ Goal</button></div>
                        </div>
                      </div>

                      <div>
                        <div style={label11}>Cards</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {cards.filter(c => c.side === side).map(c => (
                            <div key={c.key} style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                              <span aria-hidden style={{ width: 12, height: 16, borderRadius: 3, flexShrink: 0, background: c.card_type === "yellow" ? "#f0b429" : "#cf2e24" }} />
                              <select aria-label="Booked player" value={c.player_id} onChange={e => patchCard(c.key, { player_id: e.target.value })} style={{ ...field, flex: "1 1 160px" }}>
                                <option value="">Player...</option>
                                {squads[side].map(p => <option key={p.id} value={p.id}>{playerLabel(p)}</option>)}
                              </select>
                              <select aria-label="Card" value={c.card_type} onChange={e => patchCard(c.key, { card_type: e.target.value as CardType })} style={{ ...field, flex: "0 0 auto" }}>
                                {CARD_TYPES.map(t => <option key={t} value={t}>{CARD_LABELS[t]}</option>)}
                              </select>
                              <input aria-label="Card minute" type="number" inputMode="numeric" min={0} max={130} placeholder="Min" value={c.minute} onChange={e => patchCard(c.key, { minute: e.target.value })} style={{ ...field, width: 72 }} />
                              <button type="button" onClick={() => setCards(cs => cs.filter(x => x.key !== c.key))} style={linkBtn("#a3211a")} aria-label="Remove card">Remove</button>
                            </div>
                          ))}
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button type="button" onClick={() => setCards(cs => [...cs, { key: nextKey(), side, card_type: "yellow", player_id: "", minute: "" }])} style={btn(false)}>+ Yellow</button>
                            <button type="button" onClick={() => setCards(cs => [...cs, { key: nextKey(), side, card_type: "red", player_id: "", minute: "" }])} style={btn(false)}>+ Red</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {missing.length > 0 && (
                <div style={{ fontSize: 13, color: MUTED }}>
                  {missing.map(m => `${clubOf(m.s).name}: ${m.n} goal${m.n === 1 ? "" : "s"} without a scorer`).join(" · ")}. That is fine if the scorer is unknown.
                </div>
              )}
              {msg && <div role="status" style={{ fontSize: 14, fontWeight: 500, color: msg.ok ? "#1f6b37" : "#a3211a" }}>{msg.text}</div>}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button type="button" onClick={save} disabled={busy} style={btn(true, busy)}>{busy ? "Saving..." : completed ? "Update result" : "Save result"}</button>
                <button type="button" onClick={() => { setOpen(false); setMsg(null); }} style={btn(false)}>Close</button>
                {completed && <button type="button" onClick={clear} disabled={busy} style={{ ...linkBtn("#a3211a"), marginLeft: "auto" }}>Clear result</button>}
              </div>
            </>
          )}
        </div>
      )}
      {!open && msg && <div role="status" style={{ padding: "0 20px 16px", textAlign: "center", fontSize: 13, color: msg.ok ? "#1f6b37" : "#a3211a" }}>{msg.text}</div>}
    </div>
  );
}
