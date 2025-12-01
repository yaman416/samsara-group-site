// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Samsara Group - Canberra",
  description: "Fostering Community, Empowering Growth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google AdSense Verification Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3987524290120583"
          crossOrigin="anonymous"
        ></script>
        <meta name="google-adsense-account" content="ca-pub-3987524290120583"></meta>
      </head>

      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
