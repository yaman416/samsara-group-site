// components/ResultsSection.tsx
"use client";

import { useState } from "react";
import {
  FIXTURES,
  RESULTS,
  TEAM_LOGOS,
  MATCH_FACTS,
} from "@/lib/splData";
import Modal from "@/components/Modal";

export default function ResultsSection() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [openMatchId, setOpenMatchId] = useState<string | null>(null);

  const weeks = [...new Set(FIXTURES.map((f) => f.round))];

  const weekFixtures = FIXTURES.filter(
    (f) => f.round === selectedWeek
  );

  const resultMap = Object.fromEntries(
    RESULTS.map((r) => [r.fixtureId, r])
  );

  function getTeamLogo(team: string) {
    return TEAM_LOGOS[team] || "";
  }

  return (
    <section id="results" className="mt-12">
      <h2 className="text-xl font-bold mb-3">Match Results</h2>

      {/* Week Selector */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-semibold">Select Week</label>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
        >
          {weeks.map((w) => (
            <option key={w} value={w}>
              Week {w}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {weekFixtures.map((f) => {
          const res = resultMap[f.id];
          if (!res) {
            return (
              <div
                key={f.id}
                className="p-4 rounded-xl shadow bg-white text-sm flex justify-between"
              >
                <span>
                  {f.home} vs {f.away}
                </span>
                <span className="text-gray-500">Not played</span>
              </div>
            );
          }

          return (
            <div
              key={f.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
            >
              {/* Teams + Score */}
              <div className="flex justify-between items-center">
                {/* Home */}
                <div className="flex items-center gap-2">
                  <img
                    src={getTeamLogo(f.home)}
                    alt={f.home}
                    className="w-7 h-7 rounded"
                  />
                  <span className="font-semibold text-sm">{f.home}</span>
                </div>

                {/* Score */}
                <span className="font-bold text-gray-800 text-sm">
                  {res.homeGoals} - {res.awayGoals}
                </span>

                {/* Away */}
                <div className="flex items-center gap-2">
                  <img
                    src={getTeamLogo(f.away)}
                    alt={f.away}
                    className="w-7 h-7 rounded"
                  />
                  <span className="font-semibold text-sm">{f.away}</span>
                </div>
              </div>

              {/* Match Facts Button */}
              {MATCH_FACTS[f.id] && (
                <button
                  onClick={() => setOpenMatchId(f.id)}
                  className="self-start bg-blue-600 text-white px-3 py-1.5 text-xs rounded-md hover:bg-blue-700"
                >
                  Match Facts
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal open={!!openMatchId} onClose={() => setOpenMatchId(null)}>
        {openMatchId && <MatchFactsContent matchId={openMatchId} />}
      </Modal>
    </section>
  );
}

function MatchFactsContent({ matchId }: { matchId: string }) {
  const data = MATCH_FACTS[matchId];
  if (!data) return <p>No match facts available.</p>;

  return (
    <div className="space-y-6">
      {/* HOME TEAM */}
      <div>
        <h3 className="font-bold mb-2 text-gray-900">Home Team</h3>

        <p className="font-semibold text-sm">Goals:</p>
        <ul className="list-disc pl-5 text-sm">
          {data.home.scorers.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <p className="font-semibold text-sm mt-2">Cards:</p>
        <ul className="list-disc pl-5 text-sm">
          {data.home.cards.length > 0 ? (
            data.home.cards.map((c, i) => <li key={i}>{c}</li>)
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>

      {/* AWAY TEAM */}
      <div>
        <h3 className="font-bold mb-2 text-gray-900">Away Team</h3>

        <p className="font-semibold text-sm">Goals:</p>
        <ul className="list-disc pl-5 text-sm">
          {data.away.scorers.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <p className="font-semibold text-sm mt-2">Cards:</p>
        <ul className="list-disc pl-5 text-sm">
          {data.away.cards.length > 0 ? (
            data.away.cards.map((c, i) => <li key={i}>{c}</li>)
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>
    </div>
  );
}
