// components/LeagueTableSection.tsx

import Image from "next/image";
import { ChevronUp, ChevronDown, Minus } from "lucide-react";
import {
  TEAMS,
  TEAM_LOGOS,
  FIXTURE_MAP,
  RESULTS,
  Result,
} from "@/lib/splData";

type TableRow = {
  teamName: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ("W" | "D" | "L")[];
  position: number;
  previousPosition?: number;
};

function getResultRound(result: Result): number {
  const fixture = FIXTURE_MAP[result.fixtureId];
  return fixture?.round ?? 0;
}

function getMaxPlayedRound(): number {
  let max = 0;
  for (const r of RESULTS) {
    const round = getResultRound(r);
    if (round > max) max = round;
  }
  return max;
}

function buildTable(uptoRound: number): TableRow[] {
  const stats = new Map<
    string,
    {
      played: number;
      won: number;
      drawn: number;
      lost: number;
      goalsFor: number;
      goalsAgainst: number;
      points: number;
      form: ("W" | "D" | "L")[];
    }
  >();

  TEAMS.forEach((name) => {
    stats.set(name, {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: [],
    });
  });

  const sortedResults = [...RESULTS].sort(
    (a, b) => getResultRound(a) - getResultRound(b),
  );

  for (const result of sortedResults) {
    const fixture = FIXTURE_MAP[result.fixtureId];
    if (!fixture) continue;
    if (fixture.round > uptoRound) continue;

    const homeStats = stats.get(fixture.home)!;
    const awayStats = stats.get(fixture.away)!;

    homeStats.played += 1;
    awayStats.played += 1;

    homeStats.goalsFor += result.homeGoals;
    homeStats.goalsAgainst += result.awayGoals;

    awayStats.goalsFor += result.awayGoals;
    awayStats.goalsAgainst += result.homeGoals;

    if (result.homeGoals > result.awayGoals) {
      homeStats.won += 1;
      homeStats.points += 3;
      awayStats.lost += 1;
      homeStats.form.push("W");
      awayStats.form.push("L");
    } else if (result.homeGoals < result.awayGoals) {
      awayStats.won += 1;
      awayStats.points += 3;
      homeStats.lost += 1;
      homeStats.form.push("L");
      awayStats.form.push("W");
    } else {
      homeStats.drawn += 1;
      awayStats.drawn += 1;
      homeStats.points += 1;
      awayStats.points += 1;
      homeStats.form.push("D");
      awayStats.form.push("D");
    }
  }

  const rows: TableRow[] = TEAMS.map((name) => {
    const s = stats.get(name)!;
    const goalDiff = s.goalsFor - s.goalsAgainst;
    const logo = TEAM_LOGOS[name] ?? "/team/everest.png";

    return {
      teamName: name,
      logo,
      played: s.played,
      won: s.won,
      drawn: s.drawn,
      lost: s.lost,
      goalsFor: s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      goalDiff,
      points: s.points,
      form: s.form.slice(-5),
      position: 0,
    };
  });

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName);
  });

  rows.forEach((row, idx) => {
    row.position = idx + 1;
  });

  return rows;
}

function movementIcon(current: number, previous?: number) {
  if (!previous) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-600">
        N
      </span>
    );
  }
  if (previous > current) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">
        <ChevronUp className="h-3 w-3" />
      </span>
    );
  }
  if (previous < current) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700">
        <ChevronDown className="h-3 w-3" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500">
      <Minus className="h-3 w-3" />
    </span>
  );
}

function zoneClass(position: number) {
  if (position <= 4) return "border-l-4 border-blue-500 bg-blue-50/40";
  if (position >= 11) return "border-l-4 border-red-500 bg-red-50/40";
  return "border-l border-gray-200";
}

function formDot(result: "W" | "D" | "L", index: number) {
  const base = "h-2.5 w-2.5 rounded-full";
  if (result === "W") return <span key={index} className={`${base} bg-green-500`} />;
  if (result === "D") return <span key={index} className={`${base} bg-yellow-400`} />;
  return <span key={index} className={`${base} bg-red-500`} />;
}

export default function LeagueTableSection() {
  const maxRound = getMaxPlayedRound();
  const current = buildTable(maxRound);
  const previous = maxRound > 1 ? buildTable(maxRound - 1) : null;

  const rows: TableRow[] = current.map((row) => {
    const prev = previous?.find((p) => p.teamName === row.teamName);
    return { ...row, previousPosition: prev?.position };
  });

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm border">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">League Table</h2>
          <p className="text-xs text-gray-500">
            After Matchweek {maxRound}. Top 4 qualify for knockouts. Bottom 2 are
            in relegation zone.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-blue-500" />
            Top 4
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-red-500" />
            Relegation
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm">
          <thead>
            <tr className="border-b text-[11px] uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-2 text-left">Pos</th>
              <th className="py-2 pr-2 text-left">Club</th>
              <th className="px-1 text-center">MP</th>
              <th className="px-1 text-center">W</th>
              <th className="px-1 text-center">D</th>
              <th className="px-1 text-center">L</th>
              <th className="px-1 text-center">GF</th>
              <th className="px-1 text-center">GA</th>
              <th className="px-1 text-center">GD</th>
              <th className="px-1 text-center">Pts</th>
              <th className="px-2 text-center whitespace-nowrap">Last 5</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.teamName}
                className={`border-b last:border-0 ${zoneClass(row.position)}`}
              >
                <td className="py-1.5 pr-2 text-center text-xs font-semibold text-gray-700">
                  {row.position}
                </td>
                <td className="py-1.5 pr-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                      <Image
                        src={row.logo}
                        alt={row.teamName}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium md:text-sm">
                        {row.teamName}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        {movementIcon(row.position, row.previousPosition)}
                        <span>
                          {row.previousPosition
                            ? row.position === row.previousPosition
                              ? "No change"
                              : row.position < row.previousPosition
                              ? `Up from ${row.previousPosition}`
                              : `Down from ${row.previousPosition}`
                            : "First update"}
                        </span>
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-1 text-center">{row.played}</td>
                <td className="px-1 text-center">{row.won}</td>
                <td className="px-1 text-center">{row.drawn}</td>
                <td className="px-1 text-center">{row.lost}</td>
                <td className="px-1 text-center">{row.goalsFor}</td>
                <td className="px-1 text-center">{row.goalsAgainst}</td>
                <td className="px-1 text-center">
                  <span
                    className={
                      row.goalDiff > 0
                        ? "text-green-600"
                        : row.goalDiff < 0
                        ? "text-red-600"
                        : ""
                    }
                  >
                    {row.goalDiff}
                  </span>
                </td>
                <td className="px-1 text-center font-semibold">
                  {row.points}
                </td>
                <td className="px-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {row.form.length === 0 ? (
                      <span className="text-[10px] text-gray-400">No games</span>
                    ) : (
                      row.form.map(formDot)
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Key:</span>
          <span>MP: Matches played</span>
          <span>GF: Goals for</span>
          <span>GA: Goals against</span>
          <span>GD: Goal difference</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Last 5:</span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Win
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /> Draw
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Loss
          </span>
        </div>
      </div>
    </section>
  );
}
