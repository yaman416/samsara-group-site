// components/HomePage.tsx
"use client";

import { useEffect, useState } from "react";
import MainHeader from "@/components/MainHeader";
import HeroSection from "@/components/HeroSection";
import FeaturedEventsSection from "@/components/FeaturedEventsSection";
import LeagueTableSection from "@/components/LeagueTableSection";
import UpcomingFixturesSection from "@/components/UpcomingFixturesSection";
import ResultsSection from "@/components/ResultsSection";
import SponsorsSection from "@/components/SponsorsSection";
import MainFooter from "@/components/MainFooter";

type SectionKey = "home" | "table" | "fixtures" | "results" | "sponsors";

const SECTION_IDS: Record<SectionKey, string> = {
  home: "section-home",
  table: "section-table",
  fixtures: "section-fixtures",
  results: "section-results",
  sponsors: "section-sponsors",
};

export default function HomePage() {
  const [section, setSection] = useState<SectionKey>("home");

  // When header button changes `section`, smoothly scroll to that block
  useEffect(() => {
    const id = SECTION_IDS[section];
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 80; // adjust if your header is taller or smaller
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top - headerOffset;

    window.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });
  }, [section]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 overflow-x-hidden">
      {/* Sticky header */}
      <MainHeader active={section} onChange={setSection} />

      {/* Main content */}
      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-10 pt-4 space-y-8">
        {/* Home / Hero section */}
        <section id="section-home" className="space-y-4">
          <HeroSection />
          <FeaturedEventsSection />
        </section>

        {/* League Table */}
        <section id="section-table">
          <LeagueTableSection />
        </section>

        {/* Fixtures */}
        <section id="section-fixtures">
          <UpcomingFixturesSection />
        </section>

        {/* Results */}
        <section id="section-results">
          <ResultsSection />
        </section>

        {/* Sponsors */}
        <section id="section-sponsors">
          <SponsorsSection />
        </section>
      </main>

      <MainFooter />
    </div>
  );
}
