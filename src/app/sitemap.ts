import type { MetadataRoute } from "next";
import { fetchRestaurants } from "@/lib/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const entries: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/discover`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/cities`, changeFrequency: "weekly", priority: 0.7 },
  ];
  try {
    let page = 1;
    let pages = 1;
    do {
      const data = await fetchRestaurants({ page: String(page), pageSize: "24", sort: "reviews" });
      pages = data.pages;
      for (const r of data.items) {
        entries.push({
          url: `${base}/restaurants/${r.slug}`,
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
      page += 1;
    } while (page <= pages && page <= 8);
  } catch {
    /* API may be down at build time */
  }
  return entries;
}
