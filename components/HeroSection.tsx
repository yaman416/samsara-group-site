// components/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import { SPL_SEASON } from "@/lib/splData";

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
    <section id="top" className="mt-6 space-y-8">
      {/* Full width image slider */}
      <div className="relative h-80 overflow-hidden rounded-3xl border bg-slate-100 sm:h-96 md:h-[520px]">
        <img
          src={IMAGES[index]}
          alt={LABELS[index]}
          className="h-full w-full object-cover"
        />

        {/* Dark gradient overlay at bottom for text readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Tag and caption */}
        <div className="absolute left-4 right-4 bottom-4 flex flex-col gap-2 sm:left-6 sm:right-6 sm:bottom-5">
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-800 shadow-sm">
            <span>Samsara Premier League</span>
            <span className="text-[10px] uppercase tracking-wide">
              SPL 2025-26
            </span>
          </div>

          <div className="max-w-md rounded-2xl bg-black/60 px-3 py-2 text-xs text-white sm:px-4 sm:py-3 sm:text-sm">
            <p className="font-semibold">{LABELS[index]}</p>
            <p className="text-[11px] text-slate-200">
              Community football in Canberra at {SPL_SEASON.venue}
            </p>
          </div>
        </div>

        {/* Slider dots */}
        <div className="absolute inset-x-0 top-3 flex justify-center gap-1.5">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-6 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* About section full width */}
      <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6 md:p-8">
        {/* Heading row */}
        <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Samsara Group Canberra
            </h1>
            <p className="mt-1 text-xs text-slate-600 md:text-sm">
              Volunteer led community organisation supporting Nepalese and
              Bhutanese communities in Canberra.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] md:text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              Community events and culture
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              Youth and sport
            </span>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] md:items-start">
          {/* Left: main about text */}
          <div className="space-y-4 text-xs text-slate-700 md:text-sm">
            <p>
              The Samsara Group creates welcoming spaces where people can
              connect, celebrate, and support each other. Our work focuses on
              bringing Nepalese and Bhutanese communities together in Canberra.
            </p>

            <div>
              <p className="font-semibold">What we do</p>
              <ul className="mt-1 list-disc space-y-1 pl-4">
                <li>Host cultural events and community gatherings</li>
                <li>Support youth through volunteering and leadership</li>
                <li>Run community sport, including the Samsara Premier League</li>
              </ul>
            </div>

            <p className="text-xs text-slate-600 md:text-sm">
              Our volunteers, clubs, and partners work together to deliver safe,
              organised, and family friendly events throughout the year.
            </p>
          </div>

          {/* Right: key info and button */}
          <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-700 md:text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Flagship program
            </p>
            <p className="font-semibold">
              {SPL_SEASON.name}
            </p>
            <p className="text-slate-600">
              Venue: <span className="font-medium">{SPL_SEASON.venue}</span>
            </p>
            <p className="text-slate-600">
              Season start:{" "}
              <span className="font-medium">
                {new Date(SPL_SEASON.startDate).toLocaleDateString()}
              </span>
            </p>

            <a
              href="https://www.youtube.com/@SamsaraGroupCanberra"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 md:text-sm"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px]">
                ▶
              </span>
              <span>Watch Samsara Premier League live on YouTube</span>
            </a>

            <p className="mt-1 text-[11px] text-slate-500">
              Match weeks, results, and the league table are updated below as
              the season progresses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
