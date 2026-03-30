// components/HomePage.tsx
"use client";

import MainHeader from "@/components/MainHeader";
import HeroSection from "@/components/HeroSection";
import LeagueTableSection from "@/components/LeagueTableSection";
import FixturesResultsSection from "@/components/FixturesResultsSection";
import DownloadsSection from "@/components/DownloadsSection";
import SponsorsSection from "@/components/SponsorsSection";
import MainFooter from "@/components/MainFooter";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <MainHeader />
      <main className="page-shell flex-1">
        <HeroSection />
        <LeagueTableSection />
        <FixturesResultsSection />
        <DownloadsSection />
        <SponsorsSection />
      </main>
      <MainFooter />
    </div>
  );
}
