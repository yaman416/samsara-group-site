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

const NNYC_STANDINGS = [
  {
    group: "Group A",
    leader: "Thuenlam FC",
    rows: [
      { team: "Thuenlam FC", p: 3, w: 3, d: 0, l: 0, gf: 4, ga: 1, gd: 3, pts: 9 },
      { team: "FC Yeedzin", p: 3, w: 2, d: 0, l: 1, gf: 7, ga: 3, gd: 4, pts: 6 },
      { team: "Everest FC", p: 3, w: 1, d: 0, l: 2, gf: 3, ga: 4, gd: -1, pts: 3 },
      { team: "JA Brothers Football Club", p: 3, w: 0, d: 0, l: 3, gf: 2, ga: 8, gd: -6, pts: 0 },
    ],
  },
  {
    group: "Group B",
    leader: "Phuensum Masters FC",
    rows: [
      { team: "Phuensum Masters FC", p: 3, w: 2, d: 1, l: 0, gf: 7, ga: 3, gd: 4, pts: 7 },
      { team: "Nazhoen Football Club", p: 3, w: 2, d: 1, l: 0, gf: 4, ga: 1, gd: 3, pts: 7 },
      { team: "Gurkha Rhinos FC", p: 3, w: 1, d: 0, l: 2, gf: 4, ga: 5, gd: -1, pts: 3 },
      { team: "Bros and Ball FC", p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 7, gd: -6, pts: 0 },
    ],
  },
  {
    group: "Group C",
    leader: "Canberra City FC",
    rows: [
      { team: "Canberra City FC", p: 3, w: 2, d: 1, l: 0, gf: 3, ga: 0, gd: 3, pts: 7 },
      { team: "Azhas FC", p: 3, w: 2, d: 0, l: 1, gf: 3, ga: 2, gd: 1, pts: 6 },
      { team: "Khukuri Canberra FC", p: 3, w: 1, d: 0, l: 2, gf: 1, ga: 2, gd: -1, pts: 3 },
      { team: "Aces FC", p: 3, w: 0, d: 1, l: 2, gf: 0, ga: 3, gd: -3, pts: 1 },
    ],
  },
  {
    group: "Group D",
    leader: "Queanbeyan Nepalese United Football Club",
    rows: [
      { team: "Queanbeyan Nepalese United Football Club", p: 3, w: 2, d: 1, l: 0, gf: 9, ga: 3, gd: 6, pts: 7 },
      { team: "Bicchi FC", p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 4, gd: -1, pts: 4 },
      { team: "Unity Stars FC", p: 3, w: 0, d: 3, l: 0, gf: 2, ga: 2, gd: 0, pts: 3 },
      { team: "Friends FC", p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 6, gd: -5, pts: 1 },
    ],
  },
];

const NNYC_KNOCKOUT = {
  left: {
    quarterfinals: [
      { match: "Quarterfinal 1", home: "Thuenlam FC", away: "Nazhoen Football Club" },
      { match: "Quarterfinal 2", home: "Canberra City FC", away: "Bicchi FC" },
    ],
    semifinal: { match: "Semifinal 1", home: "Winner QF1", away: "Winner QF2" },
  },
  right: {
    quarterfinals: [
      { match: "Quarterfinal 3", home: "Phuensum Masters FC", away: "FC Yeedzin" },
      { match: "Quarterfinal 4", home: "Queanbeyan Nepalese United Football Club", away: "Azhas FC" },
    ],
    semifinal: { match: "Semifinal 2", home: "Winner QF3", away: "Winner QF4" },
  },
  final: { match: "Championship Final", home: "Winner SF1", away: "Winner SF2" },
};

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
            {/* SBA x SPL title sponsor card — desktop */}
            <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 lg:flex xl:right-10">
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-5 shadow-2xl backdrop-blur-md">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Title Sponsor</p>
                <img src="/sponsor/sba.png" alt="SBA Property Group" className="h-16 w-16 rounded-xl bg-white object-contain p-2 shadow-lg" />
                <span className="text-[11px] font-bold text-white/30">x</span>
                <img src="/spl-logo.png" alt="SPL" className="h-20 w-20 object-contain drop-shadow-lg" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30">SPL Season 3</p>
              </div>
            </div>
            {/* SBA x SPL title sponsor card — mobile */}
            <div className="absolute right-3 top-3 z-10 lg:hidden">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md">
                <img src="/sponsor/sba.png" alt="SBA" className="h-11 w-11 rounded-xl bg-white object-contain p-1.5 shadow" />
                <span className="text-sm font-bold text-white/30">x</span>
                <img src="/spl-logo.png" alt="SPL" className="h-12 w-12 object-contain drop-shadow" />
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
                Group stages are complete. The next event is the knockout phase on Saturday, April 11, after 1 PM.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4">
                  <CalendarDays size={18} className="text-white" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Dates</p>
                  <p className="mt-2 text-sm font-semibold text-white">Sat 11 Apr, after 1 PM</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4">
                  <MapPin size={18} className="text-white" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Venue</p>
                  <p className="mt-2 text-sm font-semibold text-white">{NEW_YEAR_CUP.venue}</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4">
                  <Trophy size={18} className="text-white" />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Current</p>
                  <p className="mt-2 text-sm font-semibold text-white">Knockout phase next</p>
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
              {NNYC_STANDINGS.map((group) => (
                <div key={group.group} className="bg-white px-4 py-4 sm:px-5 sm:py-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a838c]">{group.group}</p>
                    <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[11px] font-semibold text-[#2563eb]">
                      {group.leader}
                    </span>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-xs text-[#5f6b76]">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="pb-2 pr-3 font-semibold">#</th>
                          <th className="pb-2 pr-3 font-semibold">Team</th>
                          <th className="pb-2 pr-2 font-semibold">P</th>
                          <th className="pb-2 pr-2 font-semibold">GD</th>
                          <th className="pb-2 font-semibold">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map((row, index) => (
                          <tr key={row.team} className="border-b border-slate-100 last:border-b-0">
                            <td className="py-2 pr-3 text-[#101820]">{index + 1}</td>
                            <td className="py-2 pr-3 font-medium text-[#101820]">{row.team}</td>
                            <td className="py-2 pr-2">{row.p}</td>
                            <td className="py-2 pr-2">{row.gd}</td>
                            <td className="py-2 font-semibold text-[#101820]">{row.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#15181b] px-5 py-6 text-white sm:px-7 sm:py-8 lg:px-10 lg:py-10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-kicker text-white/60">Knockout ladder</p>
                <h3 className="mt-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-white sm:text-[2rem]">
                  Road to the championship
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
                  The ladder below follows the current qualified teams from group standings and shows the path from quarterfinals to the final.
                </p>
              </div>
              <p className="text-sm font-medium text-white/72">Knockout phase starts Saturday, April 11 after 1 PM</p>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.86fr_1fr]">
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Left side</p>
                <div className="grid gap-4 lg:grid-cols-[1fr_0.88fr]">
                  <div className="space-y-3">
                    {NNYC_KNOCKOUT.left.quarterfinals.map((fixture) => (
                      <div key={fixture.match} className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">{fixture.match}</p>
                        <div className="mt-3 space-y-2">
                          <p className="rounded-[0.9rem] bg-white px-3 py-2 text-sm font-semibold text-[#101820]">{fixture.home}</p>
                          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">vs</p>
                          <p className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-sm font-semibold text-white">{fixture.away}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex lg:items-center">
                    <div className="w-full rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-5 lg:ml-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                        {NNYC_KNOCKOUT.left.semifinal.match}
                      </p>
                      <div className="mt-3 space-y-2">
                        <p className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-sm font-semibold text-white">
                          {NNYC_KNOCKOUT.left.semifinal.home}
                        </p>
                        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">vs</p>
                        <p className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-sm font-semibold text-white">
                          {NNYC_KNOCKOUT.left.semifinal.away}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="w-full rounded-[1.5rem] border border-[#ff645f]/30 bg-[#ff645f]/12 px-5 py-6">
                  <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffb1ae]">Final</p>
                  <h4 className="mt-3 text-center text-xl font-semibold tracking-[-0.04em] text-white">
                    {NNYC_KNOCKOUT.final.match}
                  </h4>
                  <div className="mt-5 space-y-3">
                    <p className="rounded-[1rem] bg-white px-4 py-3 text-center text-sm font-semibold text-[#101820]">{NNYC_KNOCKOUT.final.home}</p>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">vs</p>
                    <p className="rounded-[1rem] bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white">{NNYC_KNOCKOUT.final.away}</p>
                  </div>
                  <p className="mt-5 text-center text-sm leading-6 text-white/70">
                    Each side of the bracket produces one finalist.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 text-left xl:text-right">Right side</p>
                <div className="grid gap-4 lg:grid-cols-[0.88fr_1fr]">
                  <div className="flex lg:items-center">
                    <div className="w-full rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-5 lg:mr-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                        {NNYC_KNOCKOUT.right.semifinal.match}
                      </p>
                      <div className="mt-3 space-y-2">
                        <p className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-sm font-semibold text-white">
                          {NNYC_KNOCKOUT.right.semifinal.home}
                        </p>
                        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">vs</p>
                        <p className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-sm font-semibold text-white">
                          {NNYC_KNOCKOUT.right.semifinal.away}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {NNYC_KNOCKOUT.right.quarterfinals.map((fixture) => (
                      <div key={fixture.match} className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">{fixture.match}</p>
                        <div className="mt-3 space-y-2">
                          <p className="rounded-[0.9rem] bg-white px-3 py-2 text-sm font-semibold text-[#101820]">{fixture.home}</p>
                          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">vs</p>
                          <p className="rounded-[0.9rem] bg-white/10 px-3 py-2 text-sm font-semibold text-white">{fixture.away}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[#101820]">Starts Nov 2026</p>
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
