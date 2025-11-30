// components/FixturesResultsSection.tsx
"use client";

import { useState, useMemo } from "react";
import {
  FIXTURES,
  RESULTS,
  TEAM_LOGOS,
  MATCH_FACTS,
  getRounds,
} from "@/lib/splData";
import Modal from "@/components/Modal";

type ResultMap = Record<string, { homeGoals: number; awayGoals: number }>;

export default function FixturesResultsSection() {
  const rounds = getRounds();

  // Work out current / upcoming round for default
  const today = new Date();

  const nextFixture = FIXTURES.find((f) => new Date(f.date) >= today);
  const nextUpcomingRound = nextFixture?.round ?? rounds[0];

  const latestResultRound = RESULTS.reduce((max, r) => {
    const fx = FIXTURES.find((f) => f.id === r.fixtureId);
    if (!fx) return max;
    return fx.round > max ? fx.round : max;
  }, 0);

  const initialRound =
    latestResultRound > 0 ? latestResultRound : nextUpcomingRound;

  const [selectedRound, setSelectedRound] = useState<number>(initialRound);
  const [openMatchId, setOpenMatchId] = useState<string | null>(null);

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

  const fixtures = useMemo(
    () =>
      FIXTURES.filter((f) => f.round === selectedRound).sort((a, b) =>
        a.time.localeCompare(b.time),
      ),
    [selectedRound],
  );

  function logo(team: string) {
    return TEAM_LOGOS[team] || "";
  }

  return (
    <section id="fixturesResults" className="mt-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold tracking-tight">
          SPL Fixtures &amp; Results
        </h2>

        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600">Week</label>
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(Number(e.target.value))}
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

      {/* Upcoming Week pill */}
      <p className="text-xs text-gray-600 mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
          Upcoming Week: {nextUpcomingRound}
        </span>
      </p>

      {/* Fixtures / Results list */}
      <div className="space-y-4">
        {fixtures.map((f) => {
          const res = resultMap[f.id];
          const isFinished = !!res;
          const hasFacts = !!MATCH_FACTS[f.id];

          return (
            <div
              key={f.id}
              className="bg-white p-4 shadow rounded-xl border"
            >
              {/* Team row */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* Home team */}
                <div className="flex items-center gap-2 min-w-[40%]">
                  <img
                    src={logo(f.home)}
                    className="w-7 h-7 rounded-full border"
                    alt={f.home}
                  />
                  <span className="font-semibold text-sm">{f.home}</span>
                </div>

                {/* Score / vs + meta */}
                <div className="flex-1 text-center">
                  {isFinished ? (
                    <span className="text-lg font-bold">
                      {res.homeGoals}
                      <span className="text-[10px] text-gray-500 mx-1">
                        FT
                      </span>
                      {res.awayGoals}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-gray-600">
                      vs
                    </span>
                  )}
                  <div className="text-[10px] text-gray-600 mt-1">
                    Week {f.round} • {f.date} • {f.time}
                  </div>
                </div>

                {/* Away team */}
                <div className="flex items-center justify-end gap-2 min-w-[40%]">
                  <span className="font-semibold text-sm text-right">
                    {f.away}
                  </span>
                  <img
                    src={logo(f.away)}
                    className="w-7 h-7 rounded-full border"
                    alt={f.away}
                  />
                </div>
              </div>

              {/* Bottom row */}
              <div className="mt-2 flex items-center justify-between text-xs text-gray-600 flex-wrap gap-2">
                <span>
                  Ground: <strong>{f.ground}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {!isFinished && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">
                      Upcoming fixture
                    </span>
                  )}

                  {isFinished && hasFacts && (
                    <button
                      onClick={() => setOpenMatchId(f.id)}
                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      Match Facts
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Match Facts modal */}
      <Modal open={!!openMatchId} onClose={() => setOpenMatchId(null)}>
        {openMatchId && <MatchFacts matchId={openMatchId} />}
      </Modal>
    </section>
  );
}

function MatchFacts({ matchId }: { matchId: string }) {
  const d = MATCH_FACTS[matchId];

  if (!d) {
    return <p className="text-sm text-white">No match facts available.</p>;
  }

  return (
    <div className="text-sm text-white space-y-6">
      <h3 className="text-xl font-bold mb-2">Match Facts</h3>

      {/* Team names row */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="text-left">
          <p className="text-base font-semibold">{d.teamHome}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold">{d.teamAway}</p>
        </div>
      </div>

      {/* Goals */}
      <div>
        <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide text-slate-200">
          Goals
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Home goals */}
          <ul className="list-disc pl-5 text-left">
            {d.home.scorers.length > 0 ? (
              d.home.scorers.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <li>No goals</li>
            )}
          </ul>

          {/* Away goals */}
          <ul className="list-disc pl-5 text-right">
            {d.away.scorers.length > 0 ? (
              d.away.scorers.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <li>No goals</li>
            )}
          </ul>
        </div>
      </div>

      {/* Cards */}
      <div>
        <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide text-slate-200">
          Cards
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Home cards */}
          <ul className="list-disc pl-5 text-left">
            {d.home.cards.length > 0 ? (
              d.home.cards.map((c, i) => <li key={i}>{c}</li>)
            ) : (
              <li>No cards</li>
            )}
          </ul>

          {/* Away cards */}
          <ul className="list-disc pl-5 text-right">
            {d.away.cards.length > 0 ? (
              d.away.cards.map((c, i) => <li key={i}>{c}</li>)
            ) : (
              <li>No cards</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
