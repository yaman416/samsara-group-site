"use client";
import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "spl_admin";

type Screen = "invites" | "regs" | "clubs" | "fixtures";
type RegStatus = "pending" | "approved" | "changes" | "rejected";

type Invite = { id: string; code: string; club_name: string; manager_email: string; season: number; used: boolean; created_at: string };
type Reg = { id: string; status: RegStatus; reviewer_notes: string | null; created_at: string; clubs: { name: string; community: string } | null };
type Club = { id: string; name: string; short_code: string; community: string; player_count?: number };
type Fixture = { id: string; week: number; home_club_id: string; away_club_id: string; home_score: number | null; away_score: number | null; played_at: string | null; venue: string | null };

function adminHeader() { return { "Content-Type": "application/json", "x-admin-key": typeof window !== "undefined" ? (localStorage.getItem(ADMIN_KEY) || "") : "" }; }

async function adminFetch(path: string, opts: RequestInit = {}) {
  return fetch(path, { ...opts, headers: { ...adminHeader(), ...(opts.headers as Record<string,string> ?? {}) } });
}

const STATUS_COLORS: Record<RegStatus, string> = {
  pending: "#8a5a12", approved: "#1f6b37", changes: "#1e40af", rejected: "#a3211a",
};
const STATUS_BG: Record<RegStatus, string> = {
  pending: "#fff6ec", approved: "#eef7f0", changes: "#eff6ff", rejected: "#fdecea",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [screen, setScreen] = useState<Screen>("invites");

  // invites
  const [invites, setInvites] = useState<Invite[]>([]);
  const [newClub, setNewClub] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [invBusy, setInvBusy] = useState(false);
  const [invMsg, setInvMsg] = useState("");

  // regs
  const [regs, setRegs] = useState<Reg[]>([]);
  const [openReg, setOpenReg] = useState<Reg | null>(null);
  const [regNote, setRegNote] = useState("");
  const [regBusy, setRegBusy] = useState(false);

  // clubs
  const [clubs, setClubs] = useState<Club[]>([]);

  // fixtures
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [weekFilter, setWeekFilter] = useState("");
  const [fixBusy, setFixBusy] = useState(false);

  // new fixture form
  const [nfWeek, setNfWeek] = useState("");
  const [nfHome, setNfHome] = useState("");
  const [nfAway, setNfAway] = useState("");
  const [nfVenue, setNfVenue] = useState("");
  const [nfDate, setNfDate] = useState("");
  const [nfOpen, setNfOpen] = useState(false);

  const loadInvites = useCallback(async () => {
    const res = await adminFetch("/api/admin/invite");
    if (res.ok) setInvites(await res.json());
  }, []);

  const loadRegs = useCallback(async () => {
    const res = await adminFetch("/api/admin/registrations");
    if (res.ok) setRegs(await res.json());
  }, []);

  const loadClubs = useCallback(async () => {
    const res = await adminFetch("/api/admin/clubs");
    if (res.ok) setClubs(await res.json());
  }, []);

  const loadFixtures = useCallback(async () => {
    const url = weekFilter ? `/api/admin/fixtures?week=${weekFilter}` : "/api/admin/fixtures";
    const res = await adminFetch(url);
    if (res.ok) setFixtures(await res.json());
  }, [weekFilter]);

  useEffect(() => {
    if (!authed) return;
    if (screen === "invites") loadInvites();
    if (screen === "regs") loadRegs();
    if (screen === "clubs") loadClubs();
    if (screen === "fixtures") loadFixtures();
  }, [authed, screen, loadInvites, loadRegs, loadClubs, loadFixtures]);

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
    const res = await adminFetch("/api/admin/invite", { method: "POST", body: JSON.stringify({ clubName: newClub.trim(), managerEmail: newEmail.trim() || "noemail@placeholder.com", season: 3 }) });
    const data = await res.json();
    setInvBusy(false);
    if (!res.ok) { setInvMsg(data.error || "Failed."); return; }
    setInvMsg(`Code created: ${data.code}`);
    setNewClub(""); setNewEmail("");
    loadInvites();
  }

  async function deleteInvite(code: string) {
    if (!confirm(`Delete invite ${code}?`)) return;
    await adminFetch("/api/admin/invite", { method: "DELETE", body: JSON.stringify({ code }) });
    loadInvites();
  }

  async function updateReg(id: string, status: RegStatus) {
    setRegBusy(true);
    await adminFetch(`/api/admin/registrations/${id}`, { method: "PATCH", body: JSON.stringify({ status, reviewer_notes: regNote }) });
    setRegBusy(false);
    setOpenReg(null);
    loadRegs();
  }

  async function createFixture() {
    if (!nfWeek || !nfHome || !nfAway) return;
    setFixBusy(true);
    await adminFetch("/api/admin/fixtures", { method: "POST", body: JSON.stringify({ week: parseInt(nfWeek), home_club_id: nfHome, away_club_id: nfAway, venue: nfVenue || null, played_at: nfDate || null }) });
    setFixBusy(false); setNfOpen(false);
    loadFixtures();
  }

  async function updateScore(id: string, homeScore: number, awayScore: number) {
    await adminFetch("/api/admin/fixtures", { method: "PATCH", body: JSON.stringify({ id, home_score: homeScore, away_score: awayScore }) });
    loadFixtures();
  }

  const label11 = { display: "block" as const, fontSize: 11, fontWeight: 500 as const, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#66707d", marginBottom: 6 };
  const inputSm = { width: "100%", boxSizing: "border-box" as const, border: "1px solid rgba(17,24,39,.18)", borderRadius: 10, fontSize: 14, padding: "10px 13px", color: "#101820", fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff" };
  const btn = (variant: "dark" | "ghost" | "red" = "dark") => ({
    fontFamily: "'DM Sans',system-ui,sans-serif", border: variant === "ghost" ? "1px solid rgba(17,24,39,.18)" : 0,
    background: variant === "dark" ? "#101820" : variant === "red" ? "#e2372b" : "none",
    color: variant === "ghost" ? "#101820" : "#fff", fontSize: 14, fontWeight: 500 as const, padding: "10px 20px", borderRadius: 999, cursor: "pointer",
  });

  if (!authed) return (
    <div style={{ background: "#f4f4f1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 40, width: "100%", maxWidth: 380 }}>
        <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Admin access</div>
        <label style={label11}>Admin key</label>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError(""); }} onKeyDown={e => e.key === "Enter" && login()} placeholder="Enter admin key" style={{ ...inputSm, marginBottom: pwError ? 8 : 20 }} />
        {pwError && <div style={{ fontSize: 14, color: "#a3211a", marginBottom: 16 }}>{pwError}</div>}
        <button type="button" onClick={login} style={{ ...btn("dark"), width: "100%" }}>Continue</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f4f4f1", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#101820", minHeight: "100vh" }}>
      <style>{`
        .atbl th { font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: #66707d; padding: 10px 14px; text-align: left; }
        .atbl td { padding: 13px 14px; font-size: 14px; border-top: 1px solid rgba(17,24,39,.07); vertical-align: middle; }
        .score-input { width: 44px; border: 1px solid rgba(17,24,39,.18); border-radius: 8px; font-size: 15px; font-weight: 600; padding: 6px 8px; text-align: center; font-family: inherit; }
      `}</style>

      {/* Topbar */}
      <div style={{ background: "#101820", padding: "0 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 52 }}>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>SPL Admin</span>
          <div style={{ display: "flex", gap: 4 }}>
            {(["invites","regs","clubs","fixtures"] as Screen[]).map(s => (
              <button key={s} type="button" onClick={() => setScreen(s)}
                style={{ background: screen === s ? "rgba(255,255,255,.12)" : "none", border: "none", color: screen === s ? "#fff" : "#98a1ab", fontSize: 13, fontWeight: 500, padding: "8px 14px", borderRadius: 8, cursor: "pointer", textTransform: "capitalize" }}>
                {s === "regs" ? "Registrations" : s === "invites" ? "Invites" : s === "clubs" ? "Clubs" : "Fixtures"}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { localStorage.removeItem(ADMIN_KEY); setAuthed(false); }}
            style={{ background: "none", border: "none", color: "#98a1ab", fontSize: 13, cursor: "pointer" }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 96px" }}>

        {/* INVITES */}
        {screen === "invites" && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 28 }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>Create invite</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "end" }}>
                <div>
                  <label style={label11}>Club name</label>
                  <input value={newClub} onChange={e => setNewClub(e.target.value)} placeholder="Nepal United FC" style={inputSm} />
                </div>
                <div>
                  <label style={label11}>Manager email (optional)</label>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="manager@club.au" style={inputSm} />
                </div>
                <button type="button" onClick={createInvite} disabled={invBusy} style={{ ...btn("dark"), whiteSpace: "nowrap" as const }}>
                  {invBusy ? "Creating..." : "Generate code"}
                </button>
              </div>
              {invMsg && <div style={{ marginTop: 12, fontSize: 14, color: invMsg.includes("Code") ? "#1f6b37" : "#a3211a" }}>{invMsg}</div>}
              <p style={{ marginTop: 12, fontSize: 13, color: "#98a1ab" }}>Email sending disabled. Share the code manually with the club rep. Enable Resend before launch.</p>
            </div>

            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden", overflowX: "auto" }}>
              <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "rgba(17,24,39,.03)" }}>
                  <tr><th>Code</th><th>Club</th><th>Email</th><th>Season</th><th>Used</th><th>Created</th><th></th></tr>
                </thead>
                <tbody>
                  {invites.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: "center", color: "#98a1ab", padding: "32px" }}>No invites yet.</td></tr>
                  )}
                  {invites.map(inv => (
                    <tr key={inv.id}>
                      <td><code style={{ fontFamily: "ui-monospace,monospace", fontSize: 13, background: "#f4f4f1", padding: "3px 8px", borderRadius: 6 }}>{inv.code}</code></td>
                      <td style={{ fontWeight: 500 }}>{inv.club_name}</td>
                      <td style={{ color: "#66707d" }}>{inv.manager_email || "-"}</td>
                      <td>{inv.season}</td>
                      <td>
                        <span style={{ background: inv.used ? "#eef7f0" : "#f4f4f1", color: inv.used ? "#1f6b37" : "#66707d", borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 500 }}>
                          {inv.used ? "Used" : "Available"}
                        </span>
                      </td>
                      <td style={{ color: "#66707d", fontSize: 13 }}>{new Date(inv.created_at).toLocaleDateString("en-AU")}</td>
                      <td style={{ textAlign: "right" }}>
                        {!inv.used && (
                          <button type="button" onClick={() => deleteInvite(inv.code)} style={{ ...btn("ghost"), fontSize: 13, padding: "6px 12px" }}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REGISTRATIONS */}
        {screen === "regs" && (
          <div style={{ display: "grid", gap: 24 }}>
            {openReg && (
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{openReg.clubs?.name}</div>
                  <button type="button" onClick={() => setOpenReg(null)} style={{ ...btn("ghost"), fontSize: 13, padding: "6px 14px" }}>Close</button>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={label11}>Reviewer notes</label>
                  <textarea value={regNote} onChange={e => setRegNote(e.target.value)} rows={4} placeholder="Optional notes for the club..." style={{ ...inputSm, resize: "vertical" as const }} />
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(["approved","changes","rejected"] as RegStatus[]).map(s => (
                    <button key={s} type="button" disabled={regBusy} onClick={() => updateReg(openReg.id, s)}
                      style={{ ...btn(s === "rejected" ? "red" : s === "approved" ? "dark" : "ghost"), opacity: regBusy ? 0.7 : 1 }}>
                      {s === "approved" ? "Approve" : s === "changes" ? "Request changes" : "Reject"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden", overflowX: "auto" }}>
              <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "rgba(17,24,39,.03)" }}>
                  <tr><th>Club</th><th>Community</th><th>Status</th><th>Submitted</th><th></th></tr>
                </thead>
                <tbody>
                  {regs.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: "center", color: "#98a1ab", padding: "32px" }}>No registrations submitted yet.</td></tr>
                  )}
                  {regs.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500 }}>{r.clubs?.name || "-"}</td>
                      <td style={{ color: "#66707d" }}>{r.clubs?.community || "-"}</td>
                      <td>
                        <span style={{ background: STATUS_BG[r.status], color: STATUS_COLORS[r.status], borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ color: "#66707d", fontSize: 13 }}>{new Date(r.created_at).toLocaleDateString("en-AU")}</td>
                      <td style={{ textAlign: "right" }}>
                        <button type="button" onClick={() => { setOpenReg(r); setRegNote(r.reviewer_notes || ""); }} style={{ ...btn("ghost"), fontSize: 13, padding: "6px 14px" }}>Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CLUBS */}
        {screen === "clubs" && (
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden", overflowX: "auto" }}>
            <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "rgba(17,24,39,.03)" }}>
                <tr><th>Club</th><th>Code</th><th>Community</th><th>Players</th></tr>
              </thead>
              <tbody>
                {clubs.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "#98a1ab", padding: "32px" }}>No clubs registered yet.</td></tr>
                )}
                {clubs.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td><code style={{ fontFamily: "ui-monospace,monospace", fontSize: 13 }}>{c.short_code}</code></td>
                    <td style={{ color: "#66707d" }}>{c.community}</td>
                    <td>{c.player_count ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FIXTURES */}
        {screen === "fixtures" && (
          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label style={{ ...label11, marginBottom: 0 }}>Week</label>
                <input type="number" value={weekFilter} onChange={e => setWeekFilter(e.target.value)} placeholder="All" style={{ ...inputSm, width: 80 }} />
                <button type="button" onClick={loadFixtures} style={{ ...btn("ghost"), padding: "10px 16px" }}>Filter</button>
              </div>
              <button type="button" onClick={() => setNfOpen(o => !o)} style={{ ...btn("dark"), marginLeft: "auto" }}>+ Add fixture</button>
            </div>

            {nfOpen && (
              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 28 }}>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 20 }}>New fixture</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16 }}>
                  <div><label style={label11}>Week</label><input type="number" value={nfWeek} onChange={e => setNfWeek(e.target.value)} style={inputSm} /></div>
                  <div>
                    <label style={label11}>Home club</label>
                    <select value={nfHome} onChange={e => setNfHome(e.target.value)} style={{ ...inputSm }}>
                      <option value="">Select...</option>
                      {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label11}>Away club</label>
                    <select value={nfAway} onChange={e => setNfAway(e.target.value)} style={{ ...inputSm }}>
                      <option value="">Select...</option>
                      {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label style={label11}>Venue</label><input value={nfVenue} onChange={e => setNfVenue(e.target.value)} placeholder="Oval name" style={inputSm} /></div>
                  <div><label style={label11}>Date / time</label><input type="datetime-local" value={nfDate} onChange={e => setNfDate(e.target.value)} style={inputSm} /></div>
                </div>
                <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
                  <button type="button" onClick={() => setNfOpen(false)} style={{ ...btn("ghost") }}>Cancel</button>
                  <button type="button" onClick={createFixture} disabled={fixBusy} style={{ ...btn("dark"), opacity: fixBusy ? 0.7 : 1 }}>
                    {fixBusy ? "Saving..." : "Add fixture"}
                  </button>
                </div>
              </div>
            )}

            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden", overflowX: "auto" }}>
              <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "rgba(17,24,39,.03)" }}>
                  <tr><th>Wk</th><th>Home</th><th>Score</th><th>Away</th><th>Date</th><th>Venue</th></tr>
                </thead>
                <tbody>
                  {fixtures.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: "center", color: "#98a1ab", padding: "32px" }}>No fixtures yet.</td></tr>
                  )}
                  {fixtures.map(f => (
                    <FixtureRow key={f.id} f={f} clubs={clubs} onSave={updateScore} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FixtureRow({ f, clubs, onSave }: { f: Fixture; clubs: Club[]; onSave: (id: string, h: number, a: number) => void }) {
  const [hs, setHs] = useState(f.home_score != null ? String(f.home_score) : "");
  const [as_, setAs] = useState(f.away_score != null ? String(f.away_score) : "");
  const home = clubs.find(c => c.id === f.home_club_id);
  const away = clubs.find(c => c.id === f.away_club_id);

  return (
    <tr>
      <td>{f.week}</td>
      <td style={{ fontWeight: 500 }}>{home?.name || f.home_club_id}</td>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input type="number" min={0} value={hs} onChange={e => setHs(e.target.value)} className="score-input" />
          <span style={{ color: "#66707d", fontWeight: 500 }}>-</span>
          <input type="number" min={0} value={as_} onChange={e => setAs(e.target.value)} className="score-input" />
          <button type="button" onClick={() => onSave(f.id, parseInt(hs) || 0, parseInt(as_) || 0)}
            style={{ background: "#101820", border: "none", color: "#fff", fontSize: 13, fontWeight: 500, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
            Save
          </button>
        </div>
      </td>
      <td style={{ fontWeight: 500 }}>{away?.name || f.away_club_id}</td>
      <td style={{ color: "#66707d", fontSize: 13 }}>{f.played_at ? new Date(f.played_at).toLocaleDateString("en-AU") : "-"}</td>
      <td style={{ color: "#66707d", fontSize: 13 }}>{f.venue || "-"}</td>
    </tr>
  );
}
