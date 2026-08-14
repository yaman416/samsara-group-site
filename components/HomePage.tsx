"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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


function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [cd, setCd] = useState({ dd: "--", hh: "--", mm: "--", ss: "--" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [showHub, setShowHub] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<"spl" | "nnyc" | null>(null);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SHOTS.length), 5200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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

      {/* ── HEADER (includes utility bar so both stay above nav overlay) ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, backdropFilter: "blur(14px)" }}>

        {/* ── TOP UTILITY BAR ── */}
        <div style={{ background: DARK, color: DARK_MUTED, fontSize: 13 }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "10px 28px", display: "flex", justifyContent: "flex-end", gap: 20, alignItems: "center" }}>
            <a href="https://www.instagram.com/samsaragroup.cbr" aria-label="Instagram" style={{ color: DARK_MUTED, textDecoration: "none", display: "flex", alignItems: "center", opacity: 0.8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com" aria-label="Facebook" style={{ color: DARK_MUTED, textDecoration: "none", display: "flex", alignItems: "center", opacity: 0.8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/@SamsaraGroupCanberra" aria-label="YouTube" style={{ color: DARK_MUTED, textDecoration: "none", display: "flex", alignItems: "center", opacity: 0.8 }}>
              <svg width="22" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Nav row */}
        <div style={{ background: "rgba(244,244,241,.96)", borderBottom: "1px solid rgba(17,24,39,.10)" }}>

        {/* Account icon button — reused across layouts */}
        {/* Wide (≥1100px): logo left | nav center | account right — NO hamburger */}
        <div className="spl-header-wide" style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: DARK, textDecoration: "none", flexShrink: 0 }}>
            <img src="/other logos/logo-dark.png" alt="Samsara Group Canberra" style={{ height: 38, width: "auto" }} />
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-.012em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: MUTED, fontWeight: 400 }}>Canberra</span>
            </span>
          </a>
          <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 500, margin: "0 auto", letterSpacing: ".02em", textTransform: "uppercase" as const }}>
            {[["Home", "/"], ["About", "/about"], ["Season 3", "/season"], ["Archive", "/archive"], ["Clubs", "/clubs"], ["Gallery", "/gallery"], ["Partners", "/partners"]].map(([label, href]) => (
              <a key={label} href={href} style={{ color: href === "/" ? DARK : "#4a545f", textDecoration: "none", padding: "6px 12px", borderBottom: href === "/" ? `2px solid ${RED}` : "none", paddingBottom: href === "/" ? 4 : 6 }}>{label}</a>
            ))}
          </nav>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button type="button" onClick={() => setAccountOpen((v) => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: DARK, padding: "6px 12px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const }}>Account</span>
            </button>
            {accountOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid rgba(17,24,39,.12)", borderRadius: 12, padding: "24px 20px", minWidth: 280, boxShadow: "0 8px 32px rgba(17,24,39,.12)", zIndex: 100 }}>
                <a href="/register" onClick={() => setAccountOpen(false)}
                  style={{ display: "block", background: RED, color: "#fff", fontSize: 14, fontWeight: 600, padding: "14px 20px", borderRadius: 999, textDecoration: "none", textAlign: "center", letterSpacing: ".04em", textTransform: "uppercase" as const }}>
                  Create account
                </a>
                <p style={{ margin: "16px 0 0", fontSize: 14, color: MUTED, textAlign: "center" }}>
                  Already have an account?{" "}
                  <a href="/register?signin=1" onClick={() => setAccountOpen(false)} style={{ color: DARK, fontWeight: 600, textDecoration: "none" }}>Sign in</a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Medium (768-1099px): hamburger left | logo center | account right */}
        <div className="spl-header-mid" style={{ padding: "0 24px", height: 72, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          <button type="button" onClick={() => { setMenuOpen((v) => !v); setAccountOpen(false); }} aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, justifySelf: "start", color: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: DARK, textDecoration: "none" }}>
            <img src="/other logos/logo-dark.png" alt="Samsara Group Canberra" style={{ height: 36, width: "auto" }} />
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-.012em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: MUTED, fontWeight: 400 }}>Canberra</span>
            </span>
          </a>
          <div style={{ position: "relative", justifySelf: "end" }}>
            <button type="button" onClick={() => { setAccountOpen((v) => !v); setMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: DARK, padding: "6px 4px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const }}>Account</span>
            </button>
            {accountOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid rgba(17,24,39,.12)", borderRadius: 12, padding: "24px 20px", minWidth: 280, boxShadow: "0 8px 32px rgba(17,24,39,.12)", zIndex: 100 }}>
                <a href="/register" onClick={() => setAccountOpen(false)}
                  style={{ display: "block", background: RED, color: "#fff", fontSize: 14, fontWeight: 600, padding: "14px 20px", borderRadius: 999, textDecoration: "none", textAlign: "center", letterSpacing: ".04em", textTransform: "uppercase" as const }}>
                  Create account
                </a>
                <p style={{ margin: "16px 0 0", fontSize: 14, color: MUTED, textAlign: "center" }}>
                  Already have an account?{" "}
                  <a href="/register?signin=1" onClick={() => setAccountOpen(false)} style={{ color: DARK, fontWeight: 600, textDecoration: "none" }}>Sign in</a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile (<768px): hamburger left | logo center | account right */}
        <div className="spl-header-mobile" style={{ padding: "0 16px", height: 72, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          <button type="button" onClick={() => { setMenuOpen((v) => !v); setAccountOpen(false); }} aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, justifySelf: "start", color: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: DARK, textDecoration: "none" }}>
            <img src="/other logos/logo-dark.png" alt="Samsara Group Canberra" style={{ height: 34, width: "auto" }} />
            <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: "-.01em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: MUTED, fontWeight: 400 }}>Canberra</span>
            </span>
          </a>
          <div style={{ position: "relative", justifySelf: "end" }}>
            <button type="button" onClick={() => { setAccountOpen((v) => !v); setMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: DARK, padding: "6px 4px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const }}>Account</span>
            </button>
            {accountOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid rgba(17,24,39,.12)", borderRadius: 12, padding: "24px 20px", minWidth: 260, boxShadow: "0 8px 32px rgba(17,24,39,.12)", zIndex: 100 }}>
                <a href="/register" onClick={() => setAccountOpen(false)}
                  style={{ display: "block", background: RED, color: "#fff", fontSize: 14, fontWeight: 600, padding: "14px 20px", borderRadius: 999, textDecoration: "none", textAlign: "center", letterSpacing: ".04em", textTransform: "uppercase" as const }}>
                  Create account
                </a>
                <p style={{ margin: "16px 0 0", fontSize: 14, color: MUTED, textAlign: "center" }}>
                  Already have an account?{" "}
                  <a href="/register?signin=1" onClick={() => setAccountOpen(false)} style={{ color: DARK, fontWeight: 600, textDecoration: "none" }}>Sign in</a>
                </p>
              </div>
            )}
          </div>
        </div>

        </div>{/* end Nav row */}
      </header>

      {/* Full-overlay nav menu (Arsenal style) — outside header to escape backdrop-filter stacking context */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 58, background: "#fff", overflowY: "auto", paddingTop: 109 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {[["Home", "/"], ["About", "/about"], ["Season 3", "/season"], ["Archive", "/archive"], ["Clubs", "/clubs"], ["Gallery", "/gallery"], ["Partners", "/partners"]].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: DARK, fontSize: 18, fontWeight: 400, padding: "20px 24px", textDecoration: "none", borderBottom: "1px solid rgba(17,24,39,.08)" }}>
                {label}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── HERO — dark centered ── */}
      <section id="top" style={{ position: "relative", minHeight: "min(86vh,820px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", background: DARK }}>
        {HERO_SHOTS.map((s, i) => (
          <img key={s.src} src={s.src} alt={s.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos, opacity: i === slide ? 0.55 : 0, transition: "opacity 1.4s ease" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(16,24,32,.72) 0%,rgba(16,24,32,.42) 45%,rgba(16,24,32,.86) 100%)" }} />

        <div style={{ position: "relative", width: "100%", maxWidth: 900, padding: "120px 24px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,.34)", borderRadius: 999, padding: "8px 18px", fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: RED, animation: "spl-pulse 1.8s ease-in-out infinite", display: "inline-block" }} />
            SBA Property Group Presents
          </div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(42px,6.4vw,86px)", lineHeight: 1.06, letterSpacing: "-.02em", margin: "26px 0 0", textWrap: "balance" as any }}>
            Samsara Premier League
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 22, flexWrap: "wrap" as const, justifyContent: "center" }}>
            <span style={{ background: RED, color: "#fff", fontSize: 12, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, padding: "9px 16px", borderRadius: 6 }}>Season 03 · 2026-27</span>
            <span style={{ fontSize: 15, color: "rgba(255,255,255,.82)" }}>Kick-off Saturday 14 November 2026</span>
          </div>
          <p style={{ maxWidth: "56ch", margin: "22px 0 0", fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,.86)" }}>
            Our annual football season, back for a third year. Twelve clubs from Canberra&apos;s Nepalese and Bhutanese communities. One shield.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, justifyContent: "center", marginTop: 34 }}>
            <a href="#register" style={{ background: RED, color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>Register a club</a>
            <a href="/about" style={{ border: "1px solid rgba(255,255,255,.42)", color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>About us</a>
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

      {/* ── HONOURS BOARD ── */}
      <section style={{ position: "relative", padding: "120px 0", overflow: "hidden" }}>
        <img src={P.final7} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(16,24,32,.76)" }} />
        <div style={{ position: "relative", maxWidth: 1340, margin: "0 auto", padding: "0 24px", color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#ff6a5e" }}>Season 2 · 2025-26</div>
          <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(30px,4vw,50px)", lineHeight: 1.16, letterSpacing: "-.012em", margin: "16px auto 0", maxWidth: "20ch" }}>The honours board</h2>
          <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {[
              { crest: "/team logos/Khukuri.png", label: "Champions", name: "Khukuri Canberra FC" },
              { crest: "/team logos/Thuenlam.png", label: "Running Shield", name: "Thuenlam FC" },
            ].map((card, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16, padding: "32px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <img src={card.crest} alt="" style={{ width: 62, height: 62, objectFit: "contain" }} />
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, color: DARK_MUTED }}>{card.label}</div>
                <div style={{ fontSize: 19, fontWeight: 500 }}>{card.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSOR SLIDER ── */}
      <section style={{ background: "#fff", borderTop: "1px solid rgba(17,24,39,.08)", padding: "56px 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" as const }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" as const, color: MUTED }}>Our partners</div>
            <a href="/partners" style={{ fontSize: 13, fontWeight: 500, color: RED, textDecoration: "none", letterSpacing: ".04em" }}>View all partners</a>
          </div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", width: "max-content", animation: "spl-marquee 32s linear infinite", alignItems: "center", gap: 64 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 64, padding: "0 32px" }}>
                {[
                  { src: "/sponsor/sba.png", alt: "SBA Property Group", h: 44 },
                  { src: "/sponsor/gtm.png", alt: "GTM Facility Services", h: 40 },
                  { src: "/sponsor/lhotse.png", alt: "Lhotse", h: 36 },
                  { src: "/sponsor/dikshant.png", alt: "Dikshant", h: 36 },
                  { src: "/sponsor/expert.png", alt: "Expert", h: 36 },
                  { src: "/sponsor/momo.png", alt: "Momo", h: 36 },
                  { src: "/sponsor/monkeytemple.png", alt: "Monkey Temple", h: 36 },
                  { src: "/sponsor/nepalihaat.png", alt: "Nepali Haat", h: 36 },
                  { src: "/sponsor/ooshman.png", alt: "Ooshman", h: 36 },
                  { src: "/sponsor/zenith.png", alt: "Zenith", h: 36 },
                ].map((s) => (
                  <img key={s.alt} src={s.src} alt={s.alt} style={{ height: s.h, width: "auto", objectFit: "contain", opacity: .7, filter: "grayscale(100%)", transition: "opacity .2s, filter .2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "1"; (e.currentTarget as HTMLImageElement).style.filter = "none"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = ".7"; (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)"; }}
                  />
                ))}
              </div>
            ))}
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
            <a href="/register" style={{ background: "#0b0e11", color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 32px", borderRadius: 999, textDecoration: "none" }}>Start registration</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER — dark ── */}
      <footer style={{ background: DARK, color: DARK_MUTED, padding: "80px 0 36px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 44 }}>
          <div>
            <img src="/other logos/logo-light.png" alt="Samsara Group Canberra" style={{ height: 46, width: "auto", objectFit: "contain", marginBottom: 20 }} />
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.72, maxWidth: "32ch" }}>Fostering community, empowering growth. Canberra, Australia.</p>
          </div>
          <div style={{ display: "grid", gap: 12, fontSize: 15, alignContent: "start" }}>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 6 }}>League</div>
            {[["About Us", "/about"], ["Clubs", "/clubs"], ["Gallery", "/gallery"], ["Season 3", "/season"]].map(([label, href]) => (
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
            <div style={{ display: "flex", gap: 0, background: "#161f28", border: "1px solid rgba(255,255,255,.14)", borderRadius: 999, overflow: "hidden" }}>
              <input type="email" placeholder="Email address" style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", padding: "13px 20px", color: "#fff", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 15, outline: "none" }} />
              <button type="button" style={{ background: RED, color: "#fff", border: 0, borderRadius: 999, padding: "13px 24px", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 15, fontWeight: 500, cursor: "pointer", flexShrink: 0 }}>Subscribe</button>
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
        .spl-mobile-only { display: none !important; }
        /* Wide: full nav, no hamburger */
        .spl-header-wide { display: flex !important; }
        .spl-header-mid { display: none !important; }
        .spl-header-mobile { display: none !important; }
        @media (max-width: 1099px) {
          /* Medium: logo left, hamburger right, no nav */
          .spl-header-wide { display: none !important; }
          .spl-header-mid { display: grid !important; }
        }
        @media (max-width: 767px) {
          /* Mobile: hamburger left, logo center, account right */
          .spl-desktop { display: none !important; }
          .spl-mobile-only { display: flex !important; }
          .spl-header-mid { display: none !important; }
          .spl-header-mobile { display: grid !important; }
        }
      `}</style>
    </div>
  );
}
