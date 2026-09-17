import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive · Samsara Premier League",
  description: "Past seasons, results, and history of the Samsara Premier League in Canberra.",
};

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
