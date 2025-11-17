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

  const handleNavChange = (target: SectionKey) => {
    setSection(target);

    if (typeof window === "undefined") return;

    if (target === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (target === "table") {
      const el = document.getElementById("league-table");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (target === "fixtures") {
      const el = document.getElementById("upcoming-fixtures");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (target === "sponsors") {
      const el = document.getElementById("sponsors");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainHeader active={section} onChange={handleNavChange} />
      <main className="flex-1 mx-auto max-w-6xl px-4 pb-10">
        {/* We always render the same vertical layout; header just scrolls to sections */}
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
