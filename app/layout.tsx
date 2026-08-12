// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Samsara Group Canberra",
  description:
    "Community football, cultural events, and local updates from Samsara Group Canberra.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Lora:wght@500;600&display=swap" rel="stylesheet" />
        {/* Google AdSense Verification Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3987524290120583"
          crossOrigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-3987524290120583"></meta>
      </head>

      <body className="min-h-screen overflow-x-hidden text-gray-900">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
