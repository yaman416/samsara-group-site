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

const IMAGE_LABELS = [
  "Nepal United FC",
  "Thuenlam FC",
  "Khukuri Canberra FC",
  "Queanbeyan Nepalese United Football Club",
  "Azhas FC",
  "CNFC Canberra",
  "Druk FC",
  "Everest FC",
  "JA Brothers Football Club",
  "Achos Football Team",
  "Phuensum FC",
  "Unity Stars FC",
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

  const clubLabel = IMAGE_LABELS[index] ?? "Samsara Premier League club";

  return (
    <section
      id="top"
      className="mt-6 grid gap-6 md:grid-cols-2 items-stretch"
    >
      {/* Left: About Samsara Group */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {ORG.name} - Canberra
        </h1>

        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          The Samsara Group is a volunteer led community organisation in
          Canberra. We create welcoming spaces where Nepalese and Bhutanese
          communities can connect, celebrate, and grow together.
        </p>

        <div className="text-xs md:text-sm text-gray-700 space-y-2">
          <p className="font-semibold">What we do</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Host cultural events and community gatherings</li>
            <li>Support youth through volunteering and leadership opportunities</li>
            <li>Run community sport, including the Samsara Premier League</li>
          </ul>
        </div>

        <div className="text-xs md:text-sm text-gray-600">
          <p>
            <strong>Flagship event:</strong> {SPL_SEASON.name} at{" "}
            {SPL_SEASON.venue}
          </p>
        </div>

        {/* YouTube button only here */}
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

      {/* Right: Photo slider with club label */}
      <div className="relative rounded-2xl overflow-hidden border bg-gray-200 h-56 md:h-64 lg:h-72">
        <img
          src={IMAGES[index]}
          alt={clubLabel}
          className="h-full w-full object-cover transition-opacity duration-500"
        />

        {/* Overlay labels and dots */}
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center rounded-full bg-black/70 px-3 py-1 text-[11px] text-white">
              <span className="font-semibold">{clubLabel}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-[10px] text-gray-100">
              Samsara Premier League 2025-26
            </div>
          </div>
          <div className="flex gap-1">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                className={`h-1.5 w-5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
