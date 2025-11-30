"use client";

import { useMemo, useState } from "react";
import { FIXTURES, RESULTS, TEAM_LOGOS, MATCH_FACTS } from "@/lib/splData";
import Modal from "@/components/Modal";

export default function ResultsSection() {
  // Fixtures that have a result saved
  const completed = FIXTURES.filter(f =>
    RESULTS.some(r => r.fixtureId === f.id)
  );

  // Get list of available result weeks
  const weeks = [...new Set(completed.map(f => f.round))].sort((a, b) => b - a);

  const [selectedWeek, setSelectedWeek] = useState(weeks[0]);
  const [openMatchId, setOpenMatchId] = useState<string | null>(null);

  // Matches to show
  const matchesThisWeek = useMemo(
    () => completed.filter(f => f.round === selectedWeek),
    [selectedWeek, completed]
  );

  function logo(team: string) {
    return TEAM_LOGOS[team] || "/team/default.png";
  }

  function getScore(id: string) {
    return RESULTS.find(r => r.fixtureId === id);
  }

  return (
    <section id="results" className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Match Results</h2>

        {/* Week dropdown */}
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg text-sm bg-white"
        >
          {weeks.map(w => (
            <option key={w} value={w}>Week {w}</option>
          ))}
        </select>
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {matchesThisWeek.map(m => {
          const s = getScore(m.id);
          if (!s) return null;

          return (
            <div
              key={m.id}
              className="bg-white border rounded-xl shadow-sm p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between text-xs text-gray-600">
                <span>{m.date}</span>
                <span>{m.ground}</span>
              </div>

              <div className="flex justify-between items-center">
                {/* HOME */}
                <div className="flex flex-col items-center w-1/3">
                  <img src={logo(m.home)} className="w-10 h-10 rounded-full" />
                  <span className="text-xs font-semibold text-center">{m.home}</span>
                </div>

                <div className="text-xl font-bold text-gray-900">
                  {s.homeGoals} - {s.awayGoals}
                </div>

                {/* AWAY */}
                <div className="flex flex-col items-center w-1/3">
                  <img src={logo(m.away)} className="w-10 h-10 rounded-full" />
                  <span className="text-xs font-semibold text-center">{m.away}</span>
                </div>
              </div>

              {/* Match Facts button */}
              {MATCH_FACTS[m.id] && (
                <button
                  onClick={() => setOpenMatchId(m.id)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md w-fit mx-auto"
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
        {openMatchId && <MatchFacts matchId={openMatchId} />}
      </Modal>
    </section>
  );
}

function MatchFacts({ matchId }: { matchId: string }) {
  const m = MATCH_FACTS[matchId];
  if (!m) return <p className="text-sm">No match facts available.</p>;

  return (
    <div className="text-sm space-y-6">
      {/* HOME */}
      <div>
        <h3 className="font-bold mb-1">Home Team</h3>

        <p className="font-semibold">Goals</p>
        <ul className="list-disc pl-5">
          {m.home.scorers.length ? m.home.scorers.map((g, i) => <li key={i}>{g}</li>) : <li>None</li>}
        </ul>

        <p className="font-semibold mt-2">Cards</p>
        <ul className="list-disc pl-5">
          {m.home.cards.length ? m.home.cards.map((c, i) => <li key={i}>{c}</li>) : <li>None</li>}
        </ul>
      </div>

      {/* AWAY */}
      <div>
        <h3 className="font-bold mb-1">Away Team</h3>

        <p className="font-semibold">Goals</p>
        <ul className="list-disc pl-5">
          {m.away.scorers.length ? m.away.scorers.map((g, i) => <li key={i}>{g}</li>) : <li>None</li>}
        </ul>

        <p className="font-semibold mt-2">Cards</p>
        <ul className="list-disc pl-5">
          {m.away.cards.length ? m.away.cards.map((c, i) => <li key={i}>{c}</li>) : <li>None</li>}
        </ul>
      </div>
    </div>
  );
}
