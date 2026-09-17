import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co",
      "frame-src https://googleads.g.doubleclick.net",
    ].join("; "),
  },
];

// 301 redirects for old Season 2 club URL slugs → new short_code slugs
const clubRedirects = [
  { source: "/clubs/khukuri",     destination: "/clubs/khk" },
  { source: "/clubs/thuenlam",    destination: "/clubs/thl" },
  { source: "/clubs/azhas",       destination: "/clubs/azh" },
  { source: "/clubs/queanbeyan",  destination: "/clubs/qnu" },
  { source: "/clubs/jabrothers",  destination: "/clubs/jab" },
  { source: "/clubs/everest",     destination: "/clubs/evr" },
  { source: "/clubs/phuensum",    destination: "/clubs/phu" },
  { source: "/clubs/yeedzin",     destination: "/clubs/ydz" },
  { source: "/clubs/ace",         destination: "/clubs/ace" },
  { source: "/clubs/bicchi",      destination: "/clubs/bic" },
  { source: "/clubs/friends",     destination: "/clubs/frd" },
  { source: "/clubs/brosandball", destination: "/clubs/bab" },
].map(r => ({ ...r, permanent: true }));

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: projectRoot,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return clubRedirects;
  },
};

export default nextConfig;
