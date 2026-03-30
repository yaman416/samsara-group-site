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
          <div className="absolute inset-0 bg-gradient-to-t from-[#050b12]/92 via-[#08121b]/54 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,34,42,0.22),transparent_24%)]" />

          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-10">
            <div className="max-w-4xl">
                <span className="inline-flex rounded-full bg-[#d7222a] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  {slide.eyebrow}
                </span>
              <h1 className="text-balance mt-4 text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.6rem]">
                {slide.label}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
                {slide.sublabel}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={slide.href}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#07111a] transition hover:bg-[#f2f5f8]"
                >
                  {slide.cta}
                </a>
                <span className="inline-flex items-center gap-2 text-sm text-white/72">
                  <CalendarDays size={16} className="text-[#ff8f62]" />
                  Canberra community football and culture
                </span>
              </div>

              <div className="mt-6 flex items-center gap-2">
                {HERO_SLIDES.map((item, itemIndex) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    className={`h-2 rounded-full transition ${
                      itemIndex === index ? "w-8 bg-[#d7222a]" : "w-2 bg-white/45"
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
            <div key={item.title} className="shell-card px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#d7222a]/14 p-2 text-[#ff8f62]">
                  <Icon size={18} />
                </div>
                <div>
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
