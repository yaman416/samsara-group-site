"use client";

import { SPL_SEASON } from "@/lib/splData";

// Smooth scrolling helper
function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const NAV = [
  { label: "About Us", id: "about" },
  { label: "Table", id: "table" },
  { label: "Fixtures", id: "fixturesResults" },
  { label: "Downloads", id: "downloads" },
  { label: "Sponsors", id: "sponsors" },
];

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          {/* Your actual logo */}
          <img
            src="/logo.png"
            alt="Samsara Group Canberra"
            className="h-9 w-9"
          />

          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              Samsara Group
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 md:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="rounded-full px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
            >
              {item.label}
            </button>
          ))}

          {/* CTA Button */}
          <a
            href="https://www.youtube.com/@SamsaraGroupCanberra"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[9px]">
              ▶
            </span>
            Watch live
          </a>
        </nav>

        {/* Mobile button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => scrollToSection("fixturesResults")}
            className="rounded-full bg-orange-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-orange-700"
          >
            Fixtures
          </button>
        </div>
      </div>
    </header>
  );
}
