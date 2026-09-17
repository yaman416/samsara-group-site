import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Your Club · Samsara Premier League",
  description: "Register your club to compete in the Samsara Premier League, Canberra's community football competition for the Nepalese and Bhutanese communities.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
