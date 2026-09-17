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
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 mx-auto max-w-xl rounded-xl border bg-white px-4 py-3 text-xs shadow-lg md:text-sm"
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-slate-700">
        This website uses cookies for performance, basic analytics, and Google
        AdSense requirements. By continuing to use this site, you agree to our
        privacy and cookie settings.
      </p>
      <button
        type="button"
        onClick={accept}
        className="mt-3 min-h-9 rounded-lg bg-orange-600 px-5 py-2 text-xs font-semibold text-white hover:bg-orange-700"
      >
        Accept
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
