// components/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import { ORG, SPL_SEASON } from "@/lib/splData";

// Hero images in /public
const IMAGES = [
  "/hero-1.jpg",
  "/hero-2.jpg",
  "/hero-3.jpg",
  "/hero-4.jpg",
  "/hero-5.jpg",
  "/hero-6.jpg",
  "/hero-7.jpg",
  "/hero-8.jpg",
  "/hero-9.jpg",
  "/hero-10.jpg",
  "/hero-11.jpg",
  "/hero-12.jpg",
];

// Automatically detect next match week
function getUpcomingWeek(): number {
  const today = new Date();
  const start = new Date(SPL_SEASON.startDate);
  const diff = today.getTime() - start.getTime();
  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.min(Math.max(week, 1), 11);
}

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const nextWeek = getUpcomingWeek();

  useEffect(() => {
    if (IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="mt-8 grid gap-8 md:grid-cols-2 items-stretch">
      {/* Left Side Content */}
      <div className="space-y-5">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {ORG.name}
        </h1>

        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          The Samsara Group is a volunteer led community organisation in
          Canberra. We create welcoming spaces where Nepalese and Bhutanese
          communities come together through culture, sport, youth programs, and
          community events.
        </p>

        <div className="text-sm md:text-base text-gray-700 space-y-2">
          <p className="font-semibold">What we focus on</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Community gatherings and cultural programs</li>
            <li>Youth leadership and volunteering opportunities</li>
            <li>Sporting events including the Samsara Premier League</li>
          </ul>
        </div>

        {/* SPL Highlight Box */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="font-bold text-gray-900 text-sm md:text-base">
            {SPL_SEASON.name}
          </p>
          <p className="text-gray-700 text-xs md:text-sm">
            Venue: {SPL_SEASON.venue}
          </p>
          <p className="mt-1 text-blue-700 font-semibold text-xs md:text-sm">
            ⭐ Upcoming Match Week: Week {nextWeek}
          </p>

          <a
            href={ORG.youtube}
            target="_blank"
            className="inline-block mt-3 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
          >
            Watch SPL Live on YouTube
          </a>
        </div>
      </div>

      {/* Right Side – Slider */}
      <div className="relative rounded-2xl overflow-hidden border bg-gray-200 h-60 md:h-72 lg:h-80 shadow-lg">
        <img
          src={IMAGES[index]}
          alt="Samsara Group event"
          className="h-full w-full object-cover transition-opacity duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />

        {/* Small indicators */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-6 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
