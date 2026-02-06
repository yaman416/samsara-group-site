// lib/splData.ts
// Keep ALL records and fixtures/results exactly as-is.
// Only update: add Week 7 results and match facts, and fix Week 6 RESULTS ids (no placeholders).

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
  organiser: "Samsara Group - Canberra",
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
  "Queanbeyan Nepalese UFC",
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
  "Queanbeyan Nepalese UFC": "/team/queanbeyan.png",
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
    away: "Queanbeyan Nepalese UFC",
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
    away: "Queanbeyan Nepalese UFC",
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
    away: "Queanbeyan Nepalese UFC",
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
    away: "Queanbeyan Nepalese UFC",
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
    away: "Queanbeyan Nepalese UFC",
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
    home: "Queanbeyan Nepalese UFC",
    away: "BYE",
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
    home: "Queanbeyan Nepalese UFC",
    away: "Achos Football Team",
    ground: "Ground 1",
  },
  {
    id: "R7-M6",
    round: 7,
    date: "2026-01-10",
    time: "6:30 PM",
    home: "JA Brothers Football Club",
    away: "BYE",
    ground: "Ground 2",
  },

  // Round 8 - 17 Jan 2026
  {
    id: "R8-M1",
    round: 8,
    date: "2026-01-17",
    time: "3:30 PM",
    home: "Achos Football Team",
    away: "BYE",
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
    home: "Queanbeyan Nepalese UFC",
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
    home: "Queanbeyan Nepalese UFC",
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
    home: "Azhas FC",
    away: "BYE",
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
    home: "Everest FC",
    away: "BYE",
    ground: "Ground 2",
  },
  {
    id: "R10-M5",
    round: 10,
    date: "2026-02-07",
    time: "6:30 PM",
    home: "Queanbeyan Nepalese UFC",
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
    home: "Queanbeyan Nepalese UFC",
    away: "Phuensum FC",
    ground: "Ground 1",
  },
  {
    id: "R11-M2",
    round: 11,
    date: "2026-02-14",
    time: "3:30 PM",
    home: "Thuenlam FC",
    away: "BYE",
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

  // Week 4
  { fixtureId: "R4-M1", homeGoals: 1, awayGoals: 1 }, // Druk 1-1 JA Brothers
  { fixtureId: "R4-M2", homeGoals: 1, awayGoals: 0 }, // CNFC 1-0 QNU
  { fixtureId: "R4-M3", homeGoals: 2, awayGoals: 2 }, // Everest 2-2 Azhas
  { fixtureId: "R4-M4", homeGoals: 9, awayGoals: 1 }, // Nepal United 9-1 Unity
  { fixtureId: "R4-M5", homeGoals: 2, awayGoals: 1 }, // Thuenlam 2-1 Achos
  { fixtureId: "R4-M6", homeGoals: 3, awayGoals: 0 }, // Khukuri 3-0 Phuensum

  // Week 5
  { fixtureId: "R5-M1", homeGoals: 1, awayGoals: 5 }, // CNFC 1-5 Achos
  { fixtureId: "R5-M2", homeGoals: 0, awayGoals: 4 }, // Unity 0-4 QNU
  { fixtureId: "R5-M3", homeGoals: 0, awayGoals: 3 }, // Nepal United 0-3 Phuensum (Match awarded)
  { fixtureId: "R5-M4", homeGoals: 0, awayGoals: 0 }, // Khukuri 0-0 JA Brothers
  { fixtureId: "R5-M5", homeGoals: 1, awayGoals: 3 }, // Druk 1-3 Azhas
  { fixtureId: "R5-M6", homeGoals: 2, awayGoals: 1 }, // Thuenlam 2-1 Everest

  // Week 6
  { fixtureId: "R6-M1", homeGoals: 1, awayGoals: 2 }, // Phuensum 1-2 JA Brothers
  { fixtureId: "R6-M2", homeGoals: 3, awayGoals: 0 }, // Queanbeyan 3-0 BYE
  { fixtureId: "R6-M3", homeGoals: 1, awayGoals: 5 }, // Unity 1-5 Achos
  { fixtureId: "R6-M4", homeGoals: 0, awayGoals: 1 }, // Khukuri 0-1 Azhas
  { fixtureId: "R6-M5", homeGoals: 1, awayGoals: 4 }, // CNFC 1-4 Everest
  { fixtureId: "R6-M6", homeGoals: 1, awayGoals: 3 }, // Druk 1-3 Thuenlam

  // Week 7
  { fixtureId: "R7-M1", homeGoals: 0, awayGoals: 0 }, // Phuensum 0-0 Azhas
  { fixtureId: "R7-M2", homeGoals: 6, awayGoals: 0 }, // Khukuri 6-0 Thuenlam
  { fixtureId: "R7-M3", homeGoals: 3, awayGoals: 3 }, // CNFC 3-3 Druk
  { fixtureId: "R7-M4", homeGoals: 0, awayGoals: 2 }, // Unity 0-2 Everest
  { fixtureId: "R7-M5", homeGoals: 0, awayGoals: 2 }, // Queanbeyan 0-2 Achos
  { fixtureId: "R7-M6", homeGoals: 3, awayGoals: 0 }, // JA Brothers 3-0 BYE

  // Week 8
  { fixtureId: "R8-M1", homeGoals: 3, awayGoals: 0 }, // Achos 3-0 BYE
  { fixtureId: "R8-M2", homeGoals: 0, awayGoals: 0 }, // JA Brothers 0-0 Azhas
  { fixtureId: "R8-M3", homeGoals: 2, awayGoals: 2 }, // Queanbeyan 2-2 Everest
  { fixtureId: "R8-M4", homeGoals: 2, awayGoals: 4 }, // Phuensum 2-4 Thuenlam
  { fixtureId: "R8-M5", homeGoals: 2, awayGoals: 6 }, // Unity 2-6 Druk
  { fixtureId: "R8-M6", homeGoals: 4, awayGoals: 0 }, // Khukuri 4-0 CNFC

  // Week 9
  { fixtureId: "R9-M1", homeGoals: 2, awayGoals: 0 }, // Achos 2-0 Everest
  { fixtureId: "R9-M2", homeGoals: 1, awayGoals: 9 }, // Unity 1-9 Khukuri
  { fixtureId: "R9-M3", homeGoals: 1, awayGoals: 2 }, // JA Brothers 1-2 Thuenlam
  { fixtureId: "R9-M4", homeGoals: 5, awayGoals: 1 }, // Queanbeyan 5-1 Druk
  { fixtureId: "R9-M5", homeGoals: 2, awayGoals: 1 }, // Phuensum 2-1 CNFC
  { fixtureId: "R9-M6", homeGoals: 3, awayGoals: 0 }, // Azhas 3-0 BYE

// Week 10
{ fixtureId: "R10-M1", homeGoals: 6, awayGoals: 0 }, // Achos FC 6-0 Druk FC
{ fixtureId: "R10-M2", homeGoals: 2, awayGoals: 1 }, // Azhas FC 2-1 Thuenlam FC
{ fixtureId: "R10-M3", homeGoals: 3, awayGoals: 0 }, // JA Brothers FC 3-0 CNFC Canberra
{ fixtureId: "R10-M4", homeGoals: 3, awayGoals: 0 }, // Everest FC 3-0 BYE
{ fixtureId: "R10-M5", homeGoals: 1, awayGoals: 1 }, // Queanbeyan Nepalese UFC 1-1 Khukuri Canberra FC
{ fixtureId: "R10-M6", homeGoals: 0, awayGoals: 0 }, // Phuensum FC 0-0 Unity Stars FC

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

  // ONLY CHANGE: remove Nepal United FC from the table output
  return rows.filter((r) => r.name !== "Nepal United FC");
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

// ---------- MATCH FACTS (Weeks 1–7) ----------

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
  // -------- WEEK 1 --------
  "R1-M1": {
    home: {
      teamName: "Nepal United FC",
      scorers: [
        "Sanjok Rai - 6 goals",
        "Niraj Chhetri - 1 goal",
        "Enoj Neupane - 2 goals",
      ],
      cards: [],
    },
    away: { teamName: "Druk FC", scorers: [], cards: [] },
  },

  "R1-M2": {
    home: {
      teamName: "Thuenlam FC",
      scorers: [
        "Pema Tshulthrim - 1 goal",
        "Penden Tshewang - 1 goal",
        "Kunzang Thinley - 1 goal",
        "Tshering Dorji - 1 goal",
      ],
      cards: [],
    },
    away: {
      teamName: "CNFC Canberra",
      scorers: ["Sumin Bhattarai - 1 goal"],
      cards: ["Bishal Ghimire - Yellow"],
    },
  },

  "R1-M3": {
    home: {
      teamName: "Everest FC",
      scorers: [],
      cards: ["Bijay Bhandari - Yellow"],
    },
    away: {
      teamName: "Khukuri Canberra FC",
      scorers: ["Sagar Khadka - 1 goal", "Roshan Lamichhane - 1 goal"],
      cards: ["Anup Shrestha - Yellow", "Protshan Basnet - Yellow"],
    },
  },

  "R1-M4": {
    home: {
      teamName: "Azhas FC",
      scorers: ["Karma Nima - 2 goals", "Tshultrim Juney - 1 goal"],
      cards: ["Tshering Dhendup - Yellow"],
    },
    away: { teamName: "Unity Stars FC", scorers: [], cards: [] },
  },

  "R1-M5": {
    home: {
      teamName: "Achos Football Team",
      scorers: ["Tshering Tobgyel - 1 goal"],
      cards: ["Pelzang - Yellow"],
    },
    away: { teamName: "Phuensum FC", scorers: [], cards: [] },
  },

  "R1-M6": {
    home: {
      teamName: "JA Brothers Football Club",
      scorers: [],
      cards: ["Angel Prasai - Yellow", "Darshan Gautam - Yellow"],
    },
    away: {
      teamName: "Queanbeyan Nepalese UFC",
      scorers: ["Sushant Shrestha - 1 goal", "Namgay - 1 goal"],
      cards: ["Bishal Kharel - Yellow"],
    },
  },

  // -------- WEEK 2 --------
  "R2-M1": {
    home: {
      teamName: "Everest FC",
      scorers: ["Krishal Lama - 1 goal"],
      cards: [],
    },
    away: {
      teamName: "Phuensum FC",
      scorers: ["Sampa Tshering - 1 goal"],
      cards: ["Sonam Wangchuk - Yellow"],
    },
  },

  "R2-M2": {
    home: { teamName: "Druk FC", scorers: [], cards: ["Tashi Norbu - Yellow"] },
    away: {
      teamName: "Khukuri Canberra FC",
      scorers: ["Roshan Lamichhane - 2 goals", "Abhishek Chapagain - 2 goals"],
      cards: [],
    },
  },

  "R2-M3": {
    home: {
      teamName: "Thuenlam FC",
      scorers: ["Tshering Dorji - 2 goals", "Kunzang Thinley - 3 goals"],
      cards: [],
    },
    away: {
      teamName: "Unity Stars FC",
      scorers: [],
      cards: ["Bishal Ghimire - Yellow"],
    },
  },

  "R2-M4": {
    home: {
      teamName: "Achos Football Team",
      scorers: ["Tshering Tobgyel - 2 goals"],
      cards: [],
    },
    away: {
      teamName: "JA Brothers Football Club",
      scorers: [],
      cards: ["Yuzan Ghimire - Yellow"],
    },
  },

  "R2-M5": {
    home: {
      teamName: "Azhas FC",
      scorers: ["Rabten Tshegyel - 1 goal"],
      cards: [
        "Rabten Tshegyel - Yellow",
        "Nima Tshering - Yellow",
        "Thinley Gyaltshen - Second yellow and red",
      ],
    },
    away: {
      teamName: "Queanbeyan Nepalese UFC",
      scorers: ["Saneej Chhetri - 1 goal"],
      cards: [],
    },
  },

  "R2-M6": {
    home: {
      teamName: "Nepal United FC",
      scorers: [
        "Nishan Khadka - 1 goal",
        "Enoj Neupane - 4 goals",
        "Niraj Chhetri - 1 goal",
        "Dipendra Gurung - 2 goals",
        "Salav Gauchan - 2 goals",
      ],
      cards: [],
    },
    away: { teamName: "CNFC Canberra", scorers: [], cards: [] },
  },

  // -------- WEEK 3 --------
  "R3-M1": {
    home: { teamName: "Everest FC", scorers: ["Kiran Gautam - 1 goal"], cards: [] },
    away: {
      teamName: "JA Brothers Football Club",
      scorers: ["Dipesh Tamang - 1 goal", "Ajay Shrestha - 1 goal", "Alton Thakuri - 1 goal"],
      cards: ["Ajay Shrestha - Yellow", "Silas Tamang - Yellow", "Rahul Tamang - Yellow"],
    },
  },

  "R3-M2": {
    home: {
      teamName: "CNFC Canberra",
      scorers: ["Sumit Ale - 1 goal", "Manoj - 2 goals"],
      cards: ["Prawol Vaidya - Yellow"],
    },
    away: { teamName: "Unity Stars FC", scorers: ["Panda - 2 goals"], cards: [] },
  },

  "R3-M3": {
    home: { teamName: "Druk FC", scorers: ["Sangay Tenzin - 1 goal"], cards: [] },
    away: {
      teamName: "Phuensum FC",
      scorers: ["Sonam Dorji - 1 goal", "Kinley Wangdi - 1 goal", "Sonam Wangchuk - 1 goal"],
      cards: ["Namgay Tenzin - Straight red (dissent)"],
    },
  },

  "R3-M4": {
    home: { teamName: "Thuenlam FC", scorers: ["Kunzang Thinley - 1 goal"], cards: [] },
    away: { teamName: "Queanbeyan Nepalese UFC", scorers: [], cards: [] },
  },

  "R3-M5": {
    home: {
      teamName: "Nepal United FC",
      scorers: ["Pujan Uparkoti - 1 goal"],
      cards: ["Enoj Neupane - Yellow", "Aakash Jung Raut - Yellow"],
    },
    away: {
      teamName: "Khukuri Canberra FC",
      scorers: ["Abhishek Chapagain - 1 goal", "Roshan Lamichhane - 1 goal"],
      cards: ["Sagar Khadka - Yellow", "Protshan Basnet - Second yellow and red"],
    },
  },

  "R3-M6": {
    home: {
      teamName: "Azhas FC",
      scorers: ["Chimi K Wangchuk - 1 goal", "Rabten Tshegyel - 1 goal", "Namgay Wangchuk - 1 goal"],
      cards: ["Zayden Dorji - Yellow"],
    },
    away: { teamName: "Achos Football Team", scorers: ["Sonam Chopen - 1 goal"], cards: ["Kelzang Jigme - Yellow"] },
  },

  // -------- WEEK 4 --------
  "R4-M1": {
    home: { teamName: "Druk FC", scorers: ["Tenzi Dorji - 1 goal"], cards: ["Sonam Wangdi - Yellow"] },
    away: {
      teamName: "JA Brothers Football Club",
      scorers: ["Darshan Gautam - 1 goal"],
      cards: ["Angel Prasai - Yellow", "Alton Thakuri - Yellow", "Silas Tamang - Yellow"],
    },
  },

  "R4-M2": {
    home: { teamName: "CNFC Canberra", scorers: ["Sumit Ale - 1 goal"], cards: [] },
    away: { teamName: "Queanbeyan Nepalese UFC", scorers: [], cards: ["Jenish Gautam - Second yellow and red"] },
  },

  "R4-M3": {
    home: { teamName: "Everest FC", scorers: ["Bikki - 1 goal", "Piya - 1 goal"], cards: ["Bikki - Yellow"] },
    away: {
      teamName: "Azhas FC",
      scorers: ["Jigme Norbu - 1 goal", "Jampel Dorji - 1 goal"],
      cards: ["Thinley Gyaltshen - Yellow", "Chimi K Wangchuk - Yellow", "Rabten Tshegyel - Yellow"],
    },
  },

  "R4-M4": {
    home: {
      teamName: "Nepal United FC",
      scorers: [
        "Niraj Chhetri - 2 goals",
        "Bivek Gurung - 2 goals",
        "Sanjok Rai - 2 goals",
        "Enoj Neupane - 1 goal",
        "Sunil Bhandari - 1 goal",
        "Salav Gauchan - 1 goal",
      ],
      cards: [],
    },
    away: { teamName: "Unity Stars FC", scorers: ["Baby - 1 goal"], cards: [] },
  },

  "R4-M5": {
    home: {
      teamName: "Thuenlam FC",
      scorers: ["Loday Wangchuk - 1 goal", "Tshering Dorji - 1 goal"],
      cards: ["Loday Wangchuk - Yellow"],
    },
    away: { teamName: "Achos Football Team", scorers: ["Kelzang Jigme - 1 goal"], cards: ["Samten Wangchuk - Yellow", "Kuenzang Dorji - Yellow"] },
  },

  "R4-M6": {
    home: {
      teamName: "Khukuri Canberra FC",
      scorers: ["Ravi Pandey - 1 goal", "Roshan Lamichhane - 1 goal", "Aawesh Dhakal - 1 goal"],
      cards: ["Sagar Khadka - Yellow"],
    },
    away: { teamName: "Phuensum FC", scorers: [], cards: [] },
  },

  // -------- WEEK 5 --------
  "R5-M1": {
    home: { teamName: "CNFC Canberra", scorers: ["Bishal Ghimire (#13) - 1 goal"], cards: ["Sudeep Gurung (#2) - Yellow"] },
    away: { teamName: "Achos Football Team", scorers: ["Tshering Tobgay (#13) - 4 goals", "Ugyen Phuntsho (#16) - 1 goal"], cards: [] },
  },

  "R5-M2": {
    home: { teamName: "Unity Stars FC", scorers: [], cards: [] },
    away: { teamName: "Queanbeyan Nepalese UFC", scorers: ["Sushant Shrestha (#77) - 3 goals", "Namgay (#9) - 1 goal"], cards: [] },
  },

  "R5-M3": {
    home: { teamName: "Nepal United FC", scorers: [], cards: ["Match abandoned due to safety concerns. Result awarded 0-3 to Phuensum FC."] },
    away: { teamName: "Phuensum FC", scorers: [], cards: ["Match abandoned due to safety concerns. Result awarded 3-0 to Phuensum FC."] },
  },

  "R5-M4": {
    home: { teamName: "Khukuri Canberra FC", scorers: [], cards: [] },
    away: { teamName: "JA Brothers Football Club", scorers: [], cards: ["Rajan Lama (#21) - Yellow", "Silas Tamang (#2) - Yellow"] },
  },

  "R5-M5": {
    home: { teamName: "Druk FC", scorers: ["Sonam Wangdi (#15) - 1 goal"], cards: [] },
    away: { teamName: "Azhas FC", scorers: ["Karma Nima (#4) - 3 goals"], cards: [] },
  },

  "R5-M6": {
    home: { teamName: "Thuenlam FC", scorers: ["Chekey Wangchuk (#10) - 2 goals"], cards: ["Kinley Wangchuk (Thuenlam FC, #11) - Yellow"] },
    away: { teamName: "Everest FC", scorers: ["Krishal Lama (#9) - 1 goal"], cards: ["Chiny (Everest FC, #24) - Yellow"] },
  },

  // -------- WEEK 6 --------
  "R6-M1": {
    home: { teamName: "Phuensum FC", scorers: ["Pema Dorji - 1 goal"], cards: [] },
    away: { teamName: "JA Brothers Football Club", scorers: ["Thaman Gurung - 1 goal", "Miraj Marikhu - 1 goal"], cards: [] },
  },

  "R6-M2": {
    home: { teamName: "Queanbeyan Nepalese UFC", scorers: ["BYE fixture - awarded 3-0 win"], cards: [] },
    away: { teamName: "BYE", scorers: [], cards: [] },
  },

  "R6-M3": {
    home: { teamName: "Unity Stars FC", scorers: ["Sangay Wangchuk - 1 goal"], cards: [] },
    away: {
      teamName: "Achos Football Team",
      scorers: [
        "Tshering Tobgyel - 1 goal",
        "Sonam Chopen - 1 goal",
        "Ugyen Phuntsho - 1 goal",
        "Sonam Dhendup - 1 goal",
        "Tshewang Dorji - 1 goal",
      ],
      cards: [],
    },
  },

  "R6-M4": {
    home: { teamName: "Khukuri Canberra FC", scorers: [], cards: ["Bikash Khadka - Red", "Sagar Khadka - Yellow"] },
    away: { teamName: "Azhas FC", scorers: ["Chimi K Wangchuk - 1 goal"], cards: ["Tandin Wangyel - Yellow", "Chimi K Wangchuk - Yellow"] },
  },

  "R6-M5": {
    home: { teamName: "CNFC Canberra", scorers: ["Sumit Ale - 1 goal"], cards: [] },
    away: { teamName: "Everest FC", scorers: ["Krishal Lama - 2 goals", "Nixon - 1 goal", "Peakay - 1 goal"], cards: [] },
  },

  "R6-M6": {
    home: { teamName: "Druk FC", scorers: ["Sonam Wangdi - 1 goal"], cards: [] },
    away: { teamName: "Thuenlam FC", scorers: ["Kunzang Thinley - 2 goals", "Kinley Wangchuk - 1 goal"], cards: [] },
  },

  // -------- WEEK 7 --------
  "R7-M1": {
    home: { teamName: "Phuensum FC", scorers: [], cards: [] },
    away: { teamName: "Azhas FC", scorers: [], cards: [] },
  },

  "R7-M2": {
    home: {
      teamName: "Khukuri Canberra FC",
      scorers: [
        "Roshan Lamichhane - 3 goals",
        "Abhishek Chapagain - 1 goal",
        "Manish Khatiwada - 1 goal",
        "Gagan Prajapati - 1 goal",
      ],
      cards: [],
    },
    away: {
      teamName: "Thuenlam FC",
      scorers: [],
      cards: ["Sangay Nildrup - Yellow"],
    },
  },

  "R7-M3": {
    home: {
      teamName: "CNFC Canberra",
      scorers: ["Sunil Thapa Magar - 2 goals", "Sumin Bhattarai - 1 goal"],
      cards: ["Bishal Ghimire - Yellow"],
    },
    away: {
      teamName: "Druk FC",
      scorers: ["Tashi Tshering - 1 goal", "Jigme Tshultrim - 2 goals"],
      cards: ["Thinley Jamtsho - Red"],
    },
  },

  "R7-M4": {
    home: { teamName: "Unity Stars FC", scorers: [], cards: ["Tenzin - Yellow", "Jersey No 5 - Yellow"] },
    away: { teamName: "Everest FC", scorers: ["Yogesh Piya - 1 goal", "Bijay Bhandari - 1 goal"], cards: ["Bikrant Rana Magar - Yellow"] },
  },

  "R7-M5": {
    home: { teamName: "Queanbeyan Nepalese UFC", scorers: [], cards: ["Prajwal Bhandari - Red"] },
    away: { teamName: "Achos Football Team", scorers: ["Kuenzang Dorji - 1 goal", "Tsherig Tobgyel - 1 goal"], cards: ["Tshering Namgay - Yellow"] },
  },

  "R7-M6": {
    home: { teamName: "JA Brothers Football Club", scorers: ["BYE fixture - awarded 3-0 win"], cards: [] },
    away: { teamName: "BYE", scorers: [], cards: [] },
  },

  // -------- WEEK 8 --------
  "R8-M1": {
    home: { teamName: "Achos Football Team", scorers: ["BYE fixture - awarded 3-0 win"], cards: [] },
    away: { teamName: "BYE", scorers: [], cards: [] },
  },

  "R8-M2": {
    home: { teamName: "JA Brothers Football Club", scorers: [], cards: [] },
    away: { teamName: "Azhas FC", scorers: [], cards: [] },
  },

  "R8-M3": {
    home: { teamName: "Queanbeyan Nepalese UFC", scorers: ["Anil Singh Chaisir - 1 goal", "Namgay - 1 goal"], cards: [] },
    away: { teamName: "Everest FC", scorers: ["Bijay - 1 goal", "Krishal Lama - 1 goal"], cards: [] },
  },

  "R8-M4": {
    home: { teamName: "Phuensum FC", scorers: ["Kinley Wangdi - 2 goals"], cards: [] },
    away: { teamName: "Thuenlam FC", scorers: ["Chekey Wangchuk - 1 goal", "Tshering Dorji - 1 goal", "Kunzang Thinley - 2 goals"], cards: [] },
  },

  "R8-M5": {
    home: { teamName: "Unity Stars FC", scorers: ["Tempa - 2 goals"], cards: [] },
    away: { teamName: "Druk FC", scorers: ["Sonam Wangdi - 3 goals", "Tashi Dorji - 1 goal", "Jigme Tshultrim - 2 goals"], cards: [] },
  },

  "R8-M6": {
    home: { teamName: "Khukuri Canberra FC", scorers: ["Roshan Lamichhane - 1 goal", "Protshan Basnet - 1 goal", "Sagar Khadka - 1 goal", "Own goal (Dev Raj Gurung, CNFC Canberra) - 1 goal"], cards: [] },
    away: { teamName: "CNFC Canberra", scorers: [], cards: [] },
  },

  // -------- WEEK 9 --------
  "R9-M1": {
    home: {
      teamName: "Achos Football Team",
      scorers: ["Sonam Chopen - 1 goal", "Kuenzang Dorji - 1 goal"],
      cards: ["Tshering Namgay - Yellow"],
    },
    away: {
      teamName: "Everest FC",
      scorers: [],
      cards: ["Denil - Yellow"],
    },
  },

  "R9-M2": {
    home: { teamName: "Unity Stars FC", scorers: ["Panda - 1 goal"], cards: [] },
    away: {
      teamName: "Khukuri Canberra FC",
      scorers: [
        "Abhishek Chapagain - 3 goals",
        "Robin Khadka - 2 goals",
        "Sagar Khadka - 1 goal",
        "Protshan Basnet - 1 goal",
        "Manish Khatiwada - 1 goal",
        "Semun Gurung - 1 goal",
      ],
      cards: [],
    },
  },

  "R9-M3": {
    home: { teamName: "JA Brothers Football Club", scorers: ["Alton Thakuri - 1 goal"], cards: [] },
    away: { teamName: "Thuenlam FC", scorers: ["Sonam Dorji - 1 goal", "Kunzang Thinley - 1 goal"], cards: [] },
  },

  "R9-M4": {
    home: {
      teamName: "Queanbeyan Nepalese UFC",
      scorers: [
        "Sushant Shrestha - 3 goals",
        "Sudip Karki - 1 goal",
        "Saneej Chhetri - 1 goal",
      ],
      cards: [],
    },
    away: { teamName: "Druk FC", scorers: ["Tenzi Dorji - 1 goal"], cards: [] },
  },

  "R9-M5": {
    home: {
      teamName: "Phuensum FC",
      scorers: ["Sampa Tshering - 2 goals"],
      cards: ["Dorji Nidup - Yellow", "Nima Tshering - Yellow"],
    },
    away: { teamName: "CNFC Canberra", scorers: ["Sumin Bhattarai - 1 goal"], cards: [] },
  },

  "R9-M6": {
    home: { teamName: "Azhas FC", scorers: ["BYE fixture - awarded 3-0 win"], cards: [] },
    away: { teamName: "BYE", scorers: [], cards: [] },
  },

// -------- WEEK 10 --------
"R10-M1": {
  home: {
    teamName: "Achos FC",
    scorers: [
      "Tshering Tobgyel - 2 goals",
      "Karma Wangchuk - 1 goal",
      "Kelzang Jigme - 2 goals",
      "Sonam Dhendup - 1 goal",
    ],
    cards: [],
  },
  away: {
    teamName: "Druk FC",
    scorers: [],
    cards: [],
  },
},

"R10-M2": {
  home: {
    teamName: "Azhas FC",
    scorers: ["Karma Nima - 1 goal", "Chimi K Wangchuk - 1 goal"],
    cards: ["Karma Nima - Yellow", "Nima Tshering - Yellow"],
  },
  away: {
    teamName: "Thuenlam FC",
    scorers: ["Kunaznag Thinley - 1 goal"],
    cards: [
      "Karma Tenzin - Yellow",
      "Penden Tsherang - Yellow",
      "Samdrup - Yellow",
    ],
  },
},

"R10-M3": {
  home: {
    teamName: "JA Brothers FC",
    scorers: [],
    cards: [],
  },
  away: {
    teamName: "CNFC Canberra",
    scorers: [],
    cards: [],
  },
},

"R10-M4": {
  home: {
    teamName: "Everest FC",
    scorers: ["BYE fixture - awarded 3-0 win"],
    cards: [],
  },
  away: {
    teamName: "BYE",
    scorers: [],
    cards: [],
  },
},

"R10-M5": {
  home: {
    teamName: "Queanbeyan Nepalese UFC",
    scorers: ["Sushant Shrestha - 1 goal"],
    cards: [
      "Sushant Shrestha - Yellow",
      "Anish Gurung - Yellow",
      "Namgay - Yellow",
      "Saneej Chhetri - Yellow",
    ],
  },
  away: {
    teamName: "Khukuri Canberra FC",
    scorers: ["Roshan Lamichhane - 1 goal"],
    cards: ["Sagar Khadka - Yellow"],
  },
},

"R10-M6": {
  home: {
    teamName: "Phuensum FC",
    scorers: [],
    cards: ["Pelzang - Yellow", "Pelzang - Red"],
  },
  away: {
    teamName: "Unity Stars FC",
    scorers: [],
    cards: [],
  },
},

};
