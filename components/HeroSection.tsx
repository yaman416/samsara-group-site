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

const LABELS = [
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
      className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-stretch"
    >
      {/* Intro */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Samsara Group - Canberra
        </h1>

        <p className="text-sm leading-relaxed text-slate-700 md:text-base">
          The Samsara Group is a volunteer led community organisation in
          Canberra. We create welcoming spaces where Nepalese and Bhutanese
          communities can connect, celebrate, and grow together.
        </p>

        <div className="space-y-1 text-xs text-slate-700 md:text-sm">
          <p className="font-semibold">What we do</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Host cultural events and community gatherings</li>
            <li>Support youth through volunteering and leadership</li>
            <li>Run community sport, including the Samsara Premier League</li>
          </ul>
        </div>

        <p className="text-xs text-slate-600 md:text-sm">
          <span className="font-semibold">Flagship event:</span>{" "}
          {SPL_SEASON.name} at {SPL_SEASON.venue}
        </p>

        {/* Youtube button */}
        <a
          href="https://www.youtube.com/@SamsaraGroupCanberra"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 md:text-sm"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
            ▶
          </span>
          <span>Watch Samsara Premier League live on YouTube</span>
        </a>
      </div>

      {/* Slider */}
      <div className="relative h-60 overflow-hidden rounded-3xl border bg-slate-100 sm:h-64 md:h-72">
        <img
          src={IMAGES[index]}
          alt={LABELS[index]}
          className="h-full w-full object-cover"
        />

        {/* Team label */}
        <div className="absolute left-3 bottom-3 rounded-2xl bg-black/60 px-3 py-2 text-xs text-white sm:text-sm">
          <p className="font-semibold">{LABELS[index]}</p>
          <p className="text-[11px] text-slate-200">
            Samsara Premier League 2025-26
          </p>
        </div>

        {/* Dots */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-6 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
