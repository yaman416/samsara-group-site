import Image from "next/image";
import SiteLayout from "@/components/SiteLayout";

const COMMUNITY = [
  { name: "Dikshant", src: "/sponsor/dikshant.png" },
  { name: "Expert", src: "/sponsor/expert.png" },
  { name: "Momo", src: "/sponsor/momo.png" },
  { name: "Monkey Temple", src: "/sponsor/monkeytemple.png" },
  { name: "Nepali Haat", src: "/sponsor/nepalihaat.png" },
  { name: "Ooshman", src: "/sponsor/ooshman.png" },
  { name: "Zenith", src: "/sponsor/zenith.png" },
];

export default function PartnersPage() {
  return (
    <SiteLayout activeNav="partners">
      {/* Hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "64px 24px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b" }}>Support</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "16px 0 0" }}>Partners</h1>
          <p style={{ margin: "20px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab" }}>
            The businesses that keep the Samsara Premier League on the pitch, from the title sponsor to the community partners backing individual matchdays.
          </p>
        </div>
      </section>

      {/* Title sponsor */}
      <section style={{ background: "#f4f4f1", padding: "64px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 20, overflow: "hidden", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))" }}>
            <div style={{ padding: "clamp(36px,5vw,60px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
              <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Title sponsor</span>
              <Image src="/sponsor/sba.png" alt="SBA Property Group" width={280} height={80} style={{ maxWidth: 280, width: "100%", height: "auto", objectFit: "contain" }} />
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(26px,3vw,36px)", lineHeight: 1.2, letterSpacing: "-.012em", margin: 0 }}>SBA Property Group</h2>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.72, color: "#4a545f", maxWidth: "46ch" }}>
                Naming partner of the Samsara Premier League and presenter of the champions prize.
              </p>
            </div>
            <div style={{ position: "relative", minHeight: 340 }}>
              <Image
                src="/gallery/FINAL%20SPL%202025-26/645045304_122201108054559639_700231387386612553_n.jpg"
                alt="Khukuri Canberra FC receive the Season 2 winners cheque"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Major partners */}
      <section style={{ background: "#f4f4f1", padding: "56px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 24 }}>Major partners</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 40, display: "flex", flexDirection: "column", gap: 26, minHeight: 200 }}>
              <Image src="/sponsor/gtm.png" alt="GTM Facility Services" width={160} height={56} style={{ height: 56, width: "auto", objectFit: "contain", alignSelf: "flex-start" }} />
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>GTM Facility Services</div>
                <div style={{ fontSize: 15, color: "#66707d", marginTop: 6 }}>Matchball partner</div>
              </div>
            </div>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 40, display: "flex", flexDirection: "column", gap: 26, minHeight: 200 }}>
              <Image src="/sponsor/lhotse.png" alt="Lhotse" width={160} height={48} style={{ height: 48, width: "auto", objectFit: "contain", alignSelf: "flex-start" }} />
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>Lhotse</div>
                <div style={{ fontSize: 15, color: "#66707d", marginTop: 6 }}>Kit and merchandise partner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community partners */}
      <section style={{ background: "#f4f4f1", padding: "56px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d", marginBottom: 24 }}>Community partners</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(180px,100%),1fr))", gap: 16 }}>
            {COMMUNITY.map(p => (
              <div key={p.name} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 16, height: 130, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                <Image src={p.src} alt={p.name} width={160} height={52} style={{ maxHeight: 52, maxWidth: "100%", width: "auto", objectFit: "contain" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section style={{ background: "#f4f4f1", padding: "64px 24px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ background: "#e2372b", color: "#fff", borderRadius: 20, padding: "clamp(36px,5vw,60px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: 36, alignItems: "center" }}>
            <h2 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(28px,3.6vw,44px)", lineHeight: 1.16, letterSpacing: "-.014em", margin: 0 }}>
              Partner with the league
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-start" }}>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,.92)", maxWidth: "46ch" }}>
                Season 3 partnership packages cover matchday signage, jersey placement and digital presence across the season.
              </p>
              <a href="mailto:samsaragroup.cbr@gmail.com" style={{ background: "#101820", color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 30px", borderRadius: 999, textDecoration: "none" }}>
                Contact Samsara Group
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
