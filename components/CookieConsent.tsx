"use client";

import { useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const approved = window.localStorage.getItem("cookieAccepted");
      return !approved;
    } catch {
      // If localStorage is blocked, keep the banner hidden to avoid breaking the page.
      return false;
    }
  });

  function accept() {
    try {
      window.localStorage.setItem("cookieAccepted", "true");
    } catch {
      // Ignore storage errors
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-xl border bg-white px-4 py-3 text-xs shadow-lg md:text-sm"
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
        className="mt-3 rounded-lg bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
      >
        Accept
      </button>
    </div>
  );
}
