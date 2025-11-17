// components/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import { ORG, SPL_SEASON } from "@/lib/splData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const IMAGES = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"]; // add these files into /public

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
      {/* Intro */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          The Samsara Group - Canberra
        </h1>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">{ORG.intro}</p>
        <Card className="rounded-2xl border bg-white shadow-sm">
          <CardContent className="py-4 text-sm text-gray-700 space-y-1">
            <div className="font-semibold">{SPL_SEASON.name}</div>
            <div>Venue: {SPL_SEASON.venue}</div>
            <div>Season start: {new Date(SPL_SEASON.startDate).toLocaleDateString()}</div>
            <Button
              asChild
              size="sm"
              className="mt-3 rounded-xl"
            >
              <a href="#league-table">View League Table</a>
            </Button>
          </CardContent>
        </Card>
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
