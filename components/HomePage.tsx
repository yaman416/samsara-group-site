"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, MapPin, Trophy } from "lucide-react";
import LeagueTableSection from "@/components/LeagueTableSection";
import FixturesResultsSection from "@/components/FixturesResultsSection";
import Modal from "@/components/Modal";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
import { ORG } from "@/lib/splData";
import { LEAGUE_INFO, NEWS_UPDATES, NEW_YEAR_CUP } from "@/lib/siteContent";

const QUICK_ACTIONS = [
  {
    number: "01",
    title: "Samsara Premier League",
    copy: "Follow the main league, season information, and official updates in one place.",
    href: "#league",
  },
  {
    number: "02",
    title: "New Year Cup",
    copy: "Find dates, venue, group information, and competition resources for the upcoming cup.",
    href: "#tournament",
  },
  {
    number: "03",
    title: "Season Hub",
    copy: "Open last season results, final table, and detailed match facts.",
    href: "#fixturesResults",
  },
];

const SPONSORS = [
  "Bittersweet",
  "Navitas Skilled Futures Canberra",
  "The Monkey Temple",
  "Aussie Finance & Home Loans - Canberra",
  "Global Consult Canberra",
  "Kathmandu Automotive",
  "GTM Facility Services",
  "Sherpa Removals",
  "uNepal",
  "FanVoice",
  "Avyukta",
  "FilmsYaman",
  "LensFusion Photography",
  "KTM Event Management",
  "LHOTSE",
];

type PreviewDoc = "fixtures" | "spl" | "nnyc" | null;

const HERO_SLIDES = [
  "/gallery/FINAL%20SPL%202025-26/643976200_122200985060559639_8937709693566884101_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/644055873_122201103818559639_8722394492457535109_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/644195431_122200984940559639_7106563034665718509_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/645045304_122201108054559639_700231387386612553_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/645321343_122201104682559639_8218344547327609707_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/645450423_122200984886559639_2302749031722042087_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/645590660_122201103038559639_895508620839760949_n.jpg",
  "/gallery/FINAL%20SPL%202025-26/khukuri-final-1.jpg",
  "/gallery/FINAL%20SPL%202025-26/khukuri-final-2.jpg",
  "/gallery/FINAL%20SPL%202025-26/khukuri-final-3.jpg",
  "/gallery/FINAL%20SPL%202025-26/thuenlam-final-2.jpg",
  "/gallery/FINAL%20SPL%202025-26/thuenlam-final-3.jpg",
];

export default function HomePage() {
  const [showSeasonHub, setShowSeasonHub] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PreviewDoc>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const openSeasonHub = () => {
    setShowSeasonHub(true);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-transparent">
      <MainHeader />

      <main className="page-shell flex-1 space-y-6 sm:space-y-8">
        <section id="home" className="sports-panel overflow-hidden p-0">
          <div className="relative min-h-[620px]">
            <img
              src={HERO_SLIDES[heroIndex]}
              alt="Samsara Group Canberra"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#101820]/78 via-[#101820]/50 to-transparent" />
            <div className="relative z-10 flex min-h-[620px] items-end px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full bg-[#ff645f] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                  Community sport and culture
                </span>
                <h1 className="mt-4 text-[2.5rem] font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-[3.4rem] lg:text-[4.2rem]">
                  Bringing communities together through football in Canberra.
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/82 sm:text-[15px]">
                  Samsara Group Canberra organises football competitions, cultural events, and community gatherings for Nepalese, Bhutanese, and wider Canberra communities.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href="#tournament" className="button-primary bg-[#ff645f] hover:bg-[#ef5752]">
                    Explore New Year Cup
                  </a>
                  <button
                    type="button"
                    onClick={openSeasonHub}
                    className="button-secondary border-white/20 bg-white/12 text-white hover:bg-white/20"
                  >
                    Open season hub
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-2 sm:bottom-6">
              {HERO_SLIDES.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setHeroIndex(index)}
                  className={`h-2.5 rounded-full transition ${
                    heroIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/45"
                  }`}
                  aria-label={`Show hero slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {QUICK_ACTIONS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="shell-card block px-5 py-5 transition hover:-translate-y-0.5 sm:px-6 sm:py-6"
            >
              <p className="text-sm font-semibold tracking-[0.18em] text-[#ff645f]">{item.number}</p>
              <h2 className="mt-4 text-[1.35rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#101820]">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#66707d]">{item.copy}</p>
            </a>
          ))}
        </section>

        <section id="tournament" className="sports-panel overflow-hidden p-0">
          <div className="grid xl:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#111315] px-5 py-6 text-white sm:px-7 sm:py-8 lg:px-10 lg:py-10">
              <div className="flex items-center gap-3">
                <img src="/NNYC%20Logo.png" alt="NNYC logo" className="h-12 w-auto object-contain sm:h-14" />
                <p className="section-kicker text-white/60">Current focus • NNYC</p>
              </div>
              <h2 className="mt-3 text-[2rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-[2.7rem]">
                Nepalese New Year Cup
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">
                One compact place for dates, venue, groups, and the official fixture document.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4">
                  <CalendarDays size={18} className="text-white" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Dates</p>
                  <p className="mt-2 text-sm font-semibold text-white">{NEW_YEAR_CUP.dates}</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4">
                  <MapPin size={18} className="text-white" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Venue</p>
                  <p className="mt-2 text-sm font-semibold text-white">{NEW_YEAR_CUP.venue}</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4">
                  <Trophy size={18} className="text-white" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Format</p>
                  <p className="mt-2 text-sm font-semibold text-white">4 groups, 16 teams</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDoc("fixtures")}
                className="mt-6 button-primary bg-[#ff645f] hover:bg-[#ef5752]"
              >
                View fixtures
              </button>
              <button
                type="button"
                onClick={() => setPreviewDoc("nnyc")}
                className="mt-3 button-secondary border-white/20 bg-white/12 text-white hover:bg-white/20"
              >
                View NNYC rulebook
              </button>
            </div>

            <div className="grid gap-px bg-slate-200/90 sm:grid-cols-2">
              {NEW_YEAR_CUP.groups.slice(0, 4).map((group) => (
                <div key={group.name} className="bg-white px-4 py-4 sm:px-5 sm:py-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a838c]">{group.name}</p>
                  <ul className="mt-3 space-y-2">
                    {group.teams.map((team) => (
                      <li key={team} className="text-sm font-medium leading-6 text-[#101820]">
                        {team}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="league" className="shell-card overflow-hidden px-5 py-6 sm:px-6 sm:py-7 lg:px-8">
          <div className="section-divider">
            <div>
              <div className="flex items-center gap-3">
                <img src="/spl-logo.png" alt="SPL logo" className="h-12 w-auto object-contain sm:h-14" />
                <p className="section-kicker">SPL • Samsara Premier League</p>
              </div>
              <h2 className="section-title mt-3">Competition updates without the clutter.</h2>
            </div>
            <button type="button" onClick={openSeasonHub} className="button-primary">
              Go to season hub
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="surface-muted px-4 py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#7a838c]">Champions</p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#101820]">Khukuri Canberra FC</p>
                <p className="mt-2 text-sm text-[#66707d]">Season 2 champions</p>
              </div>
              <div className="surface-muted px-4 py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#7a838c]">League winners</p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#101820]">Thuenlam FC</p>
                <p className="mt-2 text-sm text-[#66707d]">Running shield winners</p>
              </div>
              <div className="surface-muted px-4 py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#7a838c]">Season 3</p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#101820]">Starts Nov 2027</p>
                <p className="mt-2 text-sm text-[#66707d]">Next SPL season</p>
              </div>
            </div>

            <div className="editorial-frame overflow-hidden">
              <div className="grid h-full md:grid-cols-[1fr_0.95fr]">
                <div className="p-5 sm:p-6">
                  <p className="editorial-label">League overview</p>
                  <p className="mt-3 text-sm leading-7 text-[#66707d]">{LEAGUE_INFO.description}</p>
                  <button
                    type="button"
                    onClick={() => setPreviewDoc("spl")}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#101820]"
                  >
                    View SPL rulebook
                    <ArrowUpRight size={16} />
                  </button>
                </div>
                <div className="relative min-h-[240px] border-t border-slate-200 md:border-l md:border-t-0">
                  <img
                    src="/gallery/Screenshot%202026-03-31%20at%204.20.34%E2%80%AFam.png"
                    alt="Samsara Premier League"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fixturesResults" className="shell-card px-5 py-6 sm:px-6 sm:py-7 lg:px-8">
          <div className="section-divider">
            <div>
              <p className="section-kicker">Season hub</p>
              <h2 className="section-title mt-3">Last season results, table, and match facts.</h2>
              <p className="section-copy mt-4 max-w-2xl">
                Open the season hub popup to review the completed SPL 2025-26 campaign with the final league table, weekly results, and detailed match facts.
              </p>
            </div>
            <div className="stack-actions">
              <button
                type="button"
                onClick={openSeasonHub}
                className="button-primary"
              >
                Open season hub
              </button>
            </div>
          </div>
        </section>

        <section id="sponsors" className="shell-card overflow-hidden px-0 py-5 sm:py-6">
          <div className="px-5 sm:px-6 lg:px-8">
            <div className="section-divider">
              <div>
                <p className="section-kicker">Sponsors & supporters</p>
                <h2 className="section-title mt-3">Backed by local businesses and community partners.</h2>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3 px-5 sm:px-6 lg:px-8">
              {SPONSORS.map((name) => (
                <div key={name} className="whitespace-nowrap rounded-full border border-slate-200 bg-[#f7f7f3] px-5 py-3 text-sm font-semibold text-[#101820]">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="community" className="shell-card px-5 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-4 xl:grid-cols-[140px_1fr_auto] xl:items-center">
            <div className="image-tile max-w-[140px]">
              <img
                src="/gallery/Screenshot%202026-03-31%20at%204.20.47%E2%80%AFam.png"
                alt="Community"
                className="aspect-square h-full w-full object-cover object-center"
              />
            </div>
            <div className="max-w-2xl">
              <p className="section-kicker">Community</p>
              <h2 className="mt-2 text-[1.55rem] font-semibold tracking-[-0.04em] text-[#101820]">More than football.</h2>
              <p className="mt-3 text-sm leading-7 text-[#66707d]">
                Tournaments, events, volunteers, and supporters all contribute to a stronger community presence in Canberra.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <a href={`mailto:${ORG.email}`} className="button-primary">
                Contact us
              </a>
              <a href="/gallery" className="button-secondary">
                View gallery
              </a>
            </div>
          </div>
        </section>
      </main>

      <MainFooter />

      <Modal open={showSeasonHub} onClose={() => setShowSeasonHub(false)} wide>
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Season hub</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">SPL 2025-26</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Final league table, last season results, match facts, and official competition documents.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setPreviewDoc("spl")} className="button-secondary">
                SPL rulebook
              </button>
              <button type="button" onClick={() => setPreviewDoc("nnyc")} className="button-secondary">
                NNYC rulebook
              </button>
            </div>
          </div>

          <LeagueTableSection />
          <FixturesResultsSection />
        </div>
      </Modal>

      <Modal open={previewDoc !== null} onClose={() => setPreviewDoc(null)} wide>
        {previewDoc === "fixtures" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Document preview</p>
                <h3 className="mt-2 text-2xl font-semibold">NNYC Fixtures</h3>
              </div>
              <a href="/files/NNYC-Fixtures.pdf" target="_blank" rel="noreferrer" className="button-secondary">
                Open PDF
              </a>
            </div>
            <iframe src="/files/NNYC-Fixtures.pdf" title="NNYC fixtures preview" className="h-[72vh] w-full rounded-[1rem] border border-white/10 bg-white" />
          </div>
        )}

        {previewDoc === "spl" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Document preview</p>
                <h3 className="mt-2 text-2xl font-semibold">SPL Rulebook & Code of Conduct</h3>
              </div>
              <a href="/files/SPL Official Rulebook & Code of Conduct.pdf" target="_blank" rel="noreferrer" className="button-secondary">
                Open PDF
              </a>
            </div>
            <iframe src="/files/SPL Official Rulebook & Code of Conduct.pdf" title="SPL rulebook preview" className="h-[72vh] w-full rounded-[1rem] border border-white/10 bg-white" />
          </div>
        )}

        {previewDoc === "nnyc" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Document preview</p>
                <h3 className="mt-2 text-2xl font-semibold">NNYC 2083 Rulebook</h3>
              </div>
              <a href="/files/NNYC 2083 - Rulebook.pdf" target="_blank" rel="noreferrer" className="button-secondary">
                Open PDF
              </a>
            </div>
            <iframe src="/files/NNYC 2083 - Rulebook.pdf" title="NNYC rulebook preview" className="h-[72vh] w-full rounded-[1rem] border border-white/10 bg-white" />
          </div>
        )}
      </Modal>
    </div>
  );
}
