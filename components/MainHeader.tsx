// components/MainHeader.tsx
"use client";

import { ORG } from "@/lib/splData";

type SectionKey = "home" | "table" | "fixtures" | "results" | "sponsors";

type Props = {
  active: SectionKey;
  onChange: (key: SectionKey) => void;
};

const sectionIds: Record<SectionKey, string> = {
  home: "top",
  table: "league-table",
  fixtures: "fixtures",
  results: "results",
  sponsors: "sponsors",
};

const TABS: { key: SectionKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "table", label: "League Table" },
  { key: "fixtures", label: "Fixtures" },
  { key: "results", label: "Results" },
  { key: "sponsors", label: "Sponsors" },
];

export default function MainHeader({ active, onChange }: Props) {
  function handleClick(key: SectionKey) {
    onChange(key);
    const id = sectionIds[key];
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo + name */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Samsara Group"
            className="h-7 w-auto md:h-8"
          />
          <span className="hidden text-sm font-semibold text-slate-800 sm:inline">
            {ORG.name}
          </span>
        </div>

        {/* Facebook follow */}
        <a
          href={ORG.facebook}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-blue-600">
            f
          </span>
          <span>Follow</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-6xl px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar">
          {TABS.map((tab) => {
            const isActive = tab.key === active;
            return (
              <button
                key={tab.key}
                onClick={() => handleClick(tab.key)}
                className={[
                  "whitespace-nowrap rounded-full px-4 py-2 font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
