"use client";

import { useState } from "react";

const LINKS = [
  { key: "home", label: "Home", target: "top" },
  { key: "table", label: "League Table", target: "table" },
  { key: "fixtures", label: "Fixtures", target: "fixtures" },
  { key: "results", label: "Results", target: "results" },
  { key: "sponsors", label: "Sponsors", target: "sponsors" },
];

export default function MainHeader({ active, onChange }: any) {
  const [open, setOpen] = useState(false);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("top")}>
          <img src="/logo.png" className="w-9 h-9" alt="Samsara Logo" />
          <span className="font-bold text-lg">Samsara Group</span>
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6">
          {LINKS.map(link => (
            <button
              key={link.key}
              onClick={() => {
                onChange(link.key);
                scrollTo(link.target);
              }}
              className={`text-sm font-medium ${
                active === link.key ? "text-blue-600" : "text-gray-700 hover:text-black"
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* FACEBOOK */}
          <a
            href="https://www.facebook.com/profile.php?id=61566789173985"
            target="_blank"
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md"
          >
            Follow on Facebook
          </a>
        </nav>

        {/* MOBILE BUTTON */}
        <button onClick={() => setOpen(!open)} className="md:hidden">
          <span className="text-xl">☰</span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-3">
          {LINKS.map(link => (
            <button
              key={link.key}
              onClick={() => {
                onChange(link.key);
                scrollTo(link.target);
              }}
              className="block w-full text-left text-sm py-2 border-b"
            >
              {link.label}
            </button>
          ))}

          <a
            href="https://www.facebook.com/profile.php?id=61566789173985"
            target="_blank"
            className="block text-sm text-blue-600 font-medium pt-2"
          >
            Follow on Facebook
          </a>
        </div>
      )}
    </header>
  );
}
