// components/FixturesResultsSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, RESULTS, TEAM_LOGOS, MATCH_FACTS } from "@/lib/splData";
import Modal from "@/components/Modal";

type ResultMap = Record<
  string,
  {
    homeGoals: number;
    awayGoals: number;
  }
>;

export default function FixturesResultsSection() {
  // All weeks
  const rounds = useMemo(
    () =>
      Array.from(new Set(FIXTURES.map((f) => f.round))).sort(
        (a, b) => a - b,
      ),
    [],
  );

  // Map results by fixture id
  const resultMap: ResultMap = useMemo(
    () =>
      Object.fromEntries(
        RESULTS.map((r) => [
          r.fixtureId,
          { homeGoals: r.homeGoals, awayGoals: r.awayGoals },
        ]),
      ),
    [],
  );

  // Last round that has at least one result
  const lastPlayedRound =
    rounds
      .slice()
      .reverse()
      .find((r) =>
        FIXTURES.some((f) => f.round === r && resultMap[f.id]),
      ) ?? rounds[0];

  // Upcoming round default (first future fixture)
  const today = new Date();
  const firstFutureFixture = FIXTURES.find(
    (f) => new Date(f.date) >= today,
  );
  const defaultUpcomingRound =
    firstFutureFixture?.round ?? rounds[rounds.length - 1];

  const [selectedUpcomingRound, setSelectedUpcomingRound] = useState(
    defaultUpcomingRound,
  );

  // Modal
  const [openMatchId, setOpenMatchId] = useState<string | null>(null);

  const latestResults = useMemo(
    () =>
      FIXTURES.filter(
        (f) => f.round === lastPlayedRound && resultMap[f.id],
      ).sort((a, b) => a.time.localeCompare(b.time)),
    [lastPlayedRound, resultMap],
  );

  const upcomingFixtures = useMemo(
    () =>
      FIXTURES.filter((f) => f.round === selectedUpcomingRound).sort(
        (a, b) => a.time.localeCompare(b.time),
      ),
    [selectedUpcomingRound],
  );

  function logo(team: string) {
    return TEAM_LOGOS[team] || "";
  }

  return (
    <section id="fixtures" className="mt-12 space-y-8">
      {/* LATEST RESULTS */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-xl font-bold tracking-tight">
            Latest Results
          </h2>
          <span className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Week {lastPlayedRound}
          </span>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Most recent completed round. Tap Match facts to see goal scorers
          and cards.
        </p>

        <div className="space-y-3">
          {latestResults.length === 0 && (
            <p className="text-sm text-gray-500">
              No results recorded yet.
            </p>
          )}

          {latestResults.map((f) => {
            const res = resultMap[f.id]!;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setOpenMatchId(f.id)}
                className="w-full text-left rounded-2xl bg-slate-900 text-slate-50 px-4 py-3 sm:px-6 sm:py-4 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Score line similar to reference screenshot */}
                <div className="flex items-center justify-between gap-3">
                  {/* Home */}
                  <div className="flex items-center gap-2 sm:gap-3 w-1/3 min-w-[30%]">
                    <img
                      src={logo(f.home)}
                      alt={f.home}
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-slate-600 bg-white"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wide text-slate-300">
                        Home
                      </span>
                      <span className="text-sm sm:text-base font-semibold">
                        {f.home}
                      </span>
                    </div>
                  </div>

                  {/* Centre score */}
                  <div className="flex flex-col items-center justify-center flex-1">
                    <div className="flex items-baseline gap-2 text-2xl sm:text-3xl font-bold">
                      <span>{res.homeGoals}</span>
                      <span className="text-base sm:text-lg text-slate-400">
                        -
                      </span>
                      <span>{res.awayGoals}</span>
                    </div>
                    <span className="mt-1 text-[11px] text-slate-300">
                      Full time
                    </span>
                    <span className="mt-1 text-[10px] text-slate-400">
                      Round {f.round} • {f.date} • {f.time}
                    </span>
                  </div>

                  {/* Away */}
                  <div className="flex items-center gap-2 sm:gap-3 justify-end w-1/3 min-w-[30%]">
                    <div className="flex flex-col text-right">
                      <span className="text-xs uppercase tracking-wide text-slate-300">
                        Away
                      </span>
                      <span className="text-sm sm:text-base font-semibold">
                        {f.away}
                      </span>
                    </div>
                    <img
                      src={logo(f.away)}
                      alt={f.away}
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-slate-600 bg-white"
                    />
                  </div>
                </div>

                {/* Small footer row */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Tap for full match facts</span>
                  <span className="rounded-full border border-slate-500 px-3 py-1 text-[11px]">
                    Match facts
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* UPCOMING FIXTURES */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold tracking-tight">
            Upcoming Fixtures
          </h3>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Week</label>
            <select
              value={selectedUpcomingRound}
              onChange={(e) =>
                setSelectedUpcomingRound(Number(e.target.value))
              }
              className="border px-3 py-2 rounded-lg text-sm shadow-sm"
            >
              {rounds.map((r) => (
                <option key={r} value={r}>
                  Week {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-3">
          Select a week to see all fixtures. Tap Match centre for details.
        </p>

        <div className="space-y-3">
          {upcomingFixtures.map((f) => {
            const res = resultMap[f.id];
            const isPlayed = !!res;
            return (
              <div
                key={f.id}
                className="rounded-2xl bg-white border px-4 py-3 sm:px-5 sm:py-4 shadow-sm"
              >
                {/* Teams row */}
                <div className="flex items-center justify-between gap-3">
                  {/* Home */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-[35%]">
                    <img
                      src={logo(f.home)}
                      alt={f.home}
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border bg-white"
                    />
                    <span className="text-sm sm:text-base font-semibold">
                      {f.home}
                    </span>
                  </div>

                  {/* Centre */}
                  <div className="flex flex-col items-center flex-1 text-xs text-gray-600">
                    {isPlayed ? (
                      <span className="text-sm sm:text-base font-semibold text-gray-900">
                        {res!.homeGoals} - {res!.awayGoals}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-700">
                        vs
                      </span>
                    )}
                    <span className="mt-1 text-[10px]">
                      {f.date} • {f.time} • {f.ground}
                    </span>
                  </div>

                  {/* Away */}
                  <div className="flex items-center gap-2 sm:gap-3 justify-end min-w-[35%]">
                    <span className="text-sm sm:text-base font-semibold text-right">
                      {f.away}
                    </span>
                    <img
                      src={logo(f.away)}
                      alt={f.away}
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border bg-white"
                    />
                  </div>
                </div>

                {/* Footer row */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-600">
                  <div className="flex items-center gap-2">
                    {!isPlayed && (
                      <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenMatchId(f.id)}
                    className="rounded-full border border-blue-500 px-3 py-1 text-[11px] text-blue-600 hover:bg-blue-50"
                  >
                    Match centre
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <Modal open={!!openMatchId} onClose={() => setOpenMatchId(null)}>
        {openMatchId && <MatchCentre matchId={openMatchId} />}
      </Modal>
    </section>
  );
}

// Match centre / facts popup
function MatchCentre({ matchId }: { matchId: string }) {
  const fixture = FIXTURES.find((f) => f.id === matchId);
  const result = RESULTS.find((r) => r.fixtureId === matchId);
  const facts = MATCH_FACTS[matchId];

  if (!fixture) {
    return <p className="text-sm text-slate-50">Match not found.</p>;
  }

  const homeLogo = TEAM_LOGOS[fixture.home] || "";
  const awayLogo = TEAM_LOGOS[fixture.away] || "";

  const isFinished = !!result;
  const scoreHome = result?.homeGoals ?? "-";
  const scoreAway = result?.awayGoals ?? "-";

  function renderCards(list: string[]) {
    if (!list.length) return <li>None</li>;
    return list.map((item, i) => {
      const lower = item.toLowerCase();
      const isRed = lower.includes("red");
      const isYellow = lower.includes("yellow");
      return (
        <li key={i} className="flex items-center gap-2">
          {isRed && (
            <span className="inline-block w-2.5 h-3 rounded-[2px] bg-red-500" />
          )}
          {isYellow && !isRed && (
            <span className="inline-block w-2.5 h-3 rounded-[2px] bg-yellow-400" />
          )}
          <span>{item}</span>
        </li>
      );
    });
  }

  return (
    <div className="text-slate-50 text-sm space-y-6">
      {/* Scoreboard header (similar to reference) */}
      <div className="flex items-center justify-between gap-4">
        {/* Home */}
        <div className="flex items-center gap-3 w-1/3 min-w-[30%]">
          <img
            src={homeLogo}
            alt={fixture.home}
            className="w-10 h-10 rounded-full bg-white border border-slate-600"
          />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">
              Home
            </p>
            <p className="font-semibold text-sm sm:text-base">
              {fixture.home}
            </p>
          </div>
        </div>

        {/* Centre score and meta */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-baseline gap-2 text-3xl font-bold">
            <span>{scoreHome}</span>
            <span className="text-base text-slate-400">-</span>
            <span>{scoreAway}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-300">
            {isFinished ? "Full time" : "Upcoming fixture"}
          </p>
          <p className="mt-1 text-[11px] text-slate-400 text-center">
            Round {fixture.round} · {fixture.date} · {fixture.time}
            <br />
            {fixture.ground}
          </p>
        </div>

        {/* Away */}
        <div className="flex items-center gap-3 justify-end w-1/3 min-w-[30%]">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-300">
              Away
            </p>
            <p className="font-semibold text-sm sm:text-base">
              {fixture.away}
            </p>
          </div>
          <img
            src={awayLogo}
            alt={fixture.away}
            className="w-10 h-10 rounded-full bg-white border border-slate-600"
          />
        </div>
      </div>

      {/* Content */}
      {isFinished && facts ? (
        <>
          <div className="space-y-4">
            {/* Goals */}
            <div>
              <p className="font-semibold text-xs tracking-wide text-slate-300 mb-1">
                GOALS – {fixture.home.toUpperCase()}
              </p>
              <ul className="list-disc pl-5">
                {facts.home.scorers.length
                  ? facts.home.scorers.map((s, i) => <li key={i}>{s}</li>)
                  : <li>None</li>}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-xs tracking-wide text-slate-300 mb-1">
                GOALS – {fixture.away.toUpperCase()}
              </p>
              <ul className="list-disc pl-5">
                {facts.away.scorers.length
                  ? facts.away.scorers.map((s, i) => <li key={i}>{s}</li>)
                  : <li>None</li>}
              </ul>
            </div>
          </div>

          {/* Cards */}
          <div className="mt-4">
            <p className="font-semibold text-xs tracking-wide text-slate-300 mb-2">
              CARDS
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-[12px] mb-1">
                  {fixture.home}
                </p>
                <ul className="list-disc pl-5">{renderCards(facts.home.cards)}</ul>
              </div>
              <div>
                <p className="font-semibold text-[12px] mb-1">
                  {fixture.away}
                </p>
                <ul className="list-disc pl-5">{renderCards(facts.away.cards)}</ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-3 text-[13px] text-slate-200 leading-relaxed">
          <p>
            This match is part of the Samsara Premier League regular season.
            Kick off is scheduled for {fixture.time} on {fixture.date} at{" "}
            {fixture.ground}.
          </p>
          <p className="mt-2 text-slate-300">
            Line ups, live updates, and full match facts will appear here
            after the game has been played.
          </p>
        </div>
      )}
    </div>
  );
}
