"use client";

import { useEffect, useState } from "react";
import LeagueTableSection from "@/components/LeagueTableSection";
import FixturesResultsSection from "@/components/FixturesResultsSection";
import Modal from "@/components/Modal";

const RED = "#e2372b";
const DARK = "#101820";
const BG = "#f4f4f1";
const MUTED = "#66707d";

const HERO_SHOTS = [
  { src: "/gallery/FINAL%20SPL%202025-26/643976200_122200985060559639_8937709693566884101_n.jpg", pos: "center 32%" },
  { src: "/gallery/FINAL%20SPL%202025-26/644055873_122201103818559639_8722394492457535109_n.jpg", pos: "center 38%" },
  { src: "/gallery/FINAL%20SPL%202025-26/644195431_122200984940559639_7106563034665718509_n.jpg", pos: "center 40%" },
  { src: "/gallery/FINAL%20SPL%202025-26/khukuri-final-2.jpg", pos: "center 40%" },
  { src: "/gallery/FINAL%20SPL%202025-26/thuenlam-final-2.jpg", pos: "center 40%" },
  { src: "/gallery/FINAL%20SPL%202025-26/645590660_122201103038559639_895508620839760949_n.jpg", pos: "center 45%" },
];

const CLUBS = [
  { name: "Khukuri FC", crest: "/team/khukuri.png", country: "Nepal" },
  { name: "Thuenlam FC", crest: "/team/thuenlam.png", country: "Bhutan" },
  { name: "Azhas FC", crest: "/team/azhas.png", country: "Bhutan" },
  { name: "Queanbeyan Nepalese United FC", crest: "/team/queanbeyan.png", country: "Nepal" },
  { name: "JA Brothers FC", crest: "/team/JA.png", country: "Nepal" },
  { name: "Everest FC", crest: "/team/everest.png", country: "Nepal" },
  { name: "Phuensum FC", crest: "/team/phuensum.png", country: "Bhutan" },
  { name: "FC Yeedzin", crest: "/team/Yeedzin.png", country: "Bhutan" },
  { name: "ACE FC", crest: "/team/Aces.png", country: "Bhutan" },
  { name: "Bicchi FC", crest: "/team/Bicchi.png", country: "Nepal" },
  { name: "Friends Football Club", crest: "/team/Friends.png", country: "Nepal" },
  { name: "Bros and Ball FC", crest: "/team/BrosnBall.png", country: "Nepal" },
];

const COMMUNITY_PHOTOS = [
  "/gallery/FINAL%20SPL%202025-26/645321343_122201104682559639_8218344547327609707_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/644055873_122201103818559639_8722394492457535109_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/thuenlam-final-2.jpg",
  "/gallery/FINAL%20SPL%202025-26/645045304_122201108054559639_700231387386612553_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/643976200_122200985060559639_8937709693566884101_n.jpg",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

type PreviewDoc = "spl" | "nnyc" | "fixtures" | null;

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [cd, setCd] = useState({ dd: "--", hh: "--", mm: "--", ss: "--" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHub, setShowHub] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PreviewDoc>(null);

  useEffect(() => {
    const interval = setInterval(() => setSlide((s) => (s + 1) % HERO_SHOTS.length), 5200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function tick() {
      const target = new Date("2026-11-14T15:00:00+11:00").getTime();
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      setCd({ dd: pad(d), hh: pad(h), mm: pad(m), ss: pad(s) });
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: BG, fontFamily: "'DM Sans',system-ui,sans-serif", color: DARK, overflowX: "hidden" }}>
      {/* ── HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(244,244,241,.92)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", gap: 32 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, color: DARK, textDecoration: "none" }}>
            <img src="/logo.png" alt="Samsara Group Canberra" style={{ height: 38, width: "auto" }} />
            <span style={{ fontWeight: 500, fontSize: 16, letterSpacing: "-.012em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: MUTED, fontWeight: 500 }}>Canberra</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 28, marginLeft: "auto", fontSize: 15, fontWeight: 400 }} className="spl-nav-desktop">
            <a href="#about" style={{ color: "#445062", textDecoration: "none" }}>About</a>
            <a href="#clubs" style={{ color: "#445062", textDecoration: "none" }}>Clubs</a>
            <a href="#archive" style={{ color: "#445062", textDecoration: "none" }}>Archive</a>
            <a href="#partners" style={{ color: "#445062", textDecoration: "none" }}>Partners</a>
          </nav>
          <a href="/register/team" style={{ background: RED, color: "#fff", fontSize: 14, fontWeight: 500, padding: "12px 22px", borderRadius: 999, whiteSpace: "nowrap", textDecoration: "none" }} className="spl-nav-desktop">
            Register a club
          </a>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}
            className="spl-nav-mobile"
          >
            <span style={{ display: "block", width: 22, height: 2, background: DARK, marginBottom: 5, borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: DARK, marginBottom: 5, borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: DARK, borderRadius: 2 }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "rgba(244,244,241,.98)", borderTop: "1px solid rgba(17,24,39,.10)", padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 12 }} className="spl-nav-mobile">
            {["About", "Clubs", "Archive", "Partners"].map((label) => (
              <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: DARK, fontWeight: 500, fontSize: 16, textDecoration: "none" }}>{label}</a>
            ))}
            <a href="/register/team" style={{ background: RED, color: "#fff", fontSize: 14, fontWeight: 500, padding: "12px 22px", borderRadius: 999, textDecoration: "none", textAlign: "center", marginTop: 8 }}>
              Register a club
            </a>
          </div>
        )}
      </header>

      {/* ── MARQUEE TICKER ── */}
      <div style={{ background: RED, color: "#fff", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", width: "max-content", animation: "spl-marquee 38s linear infinite" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, padding: "9px 20px", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" }}>
              <span>Season 3 kicks off 14 November 2026</span><span style={{ opacity: .5 }}>◆</span>
              <span>Nicholls Synthetic Field, Canberra</span><span style={{ opacity: .5 }}>◆</span>
              <span>Fixtures published after the draw</span><span style={{ opacity: .5 }}>◆</span>
              <span>Invitation-only club registration</span><span style={{ opacity: .5 }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section id="top" style={{ position: "relative", background: BG, color: DARK, minHeight: "min(88vh,860px)", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {HERO_SHOTS.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt=""
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: s.pos,
              opacity: i === slide ? 0.62 : 0,
              transition: "opacity 1.4s ease",
            }}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(244,244,241,.82) 0%,rgba(244,244,241,.46) 30%,rgba(244,244,241,.92) 58%,rgba(244,244,241,1) 76%)" }} />

        <div style={{ position: "relative", width: "100%", maxWidth: 1340, margin: "0 auto", padding: "120px 24px 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(17,24,39,.20)", borderRadius: 999, padding: "7px 16px", fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: DARK }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: RED, animation: "spl-pulse 1.8s ease-in-out infinite", display: "inline-block" }} />
            Samsara Group Canberra presents
          </div>

          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(46px,8vw,124px)", lineHeight: 1.0, letterSpacing: "-.02em", margin: "26px 0 0", textWrap: "balance" as any }}>
            Samsara<br />Premier League
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22, flexWrap: "wrap" as const }}>
            <span style={{ background: RED, color: "#fff", fontWeight: 500, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase" as const, padding: "9px 16px", borderRadius: 6 }}>Season 03 · 2026–27</span>
            <span style={{ fontSize: 15, color: "#4a545f", fontWeight: 400 }}>Run every season since 2024</span>
          </div>

          <p style={{ maxWidth: "56ch", margin: "22px 0 0", fontSize: 18, lineHeight: 1.7, color: "#4a545f" }}>
            Our annual football season, back for a third year. Twelve clubs from Canberra&apos;s Nepalese and Bhutanese communities. One shield.
          </p>

          <div style={{ margin: "48px 0 0", display: "flex", flexWrap: "wrap" as const, gap: "40px 56px", alignItems: "flex-end", justifyContent: "space-between", borderTop: "1px solid rgba(17,24,39,.10)", paddingTop: 32 }}>
            {/* Countdown */}
            <div style={{ flex: "1 1 460px", minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 18 }}>Kick-off in</div>
              <div style={{ display: "flex", gap: "clamp(18px,4vw,52px)", alignItems: "flex-start" }}>
                {[{ val: cd.dd, label: "Days" }, { val: cd.hh, label: "Hours" }, { val: cd.mm, label: "Mins" }, { val: cd.ss, label: "Secs", red: true }].map((unit, idx) => (
                  <>
                    {idx > 0 && <div key={`sep-${idx}`} style={{ fontWeight: 400, fontSize: "clamp(28px,4.6vw,56px)", lineHeight: 1, color: "#d3d7dc" }}>:</div>}
                    <div key={unit.label}>
                      <div style={{ fontWeight: 500, fontSize: "clamp(36px,6.6vw,76px)", lineHeight: .95, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums", color: unit.red ? RED : DARK }}>{unit.val}</div>
                      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: MUTED, marginTop: 8 }}>{unit.label}</div>
                    </div>
                  </>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: 12, paddingBottom: 6, flexWrap: "wrap" as const, flex: "0 0 auto" }}>
              <a href="#about" style={{ background: DARK, color: "#fff", fontSize: 15, fontWeight: 500, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>About the league</a>
              <a href="/register/team" style={{ border: "1px solid rgba(17,24,39,.22)", color: DARK, fontSize: 15, fontWeight: 500, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>Register a club</a>
            </div>
          </div>

          {/* Slide dots */}
          <div style={{ marginTop: 36, display: "flex", gap: 8, alignItems: "center" }}>
            {HERO_SHOTS.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Show photo ${i + 1}`}
                style={{ width: i === slide ? 30 : 14, height: 4, borderRadius: 999, border: 0, padding: 0, cursor: "pointer", background: i === slide ? RED : "rgba(17,24,39,.22)", transition: "width .4s ease, background .4s ease" }}
              />
            ))}
          </div>

          {/* Stats bar */}
          <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", borderTop: "1px solid rgba(17,24,39,.10)" }}>
            {[{ val: "12", label: "Clubs" }, { val: "3rd", label: "Season" }, { val: "3.4", label: "Goals per game" }, { val: "Nicholls", label: "Home ground" }].map((stat) => (
              <div key={stat.label} style={{ padding: "22px 0" }}>
                <div style={{ fontWeight: 500, fontSize: 29, letterSpacing: "-.018em" }}>{stat.val}</div>
                <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" as const, color: MUTED, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section style={{ background: BG, padding: "96px 0 104px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24 }}>
            {/* Announcement card */}
            <article style={{ position: "relative", minHeight: 380, borderRadius: 20, overflow: "hidden", display: "flex", alignItems: "flex-end", color: "#fff" }}>
              <img src="/gallery/FINAL%20SPL%202025-26/khukuri-final-2.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(11,14,17,0) 30%,rgba(11,14,17,.92) 100%)" }} />
              <div style={{ position: "relative", padding: 32 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: "#ff6a5e" }}>Announcement</div>
                <h3 style={{ fontWeight: 500, fontSize: 25, lineHeight: 1.28, letterSpacing: "-.012em", margin: "12px 0 10px" }}>Registration is open</h3>
                <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,.84)", maxWidth: "38ch" }}>Season 3 entry is invitation-only. Clubs receive a code, then register a squad of up to 22 players.</p>
              </div>
            </article>

            {/* Next event card */}
            <article style={{ background: "#fff", border: "1px solid rgba(17,24,39,.09)", color: DARK, borderRadius: 20, padding: 32, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: MUTED }}>Next event</div>
              <h3 style={{ fontWeight: 500, fontSize: 25, lineHeight: 1.28, letterSpacing: "-.012em", margin: "12px 0 0" }}>Season 3 kick-off</h3>
              <div style={{ marginTop: "auto", paddingTop: 28, display: "grid", gap: 14, fontSize: 14, color: MUTED }}>
                {[{ label: "Date", val: "Sat 14 Nov 2026" }, { label: "Venue", val: "Nicholls Synthetic Field" }, { label: "Format", val: "12 clubs, league then finals" }].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(17,24,39,.10)", paddingTop: 14 }}>
                    <span>{row.label}</span><span style={{ color: DARK, fontWeight: 600 }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* Holders card */}
            <article style={{ background: "#fff", border: "1px solid rgba(17,24,39,.09)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: RED }}>Holders</div>
              <h3 style={{ fontWeight: 500, fontSize: 25, lineHeight: 1.28, letterSpacing: "-.012em", margin: "12px 0 0" }}>Khukuri Canberra</h3>
              <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.72, color: MUTED }}>Season 2 champions after beating Thuenlam in the final. Thuenlam took the Running Shield as league-stage winners.</p>
              <img src="/team/khukuri.png" alt="" style={{ width: 96, height: 96, objectFit: "contain", marginTop: "auto", paddingTop: 24 }} />
            </article>
          </div>
        </div>
      </section>

      {/* ── CLUBS ── */}
      <section id="clubs" style={{ background: "#fff", color: DARK, padding: "96px 0 104px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ borderBottom: "1px solid rgba(17,24,39,.10)", paddingBottom: 24, marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: RED }}>The clubs</div>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,50px)", lineHeight: 1.14, letterSpacing: "-.012em", margin: "14px 0 0" }}>Confirmed for Season 3</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 1, background: "rgba(17,24,39,.10)" }}>
            {CLUBS.map((c) => (
              <a key={c.name} href="#clubs" style={{ background: "#fff", padding: "30px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center", color: DARK, textDecoration: "none" }}>
                <img src={c.crest} alt="" style={{ width: 72, height: 72, objectFit: "contain" }} />
                <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{c.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "#98a1ab" }}>{c.country}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHIVE ── */}
      <section id="archive" style={{ background: BG, padding: "96px 0 104px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const, marginBottom: 44 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: RED }}>Season archive</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,50px)", lineHeight: 1.14, letterSpacing: "-.012em", margin: "14px 0 0" }}>Every season, kept</h2>
            </div>
            <p style={{ maxWidth: "34ch", margin: 0, fontSize: 16, lineHeight: 1.72, color: MUTED }}>Final tables, results and honours from past competitions stay live. Nothing gets taken down at season&apos;s end.</p>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            {/* Season 2 hero card */}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,1fr)", background: "#fff", border: "1px solid rgba(17,24,39,.09)", borderRadius: 20, overflow: "hidden", color: DARK, minHeight: 300 }}>
              <div style={{ padding: 40, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 500, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" as const, background: DARK, color: "#fff", padding: "7px 14px", borderRadius: 999 }}>SPL Season 2</span>
                  <span style={{ fontSize: 12, color: MUTED }}>2025–26 · Nicholls</span>
                </div>
                <h3 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(26px,2.9vw,38px)", lineHeight: 1.18, letterSpacing: "-.01em", margin: "24px 0 0" }}>Khukuri Canberra FC</h3>
                <div style={{ fontSize: 14, color: MUTED, marginTop: 10 }}>Champions · beat Thuenlam FC in the final</div>
                <div style={{ marginTop: "auto", paddingTop: 32, display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 20, borderTop: "1px solid rgba(17,24,39,.09)" }}>
                  {[{ label: "Running Shield", val: "Thuenlam FC" }, { label: "Runners-up", val: "Thuenlam FC" }, { label: "Rounds", val: "11" }].map((item) => (
                    <div key={item.label} style={{ paddingTop: 18 }}>
                      <div style={{ fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase" as const, color: MUTED }}>{item.label}</div>
                      <div style={{ fontWeight: 600, marginTop: 6 }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: "relative", minHeight: 260 }}>
                <img src="/gallery/FINAL%20SPL%202025-26/SPL%20Championship%20Trophies.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            {/* Lower archive cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
              <button type="button" onClick={() => setShowHub(true)} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.09)", borderRadius: 20, padding: 32, color: DARK, display: "flex", flexDirection: "column", minHeight: 230, textAlign: "left", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 500, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" as const, border: "1px solid rgba(17,24,39,.18)", padding: "6px 13px", borderRadius: 999 }}>SPL Season 1</span>
                  <span style={{ fontSize: 12, color: MUTED }}>2024–25</span>
                </div>
                <h3 style={{ fontWeight: 500, fontSize: 25, lineHeight: 1.28, letterSpacing: "-.012em", margin: "22px 0 6px" }}>The first season</h3>
                <div style={{ fontSize: 14, color: MUTED }}>Where the league started</div>
                <div style={{ marginTop: "auto", fontSize: 14, fontWeight: 500, color: RED }}>View archive</div>
              </button>

              <button type="button" onClick={() => setShowHub(true)} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.09)", borderRadius: 20, padding: 32, color: DARK, display: "flex", flexDirection: "column", minHeight: 230, textAlign: "left", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontWeight: 500, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" as const, border: "1px solid rgba(17,24,39,.18)", padding: "6px 13px", borderRadius: 999 }}>NNYC 2083</span>
                  <span style={{ fontSize: 12, color: MUTED }}>Apr 2026</span>
                </div>
                <h3 style={{ fontWeight: 500, fontSize: 25, lineHeight: 1.28, letterSpacing: "-.012em", margin: "22px 0 6px" }}>New Year Cup</h3>
                <div style={{ fontSize: 14, color: MUTED }}>16 teams · groups A–D · Nicholls</div>
                <div style={{ marginTop: "auto", fontSize: 14, fontWeight: 500, color: RED }}>View results</div>
              </button>

              <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.09)", color: DARK, borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", minHeight: 230 }}>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: MUTED }}>All-time</div>
                <div style={{ marginTop: 22, display: "grid", gap: 14, fontSize: 14 }}>
                  {[{ label: "Seasons played", val: "2" }, { label: "Matches", val: "45" }, { label: "Goals", val: "155" }].map((row, i) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", ...(i < 2 ? { borderBottom: "1px solid rgba(17,24,39,.10)", paddingBottom: 12 } : {}) }}>
                      <span style={{ color: MUTED }}>{row.label}</span><span style={{ fontWeight: 600 }}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: BG, padding: "0 0 104px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid rgba(17,24,39,.09)" }}>
            <div style={{ position: "relative", minHeight: 320 }}>
              <img src="/gallery/FINAL%20SPL%202025-26/645321343_122201104682559639_8218344547327609707_n.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "44px 40px", display: "flex", flexDirection: "column" }}>
              <img src="/logo.png" alt="Samsara Group Canberra" style={{ height: 46, width: "auto", objectFit: "contain", alignSelf: "flex-start" }} />
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(26px,2.9vw,38px)", lineHeight: 1.22, letterSpacing: "-.01em", margin: "26px 0 0" }}>
                Fostering community,<br />empowering growth
              </h2>
              <p style={{ margin: "18px 0 0", fontSize: 17, lineHeight: 1.72, color: MUTED, maxWidth: "60ch" }}>
                Samsara Group Canberra is a volunteer-led organisation connecting Canberra&apos;s Nepalese and Bhutanese communities through football, culture and events. The Premier League is our flagship competition: one season a year, every year since 2024.
              </p>
              <div style={{ marginTop: "auto", paddingTop: 34, display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 20, borderTop: "1px solid rgba(17,24,39,.09)" }}>
                {[{ val: "2024", label: "First season" }, { val: "2", label: "Seasons played" }, { val: "2", label: "Annual events" }].map((s) => (
                  <div key={s.label} style={{ paddingTop: 18 }}>
                    <div style={{ fontWeight: 500, fontSize: 26, letterSpacing: "-.018em" }}>{s.val}</div>
                    <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase" as const, color: MUTED, marginTop: 5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section id="partners" style={{ background: BG, color: DARK, padding: "96px 0 40px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ borderBottom: "1px solid rgba(17,24,39,.10)", paddingBottom: 24, marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: RED }}>Partners</div>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,50px)", lineHeight: 1.14, letterSpacing: "-.012em", margin: "14px 0 0" }}>Who backs the league</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 1, background: "rgba(17,24,39,.10)", alignItems: "stretch" }}>
            <div style={{ background: "#fff", color: DARK, padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32, minHeight: 230 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: RED }}>Title sponsor</div>
              <img src="/sponsor/sba.png" alt="SBA Property Group" style={{ maxWidth: 260, width: "100%", height: "auto", objectFit: "contain" }} />
              <div style={{ fontSize: 14, color: MUTED }}>SBA Property Group · Season 3 naming partner</div>
            </div>
            <div style={{ background: "#fff", padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: MUTED }}>Major partners</div>
              <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" as const }}>
                {[{ src: "/sponsor/gtm.png", alt: "GTM Facility Services", h: 52 }, { src: "/sponsor/lhotse.png", alt: "Lhotse", h: 44 }].map((sp) => (
                  <div key={sp.src} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.09)", borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "center" }}>
                    <img src={sp.src} alt={sp.alt} style={{ height: sp.h, width: "auto", objectFit: "contain" }} />
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, color: MUTED }}>Matchball and kit partners</div>
            </div>
          </div>

          {/* Community partner marquee */}
          <div style={{ marginTop: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, color: MUTED, marginBottom: 24 }}>Community partners</div>
            <div style={{ overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)" }}>
              <div style={{ display: "flex", width: "max-content", animation: "spl-marquee 34s linear infinite" }}>
                {[0, 1].map((i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, paddingRight: 16 }}>
                    {[
                      { src: "/sponsor/dikshant.png", alt: "Dikshant" },
                      { src: "/sponsor/expert.png", alt: "Expert" },
                      { src: "/sponsor/momo.png", alt: "Momo" },
                      { src: "/sponsor/monkeytemple.png", alt: "Monkey Temple" },
                      { src: "/sponsor/nepalihaat.png", alt: "Nepali Haat" },
                      { src: "/sponsor/ooshman.png", alt: "Ooshman" },
                      { src: "/sponsor/zenith.png", alt: "Zenith" },
                    ].map((sp) => (
                      <div key={sp.src + i} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.09)", borderRadius: 12, height: 78, padding: "0 28px", display: "flex", alignItems: "center" }}>
                        <img src={sp.src} alt={sp.alt} style={{ height: 44, width: "auto", objectFit: "contain" }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTO GRID ── */}
      <section style={{ background: BG, padding: "60px 0 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 2 }}>
          {COMMUNITY_PHOTOS.map((src) => (
            <div key={src} style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden" }}>
              <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── REGISTER CTA ── */}
      <section id="register" style={{ background: RED, color: "#fff", padding: "88px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(30px,4.2vw,52px)", lineHeight: 1.16, letterSpacing: "-.014em", margin: 0 }}>Got an<br />invitation code?</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, maxWidth: "44ch", color: "rgba(255,255,255,.9)" }}>
              Registration for Season 3 is invitation-only. Enter your club&apos;s code to set up your manager account and squad.
            </p>
            <a href="/register/team" style={{ background: "#0b0e11", color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 32px", borderRadius: 999, textDecoration: "none" }}>Start registration</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#fff", color: MUTED, padding: "64px 0 40px", borderTop: "1px solid rgba(17,24,39,.09)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40 }}>
          <div>
            <img src="/logo.png" alt="Samsara Group Canberra" style={{ height: 44, width: "auto", objectFit: "contain", marginBottom: 18 }} />
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.72, maxWidth: "30ch" }}>Fostering community, empowering growth. Canberra, Australia.</p>
          </div>
          <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
            <div style={{ color: DARK, fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, marginBottom: 6 }}>League</div>
            {["About", "Clubs", "Archive"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ color: MUTED, textDecoration: "none" }}>{item}</a>
            ))}
          </div>
          <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
            <div style={{ color: DARK, fontSize: 11, fontWeight: 500, letterSpacing: ".11em", textTransform: "uppercase" as const, marginBottom: 6 }}>Contact</div>
            <a href="mailto:samsaragroup.cbr@gmail.com" style={{ color: MUTED, textDecoration: "none" }}>samsaragroup.cbr@gmail.com</a>
            <a href="tel:+61449981624" style={{ color: MUTED, textDecoration: "none" }}>+61 449 981 624</a>
            <a href="https://www.instagram.com/samsaragroup.cbr" style={{ color: MUTED, textDecoration: "none" }}>@samsaragroup.cbr</a>
          </div>
        </div>
        <div style={{ maxWidth: 1340, margin: "44px auto 0", padding: "24px 24px 0", borderTop: "1px solid rgba(17,24,39,.10)", fontSize: 12, display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" as const }}>
          <span>© 2026 Samsara Group Canberra</span>
          <span>Samsara Premier League · Season 3</span>
        </div>
      </footer>

      {/* ── SEASON HUB MODAL ── */}
      <Modal open={showHub} onClose={() => setShowHub(false)} wide>
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Season hub</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">SPL 2025-26</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Final league table, last season results, match facts, and official competition documents.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setPreviewDoc("spl")} className="button-secondary">SPL rulebook</button>
              <button type="button" onClick={() => setPreviewDoc("nnyc")} className="button-secondary">NNYC rulebook</button>
            </div>
          </div>
          <LeagueTableSection />
          <FixturesResultsSection />
        </div>
      </Modal>

      {/* ── DOCUMENT PREVIEW MODAL ── */}
      <Modal open={previewDoc !== null} onClose={() => setPreviewDoc(null)} wide>
        {previewDoc === "spl" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Document preview</p>
                <h3 className="mt-2 text-2xl font-semibold">SPL Rulebook &amp; Code of Conduct</h3>
              </div>
              <a href="/files/SPL Official Rulebook & Code of Conduct.pdf" target="_blank" rel="noreferrer" className="button-secondary">Open PDF</a>
            </div>
            <iframe src="/files/SPL Official Rulebook & Code of Conduct.pdf" title="SPL rulebook preview" className="h-[72vh] w-full rounded-[1rem] border border-white/10 bg-white" />
          </div>
        )}
        {previewDoc === "nnyc" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Document preview</p>
                <h3 className="mt-2 text-2xl font-semibold">NNYC 2083 Rulebook</h3>
              </div>
              <a href="/files/NNYC 2083 - Rulebook.pdf" target="_blank" rel="noreferrer" className="button-secondary">Open PDF</a>
            </div>
            <iframe src="/files/NNYC 2083 - Rulebook.pdf" title="NNYC rulebook preview" className="h-[72vh] w-full rounded-[1rem] border border-white/10 bg-white" />
          </div>
        )}
      </Modal>

      <style>{`
        @keyframes spl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes spl-pulse { 0%,100% { opacity:1; } 50% { opacity:.25; } }
        .spl-nav-desktop { display: flex !important; }
        .spl-nav-mobile { display: none !important; }
        @media (max-width: 767px) {
          .spl-nav-desktop { display: none !important; }
          .spl-nav-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
