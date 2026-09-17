import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/manager", "/api/"] },
    ],
    sitemap: "https://samsaragroup.com.au/sitemap.xml",
  };
}
