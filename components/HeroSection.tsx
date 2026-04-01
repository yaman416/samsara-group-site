"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CalendarDays, ChevronRight, MapPin, Sparkles, Trophy, Users } from "lucide-react";
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
  const sideStories = useMemo(
    () => HERO_SLIDES.filter((_, itemIndex) => itemIndex !== index).slice(0, 2),
    [index],
  );

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % HERO_SLIDES.length), SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="mt-6 space-y-4 sm:space-y-5">
      <div className="sports-panel p-4 sm:p-5 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.88fr]">
          <article className="editorial-frame overflow-hidden">
            <div className="grid min-h-[520px] lg:grid-cols-[1.08fr_0.92fr]">
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <p className="eyebrow-link">
                    Featured story
                    <span className="h-1 w-1 rounded-full bg-[#a0a7af]" />
                    {slide.eyebrow}
                  </p>
                  <h1 className="editorial-headline mt-4 text-balance">{slide.label}</h1>
                  <p className="editorial-subhead mt-5 max-w-xl">{slide.sublabel}</p>
                </div>

                <div className="space-y-5 pt-8">
                  <div className="stack-actions">
                    <a href={slide.href} className="button-primary">
                      {slide.cta}
                    </a>
                    <a href="#fixturesResults" className="button-secondary">
                      Open season hub
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#66707d]">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} className="text-[#101820]" />
                      Canberra events and fixtures
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-flex" />
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={15} className="text-[#101820]" />
                      Community sport and culture
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[280px] border-t border-slate-200/80 lg:min-h-full lg:border-l lg:border-t-0">
                <img
                  src={slide.image}
                  alt={slide.label}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1720]/40 via-transparent to-white/5" />
              </div>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {sideStories.map((item, itemIndex) => (
              <a
                key={item.label}
                href={item.href}
                className="post-card group min-h-[250px]"
                onMouseEnter={() => setIndex((index + itemIndex + 1) % HERO_SLIDES.length)}
              >
                <div className="image-tile m-3 mb-0">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="post-image transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="post-body justify-between">
                  <div>
                    <p className="editorial-label">{item.eyebrow}</p>
                    <h2 className="post-title">{item.label}</h2>
                    <p className="post-copy">{item.sublabel}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#101820]">
                    Explore
                    <ChevronRight size={16} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {QUICK_INFO.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS];
          return (
            <div key={item.title} className="shell-card px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="editorial-label">{item.title}</p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#101820]">{item.value}</p>
                </div>
                <div className="rounded-full bg-[#101820] p-2.5 text-white">
                  <Icon size={16} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shell-card flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="editorial-label">Why this site exists</p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#66707d]">
            A cleaner way to follow league updates, tournament information, community events, and key documents without scrolling through a long homepage.
          </p>
        </div>
        <a href="#more" className="inline-flex items-center gap-2 text-sm font-semibold text-[#101820]">
          Browse more sections
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
