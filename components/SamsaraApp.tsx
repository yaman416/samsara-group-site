// components/SamsaraApp.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarDays, Trophy, ListOrdered, Users, Megaphone, Building2, Shield, Home, Mail, Phone, Globe } from "lucide-react";

// -------------------- CORE DATA --------------------
const ORG = {
  name: "Samsara Group",
  tagline: "Community. Football. Support.",
  intro:
    "Samsara Group is a community-led organisation in Canberra that supports sports, culture, and youth engagement. We run events and programs that bring people together.",
  email: "info@samsaragroup.org",
  phone: "+61 4xx xxx xxx",
  location: "Canberra, ACT",
  website: "https://example.org",
};

const SPL_SEASON = {
  name: "Samsara Premier League (SPL) 2025-26",
  organiser: "Samsara Group",
  venue: "Nicholls Synthetic Soccer Field, Canberra",
  startDate: "2025-11-15",
  timezone: "Australia/Sydney",
};

// Official names
const TEAMS = [
  "Khukuri Canberra FC",
  "Phuensum FC",
  "Everest FC",
  "Azhas FC",
  "Thuenlam FC",
  "Achos Football Team",
  "Nepal United FC",
  "Queanbeyan Nepalese United Football Club",
  "JA Brothers Football Club",
  "Unity Stars FC",
  "CNFC Canberra",
  "Druk FC",
];

const SPONSORS = {
  title: [{ name: "SBA Property Group - Sbapropertygroup", url: "#" }],
  platinum: [{ name: "GTM Facility Services", url: "#" }],
  silver: [
    { name: "Nepali Haat Bazaar", url: "#" },
    { name: "Canberra Momo House - Nepalese Restaurant", url: "#" },
    { name: "Dikshant Dhungel – Real Estate Agent", url: "#" },
    { name: "The Monkey Temple", url: "#" },
    { name: "Ooshman Gungahlin", url: "#" },
  ],
  media: [
    { name: "Fan Voice TV", url: "#" },
    { name: "Lensfusion Photo & Video", url: "#" },
    { name: "Goal Lens Photography", url: "#" },
    { name: "Lenscrafters Photography", url: "#" },
    { name: "Films Yaman", url: "#" },
    { name: "Crafts by Juna", url: "#" },
  ],
};

// Fixtures incl. Ground labels
const FIXTURES = [
  // Week 1 – 15 Nov 2025
  { week: 1, date: "2025-11-15", time: "3:30 PM", home: "Nepal United FC", away: "Druk FC", ground: "Ground 1" },
  { week: 1, date: "2025-11-15", time: "3:30 PM", home: "Thuenlam FC", away: "CNFC Canberra", ground: "Ground 2" },
  { week: 1, date: "2025-11-15", time: "5:00 PM", home: "Everest FC", away: "Khukuri Canberra FC", ground: "Ground 1" },
  { week: 1, date: "2025-11-15", time: "5:00 PM", home: "Azhas FC", away: "Unity Stars FC", ground: "Ground 2" },
  { week: 1, date: "2025-11-15", time: "6:30 PM", home: "Achos Football Team", away: "Phuensum FC", ground: "Ground 1" },
  { week: 1, date: "2025-11-15", time: "6:30 PM", home: "JA Brothers Football Club", away: "Queanbeyan Nepalese United Football Club", ground: "Ground 2" },

  // Week 2 – 22 Nov 2025
  { week: 2, date: "2025-11-22", time: "3:30 PM", home: "Everest FC", away: "Phuensum FC", ground: "Ground 1" },
  { week: 2, date: "2025-11-22", time: "3:30 PM", home: "Druk FC", away: "Khukuri Canberra FC", ground: "Ground 2" },
  { week: 2, date: "2025-11-22", time: "5:00 PM", home: "Thuenlam FC", away: "Unity Stars FC", ground: "Ground 1" },
  { week: 2, date: "2025-11-22", time: "5:00 PM", home: "Achos Football Team", away: "JA Brothers Football Club", ground: "Ground 2" },
  { week: 2, date: "2025-11-22", time: "6:30 PM", home: "Azhas FC", away: "Queanbeyan Nepalese United Football Club", ground: "Ground 1" },
  { week: 2, date: "2025-11-22", time: "6:30 PM", home: "Nepal United FC", away: "CNFC Canberra", ground: "Ground 2" },

  // ... keep the rest of your weeks here exactly as before ...

  // Finals
  { week: 12, date: "2026-02-21", time: "5:00 PM", home: "SEMI FINAL 1 (1st vs 4th)", away: "", ground: "Main Pitch" },
  { week: 12, date: "2026-02-21", time: "6:30 PM", home: "SEMI FINAL 2 (2nd vs 3rd)", away: "", ground: "Main Pitch" },
  { week: 13, date: "2026-02-28", time: "5:00 PM", home: "FINAL (Winner SF1 vs Winner SF2)", away: "Trophy Ceremony", ground: "Main Pitch" },
];

const RESULTS: { matchId: string; homeGoals: number; awayGoals: number }[] = [];

// -------------------- HELPERS --------------------
function computeTable(teams: string[], fixtures: any[], results: any[]) {
  const index = Object.fromEntries(teams.map((t, i) => [t, i]));
  const rows = teams.map((name) => ({ name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0 }));
  const resultMap = Object.fromEntries(results.map((r) => [r.matchId, r]));

  fixtures.forEach((m, i) => {
    const matchId = makeMatchId(m, i);
    const r = resultMap[matchId];
    if (!r) return;
    const home = rows[index[m.home]];
    const away = rows[index[m.away]];
    if (!home || !away) return;
    home.played += 1; away.played += 1;
    home.goalsFor += r.homeGoals; home.goalsAgainst += r.awayGoals;
    away.goalsFor += r.awayGoals; away.goalsAgainst += r.homeGoals;
    home.goalDiff = home.goalsFor - home.goalsAgainst;
    away.goalDiff = away.goalsFor - away.goalsAgainst;
    if (r.homeGoals > r.awayGoals) { home.won += 1; home.points += 3; away.lost += 1; }
    else if (r.homeGoals < r.awayGoals) { away.won += 1; away.points += 3; home.lost += 1; }
    else { home.drawn += 1; away.drawn += 1; home.points += 1; away.points += 1; }
  });
  rows.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor || a.name.localeCompare(b.name));
  return rows.map((r, i) => ({ ...r, position: i + 1 }));
}

function makeMatchId(m: any, i: number) {
  const wk = m.week?.toString().padStart(2, "0");
  const h = (m.home || "").replace(/[^A-Z]/gi, "").slice(0, 4).toUpperCase();
  const a = (m.away || "").replace(/[^A-Z]/gi, "").slice(0, 4).toUpperCase();
  return `SPL25-W${wk}-${h}-${a}-${i}`;
}

const weeks = Array.from(new Set(FIXTURES.map((f) => f.week))).sort((a, b) => a - b);

function fixturesByWeek(week: number) {
  return FIXTURES.filter((m) => m.week === week).sort((a, b) => a.time.localeCompare(b.time));
}

// -------------------- APP --------------------
export default function SamsaraApp() {
  const [topTab, setTopTab] = useState("org");
  const [week, setWeek] = useState(weeks[0] || 1);
  const [teamQuery, setTeamQuery] = useState("");

  const table = useMemo(() => computeTable(TEAMS, FIXTURES, RESULTS), []);
  const filteredTeams = TEAMS.filter((t) => t.toLowerCase().includes(teamQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home size={20} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{ORG.name}</h1>
              <p className="text-xs text-gray-600">{ORG.tagline}</p>
            </div>
          </div>
          <nav>
            <Tabs value={topTab} onValueChange={setTopTab} className="hidden md:block">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="org">About</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
                <TabsTrigger value="spl">SPL 2025-26</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* About */}
        {topTab === "org" && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2 rounded-2xl">
              <CardHeader><CardTitle>Who we are</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">{ORG.intro}</p>
                <ul className="list-disc pl-5 mt-4 text-sm text-gray-700 space-y-1">
                  <li>Community events and sports days</li>
                  <li>Youth programs and volunteering</li>
                  <li>Annual Samsara Premier League</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>At a glance</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                <p><Globe className="inline mr-2" size={16}/>Website: <a className="text-blue-600 underline" href={ORG.website}>{ORG.website}</a></p>
                <p><Mail className="inline mr-2" size={16}/>Email: <a className="text-blue-600 underline" href={`mailto:${ORG.email}`}>{ORG.email}</a></p>
                <p><Phone className="inline mr-2" size={16}/>Phone: {ORG.phone}</p>
                <p>Location: {ORG.location}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 rounded-2xl">
              <CardHeader><CardTitle>Featured program</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-700">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{SPL_SEASON.name}</div>
                    <div className="text-gray-600">Venue: {SPL_SEASON.venue}</div>
                    <div className="text-gray-600">Season start: {new Date(SPL_SEASON.startDate).toLocaleDateString()}</div>
                  </div>
                  <Button onClick={() => setTopTab("spl")} className="rounded-2xl">View SPL fixtures</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Programs */}
        {topTab === "programs" && (
          <div className="grid md:grid-cols-2 gap-4">
            <ProgramCard title="Samsara Premier League" desc="Community football league running Nov to Feb." action={() => setTopTab("spl")} />
            <ProgramCard title="Youth and Volunteering" desc="Opportunities to learn, coach, and support match days." />
            <ProgramCard title="Cultural Events" desc="Festivals and community gatherings across the year." />
            <ProgramCard title="Workshops" desc="Coaching, first aid, officiating, and leadership." />
          </div>
        )}

        {/* SPL subsite */}
        {topTab === "spl" && (
          <div>
            <div className="rounded-2xl bg-white border p-5 mb-4">
              <h2 className="text-xl font-bold">{SPL_SEASON.name}</h2>
              <p className="text-sm text-gray-600">Organised by {SPL_SEASON.organiser}</p>
              <p className="text-sm text-gray-600">Venue: {SPL_SEASON.venue}</p>
              <p className="text-sm text-gray-600">Start Date: {new Date(SPL_SEASON.startDate).toLocaleDateString()}</p>
            </div>

            <Tabs defaultValue="fixtures" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 rounded-2xl sticky top-0 bg-gray-50/80 backdrop-blur">
                <TabsTrigger value="fixtures" className="flex items-center gap-2"><CalendarDays size={16}/>Fixtures</TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2"><ListOrdered size={16}/>Table</TabsTrigger>
                <TabsTrigger value="teams" className="flex items-center gap-2"><Users size={16}/>Clubs</TabsTrigger>
                <TabsTrigger value="news" className="flex items-center gap-2"><Megaphone size={16}/>Updates</TabsTrigger>
                <TabsTrigger value="sponsors" className="flex items-center gap-2"><Building2 size={16}/>Sponsors</TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2"><Shield size={16}/>About</TabsTrigger>
              </TabsList>

              {/* Fixtures */}
              <TabsContent value="fixtures">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Match Week</span>
                      <Select value={String(week)} onValueChange={(v) => setWeek(Number(v))}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Select week"/></SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          {weeks.map((w) => (<SelectItem key={w} value={String(w)}>Week {w}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fixturesByWeek(week).length === 0 ? (
                      <p className="text-gray-600">No fixtures listed for this week yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500">
                              <th className="py-2">Date</th>
                              <th className="py-2">Time</th>
                              <th className="py-2">Home</th>
                              <th className="py-2">Away</th>
                              <th className="py-2">Ground</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fixturesByWeek(week).map((m, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-2">{new Date(m.date).toLocaleDateString()}</td>
                                <td className="py-2">{m.time}</td>
                                <td className="py-2 font-medium">{m.home}</td>
                                <td className="py-2">{m.away}</td>
                                <td className="py-2">{m.ground || "TBC"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Table */}
              <TabsContent value="table">
                <Card className="rounded-2xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Trophy size={18}/> League Table</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 text-left">
                            <th className="py-2">Pos</th>
                            <th className="py-2">Club</th>
                            <th className="py-2">P</th>
                            <th className="py-2">W</th>
                            <th className="py-2">D</th>
                            <th className="py-2">L</th>
                            <th className="py-2">GF</th>
                            <th className="py-2">GA</th>
                            <th className="py-2">GD</th>
                            <th className="py-2">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.map((row) => (
                            <tr key={row.name} className="border-t">
                              <td className="py-2 font-semibold">{row.position}</td>
                              <td className="py-2 font-medium">{row.name}</td>
                              <td className="py-2">{row.played}</td>
                              <td className="py-2">{row.won}</td>
                              <td className="py-2">{row.drawn}</td>
                              <td className="py-2">{row.lost}</td>
                              <td className="py-2">{row.goalsFor}</td>
                              <td className="py-2">{row.goalsAgainst}</td>
                              <td className="py-2">{row.goalDiff}</td>
                              <td className="py-2">{row.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Add results to update the table automatically.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Clubs */}
              <TabsContent value="teams">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Participating Clubs
                      <Input className="w-60" placeholder="Search clubs" value={teamQuery} onChange={(e) => setTeamQuery(e.target.value)} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTeams.map((t) => (
                        <div key={t} className="rounded-2xl bg-white border p-4 shadow-sm">
                          <div className="text-lg font-semibold">{t}</div>
                          <div className="text-sm text-gray-600">SPL 2025-26 competitor</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* News */}
              <TabsContent value="news">
                <Card className="rounded-2xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Megaphone size={18}/> News and Match Week Updates</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="rounded-2xl bg-white border p-4 shadow-sm">Season kickoff on {new Date(SPL_SEASON.startDate).toLocaleDateString()} at {SPL_SEASON.venue}.</li>
                      <li className="rounded-2xl bg-white border p-4 shadow-sm">Post scores after each match to refresh the table.</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sponsors */}
              <TabsContent value="sponsors">
                <Card className="rounded-2xl">
                  <CardHeader><CardTitle className="flex items-center gap-2"><Building2 size={18}/> Sponsors and Partners</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <Section title="Title Sponsor"><SponsorGrid items={SPONSORS.title} badge="Title"/></Section>
                    <Section title="Platinum Sponsor"><SponsorGrid items={SPONSORS.platinum} badge="Platinum"/></Section>
                    <Section title="Silver Sponsors"><SponsorGrid items={SPONSORS.silver} badge="Silver"/></Section>
                    <Section title="Media & Creative Partners"><SponsorGrid items={SPONSORS.media} badge="Media"/></Section>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* About SPL */}
              <TabsContent value="about">
                <Card className="rounded-2xl">
                  <CardHeader><CardTitle>About SPL</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">SPL is a community football competition in Canberra. Edit fixtures and results at the top of this file to keep information current.</p>
                    <ul className="list-disc text-sm text-gray-700 pl-5 mt-3 space-y-1">
                      <li>Update fixtures weekly</li>
                      <li>Add completed scores to RESULTS</li>
                      <li>Keep club names consistent</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Contact */}
        {topTab === "contact" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Contact Samsara Group</CardTitle></CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-2">
                <p>Email: <a href={`mailto:${ORG.email}`} className="text-blue-600 underline">{ORG.email}</a></p>
                <p>Phone: {ORG.phone}</p>
                <p>Location: {ORG.location}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Send a message</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Your name" />
                <Input placeholder="Your email" />
                <Textarea placeholder="Your message" />
                <Button className="rounded-2xl">Submit</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {ORG.name}. All rights reserved.
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
}

function SponsorGrid({ items, badge }: { items: { name: string; url?: string }[]; badge: string }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((s) => (
        <div key={s.name} className="rounded-2xl bg-white border p-4 shadow-sm">
          <div className="text-sm font-medium">{s.name}</div>
          <div className="text-xs text-gray-500 mt-1">{badge}</div>
          {s.url && s.url !== "#" ? (
            <a href={s.url} className="text-xs text-blue-600 underline mt-2 inline-block">Visit</a>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ProgramCard({ title, desc, action }: { title: string; desc: string; action?: () => void }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="text-sm text-gray-700">
        <p>{desc}</p>
        {action && <Button className="mt-3 rounded-2xl" onClick={action}>Open</Button>}
      </CardContent>
    </Card>
  );
}
