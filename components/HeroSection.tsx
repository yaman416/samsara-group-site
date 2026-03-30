"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, MapPin, Phone, Users } from "lucide-react";
import { ORG, SPL_SEASON } from "@/lib/splData";
import {
  COMMUNITY_PILLARS,
  CURRENT_UPDATE,
  FEATURED_EVENT,
  HOME_ACTIONS,
  HERO_SLIDES,
  HOME_HIGHLIGHTS,
  TRUST_MARKERS,
} from "@/lib/siteContent";

const SLIDE_DURATION = 5000;

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const slide = HERO_SLIDES[index];

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mt-5 space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="shell-card soft-grid relative overflow-hidden">
          <img
            src={slide.image}
            alt={slide.label}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#11283d]/90 via-[#11283d]/58 to-[#0f1116]/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(215,170,88,0.26),transparent_30%)]" />

          <div className="relative flex min-h-[420px] flex-col justify-between p-6 sm:min-h-[520px] sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 text-white/92">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
                {slide.eyebrow}
              </span>
              <span className="rounded-full border border-white/15 px-4 py-1 text-[11px]">
                {SPL_SEASON.organiser}
              </span>
            </div>

            <div className="max-w-2xl space-y-5">
              <div className="space-y-3">
                <p className="section-kicker text-[#f2cd84]">Community-led organisation</p>
                <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                  Football, culture, and community updates in one place.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-white/78 sm:text-base">
                  {ORG.intro}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {HOME_ACTIONS.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={
                      action.variant === "primary"
                        ? "inline-flex items-center gap-2 rounded-full bg-[#f2cd84] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#14324a] transition hover:bg-[#f7d99c]"
                        : "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/16"
                    }
                  >
                    {action.label}
                    <ArrowRight size={14} />
                  </a>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {HOME_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/14 bg-white/10 px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="font-display text-2xl text-white">{item.value}</p>
                    <p className="mt-1 text-xs leading-5 text-white/72">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] text-white/76">
                {TRUST_MARKERS.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/14 bg-black/12 px-3 py-1.5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div className="rounded-2xl border border-white/14 bg-black/15 px-4 py-3 text-sm text-white/88 backdrop-blur-sm">
                {slide.label}
              </div>

              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((item, itemIndex) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    className={`h-2.5 rounded-full transition ${
                      itemIndex === index ? "w-8 bg-[#f2cd84]" : "w-2.5 bg-white/45"
                    }`}
                    aria-label={`Show slide ${itemIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="shell-card p-6 sm:p-7">
            <p className="section-kicker">{CURRENT_UPDATE.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-[#182230]">
              {CURRENT_UPDATE.title}
            </h2>
            <p className="mt-4 section-copy">{CURRENT_UPDATE.body}</p>

            <div className="mt-6 space-y-3 text-sm text-[#314255]">
              <div className="flex items-start gap-3">
                <CalendarDays size={18} className="mt-0.5 text-[#8a6a35]" />
                <span>April 4 and April 11 event dates announced</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 text-[#8a6a35]" />
                <span>{SPL_SEASON.venue}</span>
              </div>
            </div>
          </div>

          <div className="shell-card bg-[#14324a] p-6 text-white sm:p-7">
            <p className="section-kicker text-[#f2cd84]">About Samsara Group Canberra</p>
            <h2 className="mt-3 font-display text-3xl leading-tight">
              Local community, organised with care.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/76">
              Samsara Group Canberra is a volunteer-led community group supporting Nepalese and
              Bhutanese individuals and families through sport, culture, wellbeing, and connection.
            </p>
            <a
              href="#about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f2cd84]"
            >
              Explore the organisation
              <ArrowRight size={16} />
            </a>
          </div>

          <div id="contact" className="shell-card p-6 sm:p-7">
            <p className="section-kicker">Get in touch</p>
            <h2 className="mt-3 font-display text-2xl leading-tight text-[#182230]">
              Contact the organisers
            </h2>
            <div className="mt-5 space-y-3 text-sm text-[#314255]">
              <a
                href={`mailto:${ORG.email}`}
                className="flex items-center justify-between rounded-2xl border border-[#14324a]/10 bg-white/70 px-4 py-3 hover:bg-white"
              >
                <span>{ORG.email}</span>
                <ArrowRight size={16} className="text-[#8a6a35]" />
              </a>
              <a
                href={`tel:${ORG.phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-between rounded-2xl border border-[#14324a]/10 bg-white/70 px-4 py-3 hover:bg-white"
              >
                <span className="inline-flex items-center gap-2">
                  <Phone size={16} className="text-[#8a6a35]" />
                  {ORG.phone}
                </span>
                <ArrowRight size={16} className="text-[#8a6a35]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div id="about" className="shell-card grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div>
          <p className="section-kicker">Who we are</p>
          <h2 className="mt-3 section-title">A community platform, not just a fixture board.</h2>
          <p className="mt-4 section-copy">
            {ORG.name} is run by volunteers from the Canberra community. We create consistent spaces
            where people can meet, compete, celebrate, and support one another across the year.
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-[#14324a]/10 bg-[#f8f3eb] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#14324a] p-2 text-white">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#182230]">{FEATURED_EVENT.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#526070]">{FEATURED_EVENT.summary}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-[#314255]">
              {FEATURED_EVENT.bullets.map((item) => (
                <p key={item} className="rounded-xl bg-white/70 px-4 py-3">
                  {item}
                </p>
              ))}
            </div>

            <p className="mt-4 text-xs leading-6 text-[#667384]">{FEATURED_EVENT.note}</p>
          </div>
        </div>

        <div className="grid gap-4">
          {COMMUNITY_PILLARS.map((pillar, pillarIndex) => (
            <div
              key={pillar.title}
              className="rounded-[1.5rem] border border-[#14324a]/10 bg-white/70 p-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6a35]">
                0{pillarIndex + 1}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#182230]">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#526070]">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
