// components/MainHeader.tsx
"use client";

import { useState } from "react";
import { ORG, SPL_SEASON } from "@/lib/splData";

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
    <header className="sticky top-0 z-40 border-b border-white/30 bg-[#f6f0e7]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Samsara Group Canberra logo"
            className="h-10 w-10 rounded-full border border-[#14324a]/10 bg-white/70 p-1"
          />
          <div className="leading-tight">
            <p className="font-display text-lg text-[#182230]">{ORG.name}</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#6f6250]">
              {SPL_SEASON.name}
            </p>
          </div>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => handleClick(link.key, link.target)}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                active === link.key
                  ? "bg-[#14324a] text-[#fff8ef]"
                  : "text-[#425164] hover:bg-white/70 hover:text-[#14324a]"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://www.youtube.com/@SamsaraGroupCanberra"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full border border-[#14324a]/12 bg-white/75 px-4 py-2 text-[11px] font-semibold text-[#14324a] shadow-sm transition hover:bg-white sm:inline-flex"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#14324a] text-[9px] text-white">
              ▶
            </span>
            <span>Watch live updates</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border border-[#14324a]/12 bg-white/75 px-3 py-2 text-xs text-[#14324a] md:hidden"
            aria-label="Open menu"
          >
            <span className="mr-1 text-[11px]">Menu</span>
            <span className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-3 rounded bg-[#14324a]" />
              <span className="block h-[2px] w-3 rounded bg-[#14324a]" />
              <span className="block h-[2px] w-3 rounded bg-[#14324a]" />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/30 bg-[#f6f0e7]/95 md:hidden">
          <div className="mx-auto max-w-7xl space-y-2 px-4 py-3 sm:px-6">
            {LINKS.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => handleClick(link.key, link.target)}
                className="block w-full rounded-xl px-3 py-3 text-left text-xs font-medium text-[#324356] hover:bg-white/80"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://www.youtube.com/@SamsaraGroupCanberra"
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl bg-[#14324a] px-3 py-3 text-xs font-semibold text-white"
            >
              Watch live updates
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
