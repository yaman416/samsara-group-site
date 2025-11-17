// components/MainHeader.tsx
"use client";

import { useState } from "react";
import { ORG } from "@/lib/splData";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

type SectionKey = "home" | "table" | "fixtures" | "sponsors";

const hrefMap: Record<SectionKey, string> = {
  home: "#top",
  table: "#league-table",
  fixtures: "#upcoming-fixtures",
  sponsors: "#sponsors",
};

export default function MainHeader({
  active,
  onChange,
}: {
  active: SectionKey;
  onChange: (s: SectionKey) => void;
}) {
  const [open, setOpen] = useState(false);

  const NavLink = ({ keyName, label }: { keyName: SectionKey; label: string }) => (
    <a
      href={hrefMap[keyName]}
      className={`px-3 py-2 text-sm rounded-xl transition ${
        active === keyName ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => {
        onChange(keyName);
        setOpen(false);
      }}
    >
      {label}
    </a>
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Samsara Group logo" className="h-9 w-9 rounded-lg object-cover" />
          <div className="leading-tight">
            <div className="font-semibold text-sm md:text-base">{ORG.name}</div>
            <div className="text-xs text-gray-500">{ORG.tagline}</div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink keyName="home" label="About" />
          <NavLink keyName="table" label="League Table" />
          <NavLink keyName="fixtures" label="Upcoming Fixtures" />
          <NavLink keyName="sponsors" label="Sponsors" />
          <Button asChild size="sm" className="rounded-xl">
            <a href={ORG.facebook} target="_blank" rel="noreferrer">
              Follow
            </a>
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-1">
            <NavLink keyName="home" label="About" />
            <NavLink keyName="table" label="League Table" />
            <NavLink keyName="fixtures" label="Upcoming Fixtures" />
            <NavLink keyName="sponsors" label="Sponsors" />
          </div>
        </div>
      )}
    </header>
  );
}
