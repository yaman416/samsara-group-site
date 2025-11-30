// lib/splData.ts

export const ORG = {
  name: "Samsara Group",
  tagline: "Fostering Community, Empowering Growth",
  intro:
    "Building connections, promoting culture, and empowering Nepalese & Bhutanese communities in Canberra through culture, sport, and community events.",
  email: "samsaragroup.cbr@gmail.com",
  phone: "+61 449 981 624",
  location: "Canberra, Australia",
  website: "https://www.samsaragroup.com.au",
  facebook: "https://www.facebook.com/profile.php?id=61566789173985",
  youtube: "https://www.youtube.com/@SamsaraGroupCanberra",
};

export const SPL_SEASON = {
  name: "Samsara Premier League (SPL) 2025-26",
  organiser: "The Samsara Group - Canberra",
  venue: "Nicholls Synthetic Soccer Field, Canberra",
  startDate: "2025-11-15",
};

// TEAMS
export const TEAMS = [
  "Khukuri Canberra FC",
  "Phuensum FC",
  "Everest FC",
  "Azhas FC",
  "Thuenlam FC",
  "Achos Football Team",
  "Nepal United FC",
  "Queanbeyan Nepalese United Football Club",
  "JA Brothers Football Club",
  "Unity Stars FC",
  "CNFC Canberra",
  "Druk FC",
];

// TEAM LOGOS
export const TEAM_LOGOS: Record<string, string> = {
  "Achos Football Team": "/team/achos.png",
  "Azhas FC": "/team/azhas.png",
  "CNFC Canberra": "/team/cnfc.png",
  "Druk FC": "/team/druk.png",
  "Everest FC": "/team/everest.png",
  "JA Brothers Football Club": "/team/jabrothers.png",
  "Khukuri Canberra FC": "/team/khukuri.png",
  "Nepal United FC": "/team/nufc.png",
  "Phuensum FC": "/team/phuensum.png",
  "Queanbeyan Nepalese United Football Club": "/team/queanbeyan.png",
  "Thuenlam FC": "/team/thuenlam.png",
  "Unity Stars FC": "/team/unity.png",
};

// SPONSORS (unchanged from your setup)
export const SPONSORS = {
  title: [
    {
      name: "SBA Property Group - Sbapropertygroup",
      url: "#",
      logo: "/sponsor/sba.png",
    },
  ],

  platinum: [
    {
      name: "GTM Facility Services",
      url: "#",
      logo: "/sponsor/gtm.png",
    },
  ],

  silver: [
    { name: "Nepali Haat Bazaar", url: "#", logo: "/sponsor/nepalihaat.png" },
    { name: "Canberra Momo House - Nepalese Restaurant", url: "#", logo: "/sponsor/momo.png" },
    { name: "Dikshant Dhungel – Real Estate Agent", url: "#", logo: "/sponsor/dikshant.png" },
    { name: "The Monkey Temple", url: "#", logo: "/sponsor/monkeytemple.png" },
    { name: "Ooshman Gungahlin", url: "#", logo: "/sponsor/ooshman.png" },
    { name: "Zenith Services Sydney", url: "#", logo: "/sponsor/zenith.png" },
    { name: "Expert Education and Visa Services (Blacktown, Sydney)", url: "#", logo: "/sponsor/expert.png" },
  ],

  media: [
    { name: "Fan Voice TV", url: "#", logo: "/media/fanvoice.png" },
    { name: "Lensfusion Photo & Video", url: "#", logo: "/media/lensfusion.png" },
    { name: "Goal Lens Photography", url: "#", logo: "/media/goallens.png" },
    { name: "Lenscrafters Photography", url: "#", logo: "/media/lenscrafters.png" },
    { name: "Films Yaman", url: "#", logo: "/media/fimlsyaman.png" },
    { name: "Crafts by Juna", url: "#", logo: "/media/junacrafts.png" },
    { name: "Avyukt News", url: "#", logo: "/media/avyukt.png" },
    { name: "Gyelpo Photography", url: "#", logo: "/media/gyelpo.png" },
  ],

  merch: [
    {
      name: "Lhotse",
      url: "#",
      logo: "/sponsor/lhotse.png",
      note: "Merchandise partner providing SPL merch and gifts for standout players.",
    },
  ],
};

// FIXTURES (your existing full list)
export type Fixture = {
  id: string;
  round: number;
  date: string;
  time: string;
  home: string;
  away: string;
  ground: string;
};

export const FIXTURES: Fixture[] = [
  // ROUND 1 – 15 NOV
  { id: "R1-M1", round: 1, date: "2025-11-15", time: "3:30 PM", home: "Nepal United FC", away: "Druk FC", ground: "Ground 1" },
  { id: "R1-M2", round: 1, date: "2025-11-15", time: "3:30 PM", home: "Thuenlam FC", away: "CNFC Canberra", ground: "Ground 2" },
  { id: "R1-M3", round: 1, date: "2025-11-15", time: "5:00 PM", home: "Everest FC", away: "Khukuri Canberra FC", ground: "Ground 1" },
  { id: "R1-M4", round: 1, date: "2025-11-15", time: "5:00 PM", home: "Azhas FC", away: "Unity Stars FC", ground: "Ground 2" },
  { id: "R1-M5", round: 1, date: "2025-11-15", time: "6:30 PM", home: "Achos Football Team", away: "Phuensum FC", ground: "Ground 1" },
  { id: "R1-M6", round: 1, date: "2025-11-15", time: "6:30 PM", home: "JA Brothers Football Club", away: "Queanbeyan Nepalese United Football Club", ground: "Ground 2" },

  // ROUND 2 – 22 NOV
  { id: "R2-M1", round: 2, date: "2025-11-22", time: "3:30 PM", home: "Everest FC", away: "Phuensum FC", ground: "Ground 1" },
  { id: "R2-M2", round: 2, date: "2025-11-22", time: "3:30 PM", home: "Druk FC", away: "Khukuri Canberra FC", ground: "Ground 2" },
  { id: "R2-M3", round: 2, date: "2025-11-22", time: "5:00 PM", home: "Thuenlam FC", away: "Unity Stars FC", ground: "Ground 1" },
  { id: "R2-M4", round: 2, date: "2025-11-22", time: "5:00 PM", home: "Achos Football Team", away: "JA Brothers Football Club", ground: "Ground 2" },
  { id: "R2-M5", round: 2, date: "2025-11-22", time: "6:30 PM", home: "Azhas FC", away: "Queanbeyan Nepalese United Football Club", ground: "Ground 1" },
  { id: "R2-M6", round: 2, date: "2025-11-22", time: "6:30 PM", home: "Nepal United FC", away: "CNFC Canberra", ground: "Ground 2" },

  // ROUND 3 – 29 NOV
  { id: "R3-M1", round: 3, date: "2025-11-29", time: "3:30 PM", home: "Everest FC", away: "JA Brothers Football Club", ground: "Ground 1" },
  { id: "R3-M2", round: 3, date: "2025-11-29", time: "3:30 PM", home: "CNFC Canberra", away: "Unity Stars FC", ground: "Ground 2" },
  { id: "R3-M3", round: 3, date: "2025-11-29", time: "5:00 PM", home: "Druk FC", away: "Phuensum FC", ground: "Ground 1" },
  { id: "R3-M4", round: 3, date: "2025-11-29", time: "5:00 PM", home: "Thuenlam FC", away: "Queanbeyan Nepalese United Football Club", ground: "Ground 2" },
  { id: "R3-M5", round: 3, date: "2025-11-29", time: "6:30 PM", home: "Nepal United FC", away: "Khukuri Canberra FC", ground: "Ground 1" },
  { id: "R3-M6", round: 3, date: "2025-11-29", time: "6:30 PM", home: "Azhas FC", away: "Achos Football Team", ground: "Ground 2" },
];

// RESULTS (week 1–3)
export const RESULTS = [
  // WEEK 1
  { fixtureId: "R1-M1", homeGoals: 9, awayGoals: 1 },
  { fixtureId: "R1-M2", homeGoals: 4, awayGoals: 1 },
  { fixtureId: "R1-M3", homeGoals: 0, awayGoals: 2 },
  { fixtureId: "R1-M4", homeGoals: 3, awayGoals: 1 },
  { fixtureId: "R1-M5", homeGoals: 1, awayGoals: 0 },
  { fixtureId: "R1-M6", homeGoals: 0, awayGoals: 2 },

  // WEEK 2
  { fixtureId: "R2-M1", homeGoals: 1, awayGoals: 1 },
  { fixtureId: "R2-M2", homeGoals: 0, awayGoals: 4 },
  { fixtureId: "R2-M3", homeGoals: 6, awayGoals: 0 },
  { fixtureId: "R2-M4", homeGoals: 2, awayGoals: 0 },
  { fixtureId: "R2-M5", homeGoals: 1, awayGoals: 1 },
  { fixtureId: "R2-M6", homeGoals: 10, awayGoals: 0 },

  // WEEK 3
  { fixtureId: "R3-M1", homeGoals: 1, awayGoals: 3 },
  { fixtureId: "R3-M2", homeGoals: 3, awayGoals: 2 },
  { fixtureId: "R3-M3", homeGoals: 1, awayGoals: 3 },
  { fixtureId: "R3-M4", homeGoals: 1, awayGoals: 0 },
  { fixtureId: "R3-M5", homeGoals: 1, awayGoals: 2 },
  { fixtureId: "R3-M6", homeGoals: 3, awayGoals: 1 },
];

// MATCH FACTS (structured)
export const MATCH_FACTS: Record<
  string,
  {
    home: {
      scorers: string[];
      cards: string[];
    };
    away: {
      scorers: string[];
      cards: string[];
    };
  }
> = {
  // WEEK 3
  "R3-M2": {
    home: {
      scorers: ["#10 Sumit Ale", "#9 Manoj", "#9 Manoj"],
      cards: ["#6 Prawol Vaidya – Yellow"],
    },
    away: {
      scorers: ["#3 Chencho Gyeltshen", "#3 Chencho Gyeltshen"],
      cards: [],
    },
  },
  "R3-M6": {
    home: {
      scorers: ["#47 Dipesh Tamang", "#12 Ajay Shrestha", "#13 Alton Thakuri"],
      cards: [
        "#2 Silas Tamang – Yellow",
        "#12 Ajay Shrestha – Yellow",
        "#99 Rahul Tamang – Yellow",
      ],
    },
    away: {
      scorers: ["#3 Kiran Gautam"],
      cards: [],
    },
  },
};

// LEAGUE TABLE FUNCTION
export type TableRow = {
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

export function computeLeagueTable(): TableRow[] {
  const idx = Object.fromEntries(TEAMS.map((t, i) => [t, i]));
  const table: TableRow[] = TEAMS.map((team) => ({
    name: team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  }));

  for (const r of RESULTS) {
    const f = FIXTURES.find((x) => x.id === r.fixtureId);
    if (!f) continue;

    const hi = idx[f.home];
    const ai = idx[f.away];
    const home = table[hi];
    const away = table[ai];

    home.played++;
    away.played++;
    home.goalsFor += r.homeGoals;
    home.goalsAgainst += r.awayGoals;
    away.goalsFor += r.awayGoals;
    away.goalsAgainst += r.homeGoals;

    if (r.homeGoals > r.awayGoals) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (r.homeGoals < r.awayGoals) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points++;
      away.points++;
    }

    home.goalDiff = home.goalsFor - home.goalsAgainst;
    away.goalDiff = away.goalsFor - away.goalsAgainst;
  }

  table.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      a.name.localeCompare(b.name)
  );

  return table;
}
