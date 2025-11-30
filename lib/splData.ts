// lib/splData.ts

// Basic org info
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

// Teams
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

// Team logos in /public/team
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

// Sponsors and media
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
    {
      name: "Nepali Haat Bazaar",
      url: "#",
      logo: "/sponsor/nepalihaat.png",
    },
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
    {
      name: "The Monkey Temple",
      url: "#",
      logo: "/sponsor/monkeytemple.png",
    },
    {
      name: "Ooshman Gungahlin",
      url: "#",
      logo: "/sponsor/ooshman.png",
    },
    {
      name: "Zenith Services Sydney",
      url: "#",
      logo: "/sponsor/zenith.png",
    },
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

// Types
export type Fixture = {
  id: string;
  round: number;
  date: string; // YYYY-MM-DD
  time: string; // "3:30 PM"
  home: string;
  away: string;
  ground: string;
};

export type MatchResult = {
  fixtureId: string;
  homeGoals: number;
  awayGoals: number;
};

export type MatchFactsSide = {
  scorers: string[];
  cards: string[];
};

export type MatchFacts = {
  home: MatchFactsSide;
  away: MatchFactsSide;
};

// All fixtures for rounds 1 to 11
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

// Results for the league table (Weeks 1, 2, 3)
export const RESULTS: MatchResult[] = [
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

// Detailed match facts for fixtures that have finished
export const MATCH_FACTS: Record<string, MatchFacts> = {
  // WEEK 1 (placeholder, can be filled later if you have scorers)
  "R1-M1": {
    home: { scorers: ["To be updated"], cards: [] },
    away: { scorers: ["To be updated"], cards: [] },
  },
  "R1-M2": {
    home: { scorers: ["To be updated"], cards: [] },
    away: { scorers: ["To be updated"], cards: [] },
  },
  "R1-M3": {
    home: { scorers: [], cards: [] },
    away: { scorers: ["To be updated"], cards: [] },
  },
  "R1-M4": {
    home: { scorers: ["To be updated"], cards: [] },
    away: { scorers: ["To be updated"], cards: [] },
  },
  "R1-M5": {
    home: { scorers: ["To be updated"], cards: [] },
    away: { scorers: [], cards: [] },
  },
  "R1-M6": {
    home: { scorers: [], cards: [] },
    away: { scorers: ["To be updated"], cards: [] },
  },

  // WEEK 2
  "R2-M1": {
    // Everest 1-1 Phuensum
    home: {
      scorers: ["Krishal Lama"],
      cards: [],
    },
    away: {
      scorers: ["Sampa Tshering"],
      cards: ["Sonam Wangchuk - Yellow"],
    },
  },
  "R2-M2": {
    // Druk 0-4 Khukuri
    home: {
      scorers: [],
      cards: ["Tashi Norbu - Yellow"],
    },
    away: {
      scorers: [
        "Roshan Lamichhane (2)",
        "Abhishek Chapagain (2)",
      ],
      cards: [],
    },
  },
  "R2-M3": {
    // Thuenlam 6-0 Unity
    home: {
      scorers: [
        "Kunzang Thinley (3)",
        "Tshering Dorji (2)",
        "Jersey 89 - name to be confirmed",
      ],
      cards: [],
    },
    away: {
      scorers: [],
      cards: [],
    },
  },
  "R2-M4": {
    // Achos 2-0 JA Brothers
    home: {
      scorers: ["Tshering Tobgay (2)"],
      cards: [],
    },
    away: {
      scorers: [],
      cards: ["Yuzan - Yellow"],
    },
  },
  "R2-M5": {
    // Azhas 1-1 QNU
    home: {
      scorers: ["Rabten Tshegyel"],
      cards: [
        "Thinley Gyeltshen - Double Yellow to Red (suspended next match)",
        "Rabten Tshegyel - Yellow",
        "Nima Tshering - Yellow",
      ],
    },
    away: {
      scorers: ["Saneej Chhetri"],
      cards: ["Anil Singh Chaisir - Yellow"],
    },
  },
  "R2-M6": {
    // Nepal United 10-0 CNFC
    home: {
      scorers: [
        "Enoj Neupane (4)",
        "Salav Gauchan (2)",
        "Niraj Chhetri",
        "Nishan Khadka",
        "Dipendra Gurung (2)",
      ],
      cards: [],
    },
    away: {
      scorers: [],
      cards: [],
    },
  },

  // WEEK 3
  "R3-M2": {
    // CNFC 3-2 Unity Stars
    home: {
      scorers: ["#10 Sumit Ale", "#9 Manoj (2)"],
      cards: ["#6 Prawol Vaidya - Yellow"],
    },
    away: {
      scorers: ["#3 Chencho Gyeltshen (2)"],
      cards: [],
    },
  },
  "R3-M6": {
    // Azhas 3-1 Achos
    home: {
      scorers: [
        "#7 Namgay Wangchuk",
        "#29 Rabtsen Tshegyel",
        "#10 Chimi Kinzang Wangchuk",
      ],
      cards: ["#15 Zeyden Dorji - Yellow"],
    },
    away: {
      scorers: ["#21 Sonam Chopel"],
      cards: ["#10 Kelzang Jigme - Yellow"],
    },
  },
  "R3-M3": {
    // Druk 1-3 Phuensum
    home: {
      scorers: ["#13 Sangay Tenzin"],
      cards: [],
    },
    away: {
      scorers: [
        "#8 Sonam Dorji",
        "#6 Kinley Wangdi",
        "#18 Sonam Wangchuk",
      ],
      cards: ["#19 Namgay Tenzin - Straight Red (Dissent)"],
    },
  },
  "R3-M5": {
    // Nepal United 1-2 Khukuri
    home: {
      scorers: ["#15 Pujan Uperkoti"],
      cards: [
        "#7 Enoj Neupane - Yellow",
        "#2 Aakash Jung Raut - Yellow",
      ],
    },
    away: {
      scorers: [
        "#10 Abhishek Chapagain",
        "#9 Roshan Lamichhane",
      ],
      cards: [
        "#6 Sagar Khadka (Black jersey) - Yellow",
        "#7 Protshan Basnet - Yellow and Red (second yellow)",
      ],
    },
  },
  "R3-M4": {
    // Thuenlam 1-0 QNUFC
    home: {
      scorers: ["#23 Kunzang Thinley"],
      cards: [],
    },
    away: {
      scorers: [],
      cards: [],
    },
  },
  "R3-M1": {
    // Everest 1-3 JA Brothers
    home: {
      scorers: ["#3 Kiran Gautam"],
      cards: [],
    },
    away: {
      scorers: [
        "#47 Dipesh Tamang",
        "#12 Ajay Shrestha",
        "#13 Alton Thakuri",
      ],
      cards: [
        "#2 Silas Tamang - Yellow",
        "#12 Ajay Shrestha - Yellow",
        "#99 Rahul Tamang - Yellow",
      ],
    },
  },
};

// League table types and helpers
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

// Upcoming fixtures helper
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

// Helper for fixtures and results by round (nice for UI)
export function getRounds(): number[] {
  return [...new Set(FIXTURES.map((f) => f.round))].sort((a, b) => a - b);
}

export function getFixturesByRound(round: number): Fixture[] {
  return FIXTURES.filter((f) => f.round === round).sort((a, b) =>
    a.time.localeCompare(b.time),
  );
}

export function getResultsByRound(round: number): { fixture: Fixture; result: MatchResult }[] {
  const map = Object.fromEntries(RESULTS.map((r) => [r.fixtureId, r]));
  return FIXTURES.filter((f) => f.round === round && map[f.id])
    .map((f) => ({ fixture: f, result: map[f.id] }))
    .sort((a, b) => a.fixture.time.localeCompare(b.fixture.time));
}
