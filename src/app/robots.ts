import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/app", "/platform-admin", "/onboarding", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
