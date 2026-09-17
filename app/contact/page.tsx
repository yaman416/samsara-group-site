import SiteLayout from "@/components/SiteLayout";

export default function ContactPage() {
  return (
    <SiteLayout>
      <section style={{ background: "#101820", color: "#fff", padding: "64px 24px 56px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#e2372b" }}>Get in touch</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: "16px 0 0" }}>Contact us</h1>
          <p style={{ margin: "20px 0 0", fontSize: 18, lineHeight: 1.7, color: "#98a1ab" }}>
            Questions about Season 3, registration, or the league? Reach out and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <section style={{ background: "#f4f4f1", padding: "64px 24px 96px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 24 }}>
          {[
            { label: "Email", value: "samsaragroup.cbr@gmail.com", href: "mailto:samsaragroup.cbr@gmail.com" },
            { label: "Location", value: "Canberra, ACT, Australia", href: null },
            { label: "Response time", value: "48 to 72 hours (volunteer team)", href: null },
          ].map(item => (
            <div key={item.label} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 34 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>{item.label}</div>
              {item.href ? (
                <a href={item.href} style={{ display: "block", fontFamily: "Lora,Georgia,serif", fontSize: 22, marginTop: 14, color: "#e2372b", textDecoration: "none" }}>{item.value}</a>
              ) : (
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 22, marginTop: 14 }}>{item.value}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
