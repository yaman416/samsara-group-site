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

  // Detect next upcoming round and use it as default selection
  const today = new Date();
  const firstUpcomingFixture = FIXTURES.find(
    (f) => new Date(f.date) >= today,
  );
  const defaultRound = firstUpcomingFixture ? firstUpcomingFixture.round : rounds[0];

  const [selectedRound, setSelectedRound] = useState<number>(defaultRound);
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

  const nextUpcomingRound =
    firstUpcomingFixture?.round || rounds[0];

  function logo(team: string) {
    return TEAM_LOGOS[team] || "";
  }

  return (
    <section id="fixturesResults" className="mt-12">
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
        <span className="px-3 py-1 rounded-full border border-red-500 text-red-600">
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

/* Small helper to render yellow/red card blocks */
function CardIcons({ text }: { text: string }) {
  const lower = text.toLowerCase();
  const icons: ("yellow" | "red")[] = [];

  if (lower.includes("yellow")) icons.push("yellow");
  if (lower.includes("red")) icons.push("red");

  if (!icons.length) return null;

  return (
    <span className="inline-flex items-center gap-1 mr-1">
      {icons.map((type, idx) => (
        <span
          key={idx}
          className={`inline-block w-2.5 h-3 rounded-[2px] ${
            type === "yellow" ? "bg-yellow-300" : "bg-red-500"
          }`}
        />
      ))}
    </span>
  );
}

function MatchFacts({ matchId }: { matchId: string }) {
  const d = MATCH_FACTS[matchId];
  const fixture = FIXTURES.find((f) => f.id === matchId);
  const res = RESULTS.find((r) => r.fixtureId === matchId);

  if (!d || !fixture) {
    return <p className="text-sm text-slate-50">No match facts available.</p>;
  }

  const homeTeam = fixture.home;
  const awayTeam = fixture.away;
  const homeLogo = TEAM_LOGOS[homeTeam] || "";
  const awayLogo = TEAM_LOGOS[awayTeam] || "";

  return (
    <div className="text-sm text-slate-50 space-y-6">
      {/* Header: teams, logos, score */}
      <div className="flex items-center justify-between gap-3 mb-2">
        {/* Home */}
        <div className="flex items-center gap-2 min-w-[35%]">
          {homeLogo && (
            <img
              src={homeLogo}
              alt={homeTeam}
              className="w-9 h-9 rounded-full border border-white/20"
            />
          )}
          <span className="font-semibold text-sm">{homeTeam}</span>
        </div>

        {/* Score + meta */}
        <div className="flex flex-col items-center justify-center flex-1">
          {res && (
            <p className="text-2xl font-bold leading-none mb-1">
              {res.homeGoals} - {res.awayGoals}
            </p>
          )}
          <p className="text-[11px] text-slate-400">
            Week {fixture.round} • {fixture.date} • {fixture.time}
          </p>
        </div>

        {/* Away */}
        <div className="flex items-center gap-2 justify-end min-w-[35%]">
          <span className="font-semibold text-sm text-right">{awayTeam}</span>
          {awayLogo && (
            <img
              src={awayLogo}
              alt={awayTeam}
              className="w-9 h-9 rounded-full border border-white/20"
            />
          )}
        </div>
      </div>

      {/* Goals */}
      <div>
        <h4 className="uppercase tracking-wide text-[11px] text-slate-400 mb-2">
          Goals
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Home goals */}
          <ul className="space-y-1 text-left">
            {d.home.scorers.length ? (
              d.home.scorers.map((s, i) => (
                <li key={i} className="flex items-center gap-1">
                  <span className="mr-1">⚽</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 text-xs">No goals</li>
            )}
          </ul>

          {/* Away goals */}
          <ul className="space-y-1 text-right">
            {d.away.scorers.length ? (
              d.away.scorers.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1 justify-end"
                >
                  <span>{s}</span>
                  <span className="ml-1">⚽</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 text-xs">No goals</li>
            )}
          </ul>
        </div>
      </div>

      {/* Cards */}
      <div>
        <h4 className="uppercase tracking-wide text-[11px] text-slate-400 mb-2">
          Cards
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Home cards */}
          <ul className="space-y-1 text-left">
            {d.home.cards.length ? (
              d.home.cards.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  <CardIcons text={c} />
                  <span>{c}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 text-xs">No cards</li>
            )}
          </ul>

          {/* Away cards */}
          <ul className="space-y-1 text-right">
            {d.away.cards.length ? (
              d.away.cards.map((c, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1 justify-end"
                >
                  <span>{c}</span>
                  <CardIcons text={c} />
                </li>
              ))
            ) : (
              <li className="text-slate-400 text-xs">No cards</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
