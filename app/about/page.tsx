"use client";
import SiteLayout from "@/components/SiteLayout";

const RED = "#e2372b";
const DARK = "#101820";
const MUTED = "#66707d";
const BG = "#f4f4f1";

export default function AboutPage() {
  return (
    <SiteLayout activeNav="about">
      {/* Hero */}
      <section style={{ background: DARK, color: "#fff", padding: "72px 24px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: RED, marginBottom: 20 }}>About Us</div>
          <h1 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(36px,5.5vw,68px)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-.025em", margin: "0 0 24px", maxWidth: "20ch" }}>
            More than football. A community in motion.
          </h1>
          <p style={{ fontSize: "clamp(16px,1.8vw,19px)", lineHeight: 1.75, color: "#c3cad2", maxWidth: "58ch", margin: "0 0 36px" }}>
            Samsara Group Canberra exists to unite, uplift, and celebrate the Nepalese and Bhutanese communities of the ACT through sport, culture, and shared purpose.
          </p>
          {/* Stat bar flush to bottom of hero */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid rgba(255,255,255,.12)", gap: "0 1px", background: "rgba(255,255,255,.08)" }}>
            {[["3", "Seasons run"], ["12", "Clubs in Season 3"], ["100+", "Matches refereed"], ["2024", "Founded in Canberra"]].map(([num, label]) => (
              <div key={label} style={{ padding: "28px 20px", background: DARK }}>
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 600, lineHeight: 1, letterSpacing: "-.02em", color: "#fff" }}>{num}</div>
                <div style={{ fontSize: 13, color: "#98a1ab", marginTop: 8, letterSpacing: ".02em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "48px 64px", alignItems: "stretch" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: RED, marginBottom: 16 }}>Who We Are</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(26px,3vw,38px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-.02em", color: DARK, margin: "0 0 22px" }}>
                Samsara Group Canberra
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: MUTED, margin: "0 0 18px" }}>
                Founded by members of the Nepalese and Bhutanese diaspora in the ACT, Samsara Group Canberra is a volunteer-run community organisation with a single conviction: that belonging is built through shared experience.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: MUTED, margin: 0 }}>
                The name Samsara reflects the cycle of life and renewal central to our cultures. We carry that spirit into everything we do, from organising competitive football to hosting cultural celebrations that connect generations.
              </p>
            </div>
            <div style={{ display: "grid", gap: 0, border: "1px solid rgba(17,24,39,.09)", borderRadius: 18, overflow: "hidden" }}>
              {[
                ["Founded", "2024, Canberra ACT"],
                ["Community", "Nepalese and Bhutanese diaspora"],
                ["Base", "Canberra and Queanbeyan region"],
                ["Structure", "Volunteer-led, community governed"],
              ].map(([label, val], i, arr) => (
                <div key={label} style={{ padding: "22px 26px", borderBottom: i < arr.length - 1 ? "1px solid rgba(17,24,39,.08)" : "none", background: i % 2 === 0 ? "#fff" : BG }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: MUTED, marginBottom: 5 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: DARK }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section style={{ background: BG, padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 64px", alignItems: "flex-end", paddingBottom: 40, borderBottom: "1px solid rgba(17,24,39,.09)", marginBottom: 24 }}>
            <div style={{ flex: "1 1 300px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: RED, marginBottom: 14 }}>Our Vision</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(26px,3vw,42px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: "-.02em", color: DARK, margin: 0 }}>
                A community that plays, celebrates, and grows together
              </h2>
            </div>
            <p style={{ flex: "1 1 280px", fontSize: 17, lineHeight: 1.75, color: MUTED, margin: 0 }}>
              We envision an ACT where every Nepalese and Bhutanese family has a place to belong, a team to support, and a league to be proud of.
            </p>
          </div>
          {/* Cards — equal height via stretch (default) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: "20px" }}>
            {[
              { icon: "⚽", title: "Sport as a Bridge", body: "Football breaks barriers. We use it to connect newcomers with established community members, and our community with wider Canberra." },
              { icon: "🏔", title: "Culture First", body: "Our roots in Nepal and Bhutan shape everything we do. We celebrate language, tradition, and identity, not despite our new home, but within it." },
              { icon: "🌱", title: "Youth Development", body: "We invest in the next generation. Every season produces young players, referees, and leaders who gain confidence through sport." },
              { icon: "🤝", title: "Inclusive by Design", body: "Mixed-heritage clubs are welcome. We build a competition that reflects the full diversity of our community, not just one group within it." },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1px solid rgba(17,24,39,.08)", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ fontSize: 30 }}>{icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: DARK, margin: 0 }}>{title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.78, color: MUTED, margin: 0, flex: 1 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Samsara Premier League */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "48px 64px", alignItems: "stretch" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: RED, marginBottom: 16 }}>The Competition</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(26px,3vw,38px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-.02em", color: DARK, margin: "0 0 22px" }}>
                Samsara Premier League
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: MUTED, margin: "0 0 18px" }}>
                The SPL is Canberra's premier community football competition for the Nepalese and Bhutanese diaspora. Now entering Season 3, it has grown from a grassroots idea into a structured, professionally run league with up to 12 clubs competing across a full round-robin season and finals.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: MUTED, margin: "0 0 32px" }}>
                Each club registers a squad, pays a modest levy, and competes under SPL rules aligned with Football Australia standards. Matches are officiated by registered referees, results tracked publicly, and champions recognised with trophies and community celebration.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="/season" style={{ background: RED, color: "#fff", fontSize: 14, fontWeight: 600, padding: "13px 26px", borderRadius: 999, textDecoration: "none" }}>Season 3 Hub</a>
                <a href="/clubs" style={{ background: "transparent", color: DARK, fontSize: 14, fontWeight: 500, padding: "13px 26px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(17,24,39,.18)" }}>View Clubs</a>
              </div>
            </div>
            <div style={{ display: "grid", gap: 1, background: "rgba(17,24,39,.08)", border: "1px solid rgba(17,24,39,.08)", borderRadius: 18, overflow: "hidden" }}>
              {[
                ["Seasons run", "3 (2024, 2025, 2026-27)"],
                ["Clubs in Season 3", "Up to 12"],
                ["Format", "Round robin + Finals"],
                ["Referees", "Registered, paid officiants"],
                ["Governance", "Samsara Group Canberra"],
              ].map(([label, val]) => (
                <div key={label} style={{ background: "#fff", padding: "22px 26px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: MUTED }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, marginTop: 6, color: DARK }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nepalese New Year Cup */}
      <section style={{ background: DARK, color: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "48px 64px", alignItems: "stretch" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: RED, marginBottom: 16 }}>Cultural Tournament</div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(26px,3vw,38px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-.02em", margin: "0 0 22px" }}>
                Nepalese New Year Cup
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "#c3cad2", margin: "0 0 18px" }}>
                Held annually to mark Nepali New Year (Baisakh), the NNYC is our flagship cultural football event. It brings together SPL clubs, open community teams, and invited sides in a festive two-day knockout tournament that doubles as a community celebration.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: "#c3cad2", margin: 0 }}>
                The Cup is more than a trophy. It is a gathering point where food stalls, music, and family fill the sidelines. It is the moment the community comes together in full colour, and it reflects exactly why we started Samsara Group Canberra.
              </p>
            </div>
            <div style={{ display: "grid", gap: 0, border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, overflow: "hidden" }}>
              {[
                { label: "When", value: "Annually, April/May (Nepali New Year)" },
                { label: "Format", value: "Two-day knockout tournament" },
                { label: "Open to", value: "SPL clubs and community teams" },
                { label: "Atmosphere", value: "Food, music, family, football" },
              ].map(({ label, value }, i, arr) => (
                <div key={label} style={{ padding: "22px 26px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,.08)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.08)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab", marginBottom: 5 }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "#fff" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why we exist */}
      <section style={{ background: BG, padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: RED, marginBottom: 16 }}>Why We Exist</div>
          <h2 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(26px,3vw,42px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: "-.02em", color: DARK, margin: "0 0 40px", maxWidth: "26ch" }}>
            A home away from home is built, not found
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "24px 56px" }}>
            <div>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: MUTED, margin: "0 0 20px" }}>
                When our founders arrived in Canberra, they brought with them a love of football and a longing for the kind of vibrant community life they had known in Nepal and Bhutan. What they found was a growing diaspora that lacked a shared sporting stage.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: MUTED, margin: 0 }}>
                Samsara Group Canberra was the answer. Not a formal institution, but a gathering of people who believed that a well-run competition could do what years of waiting could not: give the community an identity, a schedule, and a reason to show up every weekend.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: MUTED, margin: "0 0 20px" }}>
                Three seasons later, we have refereed over a hundred matches, registered hundreds of players, and watched children grow up watching their parents play. We have seen friendships form between clubs that started as rivals.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.9, color: MUTED, margin: 0 }}>
                That is what we are building. Not just a league table. A community record. A living proof that when you create space for people to play, they will show up and build something remarkable around it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get involved */}
      <section style={{ background: RED, color: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: "36px 80px", alignItems: "start" }}>
            <div>
              <h2 style={{ fontFamily: "Lora,Georgia,serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: "-.02em", margin: "0 0 18px" }}>
                Be part of what we are building
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(255,255,255,.88)", margin: 0 }}>
                Whether you represent a club ready to compete, a volunteer ready to help run the league, or simply a supporter who wants to follow the action, there is a place for you here.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-start" }}>
              <a href="/register" style={{ background: "#fff", color: RED, fontSize: 15, fontWeight: 700, padding: "16px 28px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap" }}>Register your club</a>
              <a href="/clubs" style={{ background: "rgba(255,255,255,.15)", color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,255,255,.35)", whiteSpace: "nowrap" }}>View all clubs</a>
              <a href="mailto:samsaragroup.cbr@gmail.com" style={{ background: "transparent", color: "#fff", fontSize: 15, fontWeight: 500, padding: "16px 28px", borderRadius: 999, textDecoration: "none", border: "1px solid rgba(255,255,255,.35)", whiteSpace: "nowrap" }}>Get in touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section style={{ background: DARK, padding: "48px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "20px 48px", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px", alignItems: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#98a1ab", width: "100%" }}>Contact</div>
            <a href="mailto:samsaragroup.cbr@gmail.com" style={{ color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>samsaragroup.cbr@gmail.com</a>
            <a href="tel:+61449981624" style={{ color: "#c3cad2", textDecoration: "none", fontSize: 15 }}>+61 449 981 624</a>
            <a href="https://www.instagram.com/samsaragroup.cbr" style={{ color: "#c3cad2", textDecoration: "none", fontSize: 15 }}>@samsaragroup.cbr</a>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="https://www.instagram.com/samsaragroup.cbr" aria-label="Instagram" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,.1)", color: "#fff", textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://www.youtube.com/@SamsaraGroupCanberra" aria-label="YouTube" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,.1)", color: "#fff", textDecoration: "none" }}>
              <svg width="20" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
