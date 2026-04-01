"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Menu, Search, Timer, Video, Youtube } from "lucide-react";
import { ORG } from "@/lib/splData";

type MainHeaderProps = {
  active?: string;
  onChange?: (key: string) => void;
};

const LINKS = [
  { key: "home", label: "Home", href: "/#home" },
  { key: "league", label: "Premier League", href: "/#league" },
  { key: "tournament", label: "Tournament Details", href: "/#tournament" },
  { key: "gallery", label: "Gallery", href: "/gallery" },
  { key: "sponsors", label: "Sponsors", href: "/#sponsors" },
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
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1340px]">
        <div className="shell-card overflow-hidden">
          <div className="border-b border-slate-200/90 bg-[#f7f7f3] px-4 py-2.5 sm:px-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#707983]">
                Bringing communities together through football, culture, and events in Canberra
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[#6e7782]">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                  <Timer size={12} />
                  {daysUntil} days to next event
                </span>
                <a href="https://www.facebook.com/samsaragroupcbr" target="_blank" rel="noreferrer" className="hover:text-[#101820]">
                  <Facebook size={14} />
                </a>
                <a href="https://www.instagram.com/samsaragroup.cbr/" target="_blank" rel="noreferrer" className="hover:text-[#101820]">
                  <Instagram size={14} />
                </a>
                <a href="https://www.tiktok.com/@samsaragroupcanberra" target="_blank" rel="noreferrer" className="hover:text-[#101820]">
                  <Video size={14} />
                </a>
                <a href="https://www.youtube.com/@SamsaraGroupCanberra" target="_blank" rel="noreferrer" className="hover:text-[#101820]">
                  <Youtube size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
                <img src="/logo.png" alt={`${ORG.name} logo`} className="h-12 w-auto object-contain sm:h-14" />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold tracking-[-0.03em] text-[#101820] sm:text-lg">
                    Samsara Group Canberra
                  </p>
                  <p className="truncate text-[11px] uppercase tracking-[0.18em] text-[#7a838c]">
                    Community sport and culture
                  </p>
                </div>
              </Link>

              <div className="hidden items-center gap-3 lg:flex">
                <div className="flex items-center rounded-full border border-slate-200 bg-[#f7f7f3] px-4 py-2.5 text-[#6e7782]">
                  <Search size={15} />
                  <span className="ml-2 text-sm">Search updates and events</span>
                </div>
                <Link href="/#community" className="button-primary">
                  Contact Us
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="inline-flex rounded-full border border-slate-200 bg-[#f7f7f3] p-3 text-[#101820] lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200/90 px-4 py-3 sm:px-6">
            <div className="hidden items-center justify-center lg:flex">
              <nav className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-slate-200 bg-[#f7f7f3] p-1.5">
                {LINKS.map((link) => (
                  <a
                    key={link.key}
                    onClick={() => handleClick(link.key)}
                    href={link.href}
                    className={`rounded-full px-4 py-2.5 text-[13px] font-medium transition ${
                      active === link.key
                        ? "bg-[#101820] text-white"
                        : "text-[#64707c] hover:bg-white hover:text-[#101820]"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {mobileOpen && (
              <div className="space-y-3 pt-1 lg:hidden">
                <div className="flex items-center rounded-full border border-slate-200 bg-[#f7f7f3] px-4 py-3 text-[#6e7782]">
                  <Search size={16} />
                  <span className="ml-2 text-sm">Search updates and events</span>
                </div>

                <div className="grid gap-2">
                  {LINKS.map((link) => (
                    <a
                      key={link.key}
                      onClick={() => handleClick(link.key)}
                      href={link.href}
                      className="rounded-[1rem] border border-slate-200 bg-[#f7f7f3] px-4 py-3 text-sm font-medium text-[#55606d]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <Link href="/#community" className="button-primary">
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
