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
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <MainHeader active={section} onChange={setSection} />
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 pb-10">
        <HeroSection />
        <FeaturedEventsSection />
        <LeagueTableSection />
        <UpcomingFixturesSection />
        <SponsorsSection />
      </main>
      <MainFooter />
    </div>
  );
}
