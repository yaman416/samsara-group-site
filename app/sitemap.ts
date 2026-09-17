import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://samsaragroup.com.au";

  const { data: clubs } = await supabaseAdmin
    .from("clubs")
    .select("short_code, id")
    .order("name");

  const clubUrls = (clubs ?? []).map(c => ({
    url: `${base}/clubs/${c.short_code.toLowerCase()}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/season`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/clubs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/gallery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/partners`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/register`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/archive`, changeFrequency: "monthly", priority: 0.4 },
    ...clubUrls,
  ];
}
