import Image from "next/image";

// Season 2 (2025-26) Best XI, honoured at the Samsara Gala Night.
// Order follows the gala presentation. Club is the player's Season 2 club.
const BEST_XI = [
  { name: "Amrit Chhetri", club: "Khukuri Canberra FC", crest: "/team logos/Khukuri.png" },
  { name: "Kiran Gautam", club: "Everest FC", crest: "/team logos/Everest.png" },
  { name: "Semun Gurung", club: "Khukuri Canberra FC", crest: "/team logos/Khukuri.png" },
  { name: "Karma Nima", club: "Azhas FC", crest: "/team logos/azhas.png" },
  { name: "Phola", club: "Azhas FC", crest: "/team logos/azhas.png" },
  { name: "Singye Wangchuk", club: "Azhas FC", crest: "/team logos/azhas.png" },
  { name: "Darshan Gautam", club: "JA Brothers FC", crest: "/team logos/JA.png" },
  { name: "Tshering Dorji", club: "Thuenlam FC", crest: "/team logos/Thuenlam.png" },
  { name: "Kelzang Jigme", club: "Achos FC", crest: "/team logos/Achos.png" },
  { name: "Roshan Lamichhane", club: "Khukuri Canberra FC", crest: "/team logos/Khukuri.png" },
  { name: "Sushant Shrestha", club: "Queanbeyan NUFC", crest: "/team logos/Queanbeyan.png" },
];

export default function BestXI() {
  return (
    <section id="best-xi" className="bxi" aria-labelledby="best-xi-title">
      <style>{`
        @font-face { font-family: "Inter"; src: url("/broadcast/fonts/Inter-Medium.otf") format("opentype"); font-weight: 500; font-display: swap; }
        @font-face { font-family: "Inter"; src: url("/broadcast/fonts/Inter-SemiBold.otf") format("opentype"); font-weight: 600; font-display: swap; }
        @font-face { font-family: "Inter"; src: url("/broadcast/fonts/Inter-Bold.otf") format("opentype"); font-weight: 700; font-display: swap; }
        @font-face { font-family: "Inter"; src: url("/broadcast/fonts/Inter-Black.otf") format("opentype"); font-weight: 900; font-display: swap; }
        .bxi { font-family: Inter, system-ui, sans-serif; background: #fff; border: 1px solid rgba(17,24,39,.10); border-radius: 18px; padding: 48px 40px 44px; text-align: center; scroll-margin-top: 150px; }
        .bxi-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: #cf2e24; }
        .bxi-title { font-size: clamp(32px, 4vw, 48px); font-weight: 900; letter-spacing: -.025em; line-height: 1.05; margin: 12px 0 10px; color: #101820; }
        .bxi-sub { font-size: 16px; color: #66707d; margin: 0; }
        .bxi-photo { max-width: 1040px; margin: 32px auto 0; }
        .bxi-photo-frame { position: relative; aspect-ratio: 2048 / 1531; border-radius: 14px; overflow: hidden; background: #101820; }
        .bxi-credit { font-size: 12px; color: #66707d; margin-top: 8px; text-align: left; }
        .bxi-grid { max-width: 1040px; margin: 28px auto 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
        .bxi-card { width: calc((100% - 3 * 14px) / 4); background: #f4f4f1; border: 1px solid rgba(17,24,39,.08); border-radius: 14px; padding: 22px 12px 20px; display: flex; flex-direction: column; align-items: center; }
        .bxi-crest { width: 44px; height: 44px; position: relative; }
        .bxi-name { font-size: 16px; font-weight: 700; color: #101820; margin-top: 14px; line-height: 1.25; }
        .bxi-club { font-size: 13px; font-weight: 500; color: #66707d; margin-top: 4px; }
        @media (max-width: 900px) { .bxi-card { width: calc((100% - 2 * 14px) / 3); } }
        @media (max-width: 600px) {
          .bxi { padding: 32px 16px 28px; }
          .bxi-grid { gap: 10px; }
          .bxi-card { width: calc((100% - 10px) / 2); padding: 18px 8px 16px; }
          .bxi-name { font-size: 15px; }
          .bxi-club { font-size: 12px; }
        }
      `}</style>

      <div className="bxi-eyebrow">Season 2 · 2025-26</div>
      <h2 id="best-xi-title" className="bxi-title">Best XI</h2>
      <p className="bxi-sub">Honoured at the Samsara Gala Night</p>

      <figure className="bxi-photo" style={{ margin: "32px auto 0" }}>
        <div className="bxi-photo-frame">
          <Image
            src="/gallery/gala/season2-best-xi.jpg"
            alt="The Season 2 Best XI with their awards at the Samsara Gala Night"
            fill
            sizes="(max-width: 1100px) 100vw, 1040px"
            style={{ objectFit: "contain" }}
          />
        </div>
        <figcaption className="bxi-credit">Photo: Katha Visuals</figcaption>
      </figure>

      <ul className="bxi-grid" style={{ listStyle: "none", padding: 0 }}>
        {BEST_XI.map((p) => (
          <li key={p.name} className="bxi-card">
            <div className="bxi-crest">
              <Image src={p.crest} alt="" fill sizes="44px" style={{ objectFit: "contain" }} />
            </div>
            <div className="bxi-name">{p.name}</div>
            <div className="bxi-club">{p.club}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
