import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery · Samsara Group Canberra",
  description: "Photos and highlights from Samsara Premier League matches and community events in Canberra.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
