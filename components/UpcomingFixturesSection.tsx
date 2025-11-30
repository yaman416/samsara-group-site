// components/UpcomingFixturesSection.tsx
"use client";

import { useState } from "react";
import { FIXTURES, TEAM_LOGOS, MATCH_FACTS } from "@/lib/splData";
import Modal from "@/components/Modal";

export default function UpcomingFixturesSection() {
  const weeks = [...new Set(FIXTURES.map((f) => f.round))];
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]);
  const [openMatchId, setOpenMatchId] = useState<string | null>(null);

  const fixtures = FIXTURES.filter((f) => f.round === selectedWeek);

  function logo(team: string) {
    return TEAM_LOGOS[team] || "";
  }

  return (
    <section id="fixtures" className="mt-12">
      <h2 className="text-xl font-bold mb-4">Upcoming Fixtures</h2>

      {/* Week Selector */}
      <div className="mb-4">
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          {weeks.map((w) => (
            <option key={w} value={w}>
              Week {w}
            </option>
          ))}
        </select>
      </div>

      {/* Fixtures */}
      <div className="space-y-4">
        {fixtures.map((f) => (
          <div key={f.id} className="bg-white p-4 shadow rounded-xl">
            {/* Team Row */}
            <div className="flex items-center justify-between">
              {/* Home */}
              <div className="flex items-center gap-2">
                <img src={logo(f.home)} className="w-7 h-7 rounded" alt="" />
                <span className="font-semibold text-sm">{f.home}</span>
              </div>

              <span className="font-bold text-gray-700 text-sm">vs</span>

              {/* Away */}
              <div className="flex items-center gap-2">
                <img src={logo(f.away)} className="w-7 h-7 rounded" alt="" />
                <span className="font-semibold text-sm">{f.away}</span>
              </div>
            </div>

            {/* Match Info */}
            <div className="text-xs text-gray-600 mt-2">
              {f.date} • {f.time} • {f.ground}
            </div>

            {/* Match Facts button (only if data exists) */}
            {MATCH_FACTS[f.id] && (
              <button
                onClick={() => setOpenMatchId(f.id)}
                className="mt-3 text-xs bg-blue-600 text-white px-3 py-1 rounded-md"
              >
                Match Facts
              </button>
            )}
          </div>
        ))}
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
  if (!d) return <p>No data available.</p>;

  return (
    <div className="text-sm space-y-5">
      {/* HOME TEAM */}
      <div>
        <h3 className="font-bold mb-2">Home Team</h3>
        <p className="font-semibold">Goals</p>
        <ul className="list-disc pl-5">
          {d.home.scorers.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <p className="font-semibold mt-2">Cards</p>
        <ul className="list-disc pl-5">
          {d.home.cards.length ? (
            d.home.cards.map((c, i) => <li key={i}>{c}</li>)
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>

      {/* AWAY TEAM */}
      <div>
        <h3 className="font-bold mb-2">Away Team</h3>
        <p className="font-semibold">Goals</p>
        <ul className="list-disc pl-5">
          {d.away.scorers.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <p className="font-semibold mt-2">Cards</p>
        <ul className="list-disc pl-5">
          {d.away.cards.length ? (
            d.away.cards.map((c, i) => <li key={i}>{c}</li>)
          ) : (
            <li>None</li>
          )}
        </ul>
      </div>
    </div>
  );
}
