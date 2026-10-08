import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Portal · Samsara Premier League",
  robots: { index: false, follow: false },
};

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
