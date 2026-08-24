import type { Metadata } from "next";
import { DiscoverResults } from "@/components/discover/DiscoverResults";

export const metadata: Metadata = {
  title: "Search restaurants | Nexora",
  description: "Search Nexora for restaurants, dishes, and neighborhoods.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const sp: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) sp[k] = Array.isArray(v) ? v[0] : v;
  return <DiscoverResults sp={sp} basePath="/search" />;
}
