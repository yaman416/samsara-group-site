import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clubs · Samsara Premier League",
  description: "All clubs competing in the Samsara Premier League, representing Canberra's Nepalese and Bhutanese communities.",
};

export default function ClubsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
