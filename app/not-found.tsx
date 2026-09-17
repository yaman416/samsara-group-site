import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";

export default function NotFound() {
  return (
    <SiteLayout>
      <section style={{ background: "#101820", color: "#fff", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 24px" }}>
        <div style={{ maxWidth: 560, textAlign: "center" }}>
          <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(64px,14vw,120px)", lineHeight: 1, fontWeight: 600, color: "#e2372b", opacity: 0.8 }}>404</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(24px,4vw,38px)", lineHeight: 1.15, letterSpacing: "-.02em", margin: "20px 0 0" }}>Page not found</h1>
          <p style={{ margin: "20px 0 0", fontSize: 17, lineHeight: 1.7, color: "#98a1ab" }}>
            This page does not exist or has been moved. Try the season page for fixtures and standings, or head back home.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ display: "inline-block", background: "#e2372b", color: "#fff", fontWeight: 500, fontSize: 15, padding: "13px 28px", borderRadius: 999, textDecoration: "none" }}>
              Home
            </Link>
            <Link href="/season" style={{ display: "inline-block", background: "transparent", color: "#fff", fontWeight: 500, fontSize: 15, padding: "13px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,255,255,.3)" }}>
              Season 3
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
