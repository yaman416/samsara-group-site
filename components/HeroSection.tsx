// components/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import { ORG, SPL_SEASON } from "@/lib/splData";

// 5 images in /public
const IMAGES = [
  "/hero-1.jpg",
  "/hero-2.jpg",
  "/hero-3.jpg",
  "/hero-4.jpg",
  "/hero-5.jpg",
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
      className="mt-6 grid gap-6 md:grid-cols-2 items-stretch"
    >
      {/* Intro text: story + focus areas, no contact details */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {ORG.name}
        </h1>

        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          The Samsara Group is a volunteer led community organisation in
          Canberra. We create welcoming spaces where Nepalese and Bhutanese
          communities can connect, celebrate, and grow together.
        </p>

        <div className="text-xs md:text-sm text-gray-700 space-y-2">
          <p>
            <strong>What we do</strong>
          </p>
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
      </div>

      {/* Photo slider */}
      <div className="relative rounded-2xl overflow-hidden border bg-gray-200 h-56 md:h-64 lg:h-72">
        <img
          src={IMAGES[index]}
          alt="Samsara Group event"
          className="h-full w-full object-cover transition-opacity duration-500"
        />
        <div className="absolute bottom-3 left-3 flex gap-1">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              className={`h-2 w-6 rounded-full ${
                i === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
