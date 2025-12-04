"use client";
import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const approved = localStorage.getItem("cookieAccepted");
    if (!approved) setShow(true);
  }, []);

  function accept() {
    localStorage.setItem("cookieAccepted", "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-xl border bg-white px-4 py-3 shadow-lg text-xs md:text-sm">
      <p className="text-slate-700">
        This website uses cookies for performance, analytics, and Google AdSense
        requirements. By using this site, you agree to our Privacy Policy.
      </p>
      <button
        onClick={accept}
        className="mt-3 rounded-lg bg-orange-600 px-4 py-1.5 text-white text-xs hover:bg-orange-700"
      >
        Accept
      </button>
    </div>
  );
}
