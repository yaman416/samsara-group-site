"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface SiteLayoutProps {
  children: React.ReactNode;
  activeNav?: "home" | "about" | "season" | "archive" | "clubs" | "gallery" | "partners";
}

export default function SiteLayout({ children, activeNav }: SiteLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("spl_token"));
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { href: "/", label: "Home", key: "home" },
    { href: "/about", label: "About", key: "about" },
    { href: "/season", label: "Season 3", key: "season" },
    { href: "/archive", label: "Archive", key: "archive" },
    { href: "/clubs", label: "Clubs", key: "clubs" },
    { href: "/gallery", label: "Gallery", key: "gallery" },
    { href: "/partners", label: "Partners", key: "partners" },
  ];

  return (
    <div style={{ background: "#f4f4f1", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#101820", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{`
        .site-nav-link { color: #4a545f; text-decoration: none; transition: color .2s; }
        .site-nav-link:hover { color: #101820; }
        .site-nav-active { color: #101820; border-bottom: 2px solid #e2372b; padding-bottom: 4px; }
        .spl-desktop { display: flex !important; }
        .spl-mobile-only { display: none !important; }
        .spl-header-wide { display: flex !important; }
        .spl-header-mid { display: none !important; }
        .spl-header-mobile { display: none !important; }
        @media (max-width: 1099px) {
          .spl-header-wide { display: none !important; }
          .spl-header-mid { display: grid !important; }
        }
        @media (max-width: 767px) {
          .spl-desktop { display: none !important; }
          .spl-mobile-only { display: flex !important; }
          .spl-header-mid { display: none !important; }
          .spl-header-mobile { display: grid !important; }
        }
      `}</style>

      {/* Sticky header (includes utility bar so both stay above the nav overlay) */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, backdropFilter: "blur(14px)" }}>

        {/* Utility bar */}
        <div style={{ background: "#101820", color: "#98a1ab", fontSize: 13 }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "10px 28px", display: "flex", justifyContent: "flex-end", gap: 20, alignItems: "center" }}>
            <a href="https://www.instagram.com/samsaragroup.cbr" aria-label="Instagram" style={{ color: "#98a1ab", textDecoration: "none", display: "flex", alignItems: "center", opacity: 0.8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com" aria-label="Facebook" style={{ color: "#98a1ab", textDecoration: "none", display: "flex", alignItems: "center", opacity: 0.8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.youtube.com/@SamsaraGroupCanberra" aria-label="YouTube" style={{ color: "#98a1ab", textDecoration: "none", display: "flex", alignItems: "center", opacity: 0.8 }}>
              <svg width="22" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Nav row */}
        <div style={{ background: "rgba(244,244,241,.96)", borderBottom: "1px solid rgba(17,24,39,.10)" }}>

        {/* Wide (≥1100px): logo left | nav center | account right — NO hamburger */}
        <div className="spl-header-wide" style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#101820", textDecoration: "none", flexShrink: 0 }}>
            <Image src="/other logos/logo-dark.png" alt="Samsara Group Canberra" width={120} height={38} style={{ height: 38, width: "auto", display: "block" }} />
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-.012em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: "#66707d", fontWeight: 400 }}>Canberra</span>
            </span>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 500, margin: "0 auto", letterSpacing: ".02em", textTransform: "uppercase" as const }}>
            {navLinks.map(n => (
              <Link key={n.key} href={n.href} className={`site-nav-link${activeNav === n.key ? " site-nav-active" : ""}`} style={{ padding: "6px 12px" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button type="button" onClick={() => setAccountOpen((v) => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "#101820", padding: "6px 12px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const }}>Account</span>
            </button>
            {accountOpen && <AccountDropdown isLoggedIn={isLoggedIn} onClose={() => setAccountOpen(false)} minWidth={280} />}
          </div>
        </div>

        {/* Medium (768-1099px): hamburger left | logo center | account right */}
        <div className="spl-header-mid" style={{ padding: "0 24px", height: 72, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          <button onClick={() => { setMenuOpen(!menuOpen); setAccountOpen(false); }} aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, justifySelf: "start", color: "#101820", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#101820", textDecoration: "none" }}>
            <Image src="/other logos/logo-dark.png" alt="Samsara Group Canberra" width={120} height={36} style={{ height: 36, width: "auto", display: "block" }} />
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-.012em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: "#66707d", fontWeight: 400 }}>Canberra</span>
            </span>
          </Link>
          <div style={{ position: "relative", justifySelf: "end" }}>
            <button type="button" onClick={() => { setAccountOpen((v) => !v); setMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "#101820", padding: "6px 4px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const }}>Account</span>
            </button>
            {accountOpen && <AccountDropdown isLoggedIn={isLoggedIn} onClose={() => setAccountOpen(false)} minWidth={280} />}
          </div>
        </div>

        {/* Mobile (<768px): hamburger left | logo center | account right */}
        <div className="spl-header-mobile" style={{ padding: "0 16px", height: 72, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
          <button onClick={() => { setMenuOpen(!menuOpen); setAccountOpen(false); }} aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, justifySelf: "start", color: "#101820", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#101820", textDecoration: "none" }}>
            <Image src="/other logos/logo-dark.png" alt="Samsara Group Canberra" width={100} height={34} style={{ height: 34, width: "auto", display: "block" }} />
            <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: "-.01em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: "#66707d", fontWeight: 400 }}>Canberra</span>
            </span>
          </Link>
          <div style={{ position: "relative", justifySelf: "end" }}>
            <button type="button" onClick={() => { setAccountOpen((v) => !v); setMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, color: "#101820", padding: "6px 4px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const }}>Account</span>
            </button>
            {accountOpen && <AccountDropdown isLoggedIn={isLoggedIn} onClose={() => setAccountOpen(false)} minWidth={260} />}
          </div>
        </div>

        </div>{/* end Nav row */}
      </header>

      {/* Full-overlay nav menu (Arsenal style) — outside header to escape backdrop-filter stacking context */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 58, background: "#fff", overflowY: "auto", paddingTop: 109 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            {navLinks.map(n => (
              <Link key={n.key} href={n.href} onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#101820", fontSize: 18, fontWeight: activeNav === n.key ? 600 : 400, padding: "20px 24px", textDecoration: "none", borderBottom: "1px solid rgba(17,24,39,.08)" }}>
                {n.label}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {children}

      {/* Footer */}
      <footer style={{ background: "#101820", color: "#98a1ab", padding: "80px 0 36px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 44 }}>
          <div>
            <img src="/other logos/logo-light.png" alt="Samsara Group Canberra" style={{ height: 46, width: "auto", objectFit: "contain", marginBottom: 20 }} />
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.72, maxWidth: "32ch" }}>Fostering community, empowering growth. Canberra, Australia.</p>
          </div>
          <div style={{ display: "grid", gap: 12, fontSize: 15, alignContent: "start" }}>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 6 }}>League</div>
            {[["About", "/about"], ["Clubs", "/clubs"], ["Gallery", "/gallery"], ["Season 3", "/season"]].map(([label, href]) => (
              <Link key={label} href={href} style={{ color: "#98a1ab", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <div style={{ display: "grid", gap: 12, fontSize: 15, alignContent: "start" }}>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 6 }}>Contact</div>
            <a href="mailto:samsaragroup.cbr@gmail.com" style={{ color: "#98a1ab", textDecoration: "none" }}>samsaragroup.cbr@gmail.com</a>
            <a href="tel:+61449981624" style={{ color: "#98a1ab", textDecoration: "none" }}>+61 449 981 624</a>
            <a href="https://www.instagram.com/samsaragroup.cbr" style={{ color: "#98a1ab", textDecoration: "none" }}>@samsaragroup.cbr</a>
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase" as const, marginBottom: 18 }}>Season updates</div>
            <FooterSubscribe />
          </div>
        </div>
        <div style={{ maxWidth: 1340, margin: "52px auto 0", padding: "26px 24px 0", borderTop: "1px solid rgba(255,255,255,.12)", fontSize: 14, display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" as const }}>
          <span>© 2026 Samsara Group Canberra</span>
          <span>Samsara Premier League · Season 3</span>
        </div>
      </footer>
    </div>
  );
}

function AccountDropdown({ isLoggedIn, onClose, minWidth }: { isLoggedIn: boolean; onClose: () => void; minWidth: number }) {
  async function signOut() {
    localStorage.removeItem("spl_token");
    await supabase.auth.signOut();
    onClose();
    window.location.href = "/";
  }

  return (
    <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid rgba(17,24,39,.12)", borderRadius: 12, padding: "24px 20px", minWidth, boxShadow: "0 8px 32px rgba(17,24,39,.12)", zIndex: 100 }}>
      {isLoggedIn ? (
        <>
          <Link href="/manager" onClick={onClose}
            style={{ display: "block", background: "#101820", color: "#fff", fontSize: 14, fontWeight: 600, padding: "14px 20px", borderRadius: 999, textDecoration: "none", textAlign: "center", letterSpacing: ".04em", textTransform: "uppercase" as const }}>
            My Portal
          </Link>
          <p style={{ margin: "16px 0 0", fontSize: 14, color: "#66707d", textAlign: "center" }}>
            <button type="button" onClick={signOut} style={{ background: "none", border: "none", color: "#101820", fontWeight: 600, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Sign out</button>
          </p>
        </>
      ) : (
        <>
          <Link href="/register" onClick={onClose}
            style={{ display: "block", background: "#e2372b", color: "#fff", fontSize: 14, fontWeight: 600, padding: "14px 20px", borderRadius: 999, textDecoration: "none", textAlign: "center", letterSpacing: ".04em", textTransform: "uppercase" as const }}>
            Register
          </Link>
          <p style={{ margin: "16px 0 0", fontSize: 14, color: "#66707d", textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/register?signin=1" onClick={onClose} style={{ color: "#101820", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </>
      )}
    </div>
  );
}

function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!email) return;
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setBusy(false);
    if (res.ok) { setMsg("Subscribed!"); setEmail(""); }
    else { const d = await res.json(); setMsg(d.error ?? "Something went wrong."); }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 0, background: "#161f28", border: "1px solid rgba(255,255,255,.14)", borderRadius: 999, overflow: "hidden" }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Email address"
          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", padding: "13px 20px", color: "#fff", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 15, outline: "none" }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          style={{ background: "#e2372b", color: "#fff", border: 0, borderRadius: 999, padding: "13px 24px", fontFamily: "'DM Sans',system-ui,sans-serif", fontSize: 15, fontWeight: 500, cursor: "pointer", flexShrink: 0, opacity: busy ? 0.7 : 1 }}
        >
          {busy ? "..." : "Subscribe"}
        </button>
      </div>
      {msg && <p style={{ margin: "8px 0 0", fontSize: 13, color: msg === "Subscribed!" ? "#6ee7a0" : "#f87171" }}>{msg}</p>}
    </div>
  );
}
