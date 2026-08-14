"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

const G = "/gallery/FINAL SPL 2025-26/";
const N = "/gallery/Nepalese New Year Cup/";

const SHOTS = [
  // Finals
  { src: G + "644055873_122201103818559639_8722394492457535109_n.jpg", alt: "Champions lift the trophy" },
  { src: G + "645045304_122201108054559639_700231387386612553_n.jpg", alt: "Winners cheque presentation" },
  { src: G + "643976200_122200985060559639_8937709693566884101_n.jpg", alt: "Khukuri Canberra celebrate the final" },
  { src: G + "644195431_122200984940559639_7106563034665718509_n.jpg", alt: "Captains and match officials" },
  { src: G + "645450423_122200984886559639_2302749031722042087_n.jpg", alt: "After the final whistle" },
  { src: G + "645321343_122201104682559639_8218344547327609707_n.jpg", alt: "The championship trophy" },
  { src: G + "645590660_122201103038559639_895508620839760949_n.jpg", alt: "Supporters on the sideline" },
  { src: G + "khukuri-final-1.jpg", alt: "Khukuri Canberra on finals day" },
  { src: G + "khukuri-final-2.jpg", alt: "Khukuri Canberra on finals day" },
  { src: G + "khukuri-final-3.jpg", alt: "Khukuri Canberra on finals day" },
  { src: G + "thuenlam-final-2.jpg", alt: "Thuenlam FC on finals day" },
  { src: G + "thuenlam-final-3.jpg", alt: "Thuenlam FC on finals day" },
  { src: G + "SPL Championship Trophies.jpg", alt: "The championship trophies" },
  { src: G + "SPL Running Shield.jpg", alt: "The Running Shield" },
  // NNYC named
  { src: N + "nnyc-champions.jpg", alt: "Canberra City FC · NNYC 2083 Champions" },
  { src: N + "nnyc-runnerup.jpg", alt: "FC Yeedzin · NNYC 2083 Runner-up" },
  { src: N + "nnyc-action-1.png", alt: "NNYC 2083 match action" },
  { src: N + "nnyc-action-2.png", alt: "NNYC 2083 match action" },
  { src: N + "nnyc-action-3.png", alt: "NNYC 2083 match action" },
  { src: N + "nnyc-action-4.png", alt: "NNYC 2083 match action" },
  { src: N + "nnyc-team-1.png", alt: "NNYC 2083 teams" },
  { src: N + "nnyc-team-2.png", alt: "NNYC 2083 teams" },
  { src: N + "nnyc-celebration-1.png", alt: "NNYC 2083 celebration" },
  { src: N + "nnyc-celebration-2.png", alt: "NNYC 2083 celebration" },
  { src: N + "nnyc-player-1.png", alt: "NNYC 2083 player" },
  { src: N + "nnyc-touchline-1.png", alt: "NNYC 2083 touchline" },
  // NNYC screenshots
  { src: N + "Screenshot 2026-03-31 at 4.15.35 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.15.38 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.15.42 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.15.46 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.15.55 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.16.15 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.16.18 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.16.27 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.16.48 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.06 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.14 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.22 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.25 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.32 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.35 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.42 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.45 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.49 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.51 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.52 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.17.58 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.25 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.27 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.29 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.30 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.32 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.33 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.35 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.36 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.18.43 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.19.01 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.19.04 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.19.15 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.19.17 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.19.27 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.19.37 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.19.54 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.20.02 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.20.12 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.20.24 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.20.34 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.20.44 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.20.47 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.21.06 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.21.17 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.21.32 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.21.50 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.21.54 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.22.04 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.22.10 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.22.18 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.23.08 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.23.09 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.23.30 am.png", alt: "NNYC 2083" },
  { src: N + "Screenshot 2026-03-31 at 4.23.38 am.png", alt: "NNYC 2083" },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox(i => i !== null ? (i - 1 + SHOTS.length) % SHOTS.length : null), []);
  const next = useCallback(() => setLightbox(i => i !== null ? (i + 1) % SHOTS.length : null), []);

  useEffect(() => {
    if (lightbox === null) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  return (
    <SiteLayout activeNav="gallery">
      <style>{`
        .gal-item { cursor: zoom-in; overflow: hidden; border-radius: 10px; background: #d8d8d2; break-inside: avoid; margin-bottom: 10px; }
        .gal-item img { display: block; width: 100%; height: auto; transition: transform .4s ease; }
        .gal-item:hover img { transform: scale(1.04); }
        .lb-btn { background: rgba(255,255,255,.15); border: none; color: #fff; cursor: pointer; border-radius: 50%; width: 48px; height: 48px; font-size: 22px; display: flex; align-items: center; justify-content: center; transition: background .2s; }
        .lb-btn:hover { background: rgba(255,255,255,.28); }
      `}</style>

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,12,16,.97)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button type="button" className="lb-btn" onClick={e => { e.stopPropagation(); prev(); }} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}>&#8249;</button>

          <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "min(94vw,1200px)", maxHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", width: "min(94vw,1200px)", height: "min(70vw,800px)" }}>
              <Image src={SHOTS[lightbox].src} alt={SHOTS[lightbox].alt} fill style={{ objectFit: "contain" }} priority />
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,.6)", fontSize: 13 }}>{SHOTS[lightbox].alt}</span>
              <span style={{ color: "rgba(255,255,255,.3)", fontSize: 12, flexShrink: 0 }}>{lightbox + 1} / {SHOTS.length}</span>
            </div>
          </div>

          <button type="button" className="lb-btn" onClick={e => { e.stopPropagation(); next(); }} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>&#8250;</button>
          <button type="button" className="lb-btn" onClick={close} style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, fontSize: 18 }}>&#x2715;</button>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "64px 24px 52px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b" }}>Photography</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "16px 0 0" }}>Gallery</h1>
          <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab", maxWidth: "52ch" }}>
            {SHOTS.length} photos from SPL finals days and the Nepalese New Year Cup.
          </p>
          <p style={{ margin: "14px 0 0", fontSize: 14, color: "#66707d" }}>
            Photography by Gyelpo Photography · Goal Lens Photography
          </p>
        </div>
      </section>

      {/* Grid */}
      <div style={{ background: "#f4f4f1", padding: "48px 24px 48px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", columns: "3 240px", gap: 10 }}>
          {SHOTS.map((s, i) => (
            <div key={i} className="gal-item" onClick={() => setLightbox(i)}>
              <Image src={s.src} alt={s.alt} width={600} height={400} style={{ width: "100%", height: "auto" }} />
            </div>
          ))}
        </div>
      </div>
      {/* Volunteer CTA */}
      <div style={{ background: "#f4f4f1", padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", borderTop: "1px solid rgba(17,24,39,.1)", paddingTop: 48, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 18, color: "#101820" }}>Interested in volunteering as a photographer?</div>
            <div style={{ fontSize: 14, color: "#66707d", marginTop: 6 }}>We welcome photographers to cover SPL matches and events.</div>
          </div>
          <a href="mailto:samsaragroup.cbr@gmail.com?subject=Photographer Volunteer"
            style={{ display: "inline-block", background: "#e2372b", color: "#fff", fontWeight: 600, fontSize: 14, padding: "14px 28px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
            Contact Us
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}
