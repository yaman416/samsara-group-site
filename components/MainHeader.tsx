// components/MainHeader.tsx
"use client";

import { useState } from "react";
import { SPL_SEASON } from "@/lib/splData";

type MainHeaderProps = {
  active?: string;
  onChange?: (key: string) => void;
};

const LINKS = [
  { key: "home", label: "About Us", target: "about" },
  { key: "table", label: "League Table", target: "table" },
  { key: "fixturesResults", label: "Fixtures & Results", target: "fixturesResults" },
  { key: "downloads", label: "Downloads", target: "downloads" },
  { key: "sponsors", label: "Sponsors", target: "sponsors" },
];

function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MainHeader({ active, onChange }: MainHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (key: string, target: string) => {
    if (onChange) onChange(key);
    scrollToSection(target);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3">
        {/* LEFT: logo + label */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Samsara Group Canberra logo"
            className="h-9 w-9"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              Samsara Group Canberra
            </p>
          </div>
        </div>

        {/* CENTER: main nav (desktop / tablet only) */}
        <nav className="hidden flex-1 items-center justify-center gap-3 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => handleClick(link.key, link.target)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                active === link.key
                  ? "bg-orange-50 text-orange-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* RIGHT: YouTube + hamburger (hamburger only on small screens) */}
        <div className="ml-auto flex items-center gap-2">
          {/* Watch live – always visible */}
          <a
            href="https://www.youtube.com/@SamsaraGroupCanberra"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[9px]">
              ▶
            </span>
            <span>Watch live</span>
          </a>

          {/* Hamburger – really small screens only */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs text-slate-700 md:hidden"
            aria-label="Open menu"
          >
            <span className="mr-1 text-[11px]">Menu</span>
            <span className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-3 rounded bg-slate-700" />
              <span className="block h-[2px] w-3 rounded bg-slate-700" />
              <span className="block h-[2px] w-3 rounded bg-slate-700" />
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU: only appears when hamburger open, and only on small screens */}
      {mobileOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-3">
            {LINKS.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => handleClick(link.key, link.target)}
                className="block w-full rounded-lg px-2 py-2 text-left text-xs font-medium text-slate-700 hover:bg-gray-100"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
