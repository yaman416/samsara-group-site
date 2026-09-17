import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · Samsara Group Canberra",
  description: "Privacy policy for Samsara Group Canberra website.",
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
