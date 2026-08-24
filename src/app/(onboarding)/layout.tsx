import { BrandMark } from "@/components/BrandMark";
import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-2 border-b border-border px-6 py-4">
        <Link href="/onboarding" className="flex items-center gap-2 font-semibold">
          <BrandMark size={18} />
          Nexora
        </Link>
      </header>
      {children}
    </div>
  );
}
