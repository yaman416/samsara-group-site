"use client";
import { useState } from "react";
import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

const G = "/gallery/FINAL%20SPL%202025-26/";

const SHELF: [string, string, string][] = [
  ["Finals", G + "643976200_122200985060559639_8937709693566884101_n.jpg", "Khukuri Canberra celebrate the final"],
  ["Finals", G + "644055873_122201103818559639_8722394492457535109_n.jpg", "Champions lift the trophy"],
  ["Finals", G + "645045304_122201108054559639_700231387386612553_n.jpg", "Winners cheque presentation"],
  ["Finals", G + "644195431_122200984940559639_7106563034665718509_n.jpg", "Captains and match officials"],
  ["Finals", G + "645450423_122200984886559639_2302749031722042087_n.jpg", "After the final whistle"],
  ["Finals", G + "645321343_122201104682559639_8218344547327609707_n.jpg", "The championship trophy"],
  ["Finals", G + "khukuri-final-1.jpg", "Khukuri Canberra on finals day"],
  ["Finals", G + "khukuri-final-3.jpg", "Khukuri Canberra on finals day"],
  ["Finals", G + "thuenlam-final-3.jpg", "Thuenlam FC on finals day"],
  ["Finals", G + "khukuri-final-2.jpg", "Khukuri Canberra on finals day"],
  ["Finals", G + "thuenlam-final-2.jpg", "Thuenlam FC on finals day"],
  ["Finals", G + "SPL%20Championship%20Trophies.jpg", "The championship trophies"],
  ["Finals", G + "645590660_122201103038559639_895508620839760949_n.jpg", "Supporters on the sideline"],
];

const TABS = ["All", "Finals"] as const;
type Tab = typeof TABS[number];

export default function GalleryPage() {
  const [tab, setTab] = useState<Tab>("All");

  const shots = SHELF.filter(g => tab === "All" || g[0] === tab);

  return (
    <SiteLayout activeNav="gallery">
      {/* Hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "64px 0 56px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b" }}>Photography</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "16px 0 0" }}>Gallery</h1>
          <p style={{ margin: "20px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab", maxWidth: "56ch" }}>
            Finals days, team portraits and the Nepalese New Year Cup, photographed at Nicholls.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {TABS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  fontSize: 14, fontWeight: 500,
                  padding: "11px 20px", borderRadius: 999, cursor: "pointer",
                  background: tab === t ? "#e2372b" : "transparent",
                  color: tab === t ? "#ffffff" : "#98a1ab",
                  border: `1px solid ${tab === t ? "#e2372b" : "rgba(255,255,255,.24)"}`,
                  transition: "background .25s ease, color .25s ease",
                }}
              >{t}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ background: "#f4f4f1", padding: "56px 0 104px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {shots.map((g, i) => (
              <figure key={i} style={{ margin: 0, background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", background: "#e6e6e1" }}>
                  <Image src={g[1]} alt={g[2]} fill style={{ objectFit: "cover" }} />
                </div>
                <figcaption style={{ padding: "16px 20px", fontSize: 14, color: "#66707d" }}>{g[2]}</figcaption>
              </figure>
            ))}
          </div>
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(17,24,39,.10)", fontSize: 15, color: "#66707d" }}>
            Photography by Gyelpo Photography for Samsara Group Canberra.
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
