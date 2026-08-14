"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, getMe, logout } from "@/lib/api";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/upload", label: "Upload", mobileOnly: true },
  { href: "/calculator", label: "Calculator", desktopOnly: true },
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
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          QuantaScope
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? "nav-link-active" : ""} ${"mobileOnly" in item && item.mobileOnly ? "md:hidden" : ""} ${"desktopOnly" in item && item.desktopOnly ? "hidden md:inline" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
          {!loading && user && (
            <div className="flex items-center gap-4 border-l border-border pl-4 md:pl-6">
              <NotificationBell />
              <span className="hidden text-xs text-foreground-muted sm:inline">{user.name}</span>
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
