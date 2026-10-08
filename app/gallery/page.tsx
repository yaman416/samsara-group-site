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
  { src: N + "nnyc-2083-01.png", alt: "Nepalese New Year Cup 2083 match day, photo 01" },
  { src: N + "nnyc-2083-02.png", alt: "Nepalese New Year Cup 2083 match day, photo 02" },
  { src: N + "nnyc-2083-03.png", alt: "Nepalese New Year Cup 2083 match day, photo 03" },
  { src: N + "nnyc-2083-04.png", alt: "Nepalese New Year Cup 2083 match day, photo 04" },
  { src: N + "nnyc-2083-05.png", alt: "Nepalese New Year Cup 2083 match day, photo 05" },
  { src: N + "nnyc-2083-06.png", alt: "Nepalese New Year Cup 2083 match day, photo 06" },
  { src: N + "nnyc-2083-07.png", alt: "Nepalese New Year Cup 2083 match day, photo 07" },
  { src: N + "nnyc-2083-08.png", alt: "Nepalese New Year Cup 2083 match day, photo 08" },
  { src: N + "nnyc-2083-09.png", alt: "Nepalese New Year Cup 2083 match day, photo 09" },
  { src: N + "nnyc-2083-10.png", alt: "Nepalese New Year Cup 2083 match day, photo 10" },
  { src: N + "nnyc-2083-11.png", alt: "Nepalese New Year Cup 2083 match day, photo 11" },
  { src: N + "nnyc-2083-12.png", alt: "Nepalese New Year Cup 2083 match day, photo 12" },
  { src: N + "nnyc-2083-13.png", alt: "Nepalese New Year Cup 2083 match day, photo 13" },
  { src: N + "nnyc-2083-14.png", alt: "Nepalese New Year Cup 2083 match day, photo 14" },
  { src: N + "nnyc-2083-15.png", alt: "Nepalese New Year Cup 2083 match day, photo 15" },
  { src: N + "nnyc-2083-16.png", alt: "Nepalese New Year Cup 2083 match day, photo 16" },
  { src: N + "nnyc-2083-17.png", alt: "Nepalese New Year Cup 2083 match day, photo 17" },
  { src: N + "nnyc-2083-18.png", alt: "Nepalese New Year Cup 2083 match day, photo 18" },
  { src: N + "nnyc-2083-19.png", alt: "Nepalese New Year Cup 2083 match day, photo 19" },
  { src: N + "nnyc-2083-20.png", alt: "Nepalese New Year Cup 2083 match day, photo 20" },
  { src: N + "nnyc-2083-21.png", alt: "Nepalese New Year Cup 2083 match day, photo 21" },
  { src: N + "nnyc-2083-22.png", alt: "Nepalese New Year Cup 2083 match day, photo 22" },
  { src: N + "nnyc-2083-23.png", alt: "Nepalese New Year Cup 2083 match day, photo 23" },
  { src: N + "nnyc-2083-24.png", alt: "Nepalese New Year Cup 2083 match day, photo 24" },
  { src: N + "nnyc-2083-25.png", alt: "Nepalese New Year Cup 2083 match day, photo 25" },
  { src: N + "nnyc-2083-26.png", alt: "Nepalese New Year Cup 2083 match day, photo 26" },
  { src: N + "nnyc-2083-27.png", alt: "Nepalese New Year Cup 2083 match day, photo 27" },
  { src: N + "nnyc-2083-28.png", alt: "Nepalese New Year Cup 2083 match day, photo 28" },
  { src: N + "nnyc-2083-29.png", alt: "Nepalese New Year Cup 2083 match day, photo 29" },
  { src: N + "nnyc-2083-30.png", alt: "Nepalese New Year Cup 2083 match day, photo 30" },
  { src: N + "nnyc-2083-31.png", alt: "Nepalese New Year Cup 2083 match day, photo 31" },
  { src: N + "nnyc-2083-32.png", alt: "Nepalese New Year Cup 2083 match day, photo 32" },
  { src: N + "nnyc-2083-33.png", alt: "Nepalese New Year Cup 2083 match day, photo 33" },
  { src: N + "nnyc-2083-34.png", alt: "Nepalese New Year Cup 2083 match day, photo 34" },
  { src: N + "nnyc-2083-35.png", alt: "Nepalese New Year Cup 2083 match day, photo 35" },
  { src: N + "nnyc-2083-36.png", alt: "Nepalese New Year Cup 2083 match day, photo 36" },
  { src: N + "nnyc-2083-37.png", alt: "Nepalese New Year Cup 2083 match day, photo 37" },
  { src: N + "nnyc-2083-38.png", alt: "Nepalese New Year Cup 2083 match day, photo 38" },
  { src: N + "nnyc-2083-39.png", alt: "Nepalese New Year Cup 2083 match day, photo 39" },
  { src: N + "nnyc-2083-40.png", alt: "Nepalese New Year Cup 2083 match day, photo 40" },
  { src: N + "nnyc-2083-41.png", alt: "Nepalese New Year Cup 2083 match day, photo 41" },
  { src: N + "nnyc-2083-42.png", alt: "Nepalese New Year Cup 2083 match day, photo 42" },
  { src: N + "nnyc-2083-43.png", alt: "Nepalese New Year Cup 2083 match day, photo 43" },
  { src: N + "nnyc-2083-44.png", alt: "Nepalese New Year Cup 2083 match day, photo 44" },
  { src: N + "nnyc-2083-45.png", alt: "Nepalese New Year Cup 2083 match day, photo 45" },
  { src: N + "nnyc-2083-46.png", alt: "Nepalese New Year Cup 2083 match day, photo 46" },
  { src: N + "nnyc-2083-47.png", alt: "Nepalese New Year Cup 2083 match day, photo 47" },
  { src: N + "nnyc-2083-48.png", alt: "Nepalese New Year Cup 2083 match day, photo 48" },
  { src: N + "nnyc-2083-49.png", alt: "Nepalese New Year Cup 2083 match day, photo 49" },
  { src: N + "nnyc-2083-50.png", alt: "Nepalese New Year Cup 2083 match day, photo 50" },
  { src: N + "nnyc-2083-51.png", alt: "Nepalese New Year Cup 2083 match day, photo 51" },
  { src: N + "nnyc-2083-52.png", alt: "Nepalese New Year Cup 2083 match day, photo 52" },
  { src: N + "nnyc-2083-53.png", alt: "Nepalese New Year Cup 2083 match day, photo 53" },
  { src: N + "nnyc-2083-54.png", alt: "Nepalese New Year Cup 2083 match day, photo 54" },
  { src: N + "nnyc-2083-55.png", alt: "Nepalese New Year Cup 2083 match day, photo 55" },
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
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#f0564b" }}>Photography</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "16px 0 0" }}>Gallery</h1>
          <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab", maxWidth: "52ch" }}>
            {SHOTS.length} photos from SPL finals days and the Nepalese New Year Cup.
          </p>
          <p style={{ margin: "14px 0 0", fontSize: 14, color: "#98a1ab" }}>
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
            style={{ display: "inline-block", background: "#cf2e24", color: "#fff", fontWeight: 600, fontSize: 14, padding: "14px 28px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
            Contact Us
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}
