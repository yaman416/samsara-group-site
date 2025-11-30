// components/MainHeader.tsx
"use client";

import { ORG } from "@/lib/splData";

type SectionKey = "home" | "table" | "fixtures" | "results" | "sponsors";

type Props = {
  active: SectionKey;
  onChange: (key: SectionKey) => void;
};

const NAV_ITEMS: { key: SectionKey; label: string; targetId: string }[] = [
  { key: "home", label: "Home", targetId: "top" },
  { key: "table", label: "League Table", targetId: "table" },
  { key: "fixtures", label: "Fixtures", targetId: "fixtures" },
  { key: "results", label: "Results", targetId: "results" },
  { key: "sponsors", label: "Sponsors", targetId: "sponsors" },
];

function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MainHeader({ active, onChange }: Props) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Left logo + name */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onChange("home");
              scrollToSection("top");
            }}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="Samsara Group mountain logo"
              className="h-9 w-auto"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold tracking-tight">
                Samsara Group - Canberra
              </span>
              <span className="text-[11px] text-gray-500">
                Fostering community, empowering growth
              </span>
            </div>
          </a>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
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
                  "rounded-full px-3 py-1.5 transition-colors",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Facebook button */}
        <div className="flex items-center gap-2">
          <a
            href={ORG.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white">
              f
            </span>
            <span className="hidden sm:inline">
              Follow Samsara Group on Facebook
            </span>
            <span className="sm:hidden">Follow</span>
          </a>
        </div>
      </div>

      {/* Mobile nav under header */}
      <nav className="flex md:hidden gap-2 overflow-x-auto border-t px-4 py-2 text-xs bg-white">
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
                "whitespace-nowrap rounded-full px-3 py-1 transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 bg-gray-50 hover:bg-gray-100",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
