import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Season 3 · Samsara Premier League",
  description: "Fixtures, results, standings, and clubs for Season 3 of the Samsara Premier League, Canberra.",
};

export default function SeasonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
