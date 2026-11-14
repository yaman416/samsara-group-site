"use client";
import { useState, useEffect, useCallback } from "react";
import { LEAGUE_TZ, toLeagueInput, fromLeagueInput } from "@/lib/utils";
import MatchdayScreen from "./MatchdayScreen";
import { formatPlayerName } from "@/lib/playerName";

const ADMIN_KEY = "spl_admin";

type Screen = "invites" | "clubs" | "squads" | "fixtures" | "matchday" | "table" | "emails";
type Reg = {
  club: { id: string; name: string; short_code: string; community: string; logo_url: string | null; home_color: string; away_color: string };
  manager_email: string | null;
  invite: { manager_email: string; used: boolean; used_at: string | null; created_at: string } | null;
  player_count: number;
  missing_dob: number;
  registration: { id: string; status: string; submitted_at: string; reviewed_at: string | null; reviewer_notes: string | null } | null;
};
type Invite ={ id: string; code: string; club_name: string; manager_email: string; season: number; used: boolean; created_at: string };
type Club = { id: string; name: string; short_code: string; community: string; home_color: string; away_color: string; home_ground: string; founded: number | null; manager_id: string | null; logo_url?: string | null };
type Player = { id: string; full_name: string; jersey_number: number; position: string; date_of_birth: string | null };
type Season = { id: string; name: string; year: number; is_active: boolean; squad_deadline: string | null };
type Fixture = {
  id: string; season_id?: string; week: number; venue: string | null; played_at: string | null; status: string;
  home_club: { id: string; name: string; short_code: string };
  away_club: { id: string; name: string; short_code: string };
  results: { home_score: number; away_score: number }[] | { home_score: number; away_score: number } | null;
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

const F = "'DM Sans',system-ui,sans-serif";
const label11: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d", marginBottom: 6 };
const inputSm: React.CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid rgba(17,24,39,.18)", borderRadius: 10, fontSize: 16, padding: "10px 13px", color: "#101820", fontFamily: F, background: "#fff" };

function Btn({ variant = "dark", children, style, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "dark" | "ghost" | "red" | "green" }) {
  const variants: Record<string, React.CSSProperties> = {
    dark:  { background: "#101820", color: "#fff", border: 0 },
    red:   { background: "#cf2e24", color: "#fff", border: 0 },
    green: { background: "#1f6b37", color: "#fff", border: 0 },
    ghost: { background: "none",    color: "#101820", border: "1px solid rgba(17,24,39,.18)" },
  };
  return (
    <button type="button" style={{ fontFamily: F, fontSize: 14, fontWeight: 500, padding: "10px 20px", borderRadius: 999, cursor: "pointer", ...variants[variant], ...(props.disabled ? { opacity: 0.6 } : {}), ...style }} {...props}>
      {children}
    </button>
  );
}

export default function AdminPage() {
  // Read the stored key after mount so the server and first client render match.
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthed(!!localStorage.getItem(ADMIN_KEY));
    setAuthChecked(true);
  }, []);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [screen, setScreen] = useState<Screen>("matchday");
  const [moreOpen, setMoreOpen] = useState(false);

  const [, setSeasons] = useState<Season[]>([]);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);

  const [deadlineInput, setDeadlineInput] = useState("");
  const [deadlineMsg, setDeadlineMsg] = useState("");

  type Subscriber = { id: string; email: string; subscribed_at: string };
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");

  const [invites, setInvites] = useState<Invite[]>([]);
  const [newClubId, setNewClubId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [, setNewCommunity] = useState<"Nepalese" | "Bhutanese">("Nepalese");
  const [invBusy, setInvBusy] = useState(false);
  const [invMsg, setInvMsg] = useState("");

  const [clubs, setClubs] = useState<Club[]>([]);
  const [editClub, setEditClub] = useState<Club | null>(null);
  const [editClubBusy, setEditClubBusy] = useState(false);
  const [editClubMsg, setEditClubMsg] = useState("");
  const [authUsers, setAuthUsers] = useState<{ id: string; email: string }[]>([]);
  const [clubPlayers, setClubPlayers] = useState<Player[]>([]);
  const [clubPlayersId, setClubPlayersId] = useState<string | null>(null);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [playerBusy, setPlayerBusy] = useState(false);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ full_name: "", jersey_number: "", position: "MF", date_of_birth: "" });

  const [regs, setRegs] = useState<Reg[]>([]);
  const [regNote, setRegNote] = useState<Record<string, string>>({});
  const [regBusy, setRegBusy] = useState<string | null>(null);
  const [regsError, setRegsError] = useState("");

  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [weekPick, setWeekPick] = useState<number | "all" | null>(null);
  const [changeTime, setChangeTime] = useState<{ id: string; time: string; busy: boolean; msg: string } | null>(null);
  const [changedId, setChangedId] = useState<string | null>(null);
  const [armDelete, setArmDelete] = useState<string | null>(null);
  const [approveAllOpen, setApproveAllOpen] = useState(false);
  const [approveMsg, setApproveMsg] = useState("");
  const [fixBusy, setFixBusy] = useState(false);
  const [nfOpen, setNfOpen] = useState(false);
  const [nfWeek, setNfWeek] = useState("");
  const [nfHome, setNfHome] = useState("");
  const [nfAway, setNfAway] = useState("");
  const [nfVenue, setNfVenue] = useState("");
  const [nfDate, setNfDate] = useState("");

  type EditFixture = { id: string; week: string; home_club_id: string; away_club_id: string; venue: string; played_at: string };
  const [editFixture, setEditFixture] = useState<EditFixture | null>(null);
  const [editFixBusy, setEditFixBusy] = useState(false);

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
  const loadRegs         = useCallback(async () => {
    const r = await api("/api/admin/registrations");
    if (r.ok) { setRegs(await r.json()); setRegsError(""); }
    else { const d = await r.json().catch(() => ({})); setRegsError(d.error || `Error ${r.status}`); }
  }, []);
  const loadSubscribers  = useCallback(async () => { const r = await api("/api/admin/email"); if (r.ok) setSubscribers(await r.json()); }, []);
  const loadClubs    = useCallback(async () => { const r = await api("/api/admin/clubs"); if (r.ok) setClubs(await r.json()); }, []);
  const loadAuthUsers = useCallback(async () => { const r = await api("/api/admin/users"); if (r.ok) setAuthUsers(await r.json()); }, []);
  const loadFixtures = useCallback(async () => {
    const r = await api("/api/admin/fixtures");
    if (r.ok) setFixtures(await r.json());
  }, []);
  const loadTable = useCallback(async () => {
    const url = activeSeason ? `/api/admin/league-table?season_id=${activeSeason.id}` : "/api/admin/league-table";
    const r = await api(url);
    if (r.ok) setTable(await r.json());
  }, [activeSeason]);

  /* eslint-disable react-hooks/set-state-in-effect -- these effects fetch data for the open screen */
  useEffect(() => { if (authed) { loadSeasons(); loadClubs(); loadAuthUsers(); loadRegs(); } }, [authed, loadSeasons, loadClubs, loadAuthUsers, loadRegs]);
  useEffect(() => {
    if (!authed) return;
    if (screen === "invites")  loadInvites();
    if (screen === "clubs")    loadClubs();
    if (screen === "squads")   loadRegs();
    if (screen === "emails")   loadSubscribers();
    if (screen === "fixtures") loadFixtures();
    if (screen === "table")    loadTable();
  }, [authed, screen, loadInvites, loadRegs, loadClubs, loadFixtures, loadTable, loadSubscribers]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function login() {
    if (!pw.trim()) return;
    const res = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: pw.trim() }) });
    if (!res.ok) { setPwError("Invalid key."); return; }
    localStorage.setItem(ADMIN_KEY, pw.trim());
    setAuthed(true);
  }

  async function createInvite() {
    const selectedClub = clubs.find(c => c.id === newClubId);
    if (!selectedClub) { setInvMsg("Select a club."); return; }
    if (!newEmail.trim()) { setInvMsg("Manager email required."); return; }
    setInvBusy(true); setInvMsg("");
    const res = await api("/api/admin/invite", { method: "POST", body: JSON.stringify({ clubName: selectedClub.name, clubShortCode: selectedClub.short_code, managerEmail: newEmail.trim(), season: activeSeason?.year ?? 3, community: selectedClub.community }) });
    const data = await res.json();
    setInvBusy(false);
    if (!res.ok) { setInvMsg(data.error || "Failed."); return; }
    if (data.emailWarning) { setInvMsg(`Code: ${data.code} (email failed, copy manually)`); }
    else { setInvMsg(`Invite sent to ${data.managerEmail}`); }
    setNewClubId(""); setNewEmail(""); setNewCommunity("Nepalese"); loadInvites();
  }

  async function deleteInvite(code: string) {
    if (!confirm(`Delete invite ${code}?`)) return;
    await api("/api/admin/invite", { method: "DELETE", body: JSON.stringify({ code }) });
    loadInvites();
  }

  async function saveClub() {
    if (!editClub) return;
    setEditClubBusy(true); setEditClubMsg("");
    const res = await api("/api/admin/clubs", { method: "PATCH", body: JSON.stringify(editClub) });
    setEditClubBusy(false);
    if (res.ok) { setEditClubMsg("Saved."); loadClubs(); setTimeout(() => setEditClubMsg(""), 2000); }
    else { const d = await res.json(); setEditClubMsg(d.error || "Save failed."); }
  }

  async function deleteClub(id: string, name: string) {
    if (!confirm(`Delete ${name} and all their players? This cannot be undone.`)) return;
    await api("/api/admin/clubs", { method: "DELETE", body: JSON.stringify({ id }) });
    setEditClub(null); loadClubs();
  }

  async function loadClubPlayers(clubId: string) {
    setClubPlayersId(clubId);
    const r = await api(`/api/admin/players?club_id=${clubId}`);
    if (r.ok) setClubPlayers(await r.json());
  }

  async function addPlayer() {
    if (!clubPlayersId) return;
    const num = parseInt(newPlayer.jersey_number);
    if (!newPlayer.full_name.trim() || !num) return;
    setPlayerBusy(true);
    await api("/api/admin/players", { method: "POST", body: JSON.stringify({ club_id: clubPlayersId, full_name: newPlayer.full_name.trim(), jersey_number: num, position: newPlayer.position, date_of_birth: newPlayer.date_of_birth || null }) });
    setNewPlayer({ full_name: "", jersey_number: "", position: "MF", date_of_birth: "" });
    setAddPlayerOpen(false);
    setPlayerBusy(false);
    loadClubPlayers(clubPlayersId);
  }

  async function savePlayer() {
    if (!editPlayer) return;
    setPlayerBusy(true);
    await api("/api/admin/players", { method: "PATCH", body: JSON.stringify(editPlayer) });
    setEditPlayer(null); setPlayerBusy(false);
    if (clubPlayersId) loadClubPlayers(clubPlayersId);
  }

  async function deletePlayer(id: string) {
    if (!confirm("Remove this player?")) return;
    await api("/api/admin/players", { method: "DELETE", body: JSON.stringify({ id }) });
    if (clubPlayersId) loadClubPlayers(clubPlayersId);
  }

  async function updateReg(id: string, status: string, note: string) {
    setRegBusy(id);
    await api(`/api/admin/registrations/${id}`, { method: "PATCH", body: JSON.stringify({ status, notes: note || null }) });
    setRegBusy(null);
    loadRegs();
  }

  async function createFixture() {
    if (!nfWeek || !nfHome || !nfAway || !activeSeason) return;
    setFixBusy(true);
    await api("/api/admin/fixtures", { method: "POST", body: JSON.stringify({ season_id: activeSeason.id, week: parseInt(nfWeek), home_club_id: nfHome, away_club_id: nfAway, venue: nfVenue || null, played_at: nfDate ? fromLeagueInput(nfDate) : null }) });
    setFixBusy(false); setNfOpen(false);
    setNfWeek(""); setNfHome(""); setNfAway(""); setNfVenue(""); setNfDate("");
    loadFixtures();
  }

  async function deleteFixture(id: string) {
    if (armDelete !== id) { setArmDelete(id); setTimeout(() => setArmDelete(a => (a === id ? null : a)), 3000); return; }
    setArmDelete(null);
    await api("/api/admin/fixtures", { method: "DELETE", body: JSON.stringify({ id }) });
    loadFixtures();
  }

  // Change only the kick-off time, keeping the same day (Canberra time).
  async function saveChangeTime() {
    if (!changeTime) return;
    const f = fixtures.find(x => x.id === changeTime.id);
    if (!f?.played_at || !/^\d{2}:\d{2}$/.test(changeTime.time)) return;
    setChangeTime({ ...changeTime, busy: true, msg: "" });
    const played_at = fromLeagueInput(`${toLeagueInput(f.played_at).slice(0, 10)}T${changeTime.time}`);
    const r = await api("/api/admin/fixtures", { method: "PATCH", body: JSON.stringify({ id: f.id, played_at }) }).catch(() => null);
    if (!r || !r.ok) { setChangeTime({ ...changeTime, busy: false, msg: "Could not save the new time. Try again." }); return; }
    setChangeTime(null); setChangedId(f.id); setTimeout(() => setChangedId(c => (c === f.id ? null : c)), 4000);
    loadFixtures();
  }

  async function approveAll() {
    const list = regs.filter(r => r.registration?.status === "pending");
    setRegBusy("all"); setApproveMsg("");
    let ok = 0;
    for (const r of list) {
      const res = await api(`/api/admin/registrations/${r.registration!.id}`, { method: "PATCH", body: JSON.stringify({ status: "approved", notes: regNote[r.registration!.id] || null }) }).catch(() => null);
      if (res?.ok) ok++;
    }
    setRegBusy(null); setApproveAllOpen(false);
    setApproveMsg(ok === list.length ? `Approved ${ok} squad${ok === 1 ? "" : "s"}.` : `Approved ${ok} of ${list.length}. Try again for the rest.`);
    loadRegs();
  }

  async function saveEditFixture() {
    if (!editFixture) return;
    setEditFixBusy(true);
    await api("/api/admin/fixtures", { method: "PATCH", body: JSON.stringify({
      id: editFixture.id,
      week: parseInt(editFixture.week),
      home_club_id: editFixture.home_club_id,
      away_club_id: editFixture.away_club_id,
      venue: editFixture.venue || null,
      played_at: editFixture.played_at ? fromLeagueInput(editFixture.played_at) : null,
    }) });
    setEditFixBusy(false);
    setEditFixture(null);
    loadFixtures();
  }

  // Match-day jobs first, pre-season setup after.
  const NAV_GROUPS: { title: string; items: { key: Screen; label: string }[] }[] = [
    { title: "Match day", items: [{ key: "matchday", label: "Today" }, { key: "table", label: "League table" }] },
    { title: "Season setup", items: [{ key: "fixtures", label: "Fixtures" }, { key: "squads", label: "Squads" }, { key: "clubs", label: "Clubs" }, { key: "invites", label: "Invites" }, { key: "emails", label: "Emails" }] },
  ];
  const NAV_ALL = NAV_GROUPS.flatMap(g => g.items);
  const TABS: { key: Screen | "more"; label: string; icon: string }[] = [
    { key: "matchday", label: "Today", icon: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 7v5l3 2" },
    { key: "fixtures", label: "Fixtures", icon: "M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2M4 10h16M9 3v4M15 3v4" },
    { key: "squads", label: "Squads", icon: "M9 5a3 3 0 1 0 0 6a3 3 0 1 0 0-6M3 20c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 15c2 .5 3 2 3 5" },
    { key: "table", label: "Table", icon: "M4 6h16M4 12h16M4 18h10" },
    { key: "more", label: "More", icon: "M5 12h.01M12 12h.01M19 12h.01" },
  ];
  const MORE = NAV_ALL.filter(n => !TABS.some(t => t.key === n.key));
  const pendingRegs = regs.filter(r => r.registration?.status === "pending");
  const pendingSquads = pendingRegs.length;
  // Fixtures screen: active season only, one week at a time (the next week to play by default).
  const seasonFixtures = fixtures.filter(f => !activeSeason || !f.season_id || f.season_id === activeSeason.id);
  const fixWeeks = [...new Set(seasonFixtures.map(f => f.week))].sort((a, b) => a - b);
  const nowIso = new Date().toISOString();
  const defaultWeek = seasonFixtures.filter(f => f.status !== "completed" && (f.played_at ?? "") >= nowIso.slice(0, 10)).sort((a, b) => (a.played_at ?? "").localeCompare(b.played_at ?? ""))[0]?.week ?? fixWeeks[0] ?? "all";
  const shownWeek = weekPick !== null && (weekPick === "all" || fixWeeks.includes(weekPick)) ? weekPick : defaultWeek;
  const shownFixtures = seasonFixtures.filter(f => shownWeek === "all" || f.week === shownWeek)
    .sort((a, b) => (a.played_at ?? "").localeCompare(b.played_at ?? "") || (a.venue ?? "").localeCompare(b.venue ?? ""));
  const weekDate = (w: number) => { const f = seasonFixtures.find(x => x.week === w && x.played_at); return f ? new Date(f.played_at!).toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: LEAGUE_TZ }) : ""; };
  // Kick-off times already used that day, offered as one-tap choices.
  const dayTimes = (f: Fixture) => {
    const day = toLeagueInput(f.played_at).slice(0, 10);
    return [...new Set(seasonFixtures.filter(x => x.played_at && toLeagueInput(x.played_at).slice(0, 10) === day).map(x => toLeagueInput(x.played_at).slice(11, 16)))].sort();
  };
  const fmtTime = (t: string) => { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
  function go(k: Screen) { setScreen(k); setMoreOpen(false); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); }
  function signOut() { localStorage.removeItem(ADMIN_KEY); setAuthed(false); setMoreOpen(false); }

  if (!authChecked) return <div style={{ background: "#f4f4f1", minHeight: "100vh" }} />;

  if (!authed) return (
    <main style={{ background: "#f4f4f1", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F }}>
      <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 40, width: "100%", maxWidth: 380 }}>
        <h1 style={{ fontFamily: "Lora,Georgia,serif", fontSize: 24, fontWeight: 500, margin: "0 0 8px" }}>SPL Admin</h1>
        <div style={{ fontSize: 14, color: "#66707d", marginBottom: 24 }}>Restricted access</div>
        <label htmlFor="admin-key" style={label11}>Admin key</label>
        <input id="admin-key" type="password" value={pw} onChange={e => { setPw(e.target.value); setPwError(""); }} onKeyDown={e => e.key === "Enter" && login()} placeholder="Enter admin key" style={{ ...inputSm, marginBottom: pwError ? 8 : 20 }} autoFocus />
        {pwError && <div style={{ fontSize: 14, color: "#a3211a", marginBottom: 16 }}>{pwError}</div>}
        <Btn variant="dark" onClick={login} style={{ width: "100%" }}>Continue</Btn>
      </div>
    </main>
  );

  return (
    <main style={{ background: "#f4f4f1", fontFamily: F, color: "#101820", minHeight: "100vh" }}>
      <style>{`
        .atbl th { font-size: 11px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: #66707d; padding: 10px 14px; text-align: left; white-space: nowrap; }
        .atbl td { padding: 13px 14px; font-size: 14px; border-top: 1px solid rgba(17,24,39,.07); vertical-align: middle; }
        .atbl tr:hover td { background: rgba(17,24,39,.02); }
        .score-in { width: 48px; border: 1.5px solid rgba(17,24,39,.18); border-radius: 8px; font-size: 16px; font-weight: 600; padding: 6px 8px; text-align: center; font-family: inherit; color: #101820; }
        .score-in:focus { outline: none; border-color: #101820; }
        .card { background: #fff; border: 1px solid rgba(17,24,39,.10); border-radius: 18px; }
        .admin-form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr)); gap: 16px; align-items: end; }
        .admin-pair-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); gap: 14px; }
        .admin-shell { display: block; }
        .admin-side { display: none; }
        .admin-top { position: sticky; top: 0; z-index: 50; background: #101820; height: 48px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .admin-tabs { position: fixed; left: 0; right: 0; bottom: 0; z-index: 70; background: #fff; border-top: 1px solid rgba(17,24,39,.12); display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); padding: 2px 4px calc(4px + env(safe-area-inset-bottom)); }
        .admin-more { position: fixed; left: 0; right: 0; bottom: calc(60px + env(safe-area-inset-bottom)); z-index: 69; background: #fff; border-top: 1px solid rgba(17,24,39,.12); box-shadow: 0 -8px 24px rgba(16,24,32,.12); display: grid; }
        .admin-keypad { bottom: calc(60px + env(safe-area-inset-bottom)) !important; }
        .admin-main { max-width: 1340px; margin: 0 auto; padding: 16px 16px 120px; box-sizing: border-box; }
        @media (min-width: 960px) {
          .admin-shell { display: flex; align-items: flex-start; }
          .admin-side { display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; width: 232px; flex-shrink: 0; box-sizing: border-box; background: #101820; padding: 22px 12px; overflow-y: auto; }
          .admin-top, .admin-tabs, .admin-more { display: none; }
          .admin-keypad { bottom: 0 !important; left: 232px !important; }
          .admin-main { flex: 1; min-width: 0; padding: 32px 32px 96px; }
        }
        @media (max-width: 767px) {
          .card { border-radius: 14px; }
          .admin-pad { padding: 20px !important; }
        }
      `}</style>

      {/* Navigation: sidebar on a laptop, bottom tabs on a phone */}
      <div className="admin-shell">
        <aside className="admin-side" aria-label="Admin menu">
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, padding: "0 10px" }}>SPL Admin</div>
          {activeSeason && <div style={{ color: "#98a1ab", fontSize: 12, padding: "2px 10px 14px" }}>{activeSeason.name}</div>}
          {NAV_GROUPS.map(g => (
            <div key={g.title} style={{ display: "grid", gap: 2, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab", padding: "6px 10px" }}>{g.title}</div>
              {g.items.map(n => (
                <button key={n.key} type="button" onClick={() => go(n.key)} aria-current={screen === n.key ? "page" : undefined}
                  style={{ background: screen === n.key ? "rgba(255,255,255,.14)" : "none", border: "none", color: screen === n.key ? "#fff" : "#c7ccd2", fontSize: 14, fontWeight: screen === n.key ? 600 : 500, padding: "10px", borderRadius: 8, cursor: "pointer", textAlign: "left", fontFamily: F, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {n.label}
                  {n.key === "squads" && pendingSquads > 0 && <span style={{ background: "#c8102e", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "2px 8px" }}>{pendingSquads}</span>}
                </button>
              ))}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <button type="button" onClick={signOut} style={{ background: "none", border: "none", color: "#98a1ab", fontSize: 13, cursor: "pointer", textAlign: "left", padding: 10, fontFamily: F }}>Sign out</button>
        </aside>

        <div className="admin-top">
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>SPL Admin</span>
          <span style={{ color: "#98a1ab", fontSize: 12 }}>{NAV_ALL.find(n => n.key === screen)?.label}{activeSeason ? ` · ${activeSeason.name}` : ""}</span>
        </div>

        <nav className="admin-tabs" aria-label="Admin">
          {TABS.map(t => (
            <button key={t.key} type="button" onClick={() => t.key === "more" ? setMoreOpen(o => !o) : go(t.key)}
              aria-current={screen === t.key ? "page" : undefined}
              style={{ background: "none", border: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 0", minHeight: 52, fontSize: 12, fontFamily: F, cursor: "pointer", fontWeight: (t.key === "more" ? moreOpen || MORE.some(m => m.key === screen) : screen === t.key) ? 700 : 500, color: (t.key === "more" ? moreOpen || MORE.some(m => m.key === screen) : screen === t.key) ? "#101820" : "#5b6470", position: "relative" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={t.icon} /></svg>
              {t.label}
              {t.key === "squads" && pendingSquads > 0 && <span style={{ position: "absolute", top: 2, left: "56%", background: "#c8102e", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 6px" }}>{pendingSquads}</span>}
            </button>
          ))}
        </nav>
        {moreOpen && (
          <div className="admin-more" role="dialog" aria-label="More">
            {MORE.map(m => (
              <button key={m.key} type="button" onClick={() => go(m.key)} style={{ background: screen === m.key ? "#f4f4f1" : "#fff", border: 0, borderBottom: "1px solid rgba(17,24,39,.08)", textAlign: "left", padding: "0 18px", height: 52, fontSize: 16, fontWeight: 600, fontFamily: F, cursor: "pointer", color: "#101820" }}>{m.label}</button>
            ))}
            <button type="button" onClick={signOut} style={{ background: "#fff", border: 0, textAlign: "left", padding: "0 18px", height: 52, fontSize: 16, fontFamily: F, cursor: "pointer", color: "#a3211a" }}>Sign out</button>
          </div>
        )}

      <div className="admin-main">

        {/* INVITES */}
        {screen === "invites" && (
          <div style={{ display: "grid", gap: 20 }}>
            {activeSeason && (
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Squad registration deadline</div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                    <label style={label11}>Deadline date and time (Canberra)</label>
                    <input aria-label="Deadline date and time (Canberra)"
                      type="datetime-local"
                      value={deadlineInput || toLeagueInput(activeSeason.squad_deadline)}
                      onChange={e => setDeadlineInput(e.target.value)}
                      style={inputSm}
                    />
                  </div>
                  <Btn variant="dark" onClick={async () => {
                    const val = deadlineInput || toLeagueInput(activeSeason.squad_deadline);
                    if (!val) return;
                    const res = await api("/api/admin/seasons", { method: "PATCH", body: JSON.stringify({ id: activeSeason.id, squad_deadline: fromLeagueInput(val) }) });
                    if (res.ok) {
                      setDeadlineMsg("Saved.");
                      loadSeasons();
                    } else {
                      setDeadlineMsg("Save failed.");
                    }
                    setTimeout(() => setDeadlineMsg(""), 3000);
                  }}>Save</Btn>
                  {deadlineMsg && <span style={{ fontSize: 13, color: deadlineMsg === "Saved." ? "#1f6b37" : "#a3211a", fontWeight: 500 }}>{deadlineMsg}</span>}
                </div>
                <p style={{ marginTop: 10, fontSize: 13, color: "#98a1ab" }}>After this deadline, managers cannot add, edit, or remove players. Currently active season: {activeSeason.name}.</p>
              </div>
            )}

            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Send team invite</div>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#66707d" }}>Select a club and enter the manager email. An invitation email is sent with a unique code and step-by-step registration guide.</p>
              <div className="admin-form-grid">
                <div>
                  <label style={label11}>Club</label>
                  <select aria-label="Club"
                    value={newClubId}
                    onChange={e => {
                      setNewClubId(e.target.value);
                      const c = clubs.find(cl => cl.id === e.target.value);
                      if (c) setNewCommunity(c.community as "Nepalese" | "Bhutanese");
                    }}
                    style={{ ...inputSm, background: "#fff" }}
                  >
                    <option value="">Select club...</option>
                    {clubs.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.community})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={label11}>Manager email</label>
                  <input aria-label="Manager email" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="manager@example.com" style={inputSm} />
                </div>
                <Btn variant="dark" onClick={createInvite} disabled={invBusy || !newClubId || !newEmail.trim()}>{invBusy ? "Sending..." : "Send invite"}</Btn>
              </div>
              {invMsg && (
                <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: invMsg.includes("Code") ? "#fff9ec" : invMsg.includes("sent") ? "#eef7f0" : "#fdecea", color: invMsg.includes("Code") ? "#8a5a12" : invMsg.includes("sent") ? "#1f6b37" : "#a3211a", fontSize: 14, fontWeight: 500 }}>
                  {invMsg}
                  {invMsg.includes("Code") && (
                    <button type="button" onClick={() => { const code = invMsg.match(/Code: ([^\s(]+)/)?.[1]; if (code) navigator.clipboard.writeText(code); }}
                      style={{ marginLeft: 12, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#8a5a12", fontWeight: 600 }}>Copy code</button>
                  )}
                </div>
              )}
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
                        <td style={{ color: "#66707d", fontSize: 13 }}>{new Date(inv.created_at).toLocaleDateString("en-AU", { timeZone: LEAGUE_TZ })}</td>
                        <td>
                          <button type="button" onClick={() => deleteInvite(inv.code)} style={{ background: "none", border: "none", color: "#a3211a", fontSize: 13, cursor: "pointer", fontFamily: F }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CLUBS */}
        {screen === "clubs" && (
          <div style={{ display: "grid", gap: 20 }}>
            {/* Club list */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "rgba(17,24,39,.03)" }}>
                    <tr><th>Club</th><th>Code</th><th>Community</th><th>Kit</th><th></th></tr>
                  </thead>
                  <tbody>
                    {clubs.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#98a1ab", padding: 32 }}>No clubs yet.</td></tr>}
                    {clubs.map(c => (
                      <tr key={c.id} style={{ background: editClub?.id === c.id ? "#f8f8f6" : undefined }}>
                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                        <td><code style={{ fontFamily: "ui-monospace,monospace", fontSize: 13 }}>{c.short_code}</code></td>
                        <td style={{ color: "#66707d" }}>{c.community}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <div title="Home" style={{ width: 18, height: 18, borderRadius: 4, background: c.home_color, border: "1px solid rgba(17,24,39,.12)" }} />
                            <div title="Away" style={{ width: 18, height: 18, borderRadius: 4, background: c.away_color, border: "1px solid rgba(17,24,39,.12)" }} />
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <Btn variant="ghost" style={{ fontSize: 13, padding: "6px 12px" }} onClick={() => { setEditClub(c); setEditClubMsg(""); setClubPlayersId(null); }}>Edit</Btn>
                            <Btn variant="ghost" style={{ fontSize: 13, padding: "6px 12px" }} onClick={() => loadClubPlayers(c.id)}>Players</Btn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Edit club modal */}
        {editClub && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} onClick={() => setEditClub(null)} />
            <div style={{ position: "relative", background: "#fff", borderRadius: 18, padding: 28, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,.18)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Edit: {editClub.name}</div>
                <Btn variant="ghost" style={{ fontSize: 13, padding: "6px 12px" }} onClick={() => setEditClub(null)}>Close</Btn>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 16 }}>
                <div><label style={label11}>Club name</label><input aria-label="Club name" value={editClub.name} onChange={e => setEditClub(c => c && ({ ...c, name: e.target.value }))} style={inputSm} /></div>
                <div><label style={label11}>Short code</label><input aria-label="Short code" value={editClub.short_code} onChange={e => setEditClub(c => c && ({ ...c, short_code: e.target.value.toUpperCase().slice(0,4) }))} style={inputSm} /></div>
                <div><label style={label11}>Community</label><input aria-label="Community" value={editClub.community} onChange={e => setEditClub(c => c && ({ ...c, community: e.target.value }))} style={inputSm} /></div>
                <div><label style={label11}>Home ground</label><input aria-label="Home ground" value={editClub.home_ground || ""} onChange={e => setEditClub(c => c && ({ ...c, home_ground: e.target.value }))} style={inputSm} /></div>
                <div><label style={label11}>Founded</label><input aria-label="Founded" type="number" value={editClub.founded || ""} onChange={e => setEditClub(c => c && ({ ...c, founded: parseInt(e.target.value) || null }))} style={inputSm} /></div>
                <div>
                  <label style={label11}>Home colour</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="color" value={editClub.home_color} onChange={e => setEditClub(c => c && ({ ...c, home_color: e.target.value }))} style={{ width: 40, height: 38, padding: 2, border: "1px solid rgba(17,24,39,.18)", borderRadius: 8, cursor: "pointer" }} />
                    <input value={editClub.home_color} onChange={e => setEditClub(c => c && ({ ...c, home_color: e.target.value }))} style={{ ...inputSm, flex: 1 }} />
                  </div>
                </div>
                <div>
                  <label style={label11}>Away colour</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="color" value={editClub.away_color || "#ffffff"} onChange={e => setEditClub(c => c && ({ ...c, away_color: e.target.value }))} style={{ width: 40, height: 38, padding: 2, border: "1px solid rgba(17,24,39,.18)", borderRadius: 8, cursor: "pointer" }} />
                    <input value={editClub.away_color || ""} onChange={e => setEditClub(c => c && ({ ...c, away_color: e.target.value }))} style={{ ...inputSm, flex: 1 }} />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={label11}>Club logo</label>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  {editClub.logo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={editClub.logo_url} alt="logo" style={{ width: 56, height: 56, objectFit: "contain", border: "1px solid rgba(17,24,39,.12)", borderRadius: 10 }} />
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file || !editClub) return;
                      const fd = new FormData();
                      fd.append("file", file);
                      fd.append("club_id", editClub.id);
                      setEditClubMsg("Uploading...");
                      const res = await fetch("/api/admin/clubs/logo", { method: "POST", headers: { "x-admin-key": localStorage.getItem("spl_admin") || "" }, body: fd });
                      const d = await res.json();
                      if (res.ok) { setEditClub(c => c && ({ ...c, logo_url: d.logo_url })); setEditClubMsg("Logo uploaded."); loadClubs(); }
                      else { setEditClubMsg(d.error || "Upload failed."); }
                      setTimeout(() => setEditClubMsg(""), 3000);
                    }}
                    style={{ fontSize: 13, color: "#66707d" }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={label11}>Manager (assigned user)</label>
                <select aria-label="Manager (assigned user)"
                  value={editClub.manager_id ?? ""}
                  onChange={e => setEditClub(c => c && ({ ...c, manager_id: e.target.value || null }))}
                  style={{ ...inputSm, background: "#fff" }}
                >
                  <option value="">-- No manager assigned --</option>
                  {authUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.email}</option>
                  ))}
                </select>
              </div>
              {editClubMsg && <div style={{ fontSize: 13, color: editClubMsg === "Saved." || editClubMsg === "Logo uploaded." ? "#1f6b37" : "#a3211a", marginBottom: 12 }}>{editClubMsg}</div>}
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="dark" onClick={saveClub} disabled={editClubBusy}>{editClubBusy ? "Saving..." : "Save changes"}</Btn>
                <Btn variant="red" onClick={() => deleteClub(editClub.id, editClub.name)}>Delete club</Btn>
              </div>
            </div>
          </div>
        )}

        {/* Players modal */}
        {clubPlayersId && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} onClick={() => { setClubPlayersId(null); setAddPlayerOpen(false); setEditPlayer(null); }} />
            <div style={{ position: "relative", background: "#fff", borderRadius: 18, padding: 28, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,.18)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Players: {clubs.find(c => c.id === clubPlayersId)?.name}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn variant="dark" style={{ fontSize: 13, padding: "8px 14px" }} onClick={() => setAddPlayerOpen(o => !o)}>+ Add player</Btn>
                  <Btn variant="ghost" style={{ fontSize: 13, padding: "8px 14px" }} onClick={() => { setClubPlayersId(null); setAddPlayerOpen(false); setEditPlayer(null); }}>Close</Btn>
                </div>
              </div>

              {addPlayerOpen && (
                <div style={{ background: "#f8f8f6", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 12 }}>
                    <div><label style={label11}>Name</label><input aria-label="Name" value={newPlayer.full_name} onChange={e => setNewPlayer(p => ({ ...p, full_name: e.target.value }))} style={inputSm} /></div>
                    <div><label style={label11}>Jersey no.</label><input aria-label="Jersey no." type="number" min={1} max={99} value={newPlayer.jersey_number} onChange={e => setNewPlayer(p => ({ ...p, jersey_number: e.target.value }))} style={inputSm} /></div>
                    <div><label style={label11}>Position</label>
                      <select aria-label="Position" value={newPlayer.position} onChange={e => setNewPlayer(p => ({ ...p, position: e.target.value }))} style={{ ...inputSm, background: "#fff" }}>
                        <option value="GK">Goalkeeper</option><option value="DF">Defender</option><option value="MF">Midfielder</option><option value="FW">Forward</option>
                      </select>
                    </div>
                    <div><label style={label11}>Date of birth</label><input aria-label="Date of birth" type="date" value={newPlayer.date_of_birth} onChange={e => setNewPlayer(p => ({ ...p, date_of_birth: e.target.value }))} style={inputSm} /></div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="dark" onClick={addPlayer} disabled={playerBusy}>{playerBusy ? "Adding..." : "Add"}</Btn>
                    <Btn variant="ghost" onClick={() => setAddPlayerOpen(false)}>Cancel</Btn>
                  </div>
                </div>
              )}

              <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "rgba(17,24,39,.03)" }}><tr><th>No.</th><th>Name</th><th>Position</th><th>DOB</th><th></th></tr></thead>
                <tbody>
                  {clubPlayers.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#98a1ab", padding: 24 }}>No players.</td></tr>}
                  {clubPlayers.map(p => editPlayer?.id === p.id ? (
                    <tr key={p.id} style={{ background: "#fafaf8" }}>
                      <td colSpan={5} style={{ padding: "14px 12px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 10 }}>
                          <div><label style={label11}>Name</label><input aria-label="Name" value={editPlayer.full_name} onChange={e => setEditPlayer(p => p && ({ ...p, full_name: e.target.value }))} style={inputSm} /></div>
                          <div><label style={label11}>Jersey no.</label><input aria-label="Jersey no." type="number" min={1} max={99} value={editPlayer.jersey_number} onChange={e => setEditPlayer(p => p && ({ ...p, jersey_number: parseInt(e.target.value) }))} style={inputSm} /></div>
                          <div><label style={label11}>Position</label>
                            <select aria-label="Position" value={editPlayer.position} onChange={e => setEditPlayer(p => p && ({ ...p, position: e.target.value }))} style={{ ...inputSm, background: "#fff" }}>
                              <option value="GK">Goalkeeper</option><option value="DF">Defender</option><option value="MF">Midfielder</option><option value="FW">Forward</option>
                            </select>
                          </div>
                          <div><label style={label11}>DOB</label><input aria-label="DOB" type="date" value={editPlayer.date_of_birth || ""} onChange={e => setEditPlayer(p => p && ({ ...p, date_of_birth: e.target.value || null }))} style={inputSm} /></div>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <Btn variant="dark" onClick={savePlayer} disabled={playerBusy}>{playerBusy ? "Saving..." : "Save"}</Btn>
                          <Btn variant="ghost" onClick={() => setEditPlayer(null)}>Cancel</Btn>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={p.id}>
                      <td><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6, background: "#101820", color: "#fff", fontSize: 13, fontWeight: 600 }}>{p.jersey_number}</span></td>
                      <td style={{ fontWeight: 500 }}>{formatPlayerName(p.full_name)}</td>
                      <td><span style={{ background: "rgba(17,24,39,.07)", borderRadius: 6, padding: "3px 8px", fontSize: 12, fontWeight: 500 }}>{p.position}</span></td>
                      <td style={{ color: "#66707d", fontSize: 13 }}>{p.date_of_birth || "-"}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <Btn variant="ghost" style={{ fontSize: 12, padding: "5px 10px" }} onClick={() => setEditPlayer(p)}>Edit</Btn>
                          <Btn variant="ghost" style={{ fontSize: 12, padding: "5px 10px", color: "#a3211a" }} onClick={() => deletePlayer(p.id)}>Remove</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SQUADS */}
        {screen === "squads" && (
          <div style={{ display: "grid", gap: 16 }}>
            {regsError && (
              <div className="card" style={{ padding: 20, color: "#a3211a" }}>Could not load registrations: {regsError}</div>
            )}
            {!regsError && regs.length === 0 && (
              <div className="card" style={{ padding: 48, textAlign: "center", color: "#98a1ab" }}>No clubs in the active season.</div>
            )}
            {regs.length > 0 && (() => {
              const registered = regs.filter(r => r.manager_email).length;
              const submitted = regs.filter(r => r.registration).length;
              const approved = regs.filter(r => r.registration?.status === "approved").length;
              const totalPlayers = regs.reduce((n, r) => n + r.player_count, 0);
              return (
                <div className="card" style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16 }}>
                  {[["Clubs", regs.length], ["Registered", registered], ["Squads submitted", submitted], ["Approved", approved], ["Players", totalPlayers]].map(([k, v]) => (
                    <div key={k as string}><div style={label11}>{k}</div><div style={{ fontSize: 24, fontWeight: 600 }}>{v}</div></div>
                  ))}
                </div>
              );
            })()}
            {pendingRegs.length > 0 && (
              <div className="card" style={{ padding: 20, display: "grid", gap: 12, background: "#101820", color: "#fff", border: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{pendingRegs.length} squad{pendingRegs.length === 1 ? "" : "s"} submitted and waiting for approval</div>
                {approveAllOpen && (
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, color: "#dfe3e7", display: "grid", gap: 4 }}>
                    {pendingRegs.map(r => <li key={r.club.id}>{r.club.name} · {r.player_count} player{r.player_count === 1 ? "" : "s"}</li>)}
                  </ul>
                )}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  {approveAllOpen ? (
                    <>
                      <Btn variant="green" disabled={regBusy === "all"} onClick={approveAll}>{regBusy === "all" ? "Approving..." : `Approve these ${pendingRegs.length}`}</Btn>
                      <Btn variant="ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }} onClick={() => setApproveAllOpen(false)}>Cancel</Btn>
                    </>
                  ) : (
                    <Btn variant="ghost" style={{ background: "#fff", color: "#101820", border: 0, fontWeight: 600 }} onClick={() => setApproveAllOpen(true)}>Review and approve all</Btn>
                  )}
                  {approveMsg && <span role="status" style={{ fontSize: 13, color: "#dfe3e7" }}>{approveMsg}</span>}
                </div>
              </div>
            )}
            {pendingRegs.length === 0 && approveMsg && <div role="status" style={{ fontSize: 14, color: "#1f6b37", fontWeight: 600 }}>{approveMsg}</div>}
            {regs.map(row => {
              const { club, registration: reg } = row;
              const statusColors: Record<string, { bg: string; color: string }> = {
                pending:           { bg: "#eff6ff", color: "#1e40af" },
                approved:          { bg: "#eef7f0", color: "#1f6b37" },
                changes_requested: { bg: "#fff6ec", color: "#8a5a12" },
                rejected:          { bg: "#fdecea", color: "#a3211a" },
              };
              const stage = reg ? reg.status.replace("_", " ")
                : row.manager_email ? (row.player_count > 0 ? "squad in progress" : "registered, no players")
                : row.invite ? "invited, not registered"
                : "not invited";
              const sc = reg ? statusColors[reg.status] ?? { bg: "#f4f4f1", color: "#66707d" } : { bg: "#f4f4f1", color: "#66707d" };
              return (
                <div key={club.id} className="card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: reg || row.manager_email ? 16 : 0 }}>
                    {club.logo_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={club.logo_url} alt="" width={40} height={40} style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }} />
                      : <div style={{ width: 40, height: 40, borderRadius: 8, background: club.home_color, flexShrink: 0 }} />}
                    <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{club.name}</div>
                      <div style={{ fontSize: 13, color: "#66707d", marginTop: 2 }}>
                        {row.manager_email ?? (row.invite ? `Invite sent to ${row.invite.manager_email} on ${new Date(row.invite.created_at).toLocaleDateString("en-AU", { timeZone: LEAGUE_TZ })}` : "No invite sent")}
                      </div>
                      <div style={{ fontSize: 12, color: "#98a1ab", marginTop: 2 }}>
                        {row.player_count} player{row.player_count === 1 ? "" : "s"}
                        {row.missing_dob > 0 && <span style={{ color: "#8a5a12" }}> · {row.missing_dob} missing date of birth</span>}
                        {reg && <> · Submitted {new Date(reg.submitted_at).toLocaleDateString("en-AU", { timeZone: LEAGUE_TZ })}</>}
                      </div>
                    </div>
                    <span style={{ background: sc.bg, color: sc.color, borderRadius: 8, padding: "5px 14px", fontSize: 13, fontWeight: 500, textTransform: "capitalize", whiteSpace: "nowrap" }}>
                      {stage}
                    </span>
                    {row.player_count > 0 && (
                      <Btn variant="ghost" style={{ fontSize: 13, padding: "8px 14px" }} onClick={() => loadClubPlayers(club.id)}>View squad</Btn>
                    )}
                  </div>
                  {reg?.reviewer_notes && (
                    <div style={{ background: "#f8f8f6", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#4a545f", marginBottom: 14 }}>
                      <span style={{ fontWeight: 500 }}>Note: </span>{reg.reviewer_notes}
                    </div>
                  )}
                  {reg && (
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <label style={label11}>Note to manager (optional)</label>
                        <input aria-label="Note to manager (optional)"
                          value={regNote[reg.id] ?? ""}
                          onChange={e => setRegNote(n => ({ ...n, [reg.id]: e.target.value }))}
                          placeholder="Reason or instructions..."
                          style={inputSm}
                        />
                      </div>
                      <Btn variant="green" disabled={regBusy === reg.id} onClick={() => updateReg(reg.id, "approved", regNote[reg.id] ?? "")}>Approve</Btn>
                      <Btn variant="ghost" disabled={regBusy === reg.id} onClick={() => updateReg(reg.id, "changes_requested", regNote[reg.id] ?? "")}>Request changes</Btn>
                      <Btn variant="red" disabled={regBusy === reg.id} onClick={() => updateReg(reg.id, "rejected", regNote[reg.id] ?? "")}>Reject</Btn>
                    </div>
                  )}
                  {!reg && row.manager_email && (
                    <div style={{ fontSize: 13, color: "#66707d" }}>
                      The manager has not pressed Submit squad yet. Approval opens once they submit (at least 11 players).
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* FIXTURES */}
        {screen === "fixtures" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, flex: 1 }}>Fixtures</h2>
              <Btn variant="dark" onClick={() => setNfOpen(o => !o)}>+ Add fixture</Btn>
            </div>

            {nfOpen && (
              <div className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>New fixture</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16 }}>
                  <div><label style={label11}>Week</label><input aria-label="Week" type="number" value={nfWeek} onChange={e => setNfWeek(e.target.value)} style={inputSm} /></div>
                  <div>
                    <label style={label11}>Home club</label>
                    <select aria-label="Home club" value={nfHome} onChange={e => setNfHome(e.target.value)} style={inputSm}>
                      <option value="">Select...</option>
                      {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label11}>Away club</label>
                    <select aria-label="Away club" value={nfAway} onChange={e => setNfAway(e.target.value)} style={inputSm}>
                      <option value="">Select...</option>
                      {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div><label style={label11}>Venue</label><input aria-label="Venue" value={nfVenue} onChange={e => setNfVenue(e.target.value)} placeholder="Nicholls Oval" style={inputSm} /></div>
                  <div><label style={label11}>Date and time (Canberra)</label><input aria-label="Date and time (Canberra)" type="datetime-local" value={nfDate} onChange={e => setNfDate(e.target.value)} style={inputSm} /></div>
                </div>
                <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
                  <Btn variant="ghost" onClick={() => setNfOpen(false)}>Cancel</Btn>
                  <Btn variant="dark" onClick={createFixture} disabled={fixBusy}>{fixBusy ? "Saving..." : "Add fixture"}</Btn>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} role="group" aria-label="Weeks">
              {fixWeeks.map(w => (
                <button key={w} type="button" onClick={() => setWeekPick(w)} aria-pressed={shownWeek === w}
                  style={{ height: 40, padding: "0 14px", borderRadius: 999, border: shownWeek === w ? 0 : "1px solid rgba(17,24,39,.15)", background: shownWeek === w ? "#101820" : "#fff", color: shownWeek === w ? "#fff" : "#101820", fontSize: 13, fontWeight: shownWeek === w ? 600 : 500, cursor: "pointer", fontFamily: F }}>
                  Wk {w}{weekDate(w) ? ` · ${weekDate(w)}` : ""}
                </button>
              ))}
              {fixWeeks.length > 1 && (
                <button type="button" onClick={() => setWeekPick("all")} aria-pressed={shownWeek === "all"}
                  style={{ height: 40, padding: "0 14px", borderRadius: 999, border: shownWeek === "all" ? 0 : "1px solid rgba(17,24,39,.15)", background: shownWeek === "all" ? "#101820" : "#fff", color: shownWeek === "all" ? "#fff" : "#101820", fontSize: 13, cursor: "pointer", fontFamily: F }}>All</button>
              )}
            </div>

            {seasonFixtures.length === 0 && <div className="card" style={{ padding: 40, textAlign: "center", color: "#66707d" }}>No fixtures yet.</div>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,340px),1fr))", gap: 12 }}>
              {shownFixtures.map(f => {
                const res = Array.isArray(f.results) ? f.results[0] : f.results;
                const done = f.status === "completed";
                const ct = changeTime?.id === f.id ? changeTime : null;
                return (
                  <div key={f.id} className="card" style={{ padding: "14px 16px", display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>
                        {f.played_at ? new Date(f.played_at).toLocaleString("en-AU", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: LEAGUE_TZ }) : "Date TBC"}
                        <span style={{ fontWeight: 400, color: "#66707d" }}>{f.venue ? ` · ${f.venue}` : ""}</span>
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 6, whiteSpace: "nowrap", background: done ? "#eef7f0" : "#f4f4f1", color: done ? "#1f6b37" : "#5b6470" }}>{done && res ? `FT ${res.home_score}-${res.away_score}` : `Week ${f.week}`}</span>
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>{f.home_club?.name} v {f.away_club?.name}</div>
                    {ct ? (
                      <div style={{ display: "grid", gap: 10, background: "#f8f8f6", borderRadius: 12, padding: 12 }}>
                        <div style={{ fontSize: 13, color: "#4a545f" }}>Same day, new kick-off time (Canberra time)</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          {dayTimes(f).map(t => (
                            <button key={t} type="button" onClick={() => setChangeTime({ ...ct, time: t })}
                              style={{ height: 44, padding: "0 14px", borderRadius: 10, border: ct.time === t ? 0 : "1px solid rgba(17,24,39,.2)", background: ct.time === t ? "#101820" : "#fff", color: ct.time === t ? "#fff" : "#101820", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: F }}>{fmtTime(t)}</button>
                          ))}
                          <input aria-label="Other time" type="time" value={ct.time} onChange={e => setChangeTime({ ...ct, time: e.target.value })} style={{ ...inputSm, width: 130, padding: "8px 10px" }} />
                        </div>
                        {ct.msg && <div role="status" style={{ fontSize: 13, color: "#a3211a" }}>{ct.msg}</div>}
                        <div style={{ display: "flex", gap: 8 }}>
                          <Btn variant="green" disabled={ct.busy || !ct.time} onClick={saveChangeTime}>{ct.busy ? "Saving..." : `Save ${ct.time ? fmtTime(ct.time) : ""}`}</Btn>
                          <Btn variant="ghost" onClick={() => setChangeTime(null)}>Cancel</Btn>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        {f.played_at && <Btn variant="ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setChangeTime({ id: f.id, time: toLeagueInput(f.played_at).slice(11, 16), busy: false, msg: "" })}>Change time</Btn>}
                        <Btn variant="ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setEditFixture({ id: f.id, week: String(f.week), home_club_id: f.home_club?.id ?? "", away_club_id: f.away_club?.id ?? "", venue: f.venue ?? "", played_at: toLeagueInput(f.played_at) })}>Edit</Btn>
                        {changedId === f.id && <span role="status" style={{ fontSize: 13, color: "#1f6b37", fontWeight: 600 }}>Time saved</span>}
                        <button type="button" onClick={() => deleteFixture(f.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#a3211a", fontSize: 13, fontWeight: armDelete === f.id ? 700 : 500, cursor: "pointer", fontFamily: F, minHeight: 40 }}>{armDelete === f.id ? "Tap again to delete" : "Delete"}</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>


            {/* Edit fixture modal */}
            {editFixture && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                <div className="card" style={{ padding: 28, width: "100%", maxWidth: 560 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Edit fixture</div>
                  <div className="admin-pair-grid">
                    <div><label style={label11}>Week</label><input aria-label="Week" type="number" value={editFixture.week} onChange={e => setEditFixture(x => x && ({ ...x, week: e.target.value }))} style={inputSm} /></div>
                    <div><label style={label11}>Date and time (Canberra)</label><input aria-label="Date and time (Canberra)" type="datetime-local" value={editFixture.played_at} onChange={e => setEditFixture(x => x && ({ ...x, played_at: e.target.value }))} style={inputSm} /></div>
                    <div>
                      <label style={label11}>Home team</label>
                      <select aria-label="Home team" value={editFixture.home_club_id} onChange={e => setEditFixture(x => x && ({ ...x, home_club_id: e.target.value }))} style={inputSm}>
                        {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={label11}>Away team</label>
                      <select aria-label="Away team" value={editFixture.away_club_id} onChange={e => setEditFixture(x => x && ({ ...x, away_club_id: e.target.value }))} style={inputSm}>
                        {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}><label style={label11}>Venue</label><input aria-label="Venue" value={editFixture.venue} onChange={e => setEditFixture(x => x && ({ ...x, venue: e.target.value }))} placeholder="Nicholls Oval" style={inputSm} /></div>
                  </div>
                  <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                    <Btn variant="ghost" onClick={() => setEditFixture(null)}>Cancel</Btn>
                    <Btn variant="dark" onClick={saveEditFixture} disabled={editFixBusy}>{editFixBusy ? "Saving..." : "Save"}</Btn>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MATCHDAY */}
        {screen === "matchday" && <MatchdayScreen />}

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

        {screen === "emails" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Subscribers</div>
              <div style={{ fontSize: 13, color: "#66707d", marginBottom: 16 }}>{subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}</div>
              {subscribers.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <table className="atbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "rgba(17,24,39,.03)" }}>
                      <tr><th>Email</th><th>Subscribed</th><th></th></tr>
                    </thead>
                    <tbody>
                      {subscribers.map(s => (
                        <tr key={s.id}>
                          <td>{s.email}</td>
                          <td style={{ color: "#66707d", fontSize: 13 }}>{new Date(s.subscribed_at).toLocaleDateString("en-AU", { timeZone: LEAGUE_TZ })}</td>
                          <td><button type="button" onClick={async () => { if (!confirm("Remove subscriber?")) return; await api("/api/admin/email", { method: "DELETE", body: JSON.stringify({ id: s.id }) }); loadSubscribers(); }} style={{ background: "none", border: "none", color: "#a3211a", fontSize: 13, cursor: "pointer", fontFamily: F }}>Remove</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Send email blast</div>
              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <label style={label11}>Subject</label>
                  <input aria-label="Subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Season 3 update" style={inputSm} />
                </div>
                <div>
                  <label style={label11}>Message (HTML allowed)</label>
                  <textarea aria-label="Message (HTML allowed)"
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                    placeholder="<p>Hello everyone...</p>"
                    rows={8}
                    style={{ ...inputSm, resize: "vertical", fontFamily: "ui-monospace,monospace", fontSize: 13 }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Btn variant="dark" disabled={emailBusy || !emailSubject || !emailBody} onClick={async () => {
                    if (!emailSubject || !emailBody) return;
                    setEmailBusy(true); setEmailMsg("");
                    const res = await api("/api/admin/email", { method: "POST", body: JSON.stringify({ subject: emailSubject, body: emailBody }) });
                    const data = await res.json();
                    setEmailBusy(false);
                    if (res.ok) setEmailMsg(`Sent to ${data.sent} subscriber${data.sent !== 1 ? "s" : ""}${data.failed ? `, ${data.failed} failed` : ""}.`);
                    else setEmailMsg(data.error ?? "Send failed.");
                  }}>{emailBusy ? "Sending..." : `Send to ${subscribers.length} subscriber${subscribers.length !== 1 ? "s" : ""}`}</Btn>
                  {emailMsg && <span style={{ fontSize: 13, color: emailMsg.includes("failed") || emailMsg.includes("error") || emailMsg.includes("failed") ? "#a3211a" : "#1f6b37", fontWeight: 500 }}>{emailMsg}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      </div>
    </main>
  );
}
