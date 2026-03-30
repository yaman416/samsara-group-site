"use client";

import { useState } from "react";
import { Facebook, Instagram, Menu, Search, Timer, Video, Youtube } from "lucide-react";
import { ORG } from "@/lib/splData";

type MainHeaderProps = {
  active?: string;
  onChange?: (key: string) => void;
};

const LINKS = [
  { key: "home", label: "Home", href: "/#home" },
  { key: "league", label: "Samsara Premier League", href: "/#league" },
  { key: "cup", label: "New Year Cup", href: "/#newYearCup" },
  { key: "fixtures", label: "Fixtures & Results", href: "/#fixturesResults" },
  { key: "gallery", label: "Gallery", href: "/gallery" },
  { key: "community", label: "Community Events", href: "/#community" },
  { key: "about", label: "About Us", href: "/#about" },
  { key: "contact", label: "Contact", href: "/#contact" },
];

export default function MainHeader({ active, onChange }: MainHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const eventDate = new Date("2026-04-04T09:00:00+11:00");
  const now = new Date();
  const daysUntil = Math.max(0, Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const handleClick = (key: string) => {
    onChange?.(key);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/96 backdrop-blur-xl">
      <div className="border-b border-slate-200 bg-[#15202b]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-3 py-2 text-[11px] sm:px-6 lg:px-8">
          <p className="font-medium uppercase tracking-[0.14em] text-white/80">
            Connecting communities through sport, culture, and events in Canberra
          </p>
          <div className="flex flex-wrap items-center gap-3 text-white/60">
            <a href="https://www.facebook.com/samsaragroupcbr" target="_blank" rel="noreferrer" className="hover:text-white">
              <Facebook size={14} />
            </a>
            <a href="https://www.instagram.com/samsaragroup.cbr/" target="_blank" rel="noreferrer" className="hover:text-white">
              <Instagram size={14} />
            </a>
            <a href="https://www.tiktok.com/@samsaragroupcanberra" target="_blank" rel="noreferrer" className="hover:text-white">
              <Video size={14} />
            </a>
            <a href="https://www.youtube.com/@SamsaraGroupCanberra" target="_blank" rel="noreferrer" className="hover:text-white">
              <Youtube size={14} />
            </a>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/78">
              <Timer size={12} />
              {daysUntil} days to next event
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-3 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/logo.png"
            alt={`${ORG.name} logo`}
            className="h-14 w-auto object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-[-0.02em] text-[#15202b] sm:text-lg">
              Samsara Group Canberra
            </p>
            <p className="truncate text-[11px] uppercase tracking-[0.18em] text-[#ff7d7d]">
              Community sport and culture in Canberra
            </p>
          </div>
        </a>

        <div className="hidden flex-1 items-center gap-3 xl:flex">
          <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-[#f8fafc] px-4 py-3 text-[#607181]">
            <Search size={16} />
            <span className="ml-2 text-sm">Search league, cup, fixtures, and events</span>
          </div>

          <a
            href="/#join"
            className="rounded-full bg-[#d7222a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e13940]"
          >
            Contact Us
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="ml-auto inline-flex rounded-full border border-slate-200 bg-[#f8fafc] p-3 text-[#15202b] xl:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="border-t border-slate-200 bg-[#fcfdff]">
        <div className="mx-auto hidden max-w-7xl items-center justify-between gap-4 px-3 py-3 xl:flex sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-1">
            {LINKS.map((link) => (
              <a
                key={link.key}
                onClick={() => handleClick(link.key)}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active === link.key
                    ? "bg-[#d7222a] text-white"
                    : "text-[#607181] hover:bg-[#f3f6fb] hover:text-[#15202b]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white xl:hidden">
          <div className="mx-auto max-w-7xl space-y-2 px-3 py-4 sm:px-6">
            <div className="flex items-center rounded-full border border-slate-200 bg-[#f8fafc] px-4 py-3 text-[#607181]">
              <Search size={16} />
              <span className="ml-2 text-sm">Search site</span>
            </div>

            {LINKS.map((link) => (
              <a
                key={link.key}
                onClick={() => handleClick(link.key)}
                href={link.href}
                className="block w-full rounded-xl px-3 py-3 text-left text-sm text-[#607181] hover:bg-[#f3f6fb]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/#join"
              className="block rounded-xl bg-[#d7222a] px-3 py-3 text-sm font-semibold text-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
