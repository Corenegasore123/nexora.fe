import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Nexora reservations, favorites, and reviews.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main className="bg-background">{children}</main>
      <MarketingFooter />
    </>
  );
}
