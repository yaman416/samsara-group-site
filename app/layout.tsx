// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Samsara Group - Canberra",
  description: "Fostering Community, Empowering Growth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_CLIENT_ID"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
