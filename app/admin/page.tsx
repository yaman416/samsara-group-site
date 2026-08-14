"use client";
import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "spl_admin";

type Screen = "invites" | "regs" | "clubs" | "fixtures" | "matchday" | "table";
type RegStatus = "pending" | "approved" | "changes_requested" | "rejected";

type Invite = { id: string; code: string; club_name: string; manager_email: string; season: number; used: boolean; created_at: string };
type Reg = { id: string; status: RegStatus; reviewer_notes: string | null; submitted_at: string; clubs: { name: string; community: string } | null };
type Club = { id: string; name: string; short_code: string; community: string; home_color: string };
type Season = { id: string; name: string; year: number; is_active: boolean };
type Fixture = {
  id: string; week: number; venue: string | null; played_at: string | null; status: string;
  home_club: { id: string; name: string; short_code: string };
  away_club: { id: string; name: string; short_code: string };
  results: { home_score: number; away_score: number }[] | null;
};
type TableRow = {
  position: number; club_name: string; short_code: string; home_color: string;
  played: number; won: number; drawn: number; lost: number;
  goals_for: number; goals_against: number; goal_diff: number; points: number;
};

function adminHeader() {
  return { "Content-Type": "application/json", "x-admin-key": typeof window !== "undefined" ? (localStorage.getItem(ADMIN_KEY) || "") : "" };
}
async function api(path: string, opts: RequestInit = {}) {
  return fetch(path, { ...opts, headers: { ...adminHeader(), ...(opts.headers as Record<string, string> ?? {}) } });
}

const STATUS_STYLE: Record<RegStatus, { bg: string; color: string; label: string }> = {
  pending:            { bg: "#fff6ec", color: "#8a5a12", label: "Pending" },
  approved:           { bg: "#eef7f0", color: "#1f6b37", label: "Approved" },
  changes_requested:  { bg: "#eff6ff", color: "#1e40af", label: "Changes requested" },
  rejected:           { bg: "#fdecea", color: "#a3211a", label: "Rejected" },
};

const F = "'DM Sans',system-ui,sans-serif";
const label11: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d", marginBottom: 6 };
const inputSm: React.CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(17,24,39,.18)", borderRadius: 10, fontSize: 14, padding: "10px 13px", color: "#101820", fontFamily: F, background: "#fff" };

function Btn({ variant = "dark", children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "dark" | "ghost" | "red" | "green" }) {
  const styles: Record<string, React.CSSProperties> = {
    dark:  { background: "#101820", color: "#fff", border: 0 },
    red:   { background: "#e2372b", color: "#fff", border: 0 },
    green: { background: "#1f6b37", color: "#fff", border: 0 },
    ghost: { background: "none",    color: "#101820", border: "1px solid rgba(17,24,39,.18)" },
  };
  return (
    <button type="button" style={{ fontFamily: F, fontSize: 14, fontWeight: 500, padding: "10px 20px", borderRadius: 999, cursor: "pointer", ...styles[variant], ...(props.disabled ? { opacity: 0.6 } : {}) }} {...props}>
      {children}
    </button>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [screen, setScreen] = useState<Screen>("invites");

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);

  const [invites, setInvites] = useState<Invite[]>([]);
  const [newClub, setNewClub] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [invBusy, setInvBusy] = useState(false);
  const [invMsg, setInvMsg] = useState("");

  const [regs, setRegs] = useState<Reg[]>([]);
  const [openReg, setOpenReg] = useState<Reg | null>(null);
  const [regNote, setRegNote] = useState("");
  const [regBusy, setRegBusy] = useState(false);

  const [clubs, setClubs] = useState<Club[]>([]);

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [weekFilter, setWeekFilter] = useState("");
  const [fixBusy, setFixBusy] = useState(false);
  const [nfOpen, setNfOpen] = useState(false);
  const [nfWeek, setNfWeek] = useState("");
  const [nfHome, setNfHome] = useState("");
  const [nfAway, setNfAway] = useState("");
  const [nfVenue, setNfVenue] = useState("");
  const [nfDate, setNfDate] = useState("");

  const [table, setTable] = useState<TableRow[]>([]);

  const loadSeasons = useCallback(async () => {
    const res = await api("/api/admin/seasons");
    if (res.ok) {
      const data: Season[] = await res.json();
      setSeasons(data);
      setActiveSeason(data.find(s => s.is_active) ?? data[0] ?? null);
    }
  }, []);

  const loadInvites  = useCallback(async () => { const r = await api("/api/admin/invite"); if (r.ok) setInvites(await r.json()); }, []);
  const loadRegs     = useCallback(async () => { const r = await api("/api/admin/registrations"); if (r.ok) setRegs(await r.json()); }, []);
  const loadClubs    = useCallback(async () => { const r = await api("/api/admin/clubs"); if (r.ok) setClubs(await r.json()); }, []);
  const loadFixtures = useCallback(async () => {
    const url = weekFilter ? `/api/admin/fixtures?week=${weekFilter}` : "/api/admin/fixtures";
    const r = await api(url);
    if (r.ok) setFixtures(await r.json());
  }, [weekFilter]);
  const loadTable = useCallback(async () => {
    const url = activeSeason ? `/api/admin/league-table?season_id=${activeSeason.id}` : "/api/admin/league-table";
    const r = await api(url);
    if (r.ok) setTable(await r.json());
  }, [activeSeason]);

  useEffect(() => { if (authed) { loadSeasons(); loadClubs(); } }, [authed, loadSeasons, loadClubs]);
  useEffect(() => {
    if (!authed) return;
    if (screen === "invites")  loadInvites();
    if (screen === "regs")     loadRegs();
    if (screen === "clubs")    loadClubs();
    if (screen === "fixtures" || screen === "matchday") loadFixtures();
    if (screen === "table")    loadTable();
  }, [authed, screen, loadInvites, loadRegs, loadClubs, loadFixtures, loadTable]);

  async function login() {
    if (!pw.trim()) return;
    const res = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: pw.trim() }) });
    if (!res.ok) { setPwError("Invalid key."); return; }
    localStorage.setItem(ADMIN_KEY, pw.trim());
    setAuthed(true);
  }

  async function createInvite() {
    if (!newClub.trim()) { setInvMsg("Club name required."); return; }
    setInvBusy(true); setInvMsg("");
    const res = await api("/api/admin/invite", { method: "POST", body: JSON.stringify({ clubName: newClub.trim(), managerEmail: newEmail.trim() || "noemail@placeholder.com", season: activeSeason?.year ?? 3 }) });
    const data = await res.json();
    setInvBusy(false);
    if (!res.ok) { setInvMsg(data.error || "Failed."); return; }
    setInvMsg(`Code: ${data.code}`);
    setNewClub(""); setNewEmail(""); loadInvites();
  }

  async function deleteInvite(code: string) {
    if (!confirm(`Delete invite ${code}?`)) return;
    await api("/api/admin/invite", { method: "DELETE", body: JSON.stringify({ code }) });
    loadInvites();
  }

  async function updateReg(id: string, status: RegStatus) {
    setRegBusy(true);
    await api(`/api/admin/registrations/${id}`, { method: "PATCH", body: JSON.stringify({ status, reviewer_notes: regNote }) });
    setRegBusy(false); setOpenReg(null); loadRegs();
  }

  async function createFixture() {
    if (!nfWeek || !nfHome || !nfAway || !activeSeason) return;
    setFixBusy(true);
    await api("/api/admin/fixtures", { method: "POST", body: JSON.stringify({ season_id: activeSeason.id, week: parseInt(nfWeek), home_club_id: nfHome, away_club_id: nfAway, venue: nfVenue || null, played_at: nfDate || null }) });
    setFixBusy(false); setNfOpen(false);
    setNfWeek(""); setNfHome(""); setNfAway(""); setNfVenue(""); setNfDate("");
    loadFixtures();
  }

  async function deleteFixture(id: string) {
    if (!confirm("Delete this fixture?")) return;
    await api("/api/admin/fixtures", { method: "DELETE", body: JSON.stringify({ id }) });
    loadFixtures();
  }

  async function saveResult(fixture_id: string, home_score: number, away_score: number) {
    await api("/api/admin/results", { method: "POST", body: JSON.stringify({ fixture_id, home_score, away_score }) });
    loadFixtures();
    if (screen === "table") loadTable();
  }

  async function deleteResult(fixture_id: string) {
    await api("/api/admin/results", { method: "DELETE", body: JSON.stringify({ fixture_id }) });
    loadFixtures();
  }

  const NAV: { key: Screen; label: string }[] = [
    { key: "invites",  label: "Invites" },
    { key: "regs",     label: "Registrations" },
    { key: "clubs",    label: "Clubs" },
    { key: "fixtures", label: "Fixtures" },
    { key: "matchday", label: "Matchday" },
    { key: "table",    label: "League Table" },
  ];

  if (!authed) return (
    <div style={{ background: "#f4f4f1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 40, width: "100%", maxWidth: 380 }}>
        <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 24, fontWeight: 500, marginBottom: 8 }}>SPL Admin</div>
        <div style={{ fontSize: 14, color: "#66707d", marginBottom: 24 }}>Restricted access</div>
        <label style={label11}>Admin key</label>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError(""); }} onKeyDown={e => e.key === "Enter" && login()} placeholder="Enter admin key" style={{ ...inputSm, marginBottom: pwError ? 8 : 20 }} autoFocus />
        {pwError && <div style={{ fontSize: 14, color: "#a3211a", marginBottom: 16 }}>{pwError}</div>}
        <Btn variant="dark" onClick={login} style={{ width: "100%" }}>Continue</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f4f4f1", fontFamily: F, color: "#101820", minHeight: "100vh" }}>
      <style>{`
        .atbl th { font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: #66707d; padding: 10px 14px; text-align: left; white-space: nowrap; }
        .atbl td { padding: 13px 14px; font-size: 14px; border-top: 1px solid rgba(17,24,39,.07); vertical-align: middle; }
        .atbl tr:hover td { background: rgba(17,24,39,.02); }
        .score-in { width: 48px; border: 1.5px solid rgba(17,24,39,.18); border-radius: 8px; font-size: 16px; font-weight: 600; padding: 6px 8px; text-align: center; font-family: inherit; color: #101820; }
        .score-in:focus { outline: none; border-color: #101820; }
        .card { background: #fff; border: 1px solid rgba(17,24,39,.10); border-radius: 18px; }
      `}</style>

      {/* Topbar */}
      <div style={{ background: "#101820", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", display: "flex", gap: 4, alignItems: "center", height: 52, overflowX: "auto" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginRight: 16, whiteSpace: "nowrap" }}>SPL Admin</span>
          {NAV.map(n => (
            <button key={n.key} type="button" onClick={() => setScreen(n.key)}
              style={{ background: screen === n.key ? "rgba(255,255,255,.14)" : "none", border: "none", color: screen === n.key ? "#fff" : "#98a1ab", fontSize: 13, fontWeight: 500, padding: "8px 14px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}>
              {n.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          {activeSeason && <span style={{ color: "#66707d", fontSize: 12, whiteSpace: "nowrap" }}>{activeSeason.name}</span>}
          <button type="button" onClick={() => { localStorage.removeItem(ADMIN_KEY); setAuthed(false); }}
            style={{ background: "none", border: "none", color: "#66707d", fontSize: 13, cursor: "pointer", marginLeft: 12 }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "32px 24px 96px" }}>

        {/* INVITES */}
        {screen === "invites" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Generate invite code</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "end" }}>
                <div>
                  <label style={label11}>Club name</label>
                  <input value={newClub} onChange={e => setNewClub(e.target.value)} placeholder="Nepal United FC" style={inputSm} />
                </div>
                <div>
                  <label style={label11}>Manager email (optional)</label>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="manager@club.au" style={inputSm} />
                </div>
                <Btn variant="dark" onClick={createInvite} disabled={invBusy}>{invBusy ? "Creating..." : "Generate"}</Btn>
              </div>
              {invMsg && (
                <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: invMsg.includes("Code") ? "#eef7f0" : "#fdecea", color: invMsg.includes("Code") ? "#1f6b37" : "#a3211a", fontSize: 14, fontWeight: 500 }}>
                  {invMsg}
                  {invMsg.includes("Code") && (
                    <button type="button" onClick={() => { navigator.clipboard.writeText(invMsg.replace("Code: ", "")); }}
                      style={{ marginLeft: 12, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#1f6b37", fontWeight: 600 }}>Copy</button>
                  )}
                </div>
              )}
              <p style={{ marginTop: 12, fontSize: 13, color: "#98a1ab" }}>Share the code manually with the club manager. They enter it on the registration page.</p>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "rgba(17,24,39,.03)" }}>
                    <tr><th>Code</th><th>Club</th><th>Email</th><th>Status</th><th>Created</th><th></th></tr>
                  </thead>
                  <tbody>
                    {invites.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#98a1ab", padding: 32 }}>No invites yet.</td></tr>}
                    {invites.map(inv => (
                      <tr key={inv.id}>
                        <td><code style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, background: "#f4f4f1", padding: "3px 8px", borderRadius: 6 }}>{inv.code}</code></td>
                        <td style={{ fontWeight: 500 }}>{inv.club_name}</td>
                        <td style={{ color: "#66707d" }}>{inv.manager_email || "-"}</td>
                        <td>
                          <span style={{ background: inv.used ? "#eef7f0" : "#f4f4f1", color: inv.used ? "#1f6b37" : "#66707d", borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 500 }}>
                            {inv.used ? "Used" : "Available"}
                          </span>
                        </td>
                        <td style={{ color: "#66707d", fontSize: 13 }}>{new Date(inv.created_at).toLocaleDateString("en-AU")}</td>
                        <td>
                          {!inv.used && <button type="button" onClick={() => deleteInvite(inv.code)} style={{ background: "none", border: "none", color: "#a3211a", fontSize: 13, cursor: "pointer", fontFamily: F }}>Delete</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REGISTRATIONS */}
        {screen === "regs" && (
          <div style={{ display: "grid", gap: 20 }}>
            {openReg && (
              <div className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Review: {openReg.clubs?.name}</div>
                  <Btn variant="ghost" onClick={() => setOpenReg(null)} style={{ fontSize: 13, padding: "6px 16px" }}>Close</Btn>
                </div>
                <label style={label11}>Reviewer notes</label>
                <textarea value={regNote} onChange={e => setRegNote(e.target.value)} rows={3} placeholder="Optional notes for the club..." style={{ ...inputSm, resize: "vertical", marginBottom: 16 }} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Btn variant="green" onClick={() => updateReg(openReg.id, "approved")} disabled={regBusy}>Approve</Btn>
                  <Btn variant="ghost" onClick={() => updateReg(openReg.id, "changes_requested")} disabled={regBusy}>Request changes</Btn>
                  <Btn variant="red"   onClick={() => updateReg(openReg.id, "rejected")} disabled={regBusy}>Reject</Btn>
                </div>
              </div>
            )}
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "rgba(17,24,39,.03)" }}>
                    <tr><th>Club</th><th>Community</th><th>Status</th><th>Submitted</th><th></th></tr>
                  </thead>
                  <tbody>
                    {regs.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#98a1ab", padding: 32 }}>No registrations yet.</td></tr>}
                    {regs.map(r => {
                      const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.pending;
                      return (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 500 }}>{r.clubs?.name || "-"}</td>
                          <td style={{ color: "#66707d" }}>{r.clubs?.community || "-"}</td>
                          <td><span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 500 }}>{s.label}</span></td>
                          <td style={{ color: "#66707d", fontSize: 13 }}>{new Date(r.submitted_at).toLocaleDateString("en-AU")}</td>
                          <td><button type="button" onClick={() => { setOpenReg(r); setRegNote(r.reviewer_notes || ""); }} style={{ background: "none", border: "none", color: "#101820", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: F }}>Review</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CLUBS */}
        {screen === "clubs" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "rgba(17,24,39,.03)" }}>
                  <tr><th>Club</th><th>Code</th><th>Community</th><th>Color</th></tr>
                </thead>
                <tbody>
                  {clubs.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "#98a1ab", padding: 32 }}>No clubs yet.</td></tr>}
                  {clubs.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td><code style={{ fontFamily: "ui-monospace,monospace", fontSize: 13 }}>{c.short_code}</code></td>
                      <td style={{ color: "#66707d" }}>{c.community}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 4, background: c.home_color, border: "1px solid rgba(17,24,39,.12)" }} />
                          <span style={{ fontSize: 13, color: "#66707d" }}>{c.home_color}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FIXTURES */}
        {screen === "fixtures" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input type="number" value={weekFilter} onChange={e => setWeekFilter(e.target.value)} placeholder="Filter week..." style={{ ...inputSm, width: 140 }} />
              <Btn variant="ghost" onClick={loadFixtures} style={{ padding: "10px 18px" }}>Filter</Btn>
              <Btn variant="dark" onClick={() => setNfOpen(o => !o)} style={{ marginLeft: "auto" }}>+ Add fixture</Btn>
            </div>

            {nfOpen && (
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>New fixture</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16 }}>
                  <div><label style={label11}>Week</label><input type="number" value={nfWeek} onChange={e => setNfWeek(e.target.value)} style={inputSm} /></div>
                  <div>
                    <label style={label11}>Home club</label>
                    <select value={nfHome} onChange={e => setNfHome(e.target.value)} style={inputSm}>
                      <option value="">Select...</option>
                      {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label11}>Away club</label>
                    <select value={nfAway} onChange={e => setNfAway(e.target.value)} style={inputSm}>
                      <option value="">Select...</option>
                      {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label style={label11}>Venue</label><input value={nfVenue} onChange={e => setNfVenue(e.target.value)} placeholder="Nicholls Oval" style={inputSm} /></div>
                  <div><label style={label11}>Date and time</label><input type="datetime-local" value={nfDate} onChange={e => setNfDate(e.target.value)} style={inputSm} /></div>
                </div>
                <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
                  <Btn variant="ghost" onClick={() => setNfOpen(false)}>Cancel</Btn>
                  <Btn variant="dark" onClick={createFixture} disabled={fixBusy}>{fixBusy ? "Saving..." : "Add fixture"}</Btn>
                </div>
              </div>
            )}

            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "rgba(17,24,39,.03)" }}>
                    <tr><th>Wk</th><th>Home</th><th>Away</th><th>Date</th><th>Venue</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    {fixtures.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#98a1ab", padding: 32 }}>No fixtures yet.</td></tr>}
                    {fixtures.map(f => (
                      <tr key={f.id}>
                        <td style={{ fontWeight: 600 }}>{f.week}</td>
                        <td style={{ fontWeight: 500 }}>{f.home_club?.name}</td>
                        <td style={{ fontWeight: 500 }}>{f.away_club?.name}</td>
                        <td style={{ color: "#66707d", fontSize: 13 }}>{f.played_at ? new Date(f.played_at).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" }) : "-"}</td>
                        <td style={{ color: "#66707d", fontSize: 13 }}>{f.venue || "-"}</td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 500, padding: "3px 8px", borderRadius: 6, background: f.status === "completed" ? "#eef7f0" : "#f4f4f1", color: f.status === "completed" ? "#1f6b37" : "#66707d", textTransform: "capitalize" }}>
                            {f.status}
                          </span>
                        </td>
                        <td>
                          <button type="button" onClick={() => deleteFixture(f.id)} style={{ background: "none", border: "none", color: "#a3211a", fontSize: 13, cursor: "pointer", fontFamily: F }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MATCHDAY */}
        {screen === "matchday" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input type="number" value={weekFilter} onChange={e => setWeekFilter(e.target.value)} placeholder="Filter week..." style={{ ...inputSm, width: 140 }} />
              <Btn variant="ghost" onClick={loadFixtures} style={{ padding: "10px 18px" }}>Filter</Btn>
              <span style={{ fontSize: 14, color: "#66707d" }}>Enter scores below. Table updates instantly.</span>
            </div>

            {fixtures.length === 0 && (
              <div className="card" style={{ padding: 48, textAlign: "center", color: "#98a1ab" }}>No fixtures. Add them in the Fixtures tab first.</div>
            )}

            {fixtures.map(f => (
              <MatchdayCard key={f.id} fixture={f} onSave={saveResult} onDelete={deleteResult} />
            ))}
          </div>
        )}

        {/* LEAGUE TABLE */}
        {screen === "table" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Btn variant="ghost" onClick={loadTable} style={{ padding: "10px 18px" }}>Refresh</Btn>
              <span style={{ fontSize: 14, color: "#66707d" }}>Live standings for {activeSeason?.name ?? "active season"}.</span>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "rgba(17,24,39,.03)" }}>
                    <tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th></tr>
                  </thead>
                  <tbody>
                    {table.length === 0 && <tr><td colSpan={10} style={{ textAlign: "center", color: "#98a1ab", padding: 32 }}>No results entered yet.</td></tr>}
                    {table.map((row, i) => (
                      <tr key={row.club_name} style={{ background: i === 0 ? "rgba(31,107,55,.04)" : undefined }}>
                        <td style={{ fontWeight: 700, color: i === 0 ? "#1f6b37" : "#101820" }}>{row.position}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: row.home_color }} />
                            <span style={{ fontWeight: 600 }}>{row.club_name}</span>
                            <span style={{ fontSize: 12, color: "#98a1ab" }}>{row.short_code}</span>
                          </div>
                        </td>
                        <td>{row.played}</td>
                        <td style={{ color: "#1f6b37", fontWeight: 500 }}>{row.won}</td>
                        <td>{row.drawn}</td>
                        <td style={{ color: "#a3211a" }}>{row.lost}</td>
                        <td>{row.goals_for}</td>
                        <td>{row.goals_against}</td>
                        <td style={{ color: Number(row.goal_diff) >= 0 ? "#1f6b37" : "#a3211a", fontWeight: 500 }}>{Number(row.goal_diff) > 0 ? `+${row.goal_diff}` : row.goal_diff}</td>
                        <td style={{ fontWeight: 700, fontSize: 16 }}>{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function MatchdayCard({ fixture, onSave, onDelete }: { fixture: Fixture; onSave: (id: string, h: number, a: number) => void; onDelete: (id: string) => void }) {
  const result = fixture.results?.[0] ?? null;
  const [hs, setHs] = useState(result ? String(result.home_score) : "");
  const [as_, setAs] = useState(result ? String(result.away_score) : "");
  const [busy, setBusy] = useState(false);

  const hasResult = fixture.status === "completed";

  async function save() {
    if (hs === "" || as_ === "") return;
    setBusy(true);
    await onSave(fixture.id, parseInt(hs), parseInt(as_));
    setBusy(false);
  }

  async function remove() {
    if (!confirm("Remove this result?")) return;
    await onDelete(fixture.id);
    setHs(""); setAs("");
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${hasResult ? "rgba(31,107,55,.3)" : "rgba(17,24,39,.10)"}`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#66707d", minWidth: 40 }}>Wk {fixture.week}</div>

      <div style={{ flex: 1, minWidth: 120, textAlign: "right", fontWeight: 600, fontSize: 16 }}>{fixture.home_club?.name}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input type="number" min={0} value={hs} onChange={e => setHs(e.target.value)} className="score-in" placeholder="0" />
        <span style={{ fontWeight: 700, color: "#66707d", fontSize: 18 }}>-</span>
        <input type="number" min={0} value={as_} onChange={e => setAs(e.target.value)} className="score-in" placeholder="0" />
      </div>

      <div style={{ flex: 1, minWidth: 120, fontWeight: 600, fontSize: 16 }}>{fixture.away_club?.name}</div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {hasResult && <span style={{ fontSize: 12, fontWeight: 600, color: "#1f6b37", background: "#eef7f0", padding: "4px 10px", borderRadius: 6 }}>Saved</span>}
        <button type="button" onClick={save} disabled={busy || hs === "" || as_ === ""}
          style={{ background: "#101820", border: "none", color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", borderRadius: 999, cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif", opacity: (busy || hs === "" || as_ === "") ? 0.5 : 1 }}>
          {busy ? "Saving..." : hasResult ? "Update" : "Save"}
        </button>
        {hasResult && (
          <button type="button" onClick={remove} style={{ background: "none", border: "none", color: "#a3211a", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif" }}>Remove</button>
        )}
      </div>

      {fixture.played_at && (
        <div style={{ fontSize: 12, color: "#98a1ab", width: "100%" }}>
          {new Date(fixture.played_at).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })} {fixture.venue ? `· ${fixture.venue}` : ""}
        </div>
      )}
    </div>
  );
}
