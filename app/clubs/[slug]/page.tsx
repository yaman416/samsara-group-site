import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/SiteLayout";

const CREST: Record<string, string> = {
  khukuri: "/team/Khukuri.png",
  thuenlam: "/team/Thuenlam.png",
  azhas: "/team/azhas.png",
  queanbeyan: "/team/Queanbeyan.png",
  jabrothers: "/team/JA.png",
  everest: "/team/Everest.png",
  phuensum: "/team/phuensum.png",
  yeedzin: "/team/Yeedzin.png",
  ace: "/team/Aces.png",
  bicchi: "/team/Bicchi.png",
  friends: "/team/Friends.png",
  brosandball: "/team/BrosnBall.png",
};

type Rec = [number, number, number, number, number, number] | null;

interface ClubData {
  slug: string;
  name: string;
  short: string;
  country: string;
  founded: string;
  home: string;
  away: string;
  rec: Rec;
  finish?: string;
  honours: { title: string; season: string }[];
}

const CLUBS: ClubData[] = [
  { slug: "khukuri", name: "Khukuri Canberra FC", short: "Khukuri", country: "Nepal", founded: "2021", home: "#1f6fd0", away: "#101820", rec: [11,8,2,1,30,26], finish: "2nd", honours: [{ title: "Champions", season: "Season 2" }] },
  { slug: "thuenlam", name: "Thuenlam FC", short: "Thuenlam", country: "Bhutan", founded: "—", home: "#5ec8d8", away: "#101820", rec: [11,9,0,2,13,27], finish: "1st", honours: [{ title: "Running Shield", season: "Season 2" }, { title: "Runners-up", season: "Season 2" }] },
  { slug: "azhas", name: "Azhas FC", short: "Azhas", country: "Bhutan", founded: "2022", home: "#e63329", away: "#101820", rec: [11,7,4,0,14,25], finish: "3rd", honours: [] },
  { slug: "queanbeyan", name: "Queanbeyan Nepalese United FC", short: "QNUFC", country: "Nepal", founded: "2021", home: "#e01b24", away: "#1b3a8c", rec: [11,4,4,3,9,16], finish: "6th", honours: [] },
  { slug: "jabrothers", name: "JA Brothers FC", short: "JA Brothers", country: "Nepal", founded: "2022", home: "#d81f26", away: "#0f3f8c", rec: [11,5,3,3,7,18], finish: "5th", honours: [] },
  { slug: "everest", name: "Everest FC", short: "Everest", country: "Nepal", founded: "2020", home: "#2b2a72", away: "#f08a26", rec: [11,4,3,4,3,15], finish: "7th", honours: [] },
  { slug: "phuensum", name: "Phuensum FC", short: "Phuensum", country: "Bhutan", founded: "2022", home: "#101820", away: "#d9b444", rec: [11,3,4,4,-1,13], finish: "8th", honours: [] },
  { slug: "yeedzin", name: "FC Yeedzin", short: "Yeedzin", country: "Bhutan", founded: "—", home: "#e6e6e1", away: "#101820", rec: null, honours: [] },
  { slug: "ace", name: "ACE FC", short: "ACE", country: "Bhutan", founded: "2025", home: "#c9a227", away: "#101820", rec: null, honours: [] },
  { slug: "bicchi", name: "Bicchi FC", short: "Bicchi", country: "Nepal", founded: "—", home: "#12294d", away: "#f0932b", rec: null, honours: [] },
  { slug: "friends", name: "Friends Football Club", short: "Friends", country: "Nepal", founded: "2025", home: "#1140a8", away: "#f2ede1", rec: null, honours: [] },
  { slug: "brosandball", name: "Bros and Ball FC", short: "Bros and Ball", country: "Nepal", founded: "—", home: "#1f3352", away: "#c8353c", rec: null, honours: [] },
];

function initials(name: string) {
  return name.replace(/ (FC|Football Club)$/, "").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

export async function generateStaticParams() {
  return CLUBS.map(c => ({ slug: c.slug }));
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = CLUBS.find(c => c.slug === slug);
  if (!club) notFound();

  const crest = CREST[club.slug] || null;
  const hasRecord = !!club.rec;
  const gd = club.rec ? (club.rec[4] > 0 ? `+${club.rec[4]}` : String(club.rec[4])) : "0";

  return (
    <SiteLayout activeNav="clubs">
      {/* Club hero */}
      <section style={{ background: "#101820", color: "#fff", padding: "56px 0 0" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#98a1ab" }}>
            <Link href="/season" style={{ color: "#98a1ab" }}>Season 3</Link>
            <span>/</span>
            <Link href="/clubs" style={{ color: "#98a1ab" }}>Clubs</Link>
            <span>/</span>
            <span style={{ color: "#fff" }}>{club.short}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginTop: 30 }}>
            {crest ? (
              <Image src={crest} alt="" width={112} height={112} style={{ width: 112, height: 112, objectFit: "contain", flex: "none" }} />
            ) : (
              <span style={{ width: 112, height: 112, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(255,255,255,.26)", borderRadius: 18, fontSize: 26, fontWeight: 500, color: "#98a1ab" }}>
                {initials(club.name)}
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(32px,4.6vw,56px)", lineHeight: 1.1, letterSpacing: "-.02em", margin: 0 }}>{club.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                <span style={{ border: "1px solid rgba(255,255,255,.26)", borderRadius: 999, padding: "7px 15px", fontSize: 12, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" }}>{club.country}</span>
                {club.slug === "khukuri" && (
                  <span style={{ background: "#e2372b", borderRadius: 999, padding: "7px 15px", fontSize: 12, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" }}>Season 2 champions</span>
                )}
                {!club.rec && (
                  <span style={{ border: "1px solid rgba(255,255,255,.26)", borderRadius: 999, padding: "7px 15px", fontSize: 12, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase" }}>New for Season 3</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", borderTop: "1px solid rgba(255,255,255,.14)" }}>
            {[["Founded", club.founded], ["Home ground", "Nicholls"], ["Squad limit", "22 players"], ["Season 3", "Confirmed"]].map(([label, val]) => (
              <div key={label} style={{ padding: "22px 0" }}>
                <div style={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>{label}</div>
                <div style={{ fontSize: 19, fontWeight: 500, marginTop: 8 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats cards */}
      <section style={{ background: "#f4f4f1", padding: "64px 0 40px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {/* Season 2 record */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 34 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Season 2 record</div>
            {hasRecord && club.rec ? (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontFamily: "Lora,Georgia,serif", fontSize: 44, lineHeight: 1 }}>{club.rec[5]}</span>
                  <span style={{ fontSize: 15, color: "#66707d" }}>points · finished {club.finish}</span>
                </div>
                <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 10, textAlign: "center" }}>
                  {[["P", club.rec[0]], ["W", club.rec[1]], ["D", club.rec[2]], ["L", club.rec[3]], ["GD", gd]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 20, fontWeight: 500 }}>{v}</div>
                      <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d", marginTop: 5 }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ margin: "22px 0 0", fontSize: 16, lineHeight: 1.72, color: "#4a545f" }}>This club joins the competition for Season 3, so there is no league record yet. It starts building from matchweek one.</p>
            )}
          </div>

          {/* Honours */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 34 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Honours</div>
            {club.honours.length > 0 ? (
              <div style={{ marginTop: 22, display: "grid", gap: 14 }}>
                {club.honours.map(h => (
                  <div key={h.title + h.season} style={{ display: "flex", justifyContent: "space-between", gap: 16, borderBottom: "1px solid rgba(17,24,39,.08)", paddingBottom: 14, fontSize: 16 }}>
                    <span style={{ color: "#4a545f" }}>{h.title}</span>
                    <span style={{ fontWeight: 500 }}>{h.season}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: "22px 0 0", fontSize: 16, lineHeight: 1.72, color: "#4a545f" }}>No honours recorded yet. Championships, Running Shields and finals appearances appear here as they are won.</p>
            )}
          </div>

          {/* Club colours */}
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: 34 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Club colours</div>
            <div style={{ marginTop: 24, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ width: 64, height: 64, borderRadius: 12, background: club.home, border: "1px solid rgba(17,24,39,.10)", display: "block" }} />
                <span style={{ fontSize: 12, color: "#66707d" }}>Home</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ width: 64, height: 64, borderRadius: 12, background: club.away, border: "1px solid rgba(17,24,39,.10)", display: "block" }} />
                <span style={{ fontSize: 12, color: "#66707d" }}>Away</span>
              </div>
            </div>
            <p style={{ margin: "22px 0 0", fontSize: 15, lineHeight: 1.7, color: "#66707d" }}>Jersey colours are set by the club manager during registration.</p>
          </div>
        </div>
      </section>

      {/* Squad */}
      <section style={{ background: "#f4f4f1", padding: "24px 0 40px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "30px 34px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", borderBottom: "1px solid rgba(17,24,39,.10)" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#66707d" }}>Squad</div>
                <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 26, lineHeight: 1.24, marginTop: 8 }}>Squad registration in progress</div>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "#fff6ec", border: "1px solid #f0d7b8", borderRadius: 999, padding: "9px 18px", fontSize: 13, fontWeight: 500, color: "#8a6216" }}>Not yet published</span>
            </div>
            <div style={{ padding: "30px 34px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(56px,1fr))", gap: 10 }}>
              {Array.from({ length: 22 }, (_, i) => (
                <span key={i} style={{ aspectRatio: "1/1", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 500, background: "transparent", color: "#98a1ab", border: "1px dashed rgba(17,24,39,.18)" }}>{i + 1}</span>
              ))}
            </div>
            <div style={{ padding: "0 34px 30px", fontSize: 15, color: "#66707d", lineHeight: 1.7 }}>
              The 22 jersey numbers available to a squad. Each number can be held by one player only. Names and photos publish here once the club's registration is approved.
            </div>
          </div>
        </div>
      </section>

      {/* Coming soon cards */}
      <section style={{ background: "#f4f4f1", padding: "24px 0 96px" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {[
            { mark: "01", title: "Fixtures to come", body: "This club's Season 3 fixtures appear here once the draw is published." },
            { mark: "0-0", title: "No results yet", body: "Scores, scorers and cards land here as the admin publishes each match." },
            { mark: "%", title: "Player stats", body: "Goals, appearances and discipline build automatically from published results." },
          ].map(item => (
            <div key={item.mark} style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "44px 34px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ width: 52, height: 52, borderRadius: "50%", border: "1px dashed rgba(17,24,39,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Lora,Georgia,serif", fontSize: 19, color: "#98a1ab" }}>{item.mark}</span>
              <div style={{ fontFamily: "Lora,Georgia,serif", fontSize: 24, lineHeight: 1.26, marginTop: 20 }}>{item.title}</div>
              <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.72, color: "#4a545f", maxWidth: "40ch" }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
