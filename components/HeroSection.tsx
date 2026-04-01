"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Sparkles, Trophy, Users } from "lucide-react";
import { HERO_SLIDES, QUICK_INFO } from "@/lib/siteContent";

const SLIDE_DURATION = 5000;

const ICONS = {
  trophy: Trophy,
  sparkles: Sparkles,
  "map-pin": MapPin,
  users: Users,
} as const;

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const slide = HERO_SLIDES[index];

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % HERO_SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="mt-6 space-y-5">
      <div className="sports-panel overflow-hidden">
        <div className="relative min-h-[420px] sm:min-h-[520px]">
          <img
            src={slide.image}
            alt={slide.label}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111922]/88 via-[#111922]/34 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-10">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                {slide.eyebrow}
              </span>
              <h1 className="text-balance mt-4 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-[3.4rem] lg:text-[4.4rem]">
                {slide.label}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-[15px] lg:text-base">
                {slide.sublabel}
              </p>

              <div className="stack-actions mt-6">
                <a
                  href={slide.href}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-[#18212a] transition hover:bg-[#f3f5f7] sm:min-h-0 sm:w-auto"
                >
                  {slide.cta}
                </a>
                <span className="inline-flex items-center gap-2 text-sm text-white/72 sm:w-auto">
                  <CalendarDays size={16} className="text-white/70" />
                  Canberra community football and culture
                </span>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {HERO_SLIDES.map((item, itemIndex) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    className={`h-2.5 rounded-full transition ${
                      itemIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/40"
                    }`}
                    aria-label={`Show slide ${itemIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_INFO.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          return (
            <div key={item.title} className="shell-card px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#18212a]/8 p-2.5 text-[#18212a]">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8ea0b1]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#15202b]">{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
