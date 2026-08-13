"use client";

import { useEffect, useState } from "react";
import LeagueTableSection from "@/components/LeagueTableSection";
import FixturesResultsSection from "@/components/FixturesResultsSection";
import Modal from "@/components/Modal";

const RED = "#e2372b";
const DARK = "#101820";
const BG = "#f4f4f1";
const MUTED = "#66707d";
const DARK_MUTED = "#98a1ab";

// Photo paths — mapped from design assets to local public folder
const P = {
  final1: "/gallery/FINAL%20SPL%202025-26/643976200_122200985060559639_8937709693566884101_n.jpg",
  final4: "/gallery/FINAL%20SPL%202025-26/644055873_122201103818559639_8722394492457535109_n.jpg",
  final5: "/gallery/FINAL%20SPL%202025-26/644195431_122200984940559639_7106563034665718509_n.jpg",
  final6: "/gallery/FINAL%20SPL%202025-26/645045304_122201108054559639_700231387386612553_n.jpg",
  final7: "/gallery/FINAL%20SPL%202025-26/645321343_122201104682559639_8218344547327609707_n.jpg",
  khukuri2: "/gallery/FINAL%20SPL%202025-26/khukuri-final-2.jpg",
  thuenlam2: "/gallery/FINAL%20SPL%202025-26/thuenlam-final-2.jpg",
  celebration: "/gallery/FINAL%20SPL%202025-26/645590660_122201103038559639_895508620839760949_n.jpg",
};

const HERO_SHOTS = [
  { src: P.final1, pos: "center 32%", alt: "Khukuri Canberra celebrate the final" },
  { src: P.final4, pos: "center 38%", alt: "Champions lift the SPL trophy" },
  { src: P.final6, pos: "center 40%", alt: "Khukuri Canberra FC receive the winners cheque" },
  { src: P.khukuri2, pos: "center 40%", alt: "Khukuri Canberra on finals day" },
  { src: P.thuenlam2, pos: "center 40%", alt: "Thuenlam FC on finals day" },
  { src: P.final7, pos: "center 45%", alt: "Supporters on the sideline at Nicholls" },
];

const CLUBS = [
  { name: "Khukuri FC", crest: "/team/Khukuri.png" },
  { name: "Thuenlam FC", crest: "/team/Thuenlam.png" },
  { name: "Azhas FC", crest: "/team/azhas.png" },
  { name: "Queanbeyan Nepalese United FC", crest: "/team/Queanbeyan.png" },
  { name: "JA Brothers FC", crest: "/team/JA.png" },
  { name: "Everest FC", crest: "/team/Everest.png" },
  { name: "Phuensum FC", crest: "/team/phuensum.png" },
  { name: "FC Yeedzin", crest: "/team/Yeedzin.png" },
  { name: "ACE FC", crest: "/team/Aces.png" },
  { name: "Bicchi FC", crest: "/team/Bicchi.png" },
  { name: "Friends Football Club", crest: "/team/Friends.png" },
  { name: "Bros and Ball FC", crest: "/team/BrosnBall.png" },
];

const FAQS = [
  { q: "Who can enter Season 3?", a: "Entry is invitation-only. Clubs receive a code from Samsara Group, then register a manager account online." },
  { q: "How many players can a squad hold?", a: "Up to 22 players. Each player needs a name and a jersey number, and no two players in a squad can share a number." },
  { q: "Where are matches played?", a: "Nicholls Synthetic Field in Canberra, the same ground used for Season 2 and the Nepalese New Year Cup." },
  { q: "When does Season 3 start?", a: "Saturday 14 November 2026. The full fixture list is published once all squads are approved." },
  { q: "What is the Running Shield?", a: "It goes to the club that finishes top of the league stage. The champions are decided separately, in the final." },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [cd, setCd] = useState({ dd: "--", hh: "--", mm: "--", ss: "--" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number>(-1);
  const [showHub, setShowHub] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<"spl" | "nnyc" | null>(null);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SHOTS.length), 5200);
    return () => clearInterval(id);
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
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: BG, fontFamily: "'DM Sans',system-ui,sans-serif", color: DARK, overflowX: "hidden" }}>

      {/* ── TOP UTILITY BAR ── */}
      <div style={{ background: DARK, color: DARK_MUTED, fontSize: 13 }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "10px 24px", display: "flex", flexWrap: "wrap" as const, gap: "12px 28px", alignItems: "center" }}>
          <a href="mailto:samsaragroup.cbr@gmail.com" style={{ color: DARK_MUTED, textDecoration: "none" }}>samsaragroup.cbr@gmail.com</a>
          <a href="tel:+61449981624" style={{ color: DARK_MUTED, textDecoration: "none" }}>+61 449 981 624</a>
          <span style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
            <a href="https://www.instagram.com/samsaragroup.cbr" style={{ color: DARK_MUTED, textDecoration: "none" }}>Instagram</a>
            <a href="https://www.facebook.com" style={{ color: DARK_MUTED, textDecoration: "none" }}>Facebook</a>
            <a href="https://www.youtube.com/@SamsaraGroupCanberra" style={{ color: DARK_MUTED, textDecoration: "none" }}>YouTube</a>
          </span>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(244,244,241,.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", height: 76, display: "flex", alignItems: "center", gap: 32 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, color: DARK, textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo.png" alt="Samsara Group Canberra" style={{ height: 40, width: "auto" }} />
            <span style={{ fontWeight: 500, fontSize: 16, letterSpacing: "-.012em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: MUTED }}>Canberra</span>
            </span>
          </a>

          {/* Desktop nav — centered */}
          <nav className="spl-desktop" style={{ display: "flex", alignItems: "center", gap: 28, margin: "0 auto", fontSize: 15, fontWeight: 400 }}>
            <a href="/" style={{ color: DARK, textDecoration: "none", borderBottom: `2px solid ${RED}`, paddingBottom: 4 }}>Home</a>
            <a href="/season" style={{ color: "#4a545f", textDecoration: "none" }}>Season 3</a>
            <a href="/clubs" style={{ color: "#4a545f", textDecoration: "none" }}>Clubs</a>
            <a href="/gallery" style={{ color: "#4a545f", textDecoration: "none" }}>Gallery</a>
            <a href="/partners" style={{ color: "#4a545f", textDecoration: "none" }}>Partners</a>
          </nav>

          <a href="/register/team" className="spl-desktop" style={{ background: RED, color: "#fff", fontSize: 14, fontWeight: 500, padding: "13px 24px", borderRadius: 999, whiteSpace: "nowrap", textDecoration: "none", flexShrink: 0 }}>
            Register a club
          </a>

          {/* Hamburger */}
          <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu" className="spl-mobile" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 8, display: "none", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "block", width: 22, height: 2, background: DARK, borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: DARK, borderRadius: 2 }} />
            <span style={{ display: "block", width: 22, height: 2, background: DARK, borderRadius: 2 }} />
          </button>
        </div>

        {menuOpen && (
          <div className="spl-mobile" style={{ background: "rgba(244,244,241,.98)", borderTop: "1px solid rgba(17,24,39,.10)", padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {[["Home", "/"], ["Season 3", "/season"], ["Clubs", "/clubs"], ["Gallery", "/gallery"], ["Partners", "/partners"]].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ color: DARK, fontWeight: 500, fontSize: 16, textDecoration: "none" }}>{label}</a>
            ))}
            <a href="/register/team" style={{ background: RED, color: "#fff", fontSize: 14, fontWeight: 500, padding: "12px 22px", borderRadius: 999, textDecoration: "none", textAlign: "center", marginTop: 4 }}>Register a club</a>
          </div>
        )}
      </header>

      {/* ── HERO — dark centered ── */}
      <section id="top" style={{ position: "relative", minHeight: "min(86vh,820px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", background: DARK }}>
        {HERO_SHOTS.map((s, i) => (
          <img key={s.src} src={s.src} alt={s.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos, opacity: i === slide ? 0.55 : 0, transition: "opacity 1.4s ease" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(16,24,32,.72) 0%,rgba(16,24,32,.42) 45%,rgba(16,24,32,.86) 100%)" }} />

        <div style={{ position: "relative", width: "100%", maxWidth: 900, padding: "120px 24px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,.34)", borderRadius: 999, padding: "8px 18px", fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: RED, animation: "spl-pulse 1.8s ease-in-out infinite", display: "inline-block" }} />
            Samsara Group Canberra presents
          </div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(42px,6.4vw,86px)", lineHeight: 1.06, letterSpacing: "-.02em", margin: "26px 0 0", textWrap: "balance" as any }}>
            Samsara Premier League
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, flexWrap: "wrap" as const, justifyContent: "center" }}>
            <span style={{ background: RED, color: "#fff", fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, padding: "9px 16px", borderRadius: 6 }}>Season 03 · 2026–27</span>
            <span style={{ fontSize: 15, color: "rgba(255,255,255,.82)" }}>Kick-off Saturday 14 November 2026</span>
          </div>
          <p style={{ maxWidth: "56ch", margin: "22px 0 0", fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,.86)" }}>
            Our annual football season, back for a third year. Twelve clubs from Canberra&apos;s Nepalese and Bhutanese communities. One shield.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, justifyContent: "center", marginTop: 34 }}>
            <a href="#register" style={{ background: RED, color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>Register a club</a>
            <a href="#about" style={{ border: "1px solid rgba(255,255,255,.42)", color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>About the league</a>
          </div>

          {/* Slide dots */}
          <div style={{ marginTop: 38, display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
            {HERO_SHOTS.map((s, i) => (
              <button key={s.src} type="button" onClick={() => setSlide(i)} aria-label={`Photo ${i + 1}`}
                style={{ width: i === slide ? 30 : 14, height: 4, borderRadius: 999, border: 0, padding: 0, cursor: "pointer", background: i === slide ? RED : "rgba(255,255,255,.34)", transition: "width .4s ease, background .4s ease" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: RED, color: "#fff", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", width: "max-content", animation: "spl-marquee 38s linear infinite" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 40, padding: "12px 20px", fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const }}>
              <span>Season 3 kicks off 14 November 2026</span><span style={{ opacity: .5 }}>◆</span>
              <span>Nicholls Synthetic Field, Canberra</span><span style={{ opacity: .5 }}>◆</span>
              <span>Twelve clubs confirmed</span><span style={{ opacity: .5 }}>◆</span>
              <span>Invitation-only club registration</span><span style={{ opacity: .5 }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── COUNTDOWN ── */}
      <section style={{ background: "#fff", padding: "88px 0", borderTop: "1px solid rgba(17,24,39,.08)", borderBottom: "1px solid rgba(17,24,39,.08)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: RED }}>Countdown</div>
          <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(28px,3.4vw,42px)", lineHeight: 1.2, letterSpacing: "-.012em", margin: "16px 0 44px" }}>Season 3 starts in</h2>
          <div style={{ display: "flex", gap: "clamp(20px,5vw,72px)", alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap" as const }}>
            {[{ val: cd.dd, label: "Days" }, { val: cd.hh, label: "Hours" }, { val: cd.mm, label: "Mins" }, { val: cd.ss, label: "Secs", red: true }].map((u) => (
              <div key={u.label}>
                <div style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 500, lineHeight: .95, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums", color: u.red ? RED : DARK }}>{u.val}</div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: MUTED, marginTop: 10 }}>{u.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, fontSize: 15, color: MUTED }}>Saturday 14 November 2026 · Nicholls Synthetic Field, Canberra</div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: BG, padding: "104px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: RED }}>About Samsara Group</div>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,50px)", lineHeight: 1.14, letterSpacing: "-.012em", margin: "16px 0 0" }}>Fostering community, empowering growth</h2>
            <p style={{ margin: "22px 0 0", fontSize: 17, lineHeight: 1.72, color: "#4a545f", maxWidth: "58ch" }}>
              Samsara Group Canberra is a volunteer-led organisation connecting Canberra&apos;s Nepalese and Bhutanese communities through football, culture and events. The Premier League is our flagship competition, run once a year, every year since 2024.
            </p>
            <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 24, borderTop: "1px solid rgba(17,24,39,.10)", paddingTop: 26 }}>
              {[{ val: "2024", label: "First season" }, { val: "45", label: "Matches played" }, { val: "155", label: "Goals scored" }].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: 29, fontWeight: 500, letterSpacing: "-.018em" }}>{s.val}</div>
                  <div style={{ fontSize: 11, letterSpacing: ".11em", textTransform: "uppercase" as const, color: MUTED, marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <a href="#clubs" style={{ display: "inline-block", marginTop: 34, background: DARK, color: "#fff", fontSize: 15, fontWeight: 500, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>Meet the clubs</a>
          </div>

          <div>
            <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", minHeight: 420 }}>
              <img src={P.final6} alt="Khukuri Canberra FC receive the Season 2 winners cheque" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ background: RED, color: "#fff", borderRadius: 14, marginTop: -46, marginLeft: 32, marginRight: 32, position: "relative", padding: "26px 30px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18, flexWrap: "wrap" as const }}>
              <span style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: 40, lineHeight: 1 }}>$4,000</span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,.92)" }}>champions prize, presented by<br />SBA Property Group</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLUBS — dark ── */}
      <section id="clubs" style={{ background: DARK, color: "#fff", padding: "88px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const, marginBottom: 44 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: RED }}>The twelve</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.14, letterSpacing: "-.012em", margin: "16px 0 0" }}>Clubs confirmed for Season 3</h2>
            </div>
            <a href="#clubs" style={{ border: "1px solid rgba(255,255,255,.34)", color: "#fff", fontSize: 15, fontWeight: 500, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>All twelve clubs</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 14 }}>
            {CLUBS.map((c) => (
              <div key={c.name} style={{ background: "#161f28", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "22px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center", color: "#fff" }}>
                <img src={c.crest} alt="" style={{ width: 52, height: 52, objectFit: "contain" }} />
                <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW THE SEASON RUNS ── */}
      <section style={{ background: BG, padding: "104px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 56, alignItems: "center" }}>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", minHeight: 440 }}>
            <img src={P.final4} alt="Champions lift the Samsara Premier League trophy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: RED }}>How the season runs</div>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.14, letterSpacing: "-.012em", margin: "16px 0 0" }}>One season a year, run properly</h2>
            <div style={{ marginTop: 36, display: "grid", gap: 0 }}>
              {[
                { n: "01", title: "Invitation-only entry", body: "Clubs receive a code, then register a manager account and squad online." },
                { n: "02", title: "League stage", body: "Every club plays the field. The team top of the table takes the Running Shield." },
                { n: "03", title: "Finals", body: "The season closes with a final at Nicholls, and the champions prize presented on the day." },
              ].map((step, i) => (
                <div key={step.n} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 22, padding: "24px 0", borderTop: "1px solid rgba(17,24,39,.10)", ...(i === 2 ? { borderBottom: "1px solid rgba(17,24,39,.10)" } : {}) }}>
                  <span style={{ fontFamily: "Lora,Georgia,serif", fontSize: 20, color: RED }}>{step.n}</span>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.008em" }}>{step.title}</div>
                    <p style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.72, color: "#4a545f", maxWidth: "52ch" }}>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HONOURS BOARD ── */}
      <section style={{ position: "relative", padding: "120px 0", overflow: "hidden" }}>
        <img src={P.khukuri2} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(16,24,32,.76)" }} />
        <div style={{ position: "relative", maxWidth: 1340, margin: "0 auto", padding: "0 24px", color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#ff6a5e" }}>Season 2 · 2025–26</div>
          <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,50px)", lineHeight: 1.16, letterSpacing: "-.012em", margin: "16px auto 0", maxWidth: "20ch" }}>The honours board</h2>
          <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              { crest: "/team/khukuri.png", label: "Champions", name: "Khukuri Canberra FC" },
              { crest: "/team/thuenlam.png", label: "Runners-up", name: "Thuenlam FC" },
              { crest: "/team/thuenlam.png", label: "Running Shield", name: "Thuenlam FC" },
              { icon: "S1", label: "Season 1 · 2024–25", name: "The first season" },
            ].map((card) => (
              <div key={card.label} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16, padding: "32px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                {card.crest
                  ? <img src={card.crest} alt="" style={{ width: 62, height: 62, objectFit: "contain" }} />
                  : <span style={{ width: 62, height: 62, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Lora,Georgia,serif", fontSize: 30, color: "#ff6a5e" }}>{card.icon}</span>
                }
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, color: DARK_MUTED }}>{card.label}</div>
                <div style={{ fontSize: 19, fontWeight: 500 }}>{card.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ background: BG, padding: "104px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: RED }}>Gallery</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.14, letterSpacing: "-.012em", margin: "16px 0 0" }}>Matchdays, kept</h2>
            </div>
            <a href="/gallery" style={{ border: "1px solid rgba(17,24,39,.18)", color: DARK, fontSize: 15, fontWeight: 500, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>Open the gallery</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
            {[P.final1, P.final4, P.celebration, P.final7].map((src) => (
              <a key={src} href="/gallery" style={{ position: "relative", aspectRatio: "4/3", borderRadius: 14, overflow: "hidden", background: "#e6e6e1", display: "block", textDecoration: "none" }}>
                <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background: DARK, color: "#fff", padding: "104px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 56, alignItems: "start" }}>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", minHeight: 440 }}>
            <img src={P.final5} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: RED }}>Questions</div>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.14, letterSpacing: "-.012em", margin: "16px 0 36px" }}>Before you enter</h2>
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderTop: "1px solid rgba(255,255,255,.14)" }}>
                <button type="button" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                  style={{ width: "100%", background: "none", border: 0, padding: "22px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, cursor: "pointer", textAlign: "left", color: "#fff", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 18, fontWeight: 500 }}>
                  <span>{f.q}</span>
                  <span style={{ fontSize: 22, color: RED, lineHeight: 1 }}>{faqOpen === i ? "–" : "+"}</span>
                </button>
                {faqOpen === i && (
                  <p style={{ margin: 0, padding: "0 0 24px", fontSize: 16, lineHeight: 1.72, color: DARK_MUTED, maxWidth: "56ch" }}>{f.a}</p>
                )}
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.14)" }} />
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section id="partners" style={{ background: "#fff", padding: "88px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 44, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, color: RED }}>Title sponsor</div>
              <img src="/sponsor/sba.png" alt="SBA Property Group" style={{ maxWidth: 250, width: "100%", height: "auto", objectFit: "contain", marginTop: 24 }} />
              <p style={{ margin: "22px 0 0", fontSize: 17, lineHeight: 1.72, color: "#4a545f", maxWidth: "44ch" }}>SBA Property Group presents the Samsara Premier League and the $4,000 champions prize.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, color: MUTED }}>Major partners</div>
              <div style={{ display: "flex", gap: 36, alignItems: "center", flexWrap: "wrap" as const, marginTop: 24 }}>
                <img src="/sponsor/gtm.png" alt="GTM Facility Services" style={{ height: 52, width: "auto", objectFit: "contain" }} />
                <img src="/sponsor/lhotse.png" alt="Lhotse" style={{ height: 44, width: "auto", objectFit: "contain" }} />
              </div>
              <a href="#partners" style={{ display: "inline-block", marginTop: 32, border: "1px solid rgba(17,24,39,.18)", color: DARK, fontSize: 15, fontWeight: 500, padding: "15px 28px", borderRadius: 999, textDecoration: "none" }}>All partners</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── UPDATES ── */}
      <section id="updates" style={{ background: BG, padding: "104px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 44 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: RED }}>Latest update</div>
              <a href="#clubs" style={{ display: "block", marginTop: 20, borderRadius: 18, overflow: "hidden", color: DARK, textDecoration: "none" }}>
                <div style={{ position: "relative", aspectRatio: "16/10" }}>
                  <img src={P.final7} alt="Supporters on the sideline at Nicholls" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderTop: 0, padding: 30 }}>
                  <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase" as const, color: MUTED }}>Season 3</div>
                  <h3 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: 26, lineHeight: 1.26, letterSpacing: "-.01em", margin: "12px 0 10px" }}>Twelve clubs confirmed for Season 3</h3>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.72, color: "#4a545f" }}>Six Nepalese and six Bhutanese clubs have accepted their invitations. Squad registration is open now.</p>
                </div>
              </a>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: RED }}>Upcoming</div>
              <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
                {[
                  { date: "14", month: "Nov", title: "Season 3 kick-off", sub: "Nicholls Synthetic Field, Canberra" },
                  { date: "Now", month: "", title: "Squad registration open", sub: "Invitation code required · max 22 players" },
                  { date: "TBC", month: "", title: "Fixture draw", sub: "Published once all squads are approved" },
                ].map((ev) => (
                  <div key={ev.title} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 16, padding: "26px 28px", display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 22, alignItems: "center" }}>
                    <div style={{ textAlign: "center", minWidth: 58 }}>
                      <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 30, lineHeight: 1 }}>{ev.date}</div>
                      {ev.month && <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase" as const, color: MUTED, marginTop: 4 }}>{ev.month}</div>}
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 500 }}>{ev.title}</div>
                      <div style={{ fontSize: 15, color: MUTED, marginTop: 4 }}>{ev.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REGISTER CTA ── */}
      <section id="register" style={{ background: RED, color: "#fff", padding: "96px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 44, alignItems: "center" }}>
          <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(30px,4.2vw,52px)", lineHeight: 1.16, letterSpacing: "-.014em", margin: 0 }}>Got an invitation code?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start" }}>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, maxWidth: "46ch", color: "rgba(255,255,255,.92)" }}>
              Registration for Season 3 is invitation-only. Enter your club&apos;s code to set up a manager account and register your squad.
            </p>
            <a href="/register/team" style={{ background: "#0b0e11", color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 32px", borderRadius: 999, textDecoration: "none" }}>Start registration</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER — dark ── */}
      <footer style={{ background: DARK, color: DARK_MUTED, padding: "80px 0 36px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 44 }}>
          <div>
            <img src="/samsara-logo-light.png" alt="Samsara Group Canberra" style={{ height: 46, width: "auto", objectFit: "contain", marginBottom: 20 }} />
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.72, maxWidth: "32ch" }}>Fostering community, empowering growth. Canberra, Australia.</p>
          </div>
          <div style={{ display: "grid", gap: 12, fontSize: 15, alignContent: "start" }}>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 6 }}>League</div>
            {[["About", "#about"], ["Clubs", "#clubs"], ["Gallery", "/gallery"], ["FAQ", "#faq"]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: DARK_MUTED, textDecoration: "none" }}>{label}</a>
            ))}
          </div>
          <div style={{ display: "grid", gap: 12, fontSize: 15, alignContent: "start" }}>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 6 }}>Contact</div>
            <a href="mailto:samsaragroup.cbr@gmail.com" style={{ color: DARK_MUTED, textDecoration: "none" }}>samsaragroup.cbr@gmail.com</a>
            <a href="tel:+61449981624" style={{ color: DARK_MUTED, textDecoration: "none" }}>+61 449 981 624</a>
            <a href="https://www.instagram.com/samsaragroup.cbr" style={{ color: DARK_MUTED, textDecoration: "none" }}>@samsaragroup.cbr</a>
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 18 }}>Season updates</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
              <input type="email" placeholder="Email address" style={{ flex: "1 1 160px", minWidth: 0, background: "#161f28", border: "1px solid rgba(255,255,255,.14)", borderRadius: 999, padding: "13px 20px", color: "#fff", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 15, outline: "none" }} />
              <button type="button" style={{ background: RED, color: "#fff", border: 0, borderRadius: 999, padding: "13px 24px", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Subscribe</button>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1340, margin: "52px auto 0", padding: "26px 24px 0", borderTop: "1px solid rgba(255,255,255,.12)", fontSize: 14, display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" as const }}>
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

      <Modal open={previewDoc !== null} onClose={() => setPreviewDoc(null)} wide>
        {previewDoc === "spl" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">SPL Rulebook &amp; Code of Conduct</h3>
            <a href="/files/SPL Official Rulebook & Code of Conduct.pdf" target="_blank" rel="noreferrer" className="button-secondary">Open PDF</a>
            <iframe src="/files/SPL Official Rulebook & Code of Conduct.pdf" title="SPL rulebook" className="h-[72vh] w-full rounded-[1rem] border border-white/10 bg-white" />
          </div>
        )}
        {previewDoc === "nnyc" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">NNYC 2083 Rulebook</h3>
            <a href="/files/NNYC 2083 - Rulebook.pdf" target="_blank" rel="noreferrer" className="button-secondary">Open PDF</a>
            <iframe src="/files/NNYC 2083 - Rulebook.pdf" title="NNYC rulebook" className="h-[72vh] w-full rounded-[1rem] border border-white/10 bg-white" />
          </div>
        )}
      </Modal>

      <style>{`
        @keyframes spl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes spl-pulse { 0%,100% { opacity:1; } 50% { opacity:.25; } }
        .spl-desktop { display: flex !important; }
        .spl-mobile { display: none !important; }
        @media (max-width: 767px) {
          .spl-desktop { display: none !important; }
          .spl-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
