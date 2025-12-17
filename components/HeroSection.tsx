// components/HeroSection.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ORG, SPL_SEASON, TEAMS as LEAGUE_TEAMS } from "@/lib/splData";
import { Users } from "lucide-react";

const IMAGES = [
  "/hero-3.jpg",
  "/hero-11.jpg",
  "/hero-8.jpg",
  "/hero-5.jpg",
  "/hero-2.jpg",
  "/hero-10.jpg",
  "/hero-4.jpg",
  "/hero-9.jpg",
  "/hero-12.jpg",
  "/hero-6.jpg",
  "/hero-7.jpg",
];

const SLIDE_DURATION = 5000;

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  // Use TEAMS from splData (Nepal United removed there), then make labels match image count.
  const labels = useMemo(() => {
    const cleanTeams = [...LEAGUE_TEAMS].filter((t) => t !== "Nepal United FC");
    const out: string[] = [];
    for (let i = 0; i < IMAGES.length; i++) {
      out.push(cleanTeams[i] || "SBA Samsara Premier League 2025-26");
    }
    return out;
  }, []);

  useEffect(() => {
    if (IMAGES.length <= 1) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % IMAGES.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  function goPrev() {
    setIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  }

  function goNext() {
    setIndex((prev) => (prev + 1) % IMAGES.length);
  }

  function handleDotClick(i: number) {
    setIndex(i);
  }

  return (
    <section className="mt-4 space-y-8">
      <div className="relative min-h-[340px] overflow-hidden rounded-3xl border bg-slate-900 shadow-sm sm:min-h-[420px] md:min-h-[500px]">
        <img src={IMAGES[index]} alt={labels[index]} className="absolute inset-0 h-full w-full object-cover" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-3 px-4 text-center">
          <p className="rounded-full bg-black/70 px-4 py-1 text-[11px] font-medium text-white">
            Participating Teams · SBA Samsara Premier League 2025-26
          </p>

          <div className="inline-flex max-w-xl items-center justify-center rounded-2xl bg-black/75 px-4 py-2 text-sm font-semibold text-white sm:text-base md:text-lg">
            {labels[index]}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDotClick(i)}
                className={`h-1.5 w-5 rounded-full transition ${i === index ? "bg-white" : "bg-white/40"}`}
                aria-label={`Show slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={goPrev}
          className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-lg text-white hover:bg-black/60"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-lg text-white hover:bg-black/60"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="rounded-3xl border bg-white px-4 py-7 shadow-sm sm:px-6 md:px-8" id="about">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          <span className="inline-flex items-center justify-center gap-2">
            <Users size={22} className="text-orange-600" />
            <span>About Samsara Group Canberra</span>
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-gray-600 md:text-sm">
          {ORG.name} is a volunteer led community group in Canberra. We were formed to support Nepalese and Bhutanese individuals and families who are living, studying, and working in the region. Our focus is community, wellbeing, and connection, not only sport.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-sm text-slate-700">
            <h3 className="font-semibold text-slate-900">Who we are</h3>
            <p>
              Samsara Group Canberra is run by volunteers from the local community. We bring together students, families, and workers from different backgrounds who share a connection to Nepal and Bhutan.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600 md:text-sm">
              <li>Community based and not for profit</li>
              <li>Led by volunteers who live in Canberra</li>
              <li>Open and welcoming to new members and supporters</li>
            </ul>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <h3 className="font-semibold text-slate-900">What we do</h3>
            <p>
              Our activities focus on bringing people together in a positive and practical way. Sport is a big part of this, and we also support social, cultural, and wellbeing projects through the year.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600 md:text-sm">
              <li>Organise regular community football and friendly tournaments</li>
              <li>Coordinate events where families and friends can meet</li>
              <li>Support new arrivals with information, contacts, and community links</li>
              <li>Run the Samsara Premier League as our main football program</li>
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border bg-white px-4 py-5 shadow-sm sm:px-5 md:col-span-2">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 21h8m-4-4v4m5-19H7v5a5 5 0 005 5 5 5 0 005-5V2z"
                  />
                </svg>
              </span>
              <h3 className="text-base font-extrabold tracking-tight text-slate-900">
                Featured Event: Samsara Premier League 2025-26
              </h3>
            </div>

            <p className="text-xs leading-relaxed text-slate-600 md:text-sm">
              The Samsara Premier League is the flagship football competition coordinated by {ORG.name}. Community clubs take part in organised match weeks at {SPL_SEASON.venue}. Match results, standings, and fixtures are updated after each round.
            </p>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 md:text-sm">
              <li>• Structured match weeks and a full league table</li>
              <li>• Match facts and final scores verified by SPL officials</li>
              <li>• Rulebook and format available under Downloads</li>
            </ul>

            <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-800 md:text-sm">
              <strong className="text-orange-700">Note:</strong> The SPL is a volunteer led competition built on respect, fairness, and community spirit.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
