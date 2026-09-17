import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Samsara Group Canberra",
  description: "Learn about Samsara Group Canberra, organising football and cultural events for the Nepalese and Bhutanese communities in the ACT.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
