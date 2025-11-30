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
};

export const SPL_SEASON = {
  name: "Samsara Premier League (SPL) 2025-26",
  organiser: "The Samsara Group - Canberra",
  venue: "Nicholls Synthetic Soccer Field, Canberra",
  startDate: "2025-11-15",
};

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
    {
      name: "Canberra Momo House - Nepalese Restaurant",
      url: "#",
      logo: "/sponsor/momo.png",
    },
    {
      name: "Dikshant Dhungel – Real Estate Agent",
      url: "#",
      logo: "/sponsor/dikshant.png",
    },
    { name: "The Monkey Temple", url: "#", logo: "/sponsor/monkeytemple.png" },
    { name: "Ooshman Gungahlin", url: "#", logo: "/sponsor/ooshman.png" },
    { name: "Zenith Services Sydney", url: "#", logo: "/sponsor/zenith.png" },
    {
      name: "Expert Education and Visa Services (Blacktown, Sydney)",
      url: "#",
      logo: "/sponsor/expert.png",
    },
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

export type Fixture = {
  id: string;
  round: number;
  date: string; // YYYY-MM-DD
  time: string; // "3:30 PM"
  home: string;
  away: string;
  ground: string;
};

export const FIXTURES: Fixture[] = [
  // Round 1 - 15 Nov 2025
  {
    id: "R1-M1",
    round: 1,
    date: "2025-11-15",
    time: "3:30 PM",
    home: "Nepal United FC",
    away: "Druk FC",
    ground: "Ground 1",
  },
  {
    id: "R1-M2",
    round: 1,
    date: "2025-11-15",
    time: "3:30 PM",
    home: "Thuenlam FC",
    away: "CNFC Canberra",
    ground: "Ground 2",
  },
  {
    id: "R1-M3",
    round: 1,
    date: "2025-11-15",
    time: "5:00 PM",
    home: "Everest FC",
    away: "Khukuri Canberra FC",
    ground: "Ground 1",
  },
  {
    id: "R1-M4",
    round: 1,
    date: "2025-11-15",
    time: "5:00 PM",
    home: "Azhas FC",
    away: "Unity Stars FC",
    ground: "Ground 2",
  },
  {
    id: "R1-M5",
    round: 1,
    date: "2025-11-15",
    time: "6:30 PM",
    home: "Achos Football Team",
    away: "Phuensum FC",
    ground: "Ground 1",
  },
  {
    id: "R1-M6",
    round: 1,
    date: "2025-11-15",
    time: "6:30 PM",
    home: "JA Brothers Football Club",
    away: "Queanbeyan Nepalese United Football Club",
    ground: "Ground 2",
  },

  // Round 2 - 22 Nov 2025
  {
    id: "R2-M1",
    round: 2,
    date: "2025-11-22",
    time: "3:30 PM",
    home: "Everest FC",
    away: "Phuensum FC",
    ground: "Ground 1",
  },
  {
    id: "R2-M2",
    round: 2,
    date: "2025-11-22",
    time: "3:30 PM",
    home: "Druk FC",
    away: "Khukuri Canberra FC",
    ground: "Ground 2",
  },
  {
    id: "R2-M3",
    round: 2,
    date: "2025-11-22",
    time: "5:00 PM",
    home: "Thuenlam FC",
    away: "Unity Stars FC",
    ground: "Ground 1",
  },
  {
    id: "R2-M4",
    round: 2,
    date: "2025-11-22",
    time: "5:00 PM",
    home: "Achos Football Team",
    away: "JA Brothers Football Club",
    ground: "Ground 2",
  },
  {
    id: "R2-M5",
    round: 2,
    date: "2025-11-22",
    time: "6:30 PM",
    home: "Azhas FC",
    away: "Queanbeyan Nepalese United Football Club",
    ground: "Ground 1",
  },
  {
    id: "R2-M6",
    round: 2,
    date: "2025-11-22",
    time: "6:30 PM",
    home: "Nepal United FC",
    away: "CNFC Canberra",
    ground: "Ground 2",
  },

  // Round 3 - 29 Nov 2025
  {
    id: "R3-M1",
    round: 3,
    date: "2025-11-29",
    time: "3:30 PM",
    home: "Everest FC",
    away: "JA Brothers Football Club",
    ground: "Ground 1",
  },
  {
    id: "R3-M2",
    round: 3,
    date: "2025-11-29",
    time: "3:30 PM",
    home: "CNFC Canberra",
    away: "Unity Stars FC",
    ground: "Ground 2",
  },
  {
    id: "R3-M3",
    round: 3,
    date: "2025-11-29",
    time: "5:00 PM",
    home: "Druk FC",
    away: "Phuensum FC",
    ground: "Ground 1",
  },
  {
    id: "R3-M4",
    round: 3,
    date: "2025-11-29",
    time: "5:00 PM",
    home: "Thuenlam FC",
    away: "Queanbeyan Nepalese United Football Club",
    ground: "Ground 2",
  },
  {
    id: "R3-M5",
    round: 3,
    date: "2025-11-29",
    time: "6:30 PM",
    home: "Nepal United FC",
    away: "Khukuri Canberra FC",
    ground: "Ground 1",
  },
  {
    id: "R3-M6",
    round: 3,
    date: "2025-11-29",
    time: "6:30 PM",
    home: "Azhas FC",
    away: "Achos Football Team",
    ground: "Ground 2",
  },

  // Round 4 - 6 Dec 2025
  {
    id: "R4-M1",
    round: 4,
    date: "2025-12-06",
    time: "3:30 PM",
    home: "Druk FC",
    away: "JA Brothers Football Club",
    ground: "Ground 1",
  },
  {
    id: "R4-M2",
    round: 4,
    date: "2025-12-06",
    time: "3:30 PM",
    home: "CNFC Canberra",
    away: "Queanbeyan Nepalese United Football Club",
    ground: "Ground 2",
  },
  {
    id: "R4-M3",
    round: 4,
    date: "2025-12-06",
    time: "5:00 PM",
    home: "Everest FC",
    away: "Azhas FC",
    ground: "Ground 1",
  },
  {
    id: "R4-M4",
    round: 4,
    date: "2025-12-06",
    time: "5:00 PM",
    home: "Nepal United FC",
    away: "Unity Stars FC",
    ground: "Ground 2",
  },
  {
    id: "R4-M5",
    round: 4,
    date: "2025-12-06",
    time: "6:30 PM",
    home: "Thuenlam FC",
    away: "Achos Football Team",
    ground: "Ground 1",
  },
  {
    id: "R4-M6",
    round: 4,
    date: "2025-12-06",
    time: "6:30 PM",
    home: "Khukuri Canberra FC",
    away: "Phuensum FC",
    ground: "Ground 2",
  },

  // Round 5 - 13 Dec 2025
  {
    id: "R5-M1",
    round: 5,
    date: "2025-12-13",
    time: "3:30 PM",
    home: "CNFC Canberra",
    away: "Achos Football Team",
    ground: "Ground 1",
  },
  {
    id: "R5-M2",
    round: 5,
    date: "2025-12-13",
    time: "3:30 PM",
    home: "Unity Stars FC",
    away: "Queanbeyan Nepalese United Football Club",
    ground: "Ground 2",
  },
  {
    id: "R5-M3",
    round: 5,
    date: "2025-12-13",
    time: "5:00 PM",
    home: "Nepal United FC",
    away: "Phuensum FC",
    ground: "Ground 1",
  },
  {
    id: "R5-M4",
    round: 5,
    date: "2025-12-13",
    time: "5:00 PM",
    home: "Khukuri Canberra FC",
    away: "JA Brothers Football Club",
    ground: "Ground 2",
  },
  {
    id: "R5-M5",
    round: 5,
    date: "2025-12-13",
    time: "6:30 PM",
    home: "Druk FC",
    away: "Azhas FC",
    ground: "Ground 1",
  },
  {
    id: "R5-M6",
    round: 5,
    date: "2025-12-13",
    time: "6:30 PM",
    home: "Thuenlam FC",
    away: "Everest FC",
    ground: "Ground 2",
  },

  // Round 6 - 20 Dec 2025
  {
    id: "R6-M1",
    round: 6,
    date: "2025-12-20",
    time: "3:30 PM",
    home: "Phuensum FC",
    away: "JA Brothers Football Club",
    ground: "Ground 1",
  },
  {
    id: "R6-M2",
    round: 6,
    date: "2025-12-20",
    time: "3:30 PM",
    home: "Nepal United FC",
    away: "Queanbeyan Nepalese United Football Club",
    ground: "Ground 2",
  },
  {
    id: "R6-M3",
    round: 6,
    date: "2025-12-20",
    time: "5:00 PM",
    home: "Unity Stars FC",
    away: "Achos Football Team",
    ground: "Ground 1",
  },
  {
    id: "R6-M4",
    round: 6,
    date: "2025-12-20",
    time: "5:00 PM",
    home: "Khukuri Canberra FC",
    away: "Azhas FC",
    ground: "Ground 2",
  },
  {
    id: "R6-M5",
    round: 6,
    date: "2025-12-20",
    time: "6:30 PM",
    home: "CNFC Canberra",
    away: "Everest FC",
    ground: "Ground 1",
  },
  {
    id: "R6-M6",
    round: 6,
    date: "2025-12-20",
    time: "6:30 PM",
    home: "Druk FC",
    away: "Thuenlam FC",
    ground: "Ground 2",
  },

  // Round 7 - 10 Jan 2026
  {
    id: "R7-M1",
    round: 7,
    date: "2026-01-10",
    time: "3:30 PM",
    home: "Phuensum FC",
    away: "Azhas FC",
    ground: "Ground 1",
  },
  {
    id: "R7-M2",
    round: 7,
    date: "2026-01-10",
    time: "3:30 PM",
    home: "Khukuri Canberra FC",
    away: "Thuenlam FC",
    ground: "Ground 2",
  },
  {
    id: "R7-M3",
    round: 7,
    date: "2026-01-10",
    time: "5:00 PM",
    home: "CNFC Canberra",
    away: "Druk FC",
    ground: "Ground 1",
  },
  {
    id: "R7-M4",
    round: 7,
    date: "2026-01-10",
    time: "5:00 PM",
    home: "Unity Stars FC",
    away: "Everest FC",
    ground: "Ground 2",
  },
  {
    id: "R7-M5",
    round: 7,
    date: "2026-01-10",
    time: "6:30 PM",
    home: "Queanbeyan Nepalese United Football Club",
    away: "Achos Football Team",
    ground: "Ground 1",
  },
  {
    id: "R7-M6",
    round: 7,
    date: "2026-01-10",
    time: "6:30 PM",
    home: "Nepal United FC",
    away: "JA Brothers Football Club",
    ground: "Ground 2",
  },

  // Round 8 - 17 Jan 2026
  {
    id: "R8-M1",
    round: 8,
    date: "2026-01-17",
    time: "3:30 PM",
    home: "Nepal United FC",
    away: "Achos Football Team",
    ground: "Ground 1",
  },
  {
    id: "R8-M2",
    round: 8,
    date: "2026-01-17",
    time: "3:30 PM",
    home: "JA Brothers Football Club",
    away: "Azhas FC",
    ground: "Ground 2",
  },
  {
    id: "R8-M3",
    round: 8,
    date: "2026-01-17",
    time: "5:00 PM",
    home: "Queanbeyan Nepalese United Football Club",
    away: "Everest FC",
    ground: "Ground 1",
  },
  {
    id: "R8-M4",
    round: 8,
    date: "2026-01-17",
    time: "5:00 PM",
    home: "Phuensum FC",
    away: "Thuenlam FC",
    ground: "Ground 2",
  },
  {
    id: "R8-M5",
    round: 8,
    date: "2026-01-17",
    time: "6:30 PM",
    home: "Unity Stars FC",
    away: "Druk FC",
    ground: "Ground 1",
  },
  {
    id: "R8-M6",
    round: 8,
    date: "2026-01-17",
    time: "6:30 PM",
    home: "Khukuri Canberra FC",
    away: "CNFC Canberra",
    ground: "Ground 2",
  },

  // Round 9 - 31 Jan 2026
  {
    id: "R9-M1",
    round: 9,
    date: "2026-01-31",
    time: "3:30 PM",
    home: "Achos Football Team",
    away: "Everest FC",
    ground: "Ground 1",
  },
  {
    id: "R9-M2",
    round: 9,
    date: "2026-01-31",
    time: "3:30 PM",
    home: "Unity Stars FC",
    away: "Khukuri Canberra FC",
    ground: "Ground 2",
  },
  {
    id: "R9-M3",
    round: 9,
    date: "2026-01-31",
    time: "5:00 PM",
    home: "JA Brothers Football Club",
    away: "Thuenlam FC",
    ground: "Ground 1",
  },
  {
    id: "R9-M4",
    round: 9,
    date: "2026-01-31",
    time: "5:00 PM",
    home: "Queanbeyan Nepalese United Football Club",
    away: "Druk FC",
    ground: "Ground 2",
  },
  {
    id: "R9-M5",
    round: 9,
    date: "2026-01-31",
    time: "6:30 PM",
    home: "Phuensum FC",
    away: "CNFC Canberra",
    ground: "Ground 1",
  },
  {
    id: "R9-M6",
    round: 9,
    date: "2026-01-31",
    time: "6:30 PM",
    home: "Nepal United FC",
    away: "Azhas FC",
    ground: "Ground 2",
  },

  // Round 10 - 7 Feb 2026
  {
    id: "R10-M1",
    round: 10,
    date: "2026-02-07",
    time: "3:30 PM",
    home: "Achos Football Team",
    away: "Druk FC",
    ground: "Ground 1",
  },
  {
    id: "R10-M2",
    round: 10,
    date: "2026-02-07",
    time: "3:30 PM",
    home: "Azhas FC",
    away: "Thuenlam FC",
    ground: "Ground 2",
  },
  {
    id: "R10-M3",
    round: 10,
    date: "2026-02-07",
    time: "5:00 PM",
    home: "JA Brothers Football Club",
    away: "CNFC Canberra",
    ground: "Ground 1",
  },
  {
    id: "R10-M4",
    round: 10,
    date: "2026-02-07",
    time: "5:00 PM",
    home: "Nepal United FC",
    away: "Everest FC",
    ground: "Ground 2",
  },
  {
    id: "R10-M5",
    round: 10,
    date: "2026-02-07",
    time: "6:30 PM",
    home: "Queanbeyan Nepalese United Football Club",
    away: "Khukuri Canberra FC",
    ground: "Ground 1",
  },
  {
    id: "R10-M6",
    round: 10,
    date: "2026-02-07",
    time: "6:30 PM",
    home: "Phuensum FC",
    away: "Unity Stars FC",
    ground: "Ground 2",
  },

  // Round 11 - 14 Feb 2026
  {
    id: "R11-M1",
    round: 11,
    date: "2026-02-14",
    time: "3:30 PM",
    home: "Queanbeyan Nepalese United Football Club",
    away: "Phuensum FC",
    ground: "Ground 1",
  },
  {
    id: "R11-M2",
    round: 11,
    date: "2026-02-14",
    time: "3:30 PM",
    home: "Nepal United FC",
    away: "Thuenlam FC",
    ground: "Ground 2",
  },
  {
    id: "R11-M3",
    round: 11,
    date: "2026-02-14",
    time: "5:00 PM",
    home: "Azhas FC",
    away: "CNFC Canberra",
    ground: "Ground 1",
  },
  {
    id: "R11-M4",
    round: 11,
    date: "2026-02-14",
    time: "5:00 PM",
    home: "Achos Football Team",
    away: "Khukuri Canberra FC",
    ground: "Ground 2",
  },
  {
    id: "R11-M5",
    round: 11,
    date: "2026-02-14",
    time: "6:30 PM",
    home: "JA Brothers Football Club",
    away: "Unity Stars FC",
    ground: "Ground 1",
  },
  {
    id: "R11-M6",
    round: 11,
    date: "2026-02-14",
    time: "6:30 PM",
    home: "Everest FC",
    away: "Druk FC",
    ground: "Ground 2",
  },
];

// Results for the league table
export const RESULTS = [
  // Week 1
  { fixtureId: "R1-M1", homeGoals: 9, awayGoals: 1 }, // Nepal United 9-1 Druk
  { fixtureId: "R1-M2", homeGoals: 4, awayGoals: 1 }, // Thuenlam 4-1 CNFC
  { fixtureId: "R1-M3", homeGoals: 0, awayGoals: 2 }, // Everest 0-2 Khukuri
  { fixtureId: "R1-M4", homeGoals: 3, awayGoals: 1 }, // Azhas 3-1 Unity
  { fixtureId: "R1-M5", homeGoals: 1, awayGoals: 0 }, // Achos 1-0 Phuensum
  { fixtureId: "R1-M6", homeGoals: 0, awayGoals: 2 }, // JA Brothers 0-2 QNU

  // Week 2
  { fixtureId: "R2-M1", homeGoals: 1, awayGoals: 1 }, // Everest 1-1 Phuensum
  { fixtureId: "R2-M2", homeGoals: 0, awayGoals: 4 }, // Druk 0-4 Khukuri
  { fixtureId: "R2-M3", homeGoals: 6, awayGoals: 0 }, // Thuenlam 6-0 Unity
  { fixtureId: "R2-M4", homeGoals: 2, awayGoals: 0 }, // Achos 2-0 JA Brothers
  { fixtureId: "R2-M5", homeGoals: 1, awayGoals: 1 }, // Azhas 1-1 QNU
  { fixtureId: "R2-M6", homeGoals: 10, awayGoals: 0 }, // Nepal United 10-0 CNFC

  // Week 3
  { fixtureId: "R3-M1", homeGoals: 1, awayGoals: 3 }, // Everest 1-3 JA Brothers
  { fixtureId: "R3-M2", homeGoals: 3, awayGoals: 2 }, // CNFC 3-2 Unity
  { fixtureId: "R3-M3", homeGoals: 1, awayGoals: 3 }, // Druk 1-3 Phuensum
  { fixtureId: "R3-M4", homeGoals: 1, awayGoals: 0 }, // Thuenlam 1-0 QNU
  { fixtureId: "R3-M5", homeGoals: 1, awayGoals: 2 }, // Nepal United 1-2 Khukuri
  { fixtureId: "R3-M6", homeGoals: 3, awayGoals: 1 }, // Azhas 3-1 Achos
];

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
  const index = Object.fromEntries(TEAMS.map((t, i) => [t, i]));
  const rows: TableRow[] = TEAMS.map((name) => ({
    name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  }));

  const resultMap = Object.fromEntries(RESULTS.map((r) => [r.fixtureId, r]));

  for (const f of FIXTURES) {
    const r = resultMap[f.id];
    if (!r) continue;

    const hi = index[f.home];
    const ai = index[f.away];
    if (hi === undefined || ai === undefined) continue;

    const home = rows[hi];
    const away = rows[ai];

    home.played += 1;
    away.played += 1;
    home.goalsFor += r.homeGoals;
    home.goalsAgainst += r.awayGoals;
    away.goalsFor += r.awayGoals;
    away.goalsAgainst += r.homeGoals;
    home.goalDiff = home.goalsFor - home.goalsAgainst;
    away.goalDiff = away.goalsFor - away.goalsAgainst;

    if (r.homeGoals > r.awayGoals) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (r.homeGoals < r.awayGoals) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  rows.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      a.name.localeCompare(b.name),
  );

  return rows;
}

export function getUpcomingFixtures(limit = 5): Fixture[] {
  const now = new Date();
  return [...FIXTURES]
    .filter((f) => new Date(f.date) >= now)
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (da !== db) return da - db;
      return a.time.localeCompare(b.time);
    })
    .slice(0, limit);
}

export function getRounds(): number[] {
  return [...new Set(FIXTURES.map((f) => f.round))].sort((a, b) => a - b);
}

// ---------- MATCH FACTS (only from Week 3 as per Option C) ----------

export type MatchFactsSide = {
  teamName: string;
  scorers: string[];
  cards: string[];
};

export type MatchFactsRecord = Record<
  string,
  {
    home: MatchFactsSide;
    away: MatchFactsSide;
  }
>;

export const MATCH_FACTS: MatchFactsRecord = {
  // R3-M1: Everest FC 1 - 3 JA Brothers FC
  "R3-M1": {
    home: {
      teamName: "Everest FC",
      scorers: ["Kiran Gautam (#3) - 1 goal"],
      cards: [],
    },
    away: {
      teamName: "JA Brothers Football Club",
      scorers: [
        "Dipesh Tamang (#47) - 1 goal",
        "Ajay Shrestha (#12) - 1 goal",
        "Alton Thakuri (#13) - 1 goal",
      ],
      cards: [
        "Silas Tamang (#2) - Yellow",
        "Ajay Shrestha (#12) - Yellow",
        "Rahul Tamang (#99) - Yellow",
      ],
    },
  },

  // R3-M2: CNFC Canberra 3 - 2 Unity Stars FC
  "R3-M2": {
    home: {
      teamName: "CNFC Canberra",
      scorers: [
        "Sumit Ale (#10) - 1 goal",
        "Manoj (#9) - 2 goals",
      ],
      cards: ["Prawol Vaidya (#6) - Yellow"],
    },
    away: {
      teamName: "Unity Stars FC",
      scorers: ["Chencho Gyeltshen (#3) - 2 goals"],
      cards: [],
    },
  },

  // R3-M3: Druk FC 1 - 3 Phuensum FC
  "R3-M3": {
    home: {
      teamName: "Druk FC",
      scorers: ["Sangay Tenzin (#13) - 1 goal"],
      cards: [],
    },
    away: {
      teamName: "Phuensum FC",
      scorers: [
        "Sonam Dorji (#8) - 1 goal",
        "Kinley Wangdi (#6) - 1 goal",
        "Sonam Wangchuk (#18) - 1 goal",
      ],
      cards: ["Namgay Tenzin (#19) - Straight red (dissent)"],
    },
  },

  // R3-M4: Thuenlam FC 1 - 0 QNUFC
  "R3-M4": {
    home: {
      teamName: "Thuenlam FC",
      scorers: ["Kunzang Thinley (#23) - 1 goal"],
      cards: [],
    },
    away: {
      teamName: "Queanbeyan Nepalese United Football Club",
      scorers: [],
      cards: [],
    },
  },

  // R3-M5: Nepal United FC 1 - 2 Khukuri Canberra FC
  "R3-M5": {
    home: {
      teamName: "Nepal United FC",
      scorers: ["Pujan Uperkoti (#15) - 1 goal"],
      cards: [
        "Enoj Neupane (#7) - Yellow",
        "Aakash Jung Raut (#2) - Yellow",
      ],
    },
    away: {
      teamName: "Khukuri Canberra FC",
      scorers: [
        "Abhishek Chapagain (#10) - 1 goal",
        "Roshan Lamichhane (#9) - 1 goal",
      ],
      cards: [
        "Sagar Khadka (#6, black jersey) - Yellow",
        "Protshan Basnet (#7) - Second yellow and red",
      ],
    },
  },

  // R3-M6: Azhas FC 3 - 1 Achos Football Team
  "R3-M6": {
    home: {
      teamName: "Azhas FC",
      scorers: [
        "Namgay Wangchuk (#7) - 1 goal",
        "Rabtsen Tshegyel (#29) - 1 goal",
        "Chimi Kinzang Wangchuk (#10) - 1 goal",
      ],
      cards: ["Zeyden Dorji (#15) - Yellow"],
    },
    away: {
      teamName: "Achos Football Team",
      scorers: ["Sonam Chopel (#21) - 1 goal"],
      cards: ["Kelzang Jigme (#10) - Yellow"],
    },
  },
};
