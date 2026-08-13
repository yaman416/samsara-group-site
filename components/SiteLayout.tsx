"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface SiteLayoutProps {
  children: React.ReactNode;
  activeNav?: "home" | "season" | "clubs" | "gallery" | "partners";
}

export default function SiteLayout({ children, activeNav }: SiteLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", key: "home" },
    { href: "/season", label: "Season 3", key: "season" },
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
        .spl-mobile { display: none !important; }
        @media (max-width: 767px) {
          .spl-desktop { display: none !important; }
          .spl-mobile { display: flex !important; }
        }
      `}</style>

      {/* Utility bar */}
      <div style={{ background: "#101820", color: "#98a1ab", fontSize: 13 }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "10px 24px", display: "flex", flexWrap: "wrap", gap: "12px 28px", alignItems: "center" }}>
          <a href="mailto:samsaragroup.cbr@gmail.com" style={{ color: "#98a1ab" }}>samsaragroup.cbr@gmail.com</a>
          <a href="tel:+61449981624" style={{ color: "#98a1ab" }}>+61 449 981 624</a>
          <span style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
            <a href="https://www.instagram.com/samsaragroup.cbr" style={{ color: "#98a1ab" }}>Instagram</a>
            <a href="https://www.facebook.com" style={{ color: "#98a1ab" }}>Facebook</a>
          </span>
        </div>
      </div>

      {/* Sticky header */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, background: "rgba(244,244,241,.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", height: 76, display: "flex", alignItems: "center", gap: 32 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, color: "#101820", textDecoration: "none" }}>
            <Image src="/logo.png" alt="Samsara Group Canberra" width={40} height={40} style={{ height: 40, width: "auto", display: "block" }} />
            <span style={{ fontWeight: 500, fontSize: 16, letterSpacing: "-.012em", lineHeight: 1.2 }}>
              Samsara Group<br /><span style={{ color: "#66707d" }}>Canberra</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="spl-desktop" style={{ alignItems: "center", gap: 28, margin: "0 auto", fontSize: 15, fontWeight: 400 }}>
            {navLinks.map(n => (
              <Link key={n.key} href={n.href} className={`site-nav-link${activeNav === n.key ? " site-nav-active" : ""}`}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link href="/#register" className="spl-desktop" style={{ background: "#e2372b", color: "#fff", fontSize: 14, fontWeight: 500, padding: "13px 24px", borderRadius: 999, whiteSpace: "nowrap", textDecoration: "none" }}>
            Register a club
          </Link>

          {/* Mobile hamburger */}
          <button
            className="spl-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}
            aria-label="Menu"
          >
            <span style={{ display: "block", width: 22, height: 2, background: "#101820", transition: "all .25s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#101820", transition: "all .25s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "#101820", transition: "all .25s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid rgba(17,24,39,.10)", padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map(n => (
              <Link key={n.key} href={n.href} onClick={() => setMenuOpen(false)}
                style={{ color: activeNav === n.key ? "#e2372b" : "#101820", fontWeight: activeNav === n.key ? 500 : 400, fontSize: 16, padding: "12px 0", borderBottom: "1px solid rgba(17,24,39,.07)", textDecoration: "none" }}>
                {n.label}
              </Link>
            ))}
            <Link href="/#register" onClick={() => setMenuOpen(false)}
              style={{ marginTop: 12, background: "#e2372b", color: "#fff", fontSize: 14, fontWeight: 500, padding: "14px 24px", borderRadius: 999, textAlign: "center", textDecoration: "none" }}>
              Register a club
            </Link>
          </div>
        )}
      </header>

      {children}

      {/* Footer */}
      <footer style={{ background: "#101820", color: "#98a1ab", padding: "64px 0 32px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", fontSize: 14 }}>
          <span>© 2026 Samsara Group Canberra</span>
          <span>Samsara Premier League · Season 3</span>
        </div>
      </footer>
    </div>
  );
}
