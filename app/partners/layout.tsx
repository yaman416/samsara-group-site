import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners · Samsara Group Canberra",
  description: "Sponsors and partners supporting Samsara Group and the Samsara Premier League in Canberra.",
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
