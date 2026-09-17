"use client";

import { useState, useSyncExternalStore } from "react";

export default function CookieConsent() {
  const [dismissed, setDismissed] = useState(false);
  const show = useSyncExternalStore(subscribe, needsConsent, () => false) && !dismissed;

  function accept() {
    try {
      window.localStorage.setItem("cookieAccepted", "true");
    } catch {
      // Ignore storage errors
    }
    setDismissed(true);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "#101820",
        color: "#c3cad2",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        flexWrap: "wrap",
        padding: "10px 20px",
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        borderTop: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <span>
        This site uses cookies for performance and analytics.{" "}
        <a href="/privacy-policy" style={{ color: "#98a1ab", textDecoration: "underline" }}>Privacy policy</a>
      </span>
      <button
        type="button"
        onClick={accept}
        style={{
          background: "#e2372b",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "5px 16px",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Got it
      </button>
    </div>
  );
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}
function needsConsent() {
  try { return !window.localStorage.getItem("cookieAccepted"); }
  catch { return false; }
}
