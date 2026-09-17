import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Samsara Premier League · Season 3";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#101820",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Red accent bar top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#e2372b", display: "flex" }} />

        {/* Background shield shape hint */}
        <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "rgba(226,55,43,0.04)", display: "flex" }} />

        {/* SPL badge text */}
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#e2372b", marginBottom: 24, display: "flex" }}>
          Samsara Premier League
        </div>

        {/* Main title */}
        <div style={{ fontSize: 76, fontWeight: 700, color: "#ffffff", lineHeight: 1.05, textAlign: "center", letterSpacing: "-0.02em", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span>Season 3</span>
        </div>

        {/* Subtitle */}
        <div style={{ marginTop: 28, fontSize: 22, color: "#98a1ab", textAlign: "center", display: "flex" }}>
          Canberra · Nepalese &amp; Bhutanese Football · 2026-27
        </div>

        {/* Stats row */}
        <div style={{ marginTop: 52, display: "flex", gap: 60 }}>
          {[["12", "Clubs"], ["264", "Players"], ["66", "Fixtures"]].map(([num, label]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 40, fontWeight: 700, color: "#ffffff", display: "flex" }}>{num}</span>
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#66707d", display: "flex" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: "absolute", bottom: 36, fontSize: 14, color: "#4a545f", display: "flex", letterSpacing: "0.06em" }}>
          samsaragroup.com.au
        </div>

        {/* Red accent bar bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "#e2372b", display: "flex" }} />
      </div>
    ),
    { ...size }
  );
}
