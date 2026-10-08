import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match Centre · Samsara Premier League",
};

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
