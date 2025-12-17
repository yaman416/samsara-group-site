// components/FixturesResultsSection.tsx
"use client";

import { useState, useMemo, memo } from "react";
import { FIXTURES, RESULTS, TEAM_LOGOS, MATCH_FACTS, getRounds } from "@/lib/splData";
import Modal from "@/components/Modal";
import { ListOrdered } from "lucide-react";

type ResultMap = Record<string, { homeGoals: number; awayGoals: number }>;

export default function FixturesResultsSection() {
  const rounds = getRounds();

  const today = new Date();
  const firstUpcomingFixture = FIXTURES.find((f) => new Date(f.date) >= today);
  const defaultRound = firstUpcomingFixture ? firstUpcomingFixture.round : rounds[0];

  const [selectedRound, setSelectedRound] = useState<number>(defaultRound);
  const [openMatchId, setOpenMatchId] = useState<string | null>(null);

  const resultMap: ResultMap = useMemo(
    () =>
      Object.fromEntries(
        RESULTS.map((r) => [r.fixtureId, { homeGoals: r.homeGoals, awayGoals: r.awayGoals }]),
      ),
    [],
  );

  const fixtures = useMemo(
    () => FIXTURES.filter((f) => f.round === selectedRound).sort((a, b) => a.time.localeCompare(b.time)),
    [selectedRound],
  );

  const nextUpcomingRound = firstUpcomingFixture?.round || rounds[0];

  function logo(team: string) {
    return TEAM_LOGOS[team] || "";
  }

  function isBye(team: string) {
    return team.toUpperCase() === "BYE";
  }

  return (
    <section id="fixturesResults" className="mt-12">
      <div className="rounded-3xl border bg-white px-4 py-7 shadow-sm sm:px-6 md:px-8">
        <div className="mb-5 text-center">
          <h2 className="inline-flex items-center justify-center gap-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            <ListOrdered size={22} className="text-orange-600" />
            <span>SPL Fixtures &amp; Results</span>
          </h2>
          <p className="mt-2 mx-auto max-w-2xl text-xs text-gray-600 md:text-sm">
            Weekly fixtures, final scores, and match facts for the Samsara Premier League.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Week</span>
            <select
              value={selectedRound}
              onChange={(e) => setSelectedRound(Number(e.target.value))}
              className="rounded-lg border px-3 py-2 text-sm shadow-sm"
            >
              {rounds.map((r) => (
                <option key={r} value={r}>
                  Week {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3 text-center text-xs text-gray-600">
          <span className="rounded-full border border-orange-600 px-3 py-1 text-orange-600">
            Upcoming Week: {nextUpcomingRound}
          </span>
        </div>

        <p className="mb-5 text-center text-xs text-gray-600 md:text-sm">
          Fixtures are updated weekly. Final scores and match facts are added after each match is completed and confirmed by the organisers.
        </p>

        <div className="space-y-4">
          {fixtures.map((f) => {
            const res = resultMap[f.id];
            const isFinished = !!res;
            const hasFacts = !!MATCH_FACTS[f.id];

            const homeLogo = logo(f.home);
            const awayLogo = logo(f.away);

            return (
              <div key={f.id} className="rounded-xl border bg-white p-4 shadow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Home */}
                  <div className="flex min-w-[40%] items-center gap-2">
                    {homeLogo ? (
                      <img src={homeLogo} className="h-7 w-7 rounded-full border" alt={f.home} />
                    ) : (
                      <div className="h-7 w-7 rounded-full border bg-slate-100" />
                    )}
                    <span className="text-sm font-semibold">{f.home}</span>
                    {isBye(f.home) && (
                      <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
                        BYE
                      </span>
                    )}
                  </div>

                  {/* Centre */}
                  <div className="flex-1 text-center">
                    {isFinished ? (
                      <span className="text-lg font-bold">
                        {res.homeGoals}
                        <span className="mx-1 text-[10px] text-gray-500">FT</span>
                        {res.awayGoals}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-600">vs</span>
                    )}
                    <div className="mt-1 text-[10px] text-gray-600">
                      Week {f.round} • {f.date} • {f.time}
                    </div>
                  </div>

                  {/* Away */}
                  <div className="flex min-w-[40%] items-center justify-end gap-2">
                    {isBye(f.away) && (
                      <span className="mr-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
                        BYE
                      </span>
                    )}
                    <span className="text-right text-sm font-semibold">{f.away}</span>
                    {awayLogo ? (
                      <img src={awayLogo} className="h-7 w-7 rounded-full border" alt={f.away} />
                    ) : (
                      <div className="h-7 w-7 rounded-full border bg-slate-100" />
                    )}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                  <span>
                    Ground: <strong>{f.ground}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {!isFinished && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] text-green-700">
                        Upcoming fixture
                      </span>
                    )}

                    {isFinished && hasFacts && (
                      <button
                        onClick={() => {
                          setOpenMatchId("loading-" + f.id);
                          setTimeout(() => setOpenMatchId(f.id), 50);
                        }}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
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
      </div>

      <Modal open={!!openMatchId} onClose={() => setOpenMatchId(null)}>
        {openMatchId ? (
          openMatchId.startsWith("loading-") ? (
            <p className="text-sm text-slate-50">Loading match details...</p>
          ) : (
            <MemoMatchFacts matchId={openMatchId} />
          )
        ) : null}
      </Modal>
    </section>
  );
}

function CardIcons({ text }: { text: string }) {
  const lower = text.toLowerCase();
  const icons: ("yellow" | "red")[] = [];

  if (lower.includes("yellow")) icons.push("yellow");
  if (lower.includes("red")) icons.push("red");

  if (!icons.length) return null;

  return (
    <span className="mr-1 inline-flex items-center gap-1">
      {icons.map((type, idx) => (
        <span
          key={idx}
          className={`inline-block h-3 w-2.5 rounded-[2px] ${
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
    <div className="space-y-6 text-sm text-slate-50">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-[35%] items-center gap-2">
          {homeLogo && (
            <img
              src={homeLogo}
              alt={homeTeam}
              className="h-9 w-9 rounded-full border border-white/20"
            />
          )}
          <span className="text-sm font-semibold">{homeTeam}</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          {res && (
            <p className="mb-1 text-2xl font-bold leading-none">
              {res.homeGoals} - {res.awayGoals}
            </p>
          )}
          <p className="text-[11px] text-slate-400">
            Week {fixture.round} • {fixture.date} • {fixture.time}
          </p>
        </div>

        <div className="flex min-w-[35%] items-center justify-end gap-2">
          <span className="text-right text-sm font-semibold">{awayTeam}</span>
          {awayLogo && (
            <img
              src={awayLogo}
              alt={awayTeam}
              className="h-9 w-9 rounded-full border border-white/20"
            />
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] uppercase tracking-wide text-slate-400">Goals</h4>
        <div className="grid grid-cols-2 gap-4">
          <ul className="space-y-1 text-left">
            {d.home.scorers.length ? (
              d.home.scorers.map((s, i) => (
                <li key={i} className="flex items-center gap-1">
                  <span className="mr-1">⚽</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400">No goals</li>
            )}
          </ul>

          <ul className="space-y-1 text-right">
            {d.away.scorers.length ? (
              d.away.scorers.map((s, i) => (
                <li key={i} className="flex items-center justify-end gap-1">
                  <span>{s}</span>
                  <span className="ml-1">⚽</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400">No goals</li>
            )}
          </ul>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-[11px] uppercase tracking-wide text-slate-400">Cards</h4>
        <div className="grid grid-cols-2 gap-4">
          <ul className="space-y-1 text-left">
            {d.home.cards.length ? (
              d.home.cards.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  <CardIcons text={c} />
                  <span>{c}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400">No cards</li>
            )}
          </ul>

          <ul className="space-y-1 text-right">
            {d.away.cards.length ? (
              d.away.cards.map((c, i) => (
                <li key={i} className="flex items-center justify-end gap-1">
                  <span>{c}</span>
                  <CardIcons text={c} />
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400">No cards</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

const MemoMatchFacts = memo(MatchFacts);
