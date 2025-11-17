// lib/splData.ts

export const ORG = {
  name: "The Samsara Group - Canberra",
  tagline: "Fostering Community, Empowering Growth",
  intro:
    "Building connections, promoting culture, and empowering Nepalese communities in Canberra through culture, sport, and community events.",
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

export const SPONSORS = {
  title: [{ name: "SBA Property Group - Sbapropertygroup", url: "#" }],
  platinum: [{ name: "GTM Facility Services", url: "#" }],
  silver: [
    { name: "Nepali Haat Bazaar", url: "#" },
    { name: "Canberra Momo House - Nepalese Restaurant", url: "#" },
    { name: "Dikshant Dhungel – Real Estate Agent", url: "#" },
    { name: "The Monkey Temple", url: "#" },
    { name: "Ooshman Gungahlin", url: "#" },
  ],
  media: [
    { name: "Fan Voice TV", url: "#" },
    { name: "Lensfusion Photo & Video", url: "#" },
    { name: "Goal Lens Photography", url: "#" },
    { name: "Lenscrafters Photography", url: "#" },
    { name: "Films Yaman", url: "#" },
    { name: "Crafts by Juna", url: "#" },
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

// Same fixtures you already had, now with ids and round numbers
export const FIXTURES: Fixture[] = [
  // Round 1 - 15 Nov 2025
  { id: "R1-M1", round: 1, date: "2025-11-15", time: "3:30 PM", home: "Nepal United FC", away: "Druk FC", ground: "Ground 1" },
  { id: "R1-M2", round: 1, date: "2025-11-15", time: "3:30 PM", home: "Thuenlam FC", away: "CNFC Canberra", ground: "Ground 2" },
  { id: "R1-M3", round: 1, date: "2025-11-15", time: "5:00 PM", home: "Everest FC", away: "Khukuri Canberra FC", ground: "Ground 1" },
  { id: "R1-M4", round: 1, date: "2025-11-15", time: "5:00 PM", home: "Azhas FC", away: "Unity Stars FC", ground: "Ground 2" },
  { id: "R1-M5", round: 1, date: "2025-11-15", time: "6:30 PM", home: "Achos Football Team", away: "Phuensum FC", ground: "Ground 1" },
  { id: "R1-M6", round: 1, date: "2025-11-15", time: "6:30 PM", home: "JA Brothers Football Club", away: "Queanbeyan Nepalese United Football Club", ground: "Ground 2" },

    // Round 2 - 22 Nov 2025
  { id: "R2-M1", round: 2, date: "2025-11-22", time: "3:30 PM", home: "Everest FC", away: "Phuensum FC", ground: "Ground 1" },
  { id: "R2-M2", round: 2, date: "2025-11-22", time: "3:30 PM", home: "Druk FC", away: "Khukuri Canberra FC", ground: "Ground 2" },
  { id: "R2-M3", round: 2, date: "2025-11-22", time: "5:00 PM", home: "Thuenlam FC", away: "Unity Stars FC", ground: "Ground 1" },
  { id: "R2-M4", round: 2, date: "2025-11-22", time: "5:00 PM", home: "Achos Football Team", away: "JA Brothers Football Club", ground: "Ground 2" },
  { id: "R2-M5", round: 2, date: "2025-11-22", time: "6:30 PM", home: "Azhas FC", away: "Queanbeyan Nepalese United Football Club", ground: "Ground 1" },
  { id: "R2-M6", round: 2, date: "2025-11-22", time: "6:30 PM", home: "Nepal United FC", away: "CNFC Canberra", ground: "Ground 2" },

];

// Results for the league table (you can grow this as games are played)
export const RESULTS = [
  { fixtureId: "R1-M1", homeGoals: 9, awayGoals: 1 },  // Nepal United vs Druk
  { fixtureId: "R1-M2", homeGoals: 4, awayGoals: 1 },  // Thuenlam vs CNFC (UPDATED)
  { fixtureId: "R1-M3", homeGoals: 0, awayGoals: 2 },  // Everest vs Khukuri
  { fixtureId: "R1-M4", homeGoals: 3, awayGoals: 1 },  // Azhas vs Unity Stars
  { fixtureId: "R1-M5", homeGoals: 1, awayGoals: 0 },  // Achos vs Phuensum
  { fixtureId: "R1-M6", homeGoals: 0, awayGoals: 2 },  // JA Brothers vs QN United
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
