"use client";

import { useState, useMemo } from "react";
import { FIXTURES, TEAM_LOGOS, MATCH_FACTS } from "@/lib/splData";
import Modal from "@/components/Modal";

export default function UpcomingFixturesSection() {
  // Available weeks
  const weeks = [...new Set(FIXTURES.map(f => f.round))];

  // Auto detect the next upcoming week
  const today = new Date();
  const nextWeek =
    weeks.find(week =>
      FIXTURES.some(f => f.round === week && new Date(f.date) >= today)
    ) ?? weeks[0];

  const [selectedWeek, setSelectedWeek] = useState(nextWeek);
  const [openMatchId, setOpenMatchId] = useState<string | null>(null);

  // Fixtures for selected week
  const fixtures = useMemo(
    () => FIXTURES.filter(f => f.round === selectedWeek),
    [selectedWeek]
  );

  function logo(team: string) {
    return TEAM_LOGOS[team] || "/team/default.png";
  }

  return (
    <section id="fixtures" className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Fixtures</h2>

        {/* Week selector */}
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg text-sm bg-white"
        >
          {weeks.map(w => (
            <option key={w} value={w}>
              Week {w} {w === nextWeek ? "(Upcoming)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Fixtures List */}
      <div className="space-y-4">
        {fixtures.map(f => (
          <div
            key={f.id}
            className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3"
          >
            {/* Team vs Team */}
            <div className="flex justify-between items-center">
              {/* Home */}
              <div className="flex items-center gap-3 w-1/3">
                <img src={logo(f.home)} className="w-8 h-8 rounded-full" />
                <span className="font-semibold text-sm">{f.home}</span>
              </div>

              <span className="font-bold text-gray-700 text-sm">vs</span>

              {/* Away */}
              <div className="flex items-center gap-3 w-1/3 justify-end">
                <span className="font-semibold text-sm">{f.away}</span>
                <img src={logo(f.away)} className="w-8 h-8 rounded-full" />
              </div>
            </div>

            {/* Match info */}
            <div className="text-xs text-gray-600 text-center">
              {f.date} • {f.time} • {f.ground}
            </div>

            {/* Match Facts only if exists */}
            {MATCH_FACTS[f.id] && (
              <button
                onClick={() => setOpenMatchId(f.id)}
                className="text-xs bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1 rounded-md w-fit mx-auto"
              >
                Match Facts
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={!!openMatchId} onClose={() => setOpenMatchId(null)}>
        {openMatchId && (
          <MatchFacts matchId={openMatchId} />
        )}
      </Modal>
    </section>
  );
}

function MatchFacts({ matchId }: { matchId: string }) {
  const m = MATCH_FACTS[matchId];
  if (!m) return <p className="text-sm">No match facts found.</p>;

  return (
    <div className="space-y-6 text-sm">
      {/* HOME */}
      <div>
        <h3 className="font-bold text-base mb-1">Home Team</h3>

        <p className="font-medium">Goals</p>
        <ul className="list-disc pl-5">
          {m.home.scorers.length
            ? m.home.scorers.map((g, i) => <li key={i}>{g}</li>)
            : <li>None</li>}
        </ul>

        <p className="font-medium mt-3">Cards</p>
        <ul className="list-disc pl-5">
          {m.home.cards.length
            ? m.home.cards.map((c, i) => <li key={i}>{c}</li>)
            : <li>None</li>}
        </ul>
      </div>

      {/* AWAY */}
      <div>
        <h3 className="font-bold text-base mb-1">Away Team</h3>

        <p className="font-medium">Goals</p>
        <ul className="list-disc pl-5">
          {m.away.scorers.length
            ? m.away.scorers.map((g, i) => <li key={i}>{g}</li>)
            : <li>None</li>}
        </ul>

        <p className="font-medium mt-3">Cards</p>
        <ul className="list-disc pl-5">
          {m.away.cards.length
            ? m.away.cards.map((c, i) => <li key={i}>{c}</li>)
            : <li>None</li>}
        </ul>
      </div>
    </div>
  );
}
