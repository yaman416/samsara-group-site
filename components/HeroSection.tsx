// components/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import { ORG, SPL_SEASON } from "@/lib/splData";

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

const YOUTUBE_URL = "https://www.youtube.com/@SamsaraGroupCanberra";

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="mt-6 grid gap-6 md:grid-cols-2 items-stretch"
    >
      {/* Left: text content */}
      <div className="space-y-4 md:space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] md:text-xs text-blue-700 font-medium">
          <span className="h-4 w-4 flex items-center justify-center rounded-full bg-white text-[10px]">
            ⚽
          </span>
          Samsara Premier League 2025-26
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            {ORG.name} - Canberra
          </h1>
          <p className="mt-1 text-xs md:text-sm text-gray-600">
            Fostering community and empowering growth through culture, sport,
            and community events.
          </p>
        </div>

        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          The Samsara Group is a volunteer led community organisation in
          Canberra. We create welcoming spaces where Nepalese and Bhutanese
          communities can connect, celebrate, and grow together.
        </p>

        <div className="text-xs md:text-sm text-gray-700 space-y-2">
          <p className="font-semibold">What we focus on</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Community sport, including the Samsara Premier League</li>
            <li>Cultural events and community gatherings</li>
            <li>Youth engagement, volunteering, and leadership pathways</li>
          </ul>
        </div>

        <div className="text-xs md:text-sm text-gray-600 space-y-1">
          <p>
            <strong>Flagship event:</strong> {SPL_SEASON.name}
          </p>
          <p>
            <strong>Venue:</strong> {SPL_SEASON.venue}
          </p>
        </div>

        {/* Single YouTube button */}
        <div className="pt-1">
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            <span className="h-4 w-4 flex items-center justify-center rounded-[4px] bg-white/10 text-[11px]">
              ▶
            </span>
            <span>Watch Samsara Premier League live on YouTube</span>
          </a>
        </div>
      </div>

      {/* Right: photo slider */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-200 h-56 md:h-64 lg:h-72 shadow-sm">
        <img
          src={IMAGES[index]}
          alt="Samsara Group event"
          className="h-full w-full object-cover transition-opacity duration-500"
        />

        {/* Gradient overlay and label */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs md:text-sm font-semibold text-white">
              Samsara Premier League (SPL) 2025-26
            </p>
            <p className="text-[11px] text-gray-100">
              Live from Nicholls Synthetic Soccer Field, Canberra.
            </p>
          </div>

          {/* Slider dots */}
          <div className="flex gap-1">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={[
                  "h-1.5 w-5 rounded-full transition-all",
                  i === index ? "bg-white" : "bg-white/40",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
