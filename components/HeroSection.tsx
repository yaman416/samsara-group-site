// components/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import { ORG } from "@/lib/splData";
import { Button } from "@/components/ui/button";

const IMAGES = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg", "/hero-4.jpg", "/hero-5.jpg"]; // keep your images here

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
    <section className="mt-6 grid gap-6 md:grid-cols-2 items-stretch">
      {/* Intro text only */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {ORG.name}
        </h1>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          {ORG.intro}
        </p>
        <div className="text-xs md:text-sm text-gray-600 space-y-1">
          <p><strong>Watch Games Live on Facebook:</strong></p>
          <p>Saturdays' from 3:30PM to 7:30PM</p>
          <p>  
            <Button asChild size="sm" className="rounded-xl">
              <a href={ORG.facebook} target="_blank" rel="noreferrer">
                Watch Live
              </a>
          </Button>
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
