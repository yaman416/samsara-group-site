// components/MainHeader.tsx
"use client";

import { ORG } from "@/lib/splData";

type SectionKey = "home" | "table" | "fixtures" | "results" | "sponsors";

type MainHeaderProps = {
  active: SectionKey;
  onChange: (section: SectionKey) => void;
};

const NAV_ITEMS: { key: SectionKey; label: string; targetId: string }[] = [
  { key: "home", label: "Home", targetId: "top" },
  { key: "table", label: "League Table", targetId: "table" },
  { key: "fixtures", label: "Fixtures", targetId: "fixtures" },
  { key: "results", label: "Results", targetId: "results" },
  { key: "sponsors", label: "Sponsors", targetId: "sponsors" },
];

const YOUTUBE_URL = "https://www.youtube.com/@SamsaraGroupCanberra";

function scrollToSection(targetId: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(targetId);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = window.scrollY + rect.top - 80; // adjust for header height
  window.scrollTo({ top: offset, behavior: "smooth" });
}

export default function MainHeader({ active, onChange }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Left: logo + name */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-semibold shadow-sm">
            SG
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {ORG.name} - Canberra
            </p>
            <p className="text-[11px] text-gray-500">
              Samsara Premier League 2025-26
            </p>
          </div>
        </div>

        {/* Center: nav buttons */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-gray-100 px-1 py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onChange(item.key);
                  scrollToSection(item.targetId);
                }}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  isActive
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-white/80",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: YouTube button */}
        <div className="flex items-center gap-2">
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            <span className="h-4 w-4 flex items-center justify-center rounded-[4px] bg-white/10">
              ▶
            </span>
            <span>Watch live on YouTube</span>
          </a>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden border-t border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-1 px-2 py-2 text-[11px]">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onChange(item.key);
                  scrollToSection(item.targetId);
                }}
                className={[
                  "px-2 py-1 rounded-full font-medium",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
