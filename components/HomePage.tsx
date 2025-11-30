// components/HomePage.tsx
"use client";

import { useState } from "react";
import MainHeader from "@/components/MainHeader";
import HeroSection from "@/components/HeroSection";
import FeaturedEventsSection from "@/components/FeaturedEventsSection";
import LeagueTableSection from "@/components/LeagueTableSection";
import UpcomingFixturesSection from "@/components/UpcomingFixturesSection";
import ResultsSection from "@/components/ResultsSection";
import SponsorsSection from "@/components/SponsorsSection";
import MainFooter from "@/components/MainFooter";

export type SectionKey =
  | "home"
  | "table"
  | "fixtures"
  | "results"
  | "sponsors";

export default function HomePage() {
  const [section, setSection] = useState<SectionKey>("home");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <MainHeader active={section} onChange={setSection} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 pb-10">
          {/* Hero / About */}
          <HeroSection />

          {/* Featured event */}
          <div className="mt-10">
            <FeaturedEventsSection />
          </div>

          {/* League table + fixtures + results */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LeagueTableSection />
            </div>
            <div className="lg:col-span-1">
              <UpcomingFixturesSection />
            </div>
          </div>

          <div className="mt-10">
            <ResultsSection />
          </div>

          <div className="mt-10">
            <SponsorsSection />
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
