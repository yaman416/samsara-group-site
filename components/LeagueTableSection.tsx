// components/LeagueTableSection.tsx
"use client";

import { useMemo } from "react";
import {
  TEAMS,
  FIXTURES,
  RESULTS,
  TEAM_LOGOS,
  SPL_SEASON,
  type TableRow,
} from "@/lib/splData";

type ResultEntry = {
  fixtureId: string;
  homeGoals: number;
  awayGoals: number;
};

type RowWithMeta = TableRow & {
  position: number;
  change: number; // positive = moved up, negative = moved down
  form: ("W" | "D" | "L" | null)[];
};

function buildTableFromResults(results: ResultEntry[]): TableRow[] {
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

  const resultMap = Object.fromEntries(results.map((r) => [r.fixtureId, r]));

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

function computeForm(teamName: string, maxMatches = 5): ("W" | "D" | "L")[] {
  type MatchForForm = {
    round: number;
    date: string;
    outcome: "W" | "D" | "L";
  };

  const matches: MatchForForm[] = [];

  for (const r of RESULTS) {
    const f = FIXTURES.find((fx) => fx.id === r.fixtureId);
    if (!f) continue;
    if (f.home !== teamName && f.away !== teamName) continue;

    let outcome: "W" | "D" | "L";
    if (r.homeGoals === r.awayGoals) {
      outcome = "D";
    } else {
      const teamIsHome = f.home === teamName;
      const teamGoals = teamIsHome ? r.homeGoals : r.awayGoals;
      const oppGoals = teamIsHome ? r.awayGoals : r.homeGoals;
      outcome = teamGoals > oppGoals ? "W" : "L";
    }

    matches.push({
      round: f.round,
      date: f.date,
      outcome,
    });
  }

  matches.sort((a, b) => {
    if (a.round !== b.round) return a.round - b.round;
    return a.date.localeCompare(b.date);
  });

  const outcomes = matches.map((m) => m.outcome);
  const last = outcomes.slice(-maxMatches);
  return last;
}

function PositionChangeBadge({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span className="ml-1 inline-flex items-center text-[10px] font-semibold text-emerald-600">
        ▲ {change}
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="ml-1 inline-flex items-center text-[10px] font-semibold text-red-600">
        ▼ {Math.abs(change)}
      </span>
    );
  }
  return (
    <span className="ml-1 inline-flex items-center text-[10px] text-gray-400">
      •
    </span>
  );
}

function FormPills({ values }: { values: ("W" | "D" | "L" | null)[] }) {
  const getStyles = (v: "W" | "D" | "L" | null) => {
    if (v === "W") return "bg-emerald-500 text-white";
    if (v === "D") return "bg-gray-400 text-white";
    if (v === "L") return "bg-red-500 text-white";
    return "bg-gray-100 text-gray-300";
  };

  return (
    <div className="flex gap-1 justify-center">
      {values.map((v, idx) => (
        <div
          key={idx}
          className={
            "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold " +
            getStyles(v)
          }
        >
          {v ?? ""}
        </div>
      ))}
    </div>
  );
}

export default function LeagueTableSection() {
  const currentTable = useMemo(
    () => buildTableFromResults(RESULTS),
    [],
  );

  const latestRound = useMemo(() => {
    let maxRound = 0;
    for (const r of RESULTS) {
      const fx = FIXTURES.find((f) => f.id === r.fixtureId);
      if (fx && fx.round > maxRound) {
        maxRound = fx.round;
      }
    }
    return maxRound;
  }, []);

  const previousResults = useMemo(() => {
    if (latestRound <= 1) return [] as ResultEntry[];
    return RESULTS.filter((r) => {
      const fx = FIXTURES.find((f) => f.id === r.fixtureId);
      return fx && fx.round < latestRound;
    });
  }, [latestRound]);

  const previousTable = useMemo(() => {
    if (previousResults.length === 0) return null;
    return buildTableFromResults(previousResults);
  }, [previousResults]);

  const prevPositionMap: Record<string, number> = useMemo(() => {
    if (!previousTable) return {};
    const map: Record<string, number> = {};
    previousTable.forEach((row, idx) => {
      map[row.name] = idx + 1;
    });
    return map;
  }, [previousTable]);

  const rowsWithMeta: RowWithMeta[] = useMemo(() => {
    return currentTable.map((row, idx) => {
      const position = idx + 1;
      const prev = prevPositionMap[row.name];
      const change =
        prev !== undefined ? prev - position : 0;

      const formRaw = computeForm(row.name, 5);
      const padded: ("W" | "D" | "L" | null)[] = Array.from(
        { length: 5 },
        (_, i) => formRaw[formRaw.length - 5 + i] ?? null,
      );

      return { ...row, position, change, form: padded };
    });
  }, [currentTable, prevPositionMap]);

  return (
    <section
      id="table"
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/spl-logo.png"
            alt="Samsara Premier League logo"
            className="h-10 w-auto bg-white"
          />
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              League Table
            </h2>
            <p className="text-xs text-gray-500">
              {SPL_SEASON.name}. Top 4 qualify for knockouts. Bottom 2 in
              relegation zone.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm bg-emerald-100 border border-emerald-400" />
            <span>Top 4 - knockout places</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-red-100 border border-red-400" />
            <span>11th - 12th - relegation zone</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-xs md:text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-600">
              <th className="px-2 py-2 text-left">Pos</th>
              <th className="px-2 py-2 text-left">Team</th>
              <th className="px-1 py-2 text-center">P</th>
              <th className="px-1 py-2 text-center">W</th>
              <th className="px-1 py-2 text-center">D</th>
              <th className="px-1 py-2 text-center">L</th>
              <th className="px-1 py-2 text-center">GF</th>
              <th className="px-1 py-2 text-center">GA</th>
              <th className="px-1 py-2 text-center">GD</th>
              <th className="px-2 py-2 text-center">Pts</th>
              <th className="px-2 py-2 text-center">Form</th>
            </tr>
          </thead>
          <tbody>
            {rowsWithMeta.map((row) => {
              const isTop4 = row.position <= 4;
              const isRelegation = row.position >= 11;
              const logoSrc = TEAM_LOGOS[row.name];

              const baseRow =
                "border-b border-gray-100 text-gray-800";
              const bgClass = isTop4
                ? "bg-emerald-50"
                : isRelegation
                ? "bg-red-50"
                : "bg-white";

              return (
                <tr key={row.name} className={`${baseRow} ${bgClass}`}>
                  <td className="px-2 py-2 text-left font-semibold text-gray-800">
                    <span className="inline-flex items-center">
                      {row.position}
                      <PositionChangeBadge change={row.change} />
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      {logoSrc && (
                        <img
                          src={logoSrc}
                          alt={row.name}
                          className="h-6 w-6 rounded-full border border-gray-200 bg-white object-contain"
                        />
                      )}
                      <span className="text-[11px] md:text-xs font-medium">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-1 py-2 text-center">
                    {row.played}
                  </td>
                  <td className="px-1 py-2 text-center">{row.won}</td>
                  <td className="px-1 py-2 text-center">
                    {row.drawn}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {row.lost}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {row.goalsFor}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {row.goalsAgainst}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {row.goalDiff}
                  </td>
                  <td className="px-2 py-2 text-center font-semibold">
                    {row.points}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <FormPills values={row.form} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
