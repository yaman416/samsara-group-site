"use client";

import { useState } from "react";
import {
  Camera,
  CalendarDays,
  Mail,
  Music4,
  Trophy,
  UserPlus,
  Users,
  Utensils,
  Volleyball,
} from "lucide-react";
import MainHeader from "@/components/MainHeader";
import HeroSection from "@/components/HeroSection";
import LeagueTableSection from "@/components/LeagueTableSection";
import FixturesResultsSection from "@/components/FixturesResultsSection";
import DownloadsSection from "@/components/DownloadsSection";
import SponsorsSection from "@/components/SponsorsSection";
import MainFooter from "@/components/MainFooter";
import { ORG } from "@/lib/splData";
import {
  ABOUT_SAMSARA,
  COMMUNITY_EVENTS,
  GALLERY_HIGHLIGHTS,
  JOIN_OPTIONS,
  LEAGUE_INFO,
  NEWS_UPDATES,
  NEW_YEAR_CUP,
} from "@/lib/siteContent";

type SeasonHubTab = "tournament" | "spl";

export default function HomePage() {
  const [seasonHubTab, setSeasonHubTab] = useState<SeasonHubTab>("tournament");

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-transparent">
      <MainHeader />
      <main className="page-shell flex-1 space-y-8 sm:space-y-10">
        <HeroSection />

        <section id="league" className="shell-card overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[320px]">
              <img src="/gallery/FINAL%20SPL%202025-26/642817713_122200982624559639_2172016094638242016_n.jpg" alt="Samsara Premier League" className="absolute inset-0 h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111922]/82 via-[#111922]/28 to-transparent" />
              <div className="absolute inset-0 p-5 sm:p-7 lg:p-8">
                <div className="max-w-2xl">
                  <p className="section-kicker">Samsara Premier League</p>
                  <h2 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                    Community football competition in Canberra.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">{LEAGUE_INFO.description}</p>
                  <a href="#fixturesResults" className="button-primary mt-6">
                    Open Season Hub
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-t border-slate-200 p-5 sm:p-6 lg:border-l lg:border-t-0">
                <p className="editorial-caption">Past winners</p>
                <div className="mt-4 grid gap-2">
                  {LEAGUE_INFO.winners.map((winner, index) => (
                    <div key={winner} className="rounded-[1rem] border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm text-[#15202b]">
                      {index + 1}. {winner}
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-200 p-5 sm:p-6 lg:border-l">
                <p className="editorial-caption">Season history</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {LEAGUE_INFO.seasons.map((season) => (
                    <span key={season} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-[#15202b]">
                      {season}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {LEAGUE_INFO.stats.map((item) => (
                    <div key={item.label} className="rounded-[1rem] border border-slate-200 bg-[#f8fafc] px-4 py-4">
                      <p className="text-2xl font-semibold tracking-[-0.03em] text-[#15202b]">{item.value}</p>
                      <p className="mt-1 text-sm text-[#607181]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fixturesResults" className="shell-card p-5 sm:p-7 lg:p-8">
          <div className="section-divider">
            <div className="min-w-0">
              <p className="section-kicker">Season hub</p>
              <h2 className="section-title mt-3">Samsara football season hub</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#607181]">
                Track the upcoming Nepalese New Year Cup on the homepage, while the SPL 2025-26 table and match facts stay available under their own tab.
              </p>
            </div>
            <div className="stack-actions">
              {([
                { key: "tournament", label: "Upcoming Tournament" },
                { key: "spl", label: "SPL 2025-26" },
              ] as { key: SeasonHubTab; label: string }[]).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSeasonHubTab(tab.key)}
                  className={`button-chip w-full sm:w-auto ${
                    seasonHubTab === tab.key
                      ? "bg-[#18212a] text-white"
                      : "border border-slate-200 bg-white text-[#607181] hover:bg-[#f6f8fa]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {seasonHubTab === "tournament" ? (
            <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="surface-muted px-5 py-5">
                    <div className="flex items-center gap-2 text-[#18212a]">
                      <CalendarDays size={18} />
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">Dates</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-[#15202b]">{NEW_YEAR_CUP.dates}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#607181]">
                      Group stages and finals for the Nepalese New Year Cup 2083.
                    </p>
                  </div>

                  <div className="surface-muted px-5 py-5">
                    <div className="flex items-center gap-2 text-[#18212a]">
                      <CalendarDays size={18} />
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">Venue</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-[#15202b]">{NEW_YEAR_CUP.venue}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#607181]">
                      Community tournament venue for both event weekends.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {NEW_YEAR_CUP.groups.map((group) => (
                    <div key={group.name} className="surface-muted px-5 py-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5f6b76]">{group.name}</p>
                      <div className="mt-3 grid gap-2">
                        {group.teams.map((team) => (
                          <div key={team} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#15202b]">
                            {team}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="stack-actions">
                  <a href="/files/NNYC-Fixtures.pdf" target="_blank" rel="noreferrer" className="button-primary">
                    View Full Fixtures PDF
                  </a>
                  <a href="/files/NNYC 2083 - Rulebook.pdf" target="_blank" rel="noreferrer" className="button-secondary">
                    View NNYC Rulebook
                  </a>
                </div>
              </div>

              <div className="editorial-frame overflow-hidden">
                <img
                  src="/gallery/FINAL%20SPL%202025-26/645590660_122201103038559639_895508620839760949_n.jpg"
                  alt="Upcoming New Year Cup"
                  className="aspect-[16/11] h-full w-full object-cover object-center"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <LeagueTableSection />
              <FixturesResultsSection />
            </div>
          )}
        </section>

        <section id="newYearCup" className="shell-card p-5 sm:p-7 lg:p-8">
          <div className="section-divider">
            <div className="min-w-0">
              <p className="section-kicker">Nepalese New Year Cup</p>
              <h2 className="section-title mt-3">Celebrate culture through football.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#607181]">{NEW_YEAR_CUP.description}</p>
            </div>
            <a href="#join" className="button-primary">
              {NEW_YEAR_CUP.cta}
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="editorial-frame overflow-hidden">
                <img src="/gallery/Screenshot%202026-03-31%20at%204.18.35%E2%80%AFam.png" alt="New Year Cup celebration" className="aspect-[16/11] h-full w-full object-cover object-center" />
              </div>
              <div className="editorial-frame overflow-hidden">
                <img src="/gallery/Screenshot%202026-03-31%20at%204.21.06%E2%80%AFam.png" alt="Cultural activities" className="aspect-[16/11] h-full w-full object-cover object-center" />
              </div>
            </div>

            <div className="grid gap-3">
              {NEW_YEAR_CUP.highlights.map((item) => (
                <div key={item} className="surface-muted flex items-center gap-3 px-4 py-4 text-sm text-[#15202b]">
                  <Volleyball size={18} className="text-[#18212a]" />
                  <span>{item}</span>
                </div>
              ))}
              <div className="surface-muted grid gap-3 px-4 py-4">
                <div className="flex items-center gap-3 text-sm text-[#15202b]">
                  <CalendarDays size={18} className="text-[#18212a]" />
                  {NEW_YEAR_CUP.dates}
                </div>
                <div className="flex items-center gap-3 text-sm text-[#15202b]">
                  <CalendarDays size={18} className="text-[#18212a]" />
                  {NEW_YEAR_CUP.venue}
                </div>
                <div className="flex items-center gap-3 text-sm text-[#15202b]">
                  <Utensils size={18} className="text-[#18212a]" />
                  Food stalls
                </div>
                <div className="flex items-center gap-3 text-sm text-[#15202b]">
                  <Music4 size={18} className="text-[#18212a]" />
                  Music
                </div>
                <div className="flex items-center gap-3 text-sm text-[#15202b]">
                  <Users size={18} className="text-[#18212a]" />
                  Community celebration
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="news" className="shell-card p-5 sm:p-7">
          <div className="section-divider">
            <div className="min-w-0">
              <p className="section-kicker">News & updates</p>
              <h2 className="section-title mt-3">Match reports, announcements, and event updates.</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {NEWS_UPDATES.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-[1rem] border border-slate-200 bg-white">
                <img src={item.image} alt={item.title} className="aspect-[16/10] h-full w-full object-cover object-center" />
                <div className="p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6a7682]">{item.tag}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#15202b]">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="shell-card p-5 sm:p-7">
          <div className="section-divider">
            <div className="min-w-0">
              <p className="section-kicker">Gallery / Highlights</p>
              <h2 className="section-title mt-3">Match photos, celebrations, and video-style moments.</h2>
            </div>
            <a href="/gallery" className="button-secondary">
              Open Full Gallery
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {GALLERY_HIGHLIGHTS.map((item) => (
              <div key={item.title} className="group relative overflow-hidden rounded-[1rem] border border-slate-200">
                <img src={item.image} alt={item.title} className="aspect-[16/10] h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111a]/85 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <div className="rounded-full bg-white p-3 text-[#18212a]">
                    <Camera size={18} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <DownloadsSection />

        <section id="community" className="shell-card p-5 sm:p-7 lg:p-8">
          <div className="section-divider">
            <div className="min-w-0">
              <p className="section-kicker">Community events</p>
              <h2 className="section-title mt-3">More than football.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#607181]">
                Future expansion across festivals, social gatherings, youth programs, and community-led events.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {COMMUNITY_EVENTS.map((item) => (
              <div key={item} className="surface-muted px-5 py-5">
                <p className="text-lg font-semibold text-[#15202b]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="shell-card p-5 sm:p-7 lg:p-8">
          <div className="section-divider">
            <div className="min-w-0">
              <p className="section-kicker">About us</p>
              <h2 className="section-title mt-3">Community football and culture in Canberra.</h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm leading-8 text-[#607181]">{ABOUT_SAMSARA.story}</p>
            </div>
            <div className="grid gap-3">
              {ABOUT_SAMSARA.mission.map((item) => (
                <div key={item} className="surface-muted px-4 py-4 text-sm text-[#15202b]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <SponsorsSection />

        <section id="join" className="shell-card p-5 sm:p-7 lg:p-8">
          <div className="section-divider">
            <div className="min-w-0">
              <p className="section-kicker">Join / Register</p>
              <h2 className="section-title mt-3">To register or volunteer, please contact us.</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {JOIN_OPTIONS.map((item, index) => (
              <div key={item.title} className="surface-muted px-5 py-5">
                <div className="mb-4 inline-flex rounded-full bg-[#18212a]/8 p-3 text-[#18212a]">
                  {index === 0 ? <Trophy size={18} /> : index === 1 ? <UserPlus size={18} /> : <Mail size={18} />}
                </div>
                <h3 className="text-xl font-semibold text-[#15202b]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#607181]">{item.description}</p>
                {index === 2 && (
                  <a
                    href={`mailto:${ORG.email}`}
                    className="button-secondary mt-4 text-xs uppercase tracking-[0.14em]"
                  >
                    {ORG.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <MainFooter />
    </div>
  );
}
