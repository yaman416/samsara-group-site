// components/UpcomingFixturesSection.tsx
"use client";

import { useMemo, useState } from "react";
import { FIXTURES, TEAM_LOGOS, type Fixture } from "@/lib/splData";

type RoundTab = {
  round: number;
  label: string;
  dateLabel: string;
};

type ActiveFixture = {
  fixture: Fixture;
};

function buildRoundTabs(): RoundTab[] {
  const rounds = Array.from(new Set(FIXTURES.map((f) => f.round))).sort(
    (a, b) => a - b,
  );

  return rounds.map((round) => {
    const fixtures = FIXTURES.filter((f) => f.round === round);
    const first = fixtures[0];
    let dateLabel = `Week ${round}`;
    if (first) {
      const d = new Date(first.date + "T00:00:00");
      dateLabel = d.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    }
    return {
      round,
      label: `Week ${round}`,
      dateLabel,
    };
  });
}

function findNextRound(): number {
  const today = new Date();
  let bestRound = 1;
  let bestDate: Date | null = null;

  for (const round of new Set(FIXTURES.map((f) => f.round))) {
    const fixtures = FIXTURES.filter((f) => f.round === round);
    if (fixtures.length === 0) continue;
    const earliest = fixtures
      .map((f) => new Date(f.date + "T00:00:00"))
      .sort((a, b) => a.getTime() - b.getTime())[0];

    if (earliest >= today) {
      if (!bestDate || earliest < bestDate) {
        bestDate = earliest;
        bestRound = round;
      }
    }
  }

  return bestRound;
}

function FixtureModal({
  active,
  onClose,
}: {
  active: ActiveFixture | null;
  onClose: () => void;
}) {
  if (!active) return null;
  const { fixture } = active;
  const homeLogo = TEAM_LOGOS[fixture.home];
  const awayLogo = TEAM_LOGOS[fixture.away];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-gray-900 text-gray-100 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:bg-gray-700"
        >
          Close
        </button>

        <div className="px-6 pb-5 pt-6">
          <div className="flex items-center justify-between gap-4">
            {/* Home */}
            <div className="flex flex-1 flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                {homeLogo && (
                  <img
                    src={homeLogo}
                    alt={fixture.home}
                    className="h-9 w-9 rounded-full border border-gray-700 bg-white object-contain"
                  />
                )}
                <span className="text-sm font-semibold">
                  {fixture.home}
                </span>
              </div>
            </div>

            {/* Centre */}
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <div className="flex items-center gap-3 text-2xl font-semibold">
                <span>vs</span>
              </div>
              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                Upcoming fixture
              </span>
              <div className="mt-1 text-[11px] text-gray-400">
                Round {fixture.round} · {fixture.date} · {fixture.time}
              </div>
              <div className="text-[11px] text-gray-500">
                {fixture.ground}
              </div>
            </div>

            {/* Away */}
            <div className="flex flex-1 flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-right">
                  {fixture.away}
                </span>
                {awayLogo && (
                  <img
                    src={awayLogo}
                    alt={fixture.away}
                    className="h-9 w-9 rounded-full border border-gray-700 bg-white object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-800" />

        <div className="px-6 py-4 text-xs md:text-sm text-gray-300">
          <p>
            This match is part of the Samsara Premier League regular
            season. Kick off is scheduled for {fixture.time} on{" "}
            {fixture.date} at {fixture.ground}.
          </p>
          <p className="mt-2 text-[11px] text-gray-400">
            Line ups, live updates, and full match facts will appear
            here after the game has been played.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UpcomingFixturesSection() {
  const tabs = useMemo(() => buildRoundTabs(), []);
  const nextRound = useMemo(() => findNextRound(), []);
  const [selectedRound, setSelectedRound] = useState<number>(nextRound);
  const [activeFixture, setActiveFixture] =
    useState<ActiveFixture | null>(null);

  const fixturesForRound = useMemo(
    () =>
      FIXTURES.filter((f) => f.round === selectedRound).sort((a, b) =>
        a.time.localeCompare(b.time),
      ),
    [selectedRound],
  );

  const selectedTab = tabs.find((t) => t.round === selectedRound);

  return (
    <section
      id="fixtures"
      className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Fixtures
          </h2>
          <p className="text-xs text-gray-500">
            Select a week to see all fixtures. Next upcoming week is
            highlighted.
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end text-[11px] text-gray-500">
          <span className="font-medium">
            Next week: {nextRound > 0 ? `Week ${nextRound}` : "TBA"}
          </span>
          {selectedTab && (
            <span>Showing: {selectedTab.label}</span>
          )}
        </div>
      </div>

      {/* Week selector */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = tab.round === selectedRound;
          const isNext = tab.round === nextRound;
          return (
            <button
              key={tab.round}
              onClick={() => setSelectedRound(tab.round)}
              className={[
                "flex flex-col items-start rounded-xl border px-3 py-2 min-w-[90px] text-left text-xs transition-colors",
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50/60",
              ].join(" ")}
            >
              <span className="font-semibold">{tab.label}</span>
              <span className="text-[11px] text-gray-500">
                {tab.dateLabel}
              </span>
              {isNext && (
                <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100 px-2 py-[2px] text-[10px] font-semibold text-emerald-700">
                  Upcoming week
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fixture list */}
      <div className="mt-4 space-y-2">
        {fixturesForRound.length === 0 ? (
          <p className="text-xs text-gray-500">
            No fixtures found for this week.
          </p>
        ) : (
          fixturesForRound.map((fixture) => {
            const homeLogo = TEAM_LOGOS[fixture.home];
            const awayLogo = TEAM_LOGOS[fixture.away];

            return (
              <div
                key={fixture.id}
                className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs md:text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {/* Home */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {homeLogo && (
                          <img
                            src={homeLogo}
                            alt={fixture.home}
                            className="h-6 w-6 rounded-full border border-gray-200 bg-white object-contain"
                          />
                        )}
                        <span className="font-medium text-gray-800">
                          {fixture.home}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        Home
                      </span>
                    </div>

                    {/* Away */}
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {awayLogo && (
                          <img
                            src={awayLogo}
                            alt={fixture.away}
                            className="h-6 w-6 rounded-full border border-gray-200 bg-white object-contain"
                          />
                        )}
                        <span className="font-medium text-gray-800">
                          {fixture.away}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        Away
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 text-[11px] text-gray-500 whitespace-nowrap">
                    <div>{fixture.date}</div>
                    <div>{fixture.time}</div>
                    <div>Round {fixture.round}</div>
                    <button
                      type="button"
                      onClick={() => setActiveFixture({ fixture })}
                      className="mt-1 inline-flex items-center rounded-full border border-emerald-600 px-2 py-[3px] text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      Match centre
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <FixtureModal
        active={activeFixture}
        onClose={() => setActiveFixture(null)}
      />
    </section>
  );
}
