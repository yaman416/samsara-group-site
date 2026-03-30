// components/LeagueTableSection.tsx
"use client";

import {
  FIXTURES,
  RESULTS,
  TEAMS,
  TEAM_LOGOS,
  type TableRow,
  SPL_STATUS,
} from "@/lib/splData";
import { useMemo } from "react";
import { ListOrdered } from "lucide-react";

type FormCode = "W" | "D" | "L";

type RowWithForm = TableRow & {
  form: FormCode[];
  position: number;
  movement: number;
};

function isBye(name: string) {
  return name.trim().toUpperCase() === "BYE";
}

function computeTableUpToRound(roundLimit: number) {
  const teamNames = TEAMS;
  const base: Record<string, TableRow & { form: FormCode[] }> = {};

  for (const name of teamNames) {
    base[name] = {
      name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
      form: [],
    };
  }

  const resultMap = Object.fromEntries(
    RESULTS.map((r) => [r.fixtureId, r]),
  ) as Record<
    string,
    {
      fixtureId: string;
      homeGoals: number;
      awayGoals: number;
    }
  >;

  const fixturesSorted = [...FIXTURES].sort((a, b) => {
    if (a.round !== b.round) return a.round - b.round;
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  for (const f of fixturesSorted) {
    if (f.round > roundLimit) continue;
    const r = resultMap[f.id];
    if (!r) continue;

    const homeIsBye = isBye(f.home);
    const awayIsBye = isBye(f.away);

    // ONLY CHANGE: handle BYE fixtures so the real team receives MP, GF, PTS, and Form
    if (homeIsBye && !awayIsBye) {
      const away = base[f.away];
      if (!away) continue;

      away.played += 1;
      away.won += 1;
      away.points += 3;
      away.goalsFor += r.awayGoals;
      away.goalsAgainst += r.homeGoals;
      away.form.push("W");
      continue;
    }

    if (awayIsBye && !homeIsBye) {
      const home = base[f.home];
      if (!home) continue;

      home.played += 1;
      home.won += 1;
      home.points += 3;
      home.goalsFor += r.homeGoals;
      home.goalsAgainst += r.awayGoals;
      home.form.push("W");
      continue;
    }

    const home = base[f.home];
    const away = base[f.away];
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += r.homeGoals;
    home.goalsAgainst += r.awayGoals;
    away.goalsFor += r.awayGoals;
    away.goalsAgainst += r.homeGoals;

    let homeForm: FormCode;
    let awayForm: FormCode;

    if (r.homeGoals > r.awayGoals) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
      homeForm = "W";
      awayForm = "L";
    } else if (r.homeGoals < r.awayGoals) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
      homeForm = "L";
      awayForm = "W";
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
      homeForm = "D";
      awayForm = "D";
    }

    home.form.push(homeForm);
    away.form.push(awayForm);
  }

  const rows: RowWithForm[] = Object.values(base).map((t) => ({
    ...t,
    goalDiff: t.goalsFor - t.goalsAgainst,
    form: t.form,
    position: 0,
    movement: 0,
  }));

  rows.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor ||
      a.name.localeCompare(b.name),
  );

  rows.forEach((r, idx) => {
    r.position = idx + 1;
  });

  return rows;
}

export default function LeagueTableSection() {
  const { latestRound, rows } = useMemo(() => {
    // detect the latest round that has any result
    const fixtureById = Object.fromEntries(FIXTURES.map((f) => [f.id, f]));
    let maxRound = 0;
    for (const r of RESULTS) {
      const f = fixtureById[r.fixtureId];
      if (f && f.round > maxRound) maxRound = f.round;
    }
    if (maxRound === 0) maxRound = 1;

    const current = computeTableUpToRound(maxRound);
    const previous =
      maxRound > 1 ? computeTableUpToRound(maxRound - 1) : null;

    const prevPos = new Map<string, number>();
    if (previous) {
      previous.forEach((r) => prevPos.set(r.name, r.position));
    }

    const withMovement = current.map((row) => {
      const prev = prevPos.get(row.name) ?? row.position;
      const movement = prev - row.position;
      return { ...row, movement };
    });

    return { latestRound: maxRound, rows: withMovement };
  }, []);

  // Hide Nepal United FC in table display only
  const visibleRows = useMemo(
    () => rows.filter((r) => r.name !== "Nepal United FC"),
    [rows],
  );

  // Re-number positions after filtering so you still have 1 to 11
  const renumberedRows = useMemo(() => {
    return visibleRows.map((r, idx) => ({
      ...r,
      position: idx + 1,
    }));
  }, [visibleRows]);

  const leader = renumberedRows[0];
  const topAttack = leader
    ? renumberedRows.reduce((best, row) => (row.goalsFor > best.goalsFor ? row : best), leader)
    : null;
  const topDefence = leader
    ? renumberedRows.reduce(
        (best, row) => (row.goalsAgainst < best.goalsAgainst ? row : best),
        leader,
      )
    : null;

  return (
    <section id="table" className="mt-0">
      <div className="shell-card px-4 py-7 sm:px-6 md:px-8">
        <div className="section-divider">
          <div className="min-w-0">
            <p className="section-kicker">Standings</p>
            <h2 className="mt-2 inline-flex max-w-full items-center gap-2 font-display text-3xl md:text-4xl">
              <ListOrdered size={22} className="text-[#ff8f62]" />
              <span className="text-[#15202b]">League Table</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#8ea0b1]">
              Samsara Premier League (SPL) 2025 to 2026 standings after Week {latestRound}.
              {SPL_STATUS.leagueStageConcluded ? (
                <>
                  {" "}
                  League Stage has concluded. Championship Stage is ongoing.
                </>
              ) : (
                <> Table updates after each completed match.</>
              )}
            </p>
          </div>
          {SPL_STATUS.leagueStageConcluded && (
            <div className="w-full max-w-sm rounded-[1.25rem] border border-slate-200 bg-[#f8fafc] px-4 py-4 text-left text-sm">
              <div className="font-semibold text-[#15202b]">
                League Stage Winners:{" "}
                <span className="text-[#f0b429]">{SPL_STATUS.leagueStageWinner}</span>
              </div>
              <div className="mt-1 text-[#8ea0b1]">{SPL_STATUS.note}</div>
            </div>
          )}
        </div>

        {leader && (
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-[#15202b]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff8f62]">
                League winner
              </p>
              <p className="mt-2 text-lg font-semibold">{SPL_STATUS.leagueStageWinner}</p>
              <p className="mt-1 text-sm text-[#607181]">League stage winners for SPL 2025-26</p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-[#15202b]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ff8f62]">
                Best attack
              </p>
              <p className="mt-2 text-lg font-semibold">{topAttack?.name}</p>
              <p className="mt-1 text-sm text-[#607181]">
                {topAttack?.goalsFor} goals scored
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-slate-200 bg-[#fff5f5] px-4 py-4 text-[#15202b]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b42318]">
                Best defence
              </p>
              <p className="mt-2 text-lg font-semibold">{topDefence?.name}</p>
              <p className="mt-1 text-sm text-[#607181]">
                {topDefence?.goalsAgainst} goals conceded
              </p>
            </div>
          </div>
        )}

        <div className="-mx-2 overflow-x-auto px-2 pb-2 sm:pb-4 mt-2">
          <table className="min-w-full overflow-hidden text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-[#f8fafc] text-[11px] uppercase text-[#607181] sm:text-xs">
                <th className="px-3 py-2">Pos</th>
                <th className="px-3 py-2">Team</th>
                <th className="px-2 py-2 text-center">MP</th>
                <th className="px-2 py-2 text-center">W</th>
                <th className="px-2 py-2 text-center">D</th>
                <th className="px-2 py-2 text-center">L</th>
                <th className="px-2 py-2 text-center">GF</th>
                <th className="px-2 py-2 text-center">GA</th>
                <th className="px-2 py-2 text-center">GD</th>
                <th className="px-2 py-2 text-center">Pts</th>
                <th className="px-3 py-2 text-center">Form</th>
              </tr>
            </thead>
            <tbody>
              {renumberedRows.map((row) => {
                const logo = TEAM_LOGOS[row.name];
                const recentForm = row.form.slice(-5);
                const isTop4 = row.position <= 4;
                const isBottom2 = row.position >= 10;

                const bg =
                  row.played === 0
                    ? "bg-white"
                    : isTop4
                    ? "bg-[#f8fbff]"
                    : isBottom2
                    ? "bg-[#fff7f7]"
                    : "bg-white";

                const movementSymbol =
                  row.movement > 0 ? "▲" : row.movement < 0 ? "▼" : "•";
                const movementClass =
                  row.movement > 0
                    ? "text-emerald-600"
                    : row.movement < 0
                    ? "text-rose-600"
                    : "text-slate-400";

                return (
                  <tr key={row.name} className={`${bg} text-[11px] text-[#15202b] sm:text-xs`}>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-[#15202b]">
                      <span>{row.position}</span>{" "}
                      <span className={`ml-1 text-[10px] ${movementClass}`}>
                        {movementSymbol}{" "}
                        {row.movement !== 0 ? Math.abs(row.movement) : ""}
                      </span>
                    </td>
                    <td className="flex items-center gap-2 px-3 py-2">
                      {logo ? (
                        <img
                          src={logo}
                          alt={row.name}
                          className="h-6 w-6 rounded-full border border-[#11293f]/8 bg-white object-contain"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-[#607181]">
                          {row.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")}
                        </div>
                      )}
                      <span className="truncate text-xs sm:text-sm">
                        {row.name}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">{row.played}</td>
                    <td className="px-2 py-2 text-center">{row.won}</td>
                    <td className="px-2 py-2 text-center">{row.drawn}</td>
                    <td className="px-2 py-2 text-center">{row.lost}</td>
                    <td className="px-2 py-2 text-center">{row.goalsFor}</td>
                    <td className="px-2 py-2 text-center">{row.goalsAgainst}</td>
                    <td className="px-2 py-2 text-center">{row.goalDiff}</td>
                    <td className="px-2 py-2 text-center font-semibold">
                      {row.points}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        {recentForm.length === 0 ? (
                          <span className="text-[10px] text-slate-400">-</span>
                        ) : (
                          recentForm.map((code, i) => (
                            <span
                              key={i}
                              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                                code === "W"
                                  ? "bg-[#11293f] text-white"
                                  : code === "D"
                                  ? "bg-slate-300 text-slate-800"
                                  : "bg-[#ff5a36] text-white"
                              }`}
                            >
                              {code}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-slate-200 px-4 py-3 text-[11px] text-[#607181] sm:px-6 sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-[#d7222a] bg-[#d7222a]/20" />
            Top 4 advance to knockouts
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-[#ff5a36] bg-[#ff5a36]/20" />
            Bottom 2 in relegation zone
          </div>
        </div>
      </div>
    </section>
  );
}
