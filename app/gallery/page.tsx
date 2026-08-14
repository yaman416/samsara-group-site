"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

const G = "/gallery/FINAL SPL 2025-26/";
const N = "/gallery/Nepalese New Year Cup/";

type Category = "All" | "Finals" | "Teams" | "NNYC";

interface Shot {
  cat: Category;
  src: string;
  alt: string;
  wide?: boolean;
}

const SHOTS: Shot[] = [
  // Finals
  { cat: "Finals", src: G + "644055873_122201103818559639_8722394492457535109_n.jpg", alt: "Champions lift the trophy", wide: true },
  { cat: "Finals", src: G + "645045304_122201108054559639_700231387386612553_n.jpg", alt: "Winners cheque presentation" },
  { cat: "Finals", src: G + "643976200_122200985060559639_8937709693566884101_n.jpg", alt: "Khukuri Canberra celebrate the final" },
  { cat: "Finals", src: G + "644195431_122200984940559639_7106563034665718509_n.jpg", alt: "Captains and match officials" },
  { cat: "Finals", src: G + "645450423_122200984886559639_2302749031722042087_n.jpg", alt: "After the final whistle" },
  { cat: "Finals", src: G + "645321343_122201104682559639_8218344547327609707_n.jpg", alt: "The championship trophy" },
  { cat: "Finals", src: G + "645590660_122201103038559639_895508620839760949_n.jpg", alt: "Supporters on the sideline" },
  { cat: "Finals", src: G + "khukuri-final-1.jpg", alt: "Khukuri Canberra on finals day" },
  { cat: "Finals", src: G + "khukuri-final-2.jpg", alt: "Khukuri Canberra on finals day" },
  { cat: "Finals", src: G + "khukuri-final-3.jpg", alt: "Khukuri Canberra on finals day" },
  { cat: "Finals", src: G + "thuenlam-final-2.jpg", alt: "Thuenlam FC on finals day" },
  { cat: "Finals", src: G + "thuenlam-final-3.jpg", alt: "Thuenlam FC on finals day" },
  { cat: "Finals", src: G + "SPL Championship Trophies.jpg", alt: "The championship trophies" },
  { cat: "Finals", src: G + "SPL Running Shield.jpg", alt: "The Running Shield" },
  // NNYC
  { cat: "NNYC", src: N + "nnyc-champions.jpg", alt: "Canberra City FC · NNYC 2083 Champions", wide: true },
  { cat: "NNYC", src: N + "nnyc-runnerup.jpg", alt: "FC Yeedzin · NNYC 2083 Runner-up" },
  { cat: "NNYC", src: N + "nnyc-action-1.png", alt: "NNYC 2083 match action" },
  { cat: "NNYC", src: N + "nnyc-action-2.png", alt: "NNYC 2083 match action" },
  { cat: "NNYC", src: N + "nnyc-action-3.png", alt: "NNYC 2083 match action" },
  { cat: "NNYC", src: N + "nnyc-action-4.png", alt: "NNYC 2083 match action" },
  { cat: "NNYC", src: N + "nnyc-team-1.png", alt: "NNYC 2083 team" },
  { cat: "NNYC", src: N + "nnyc-team-2.png", alt: "NNYC 2083 team" },
  { cat: "NNYC", src: N + "nnyc-celebration-1.png", alt: "NNYC 2083 celebration" },
  { cat: "NNYC", src: N + "nnyc-celebration-2.png", alt: "NNYC 2083 celebration" },
  { cat: "NNYC", src: N + "nnyc-player-1.png", alt: "NNYC 2083 player" },
  { cat: "NNYC", src: N + "nnyc-touchline-1.png", alt: "NNYC 2083 touchline" },
];

const CATS: Category[] = ["All", "Finals", "NNYC"];

export default function GalleryPage() {
  const [cat, setCat] = useState<Category>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const closeRef = useRef<HTMLButtonElement>(null);

  const shots = cat === "All" ? SHOTS : SHOTS.filter(s => s.cat === cat);
  const counts: Record<Category, number> = {
    All: SHOTS.length,
    Finals: SHOTS.filter(s => s.cat === "Finals").length,
    Teams: 0,
    NNYC: SHOTS.filter(s => s.cat === "NNYC").length,
  };

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox(i => i !== null ? (i - 1 + shots.length) % shots.length : null), [shots.length]);
  const next = useCallback(() => setLightbox(i => i !== null ? (i + 1) % shots.length : null), [shots.length]);

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
        .gal-item { cursor: zoom-in; overflow: hidden; border-radius: 12px; background: #d8d8d2; position: relative; }
        .gal-item img { transition: transform .5s ease, opacity .4s ease; display: block; width: 100%; height: 100%; object-fit: cover; }
        .gal-item:hover img { transform: scale(1.05); }
        .gal-item .gal-overlay { position: absolute; inset: 0; background: linear-gradient(0deg,rgba(16,24,32,.72) 0%,transparent 60%); opacity: 0; transition: opacity .3s ease; display: flex; align-items: flex-end; padding: 16px; }
        .gal-item:hover .gal-overlay { opacity: 1; }
        .gal-cat-btn { border: none; cursor: pointer; font-family: 'DM Sans',system-ui,sans-serif; transition: background .2s, color .2s; }
        .lb-btn { background: rgba(255,255,255,.12); border: none; color: #fff; cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background .2s; }
        .lb-btn:hover { background: rgba(255,255,255,.24); }
        @media (max-width: 600px) { .gal-sidebar { display: none !important; } .gal-topbar { display: flex !important; } }
      `}</style>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={close}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,14,18,.96)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {/* Prev */}
          <button type="button" className="lb-btn" onClick={e => { e.stopPropagation(); prev(); }}
            style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, fontSize: 22 }}>
            &#8249;
          </button>

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "min(92vw,1200px)", maxHeight: "82vh", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            <div style={{ position: "relative", width: "min(92vw,1200px)", height: "min(67vw,780px)" }}>
              <Image
                src={shots[lightbox].src}
                alt={shots[lightbox].alt}
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>{shots[lightbox].alt}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.35)", flexShrink: 0 }}>{lightbox + 1} / {shots.length}</span>
            </div>
          </div>

          {/* Next */}
          <button type="button" className="lb-btn" onClick={e => { e.stopPropagation(); next(); }}
            style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, fontSize: 22 }}>
            &#8250;
          </button>

          {/* Close */}
          <button ref={closeRef} type="button" className="lb-btn" onClick={close}
            style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, fontSize: 18 }}>
            &#x2715;
          </button>

          {/* Dot strip */}
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5, flexWrap: "wrap", padding: "0 60px" }}>
            {shots.map((_, i) => (
              <button key={i} type="button" onClick={e => { e.stopPropagation(); setLightbox(i); }}
                style={{ width: i === lightbox ? 20 : 6, height: 6, borderRadius: 99, border: 0, padding: 0, cursor: "pointer", background: i === lightbox ? "#e2372b" : "rgba(255,255,255,.3)", transition: "width .3s ease, background .3s ease" }} />
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "64px 24px 52px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b" }}>Photography</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "16px 0 0" }}>Gallery</h1>
          <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab", maxWidth: "52ch" }}>
            {SHOTS.length} photos from SPL finals days and the Nepalese New Year Cup. Photographed at Nicholls.
          </p>
        </div>
      </section>

      {/* Mobile filter bar */}
      <div className="gal-topbar" style={{ display: "none", background: "#fff", borderBottom: "1px solid rgba(17,24,39,.08)", padding: "12px 20px", gap: 8, overflowX: "auto" }}>
        {CATS.map(c => (
          <button key={c} type="button" className="gal-cat-btn" onClick={() => { setCat(c); setLightbox(null); }}
            style={{ padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
              background: cat === c ? "#101820" : "rgba(17,24,39,.06)", color: cat === c ? "#fff" : "#66707d" }}>
            {c} <span style={{ opacity: .6, fontSize: 11 }}>{counts[c]}</span>
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div style={{ background: "#f4f4f1", minHeight: "60vh" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "48px 24px 96px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 40, alignItems: "start" }}>

          {/* Sidebar */}
          <div className="gal-sidebar" style={{ position: "sticky", top: 120 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 12 }}>Filter</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CATS.map(c => (
                <button key={c} type="button" className="gal-cat-btn" onClick={() => { setCat(c); setLightbox(null); }}
                  style={{ padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: 500, textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: cat === c ? "#101820" : "transparent",
                    color: cat === c ? "#fff" : "#4a545f" }}>
                  <span>{c}</span>
                  <span style={{ fontSize: 12, opacity: .6, fontVariantNumeric: "tabular-nums" }}>{counts[c]}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(17,24,39,.1)" }}>
              <div style={{ fontSize: 12, color: "#98a1ab", lineHeight: 1.6 }}>
                Photography by<br />
                <span style={{ color: "#66707d", fontWeight: 500 }}>Gyelpo Photography</span>
              </div>
              <a href="mailto:samsaragroup.cbr@gmail.com?subject=High-resolution photo request"
                style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 500, color: "#e2372b", textDecoration: "none" }}>
                Request hi-res copy
              </a>
            </div>
          </div>

          {/* Masonry grid */}
          <div style={{ columns: "3 260px", gap: 12 }}>
            {shots.map((s, i) => (
              <div
                key={s.src + i}
                className="gal-item"
                onClick={() => setLightbox(i)}
                style={{ marginBottom: 12, breakInside: "avoid" }}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={600}
                  height={400}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  onLoad={() => setLoaded(prev => new Set(prev).add(s.src))}
                />
                <div className="gal-overlay">
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{s.alt}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
