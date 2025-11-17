// components/HomePage.tsx
"use client";

import { useState } from "react";
import MainHeader from "@/components/MainHeader";
import HeroSection from "@/components/HeroSection";
import FeaturedEventsSection from "@/components/FeaturedEventsSection";
import LeagueTableSection from "@/components/LeagueTableSection";
import UpcomingFixturesSection from "@/components/UpcomingFixturesSection";
import SponsorsSection from "@/components/SponsorsSection";
import MainFooter from "@/components/MainFooter";

type SectionKey = "home" | "table" | "fixtures" | "sponsors";

export default function HomePage() {
  const [section, setSection] = useState<SectionKey>("home");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainHeader active={section} onChange={setSection} />
      <main className="flex-1 mx-auto max-w-6xl px-4 pb-10">
        {section === "home" && (
          <>
            <HeroSection />
            <FeaturedEventsSection />
            {/* League table ABOVE fixtures */}
            <LeagueTableSection />
            <UpcomingFixturesSection />
            <SponsorsSection />
          </>
        )}

        {section === "table" && (
          <>
            <HeroSection />
            {/* Focus on table first, fixtures under it */}
            <LeagueTableSection />
            <UpcomingFixturesSection />
          </>
        )}

        {section === "fixtures" && (
          <>
            <HeroSection />
            {/* Still keep table above fixtures for consistency */}
            <LeagueTableSection />
            <UpcomingFixturesSection />
          </>
        )}

        {section === "sponsors" && (
          <>
            <HeroSection />
            <SponsorsSection />
          </>
        )}
      </main>
      <MainFooter />
    </div>
  );
}
