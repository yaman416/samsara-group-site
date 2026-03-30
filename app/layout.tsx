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
