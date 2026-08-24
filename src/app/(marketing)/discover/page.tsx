import type { Metadata } from "next";
import { DiscoverResults } from "@/components/discover/DiscoverResults";

export const metadata: Metadata = {
  title: "Discover restaurants | Nexora",
  description: "Search restaurants by city, cuisine, price, and live table availability.",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const sp: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) sp[k] = Array.isArray(v) ? v[0] : v;
  return <DiscoverResults sp={sp} />;
}
