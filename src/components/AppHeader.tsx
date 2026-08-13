"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, getMe, logout } from "@/lib/api";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/calculator", label: "Calculator" },
  { href: "/calculations", label: "History" },
  { href: "/rules", label: "Rules" },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .finally(() => setLoading(false));
  }, [isAuthPage, pathname]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          QuantScope
        </Link>
        <nav className="flex items-center gap-8">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
          {!loading && user && (
            <div className="flex items-center gap-4 border-l border-border pl-6">
              <span className="hidden text-xs text-neutral-500 sm:inline">{user.name}</span>
              <button type="button" onClick={handleLogout} className="nav-link">
                Log out
              </button>
            </div>
          )}
          {!loading && !user && (
            <Link href="/login" className="btn-secondary py-2 text-xs">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
