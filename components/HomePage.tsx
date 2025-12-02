// components/HomePage.tsx
"use client";

import { useState } from "react";
import MainHeader from "@/components/MainHeader";
import HeroSection from "@/components/HeroSection";
import FeaturedEventsSection from "@/components/FeaturedEventsSection";
import LeagueTableSection from "@/components/LeagueTableSection";
import SponsorsSection from "@/components/SponsorsSection";
import MainFooter from "@/components/MainFooter";
import FixturesResultsSection from "@/components/FixturesResultsSection";
import DownloadsSection from "@/components/DownloadsSection";


type SectionKey = "home" | "table" | "fixtures" | "results" | "sponsors";

export default function HomePage() {
  const [section, setSection] = useState<SectionKey>("home");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <MainHeader active={section} onChange={setSection} />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossOrigin="anonymous"></script>
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 pb-10">
        <HeroSection />
        <FeaturedEventsSection />
        <LeagueTableSection />
        <FixturesResultsSection/>
        <DownloadsSection />
        <SponsorsSection />
      </main>
      <MainFooter />
    </div>
  );
}
