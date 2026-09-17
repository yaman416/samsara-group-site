// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Samsara Group Canberra",
  description:
    "Community football, cultural events, and local updates from Samsara Group Canberra.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Samsara Group Canberra",
    title: "Samsara Group Canberra",
    description: "Community football, cultural events, and local updates from Samsara Group Canberra.",
    url: "https://samsaragroup.com.au",
    images: [
      {
        url: "https://samsaragroup.com.au/gallery/FINAL%20SPL%202025-26/645045304_122201108054559639_700231387386612553_n.jpg",
        width: 1080,
        height: 1080,
        alt: "Samsara Premier League",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samsara Group Canberra",
    description: "Community football, cultural events, and local updates from Samsara Group Canberra.",
    images: ["https://samsaragroup.com.au/gallery/FINAL%20SPL%202025-26/645045304_122201108054559639_700231387386612553_n.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Lora:wght@500;600&display=swap" rel="stylesheet" />
        <meta name="google-adsense-account" content="ca-pub-3987524290120583" />
      </head>

      <body className="min-h-screen overflow-x-hidden text-gray-900">
        {children}
        <CookieConsent />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3987524290120583"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
