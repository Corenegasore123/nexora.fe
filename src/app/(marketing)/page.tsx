import type { Metadata } from "next";
import { DiscoverHome } from "@/components/discover/DiscoverHome";

export const metadata: Metadata = {
  title: { absolute: "Nexora — Discover where to eat. Book your table." },
  description: "Find restaurants across Rwanda and book a table.",
};

export default function HomePage() {
  return <DiscoverHome />;
}
