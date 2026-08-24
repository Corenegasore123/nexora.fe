"use client";

import Link from "next/link";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link href="/platform-admin" className="flex items-center gap-2 font-semibold">
          <BrandMark size={18} />
          Nexora Platform
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/platform-admin/moderation" className="text-sm font-medium text-foreground-secondary hover:text-foreground">
            Moderation
          </Link>
          <button
            className="btn-secondary"
            type="button"
            onClick={async () => {
              await logout();
              router.push("/sign-in");
            }}
          >
            Sign out
          </button>
        </nav>
      </header>
      {children}
    </div>
  );
}
