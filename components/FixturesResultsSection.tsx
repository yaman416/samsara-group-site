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
  // All match weeks
  const rounds = getRounds();

  // Default to the first round
  const [selectedRound, setSelectedRound] = useState<number>(rounds[0]);

  // Modal state
  const [openMatchId, setOpenMatchId] = useState<string | null>(null);

  // Map all results by fixtureId for quick lookup
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

  // Fixtures for selected week
  const fixtures = useMemo(
    () =>
      FIXTURES.filter((f) => f.round === selectedRound).sort((a, b) =>
        a.time.localeCompare(b.time),
      ),
    [selectedRound],
  );

  // Detect next upcoming round
  const today = new Date();
  const nextUpcomingRound =
    FIXTURES.find((f) => new Date(f.date) >= today)?.round || rounds[0];

  function logo(team: string) {
    return TEAM_LOGOS[team] || "";
  }

  return (
    <section id="fixtures" className="mt-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold tracking-tight">
          SPL Fixtures & Results
        </h2>

        {/* Week Selector */}
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

      {/* Upcoming Week Indicator */}
      <p className="text-xs text-gray-600 mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
          Upcoming Week: {nextUpcomingRound}
        </span>
      </p>

      {/* Fixtures list */}
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
              {/* Team Row */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* Home */}
                <div className="flex items-center gap-2 min-w-[40%]">
                  <img
                    src={logo(f.home)}
                    className="w-7 h-7 rounded-full border"
                    alt={f.home}
                  />
                  <span className="font-semibold text-sm">{f.home}</span>
                </div>

                {/* Centre */}
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

                {/* Away */}
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

              {/* Match info row */}
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

      {/* Modal */}
      <Modal open={!!openMatchId} onClose={() => setOpenMatchId(null)}>
        {openMatchId && <MatchFacts matchId={openMatchId} />}
      </Modal>
    </section>
  );
}

function MatchFacts({ matchId }: { matchId: string }) {
  const d = MATCH_FACTS[matchId];

  if (!d) return <p className="text-sm text-white">No data available.</p>;

  return (
    <div className="text-sm space-y-5 text-white">
      <h3 className="text-lg font-bold">Match Facts</h3>

      {/* Home Team */}
      <div>
        <p className="font-semibold bg-white/10 px-2 py-1 rounded">
          Home Team
        </p>

        <p className="mt-2 font-semibold">Goals</p>
        <ul className="list-disc pl-5">
          {d.home.scorers.length > 0 ? (
            d.home.scorers.map((s, i) => <li key={i}>{s}</li>)
          ) : (
            <li>No goals</li>
          )}
        </ul>

        <p className="mt-3 font-semibold">Cards</p>
        <ul className="list-disc pl-5">
          {d.home.cards.length > 0 ? (
            d.home.cards.map((c, i) => <li key={i}>{c}</li>)
          ) : (
            <li>No cards</li>
          )}
        </ul>
      </div>

      {/* Away Team */}
      <div>
        <p className="font-semibold bg-white/10 px-2 py-1 rounded">
          Away Team
        </p>

        <p className="mt-2 font-semibold">Goals</p>
        <ul className="list-disc pl-5">
          {d.away.scorers.length > 0 ? (
            d.away.scorers.map((s, i) => <li key={i}>{s}</li>)
          ) : (
            <li>No goals</li>
          )}
        </ul>

        <p className="mt-3 font-semibold">Cards</p>
        <ul className="list-disc pl-5">
          {d.away.cards.length > 0 ? (
            d.away.cards.map((c, i) => <li key={i}>{c}</li>)
          ) : (
            <li>No cards</li>
          )}
        </ul>
      </div>
    </div>
  );
}
