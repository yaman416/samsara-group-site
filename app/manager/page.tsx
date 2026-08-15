"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const COLORS = [
  ["#b3122b", "Crimson"], ["#e2372b", "Red"], ["#1b2a4a", "Navy"],
  ["#14532d", "Forest"], ["#f0b429", "Gold"], ["#2f80ed", "Sky"],
  ["#101820", "Black"], ["#ffffff", "White"],
];

type Screen = "squad" | "fixtures" | "kit" | "club" | "account";
type Player = { id: string; full_name: string; jersey_number: number; position: string; date_of_birth: string | null; nationality: string | null };
type Club = { id: string; name: string; short_code: string; home_ground: string; community: string; home_color: string; away_color: string; home_trim: string; away_trim: string };
type Fixture = {
  id: string; week: number; venue: string | null; played_at: string | null; status: string;
  home_club: { id: string; name: string; short_code: string };
  away_club: { id: string; name: string; short_code: string };
  results: { home_score: number; away_score: number }[] | null;
};

async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function ManagerPage() {
  const [screen, setScreen] = useState<Screen>("squad");
  const [club, setClub] = useState<Club | null>(null);
  const [squad, setSquad] = useState<Player[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add player form
  const [addOpen, setAddOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ full_name: "", jersey_number: "", position: "MF", date_of_birth: "" });
  const [addError, setAddError] = useState("");
  const [addBusy, setAddBusy] = useState(false);

  // Edit player
  const [editId, setEditId] = useState<string | null>(null);
  const [editPlayer, setEditPlayer] = useState({ full_name: "", jersey_number: "", position: "MF", date_of_birth: "" });
  const [editError, setEditError] = useState("");
  const [editBusy, setEditBusy] = useState(false);

  // Kit edit
  const [homeColor, setHomeColor] = useState("#b3122b");
  const [awayColor, setAwayColor] = useState("#ffffff");
  const [homeTrim, setHomeTrim] = useState("#101820");
  const [awayTrim, setAwayTrim] = useState("#b3122b");
  const [kitSaving, setKitSaving] = useState(false);
  const [kitMsg, setKitMsg] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [clubRes, squadRes, fixRes] = await Promise.all([
        apiFetch("/api/manager/club"),
        apiFetch("/api/manager/squad"),
        apiFetch("/api/manager/fixtures"),
      ]);
      if (clubRes.status === 401) { window.location.href = "/register"; return; }
      if (clubRes.ok) {
        const c = await clubRes.json();
        setClub(c);
        setHomeColor(c.home_color || "#b3122b");
        setAwayColor(c.away_color || "#ffffff");
        setHomeTrim(c.home_trim || "#101820");
        setAwayTrim(c.away_trim || "#b3122b");
      }
      if (squadRes.ok) setSquad(await squadRes.json());
      if (fixRes.ok) setFixtures(await fixRes.json());
    } catch { setError("Failed to load club data."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function addPlayer() {
    const num = parseInt(newPlayer.jersey_number);
    if (!newPlayer.full_name.trim()) { setAddError("Player name required."); return; }
    if (!num || num < 1 || num > 99) { setAddError("Jersey number must be 1-99."); return; }
    if (squad.some(p => p.jersey_number === num)) { setAddError(`Jersey ${num} is already taken.`); return; }
    setAddBusy(true);
    try {
      const res = await apiFetch("/api/manager/squad", {
        method: "POST",
        body: JSON.stringify({ full_name: newPlayer.full_name.trim(), jersey_number: num, position: newPlayer.position, date_of_birth: newPlayer.date_of_birth || null }),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error); return; }
      setSquad(s => [...s, data].sort((a, b) => a.jersey_number - b.jersey_number));
      setNewPlayer({ full_name: "", jersey_number: "", position: "MF", date_of_birth: "" });
      setAddOpen(false); setAddError("");
    } catch { setAddError("Network error."); }
    finally { setAddBusy(false); }
  }

  async function removePlayer(id: string) {
    if (!confirm("Remove this player?")) return;
    await apiFetch("/api/manager/squad", { method: "DELETE", body: JSON.stringify({ id }) });
    setSquad(s => s.filter(p => p.id !== id));
  }

  function openEdit(p: Player) {
    setEditId(p.id);
    setEditPlayer({ full_name: p.full_name, jersey_number: String(p.jersey_number), position: p.position, date_of_birth: p.date_of_birth || "" });
    setEditError("");
    setAddOpen(false);
  }

  async function saveEdit() {
    const num = parseInt(editPlayer.jersey_number);
    if (!editPlayer.full_name.trim()) { setEditError("Player name required."); return; }
    if (!num || num < 1 || num > 99) { setEditError("Jersey number must be 1-99."); return; }
    if (squad.some(p => p.jersey_number === num && p.id !== editId)) { setEditError(`Jersey ${num} is already taken.`); return; }
    setEditBusy(true);
    try {
      const res = await apiFetch("/api/manager/squad", {
        method: "PATCH",
        body: JSON.stringify({ id: editId, full_name: editPlayer.full_name.trim(), jersey_number: num, position: editPlayer.position, date_of_birth: editPlayer.date_of_birth || null }),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.error); return; }
      setSquad(s => s.map(p => p.id === editId ? { ...p, full_name: editPlayer.full_name.trim(), jersey_number: num, position: editPlayer.position, date_of_birth: editPlayer.date_of_birth || null } : p).sort((a, b) => a.jersey_number - b.jersey_number));
      setEditId(null);
    } catch { setEditError("Network error."); }
    finally { setEditBusy(false); }
  }

  async function saveKit() {
    setKitSaving(true); setKitMsg("");
    const res = await apiFetch("/api/manager/club", { method: "PATCH", body: JSON.stringify({ home_color: homeColor, away_color: awayColor, home_trim: homeTrim, away_trim: awayTrim }) });
    setKitSaving(false);
    setKitMsg(res.ok ? "Kit colours saved." : "Save failed.");
    setTimeout(() => setKitMsg(""), 3000);
  }

  async function signOut() {
    localStorage.removeItem("spl_token");
    await supabase.auth.signOut();
    window.location.href = "/register";
  }

  const label11 = { display: "block" as const, fontSize: 11, fontWeight: 500 as const, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#66707d", marginBottom: 8 };
  const inputSm = { width: "100%", boxSizing: "border-box" as const, border: "1px solid rgba(17,24,39,.18)", borderRadius: 10, fontSize: 15, padding: "11px 14px", color: "#101820", fontFamily: "'DM Sans',system-ui,sans-serif" };

  if (loading) return (
    <div style={{ background: "#f4f4f1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#66707d" }}>
      Loading your club...
    </div>
  );

  if (error) return (
    <div style={{ background: "#f4f4f1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#c22b20", flexDirection: "column", gap: 16 }}>
      <div>{error}</div>
      <a href="/register" style={{ color: "#e2372b" }}>Go to login</a>
    </div>
  );

  return (
    <div style={{ background: "#f4f4f1", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#101820", minHeight: "100vh" }}>
      <style>{`
        .mgr-nav-btn { background: none; border: none; cursor: pointer; font-family: 'DM Sans',system-ui,sans-serif; font-size: 14px; font-weight: 500; padding: 14px 18px; color: #66707d; border-bottom: 2px solid transparent; white-space: nowrap; }
        .mgr-nav-btn:hover { color: #101820; }
        .mgr-nav-active { color: #101820; border-bottom-color: #e2372b; }
        .tbl th { font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: #66707d; padding: 10px 12px; text-align: left; }
        .tbl td { padding: 13px 12px; font-size: 15px; border-top: 1px solid rgba(17,24,39,.07); vertical-align: middle; }
        .swatch { width: 34px; height: 34px; border-radius: 8px; cursor: pointer; padding: 0; border: 2px solid transparent; }
        .swatch:hover { transform: scale(1.1); }
      `}</style>

      {/* Club color accent strip */}
      <div style={{ height: 4, background: homeColor }} />

      {/* Top bar */}
      <div style={{ background: "#101820", color: "#98a1ab", fontSize: 13 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 500, color: "#fff" }}>{club?.name || "My Club"}</span>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a href="/" style={{ color: "#98a1ab", textDecoration: "none" }}>Public site</a>
            <button type="button" onClick={signOut} style={{ background: "none", border: "none", color: "#98a1ab", cursor: "pointer", fontSize: 13 }}>Sign out</button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>Club portal</div>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-.015em", margin: "6px 0 0", lineHeight: 1.2 }}>{club?.name || "My Club"}</h1>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              {(() => {
                const now = new Date();
                const next = fixtures.filter(f => f.status === "scheduled" && f.played_at && new Date(f.played_at) >= now).sort((a, b) => new Date(a.played_at!).getTime() - new Date(b.played_at!).getTime())[0];
                if (!next) return null;
                const isHome = next.home_club?.id === club?.id;
                const opponent = isHome ? next.away_club?.name : next.home_club?.name;
                const d = new Date(next.played_at!);
                const dateStr = d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
                const timeStr = d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
                return (
                  <div style={{ background: "#f4f4f1", borderRadius: 12, padding: "10px 16px", fontSize: 13, color: "#4a545f", textAlign: "right" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#98a1ab", marginBottom: 3 }}>Next match</div>
                    <div style={{ fontWeight: 600, color: "#101820" }}>vs {opponent}</div>
                    <div style={{ color: "#66707d", marginTop: 2 }}>{isHome ? "Home" : "Away"} · {dateStr} {timeStr}</div>
                  </div>
                );
              })()}
              <div style={{ fontSize: 13, color: "#66707d" }}>{squad.length} / 22 players</div>
              <button type="button" onClick={() => { setScreen("squad"); setAddOpen(true); }}
                style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 14, fontWeight: 500, padding: "11px 20px", borderRadius: 999, cursor: "pointer" }}>
                + Add player
              </button>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 0, overflowX: "auto", marginTop: 20 }}>
            {(["squad", "fixtures", "kit", "club", "account"] as Screen[]).map(s => (
              <button key={s} type="button" className={`mgr-nav-btn${screen === s ? " mgr-nav-active" : ""}`} onClick={() => setScreen(s)}>
                {s === "squad" ? "Squad" : s === "fixtures" ? "Fixtures" : s === "kit" ? "Kit colours" : s === "club" ? "Club details" : "Account"}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 96px" }}>

        {/* SQUAD */}
        {screen === "squad" && (
          <div style={{ display: "grid", gap: 24 }}>
            {/* Add player form */}
            {addOpen && (
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 28 }}>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>Add a player</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
                  <div>
                    <label style={label11}>Full name</label>
                    <input value={newPlayer.full_name} onChange={e => setNewPlayer(p => ({ ...p, full_name: e.target.value }))} placeholder="Player name" style={inputSm} />
                  </div>
                  <div>
                    <label style={label11}>Jersey no.</label>
                    <input type="number" min={1} max={99} value={newPlayer.jersey_number} onChange={e => setNewPlayer(p => ({ ...p, jersey_number: e.target.value }))} placeholder="1-99" style={inputSm} />
                  </div>
                  <div>
                    <label style={label11}>Position</label>
                    <select value={newPlayer.position} onChange={e => setNewPlayer(p => ({ ...p, position: e.target.value }))} style={{ ...inputSm, background: "#fff" }}>
                      <option value="GK">Goalkeeper</option>
                      <option value="DF">Defender</option>
                      <option value="MF">Midfielder</option>
                      <option value="FW">Forward</option>
                    </select>
                  </div>
                  <div>
                    <label style={label11}>Date of birth</label>
                    <input type="date" value={newPlayer.date_of_birth} onChange={e => setNewPlayer(p => ({ ...p, date_of_birth: e.target.value }))} style={inputSm} />
                  </div>
                </div>
                {addError && <div style={{ marginTop: 12, fontSize: 14, color: "#c22b20" }}>{addError}</div>}
                <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
                  <button type="button" onClick={() => { setAddOpen(false); setAddError(""); }} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: "1px solid rgba(17,24,39,.18)", color: "#101820", fontSize: 14, fontWeight: 500, padding: "11px 22px", borderRadius: 999, cursor: "pointer" }}>Cancel</button>
                  <button type="button" onClick={addPlayer} disabled={addBusy} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 14, fontWeight: 500, padding: "11px 22px", borderRadius: 999, cursor: "pointer", opacity: addBusy ? 0.7 : 1 }}>
                    {addBusy ? "Adding..." : "Add player"}
                  </button>
                </div>
              </div>
            )}

            {/* Squad table */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden", overflowX: "auto" }}>
              {squad.length === 0 ? (
                <div style={{ padding: "48px 32px", textAlign: "center", color: "#66707d", fontSize: 15 }}>
                  No players yet. Click <strong>+ Add player</strong> to build your squad.
                </div>
              ) : (
                <table className="tbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "rgba(17,24,39,.03)" }}>
                    <tr>
                      <th>No.</th><th>Name</th><th>Position</th><th>Date of birth</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {squad.map(p => editId === p.id ? (
                      <tr key={p.id} style={{ background: "#fafaf8" }}>
                        <td colSpan={5} style={{ padding: "16px 12px" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 12 }}>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#4a545f", marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase" }}>Full name</label>
                              <input value={editPlayer.full_name} onChange={e => setEditPlayer(p => ({ ...p, full_name: e.target.value }))} style={inputSm} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#4a545f", marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase" }}>Jersey no.</label>
                              <input type="number" min={1} max={99} value={editPlayer.jersey_number} onChange={e => setEditPlayer(p => ({ ...p, jersey_number: e.target.value }))} style={inputSm} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#4a545f", marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase" }}>Position</label>
                              <select value={editPlayer.position} onChange={e => setEditPlayer(p => ({ ...p, position: e.target.value }))} style={{ ...inputSm, background: "#fff" }}>
                                <option value="GK">Goalkeeper</option>
                                <option value="DF">Defender</option>
                                <option value="MF">Midfielder</option>
                                <option value="FW">Forward</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#4a545f", marginBottom: 6, letterSpacing: ".06em", textTransform: "uppercase" }}>Date of birth</label>
                              <input type="date" value={editPlayer.date_of_birth} onChange={e => setEditPlayer(p => ({ ...p, date_of_birth: e.target.value }))} style={inputSm} />
                            </div>
                          </div>
                          {editError && <div style={{ fontSize: 13, color: "#c22b20", marginBottom: 10 }}>{editError}</div>}
                          <div style={{ display: "flex", gap: 10 }}>
                            <button type="button" onClick={() => setEditId(null)} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: "1px solid rgba(17,24,39,.18)", color: "#101820", fontSize: 13, fontWeight: 500, padding: "9px 18px", borderRadius: 999, cursor: "pointer" }}>Cancel</button>
                            <button type="button" onClick={saveEdit} disabled={editBusy} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 13, fontWeight: 500, padding: "9px 18px", borderRadius: 999, cursor: "pointer", opacity: editBusy ? 0.7 : 1 }}>{editBusy ? "Saving..." : "Save changes"}</button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={p.id}>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, background: homeColor, color: "#fff", fontSize: 14, fontWeight: 600 }}>
                            {p.jersey_number}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{p.full_name}</td>
                        <td>
                          <span style={{ background: "rgba(17,24,39,.07)", borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 500 }}>{p.position}</span>
                        </td>
                        <td style={{ color: "#66707d", fontSize: 14 }}>{p.date_of_birth || "-"}</td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button type="button" onClick={() => openEdit(p)}
                              style={{ background: "none", border: "1px solid rgba(17,24,39,.14)", borderRadius: 8, color: "#101820", fontSize: 13, padding: "6px 12px", cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
                              Edit
                            </button>
                            <button type="button" onClick={() => removePlayer(p.id)}
                              style={{ background: "none", border: "1px solid rgba(17,24,39,.14)", borderRadius: 8, color: "#66707d", fontSize: 13, padding: "6px 12px", cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(17,24,39,.07)", fontSize: 13, color: "#98a1ab", display: "flex", gap: 20, flexWrap: "wrap" }}>
                {["GK","DF","MF","FW"].map(pos => (
                  <span key={pos}>{pos} {squad.filter(p => p.position === pos).length}</span>
                ))}
                <span style={{ marginLeft: "auto" }}>Min 11, max 22 players</span>
              </div>
            </div>
          </div>
        )}

        {/* FIXTURES */}
        {screen === "fixtures" && (
          <div style={{ display: "grid", gap: 16 }}>
            {fixtures.length === 0 && (
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 48, textAlign: "center", color: "#66707d" }}>
                No fixtures scheduled yet.
              </div>
            )}
            {fixtures.map(f => {
              const result = f.results?.[0] ?? null;
              const isHome = f.home_club?.name === club?.name;
              const opponent = isHome ? f.away_club : f.home_club;
              const completed = f.status === "completed";
              return (
                <div key={f.id} style={{ background: "#fff", border: `1px solid ${completed ? "rgba(31,107,55,.2)" : "rgba(17,24,39,.10)"}`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#66707d", minWidth: 44 }}>Wk {f.week}</div>
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{isHome ? "vs" : "@"} {opponent?.name}</div>
                    <div style={{ fontSize: 13, color: "#98a1ab", marginTop: 3 }}>
                      {isHome ? "Home" : "Away"}
                      {f.venue ? ` · ${f.venue}` : ""}
                    </div>
                  </div>
                  {f.played_at && (
                    <div style={{ fontSize: 13, color: "#66707d" }}>
                      {new Date(f.played_at).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                  )}
                  {completed && result && (
                    <div style={{ fontWeight: 700, fontSize: 20, letterSpacing: ".04em", color: "#101820" }}>
                      {isHome ? result.home_score : result.away_score}
                      <span style={{ color: "#98a1ab", fontWeight: 400, margin: "0 6px" }}>-</span>
                      {isHome ? result.away_score : result.home_score}
                    </div>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: completed ? "#eef7f0" : "#f4f4f1", color: completed ? "#1f6b37" : "#66707d", textTransform: "capitalize" as const }}>
                    {f.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* KIT */}
        {screen === "kit" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {[
              { label: "Home kit", primary: homeColor, setP: setHomeColor, trim: homeTrim, setT: setHomeTrim },
              { label: "Away kit", primary: awayColor, setP: setAwayColor, trim: awayTrim, setT: setAwayTrim },
            ].map(kit => (
              <div key={kit.label} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 32 }}>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 24 }}>{kit.label}</div>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  {/* Jersey preview */}
                  <div style={{ width: 88, height: 104, borderRadius: 10, background: kit.primary, border: "1px solid rgba(17,24,39,.12)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 10, flexShrink: 0 }}>
                    <span style={{ width: "100%", height: 20, borderRadius: 5, background: kit.trim }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={label11}>Primary colour</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                      {COLORS.map(([hex, name]) => (
                        <button key={hex} type="button" title={name} className="swatch"
                          style={{ background: hex, border: `2px solid ${kit.primary === hex ? "#101820" : "rgba(17,24,39,.14)"}`, borderRadius: 8, width: 34, height: 34, cursor: "pointer", padding: 0 }}
                          onClick={() => kit.setP(hex)} />
                      ))}
                    </div>
                    <div style={label11}>Trim colour</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {COLORS.map(([hex, name]) => (
                        <button key={hex} type="button" title={name} className="swatch"
                          style={{ background: hex, border: `2px solid ${kit.trim === hex ? "#101820" : "rgba(17,24,39,.14)"}`, borderRadius: 8, width: 34, height: 34, cursor: "pointer", padding: 0 }}
                          onClick={() => kit.setT(hex)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 16 }}>
              <button type="button" onClick={saveKit} disabled={kitSaving}
                style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 15, fontWeight: 500, padding: "14px 28px", borderRadius: 999, cursor: "pointer", opacity: kitSaving ? 0.7 : 1 }}>
                {kitSaving ? "Saving..." : "Save kit colours"}
              </button>
              {kitMsg && <span style={{ fontSize: 15, color: kitMsg.includes("saved") ? "#1f6b37" : "#c22b20" }}>{kitMsg}</span>}
            </div>
          </div>
        )}

        {/* CLUB DETAILS */}
        {screen === "club" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, maxWidth: 900 }}>
            {/* Club info */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#66707d", marginBottom: 20 }}>Club information</div>
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  ["Club name", club?.name || "-"],
                  ["Short code", club?.short_code || "-"],
                  ["Community", club?.community || "-"],
                  ["Home ground", club?.home_ground || "Nicholls"],
                  ["Season", "Season 3 · 2026-27"],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 15, paddingBottom: 14, borderBottom: "1px solid rgba(17,24,39,.07)" }}>
                    <span style={{ color: "#66707d" }}>{l}</span>
                    <span style={{ fontWeight: 500, textAlign: "right" as const }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Squad checklist */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#66707d", marginBottom: 20 }}>Registration checklist</div>
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { label: "Club registered", done: true },
                  { label: `Squad size (${squad.length} / min 11)`, done: squad.length >= 11 },
                  { label: `Goalkeeper added (${squad.filter(p => p.position === "GK").length})`, done: squad.filter(p => p.position === "GK").length >= 1 },
                  { label: "Kit colours set", done: !!(homeColor && awayColor) },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15 }}>
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: item.done ? "#eef7f0" : "#f4f4f1", border: `1px solid ${item.done ? "#c7e3ce" : "rgba(17,24,39,.14)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: item.done ? "#1f6b37" : "#98a1ab", flex: "none" }}>
                      {item.done ? "✓" : "·"}
                    </span>
                    <span style={{ color: item.done ? "#101820" : "#66707d" }}>{item.label}</span>
                  </div>
                ))}
              </div>
              {squad.length >= 11 && squad.filter(p => p.position === "GK").length >= 1 ? (
                <div style={{ marginTop: 24, background: "#eef7f0", border: "1px solid #c7e3ce", borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#1f6b37" }}>
                  Squad ready for Season 3.
                </div>
              ) : (
                <div style={{ marginTop: 24, background: "#fff6ec", border: "1px solid #f0d7b8", borderRadius: 12, padding: "14px 18px", fontSize: 14, color: "#8a5a12" }}>
                  Complete the checklist before the season draw.
                </div>
              )}
            </div>

            {/* Kit preview */}
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#66707d", marginBottom: 20 }}>Kit colours</div>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                {[["Home", homeColor, homeTrim], ["Away", awayColor, awayTrim]].map(([label, primary, trim]) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 10 }}>
                    <div style={{ width: 72, height: 88, borderRadius: 10, background: primary, border: "1px solid rgba(17,24,39,.10)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 8 }}>
                      <span style={{ width: "100%", height: 16, borderRadius: 4, background: trim, display: "block" }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#66707d" }}>{label}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setScreen("kit")} style={{ marginTop: 20, fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: "1px solid rgba(17,24,39,.18)", color: "#101820", fontSize: 13, fontWeight: 500, padding: "9px 18px", borderRadius: 999, cursor: "pointer" }}>
                Edit kit colours
              </button>
            </div>
          </div>
        )}

        {/* ACCOUNT */}
        {screen === "account" && (
          <AccountTab club={club} onSignOut={signOut} />
        )}
      </div>
    </div>
  );
}

function AccountTab({ club, onSignOut }: { club: { name: string } | null; onSignOut: () => void }) {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const inputSm = { width: "100%", boxSizing: "border-box" as const, border: "1px solid rgba(17,24,39,.18)", borderRadius: 10, fontSize: 15, padding: "11px 14px", color: "#101820", fontFamily: "'DM Sans',system-ui,sans-serif" };
  const label11 = { display: "block" as const, fontSize: 11, fontWeight: 500 as const, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#66707d", marginBottom: 8 };

  async function changePassword() {
    setPwError(""); setPwMsg("");
    if (!newPw || newPw.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    setPwBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwBusy(false);
    if (error) { setPwError(error.message); return; }
    setPwMsg("Password updated successfully.");
    setNewPw(""); setConfirmPw("");
  }

  return (
    <div style={{ maxWidth: 480, display: "grid", gap: 20 }}>
      <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 32 }}>
        <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: 24, margin: "0 0 20px" }}>Account</h2>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, paddingBottom: 12, borderBottom: "1px solid rgba(17,24,39,.07)" }}>
            <span style={{ color: "#66707d" }}>Club</span>
            <span style={{ fontWeight: 500 }}>{club?.name || "-"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, paddingBottom: 12, borderBottom: "1px solid rgba(17,24,39,.07)" }}>
            <span style={{ color: "#66707d" }}>Season</span>
            <span style={{ fontWeight: 500 }}>Season 3 · 2026</span>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 32 }}>
        <h3 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: 20, margin: "0 0 20px" }}>Change password</h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={label11}>New password</label>
            <input type="password" value={newPw} onChange={e => { setNewPw(e.target.value); setPwError(""); setPwMsg(""); }} placeholder="At least 8 characters" style={inputSm} />
          </div>
          <div>
            <label style={label11}>Confirm new password</label>
            <input type="password" value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setPwError(""); setPwMsg(""); }} placeholder="Repeat password" style={inputSm} />
          </div>
        </div>
        {pwError && <div style={{ marginTop: 12, fontSize: 14, color: "#a3211a" }}>{pwError}</div>}
        {pwMsg && <div style={{ marginTop: 12, fontSize: 14, color: "#1f6b37", fontWeight: 500 }}>{pwMsg}</div>}
        <button type="button" onClick={changePassword} disabled={pwBusy}
          style={{ marginTop: 20, fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 14, fontWeight: 500, padding: "12px 24px", borderRadius: 999, cursor: "pointer", opacity: pwBusy ? 0.7 : 1 }}>
          {pwBusy ? "Updating..." : "Update password"}
        </button>
      </div>

      <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 24 }}>
        <button type="button" onClick={onSignOut}
          style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: "none", color: "#a3211a", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
