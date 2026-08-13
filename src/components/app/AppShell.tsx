"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, getMe, logout } from "@/lib/api";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  section?: string;
  adminOnly?: boolean;
};

const NAV: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: "◉", section: "Overview" },
  { href: "/app/projects", label: "Projects", icon: "◫", section: "Overview" },
  { href: "/app/calculator", label: "New Calculation", icon: "⊕", section: "Analysis" },
  { href: "/app/history", label: "History", icon: "◷", section: "Analysis" },
  { href: "/app/reports", label: "Reports", icon: "▣", section: "Output" },
  { href: "/app/rules", label: "Rules", icon: "⚙", section: "System" },
  { href: "/app/admin", label: "Admin", icon: "◈", section: "System", adminOnly: true },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({
  user,
  mobileOpen,
  onClose,
}: {
  user: AuthUser | null;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
    router.refresh();
  };

  let lastSection = "";

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-16" : "lg:w-64"}`}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link href="/app" className="text-base font-bold text-foreground" onClick={onClose}>
              QuantScope
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded p-1 text-foreground-muted hover:bg-pending-bg lg:block"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.filter((item) => !item.adminOnly || user?.role === "ADMIN").map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            return (
              <div key={item.href}>
                {showSection && !collapsed && (
                  <p className="mb-2 mt-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-foreground-placeholder first:mt-0">
                    {item.section}
                  </p>
                )}
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive(pathname, item.href)
                      ? "bg-selected font-medium text-primary"
                      : "text-foreground-secondary hover:bg-pending-bg hover:text-foreground"
                  }`}
                >
                  <span className="w-4 shrink-0 text-center text-xs">{item.icon}</span>
                  {!collapsed && item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          {user && !collapsed && (
            <p className="truncate px-2 text-xs font-medium text-foreground">{user.name}</p>
          )}
          <Link
            href="/app/profile"
            onClick={onClose}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-secondary hover:bg-pending-bg"
          >
            <span className="w-4 text-center text-xs">👤</span>
            {!collapsed && "Profile"}
          </Link>
          <Link
            href="/app/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-secondary hover:bg-pending-bg"
          >
            <span className="w-4 text-center text-xs">⚙</span>
            {!collapsed && "Settings"}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-secondary hover:bg-pending-bg"
          >
            <span className="w-4 text-center text-xs">↪</span>
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}

export function AppTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded p-2 text-foreground-muted hover:bg-pending-bg lg:hidden"
        aria-label="Open menu"
      >
        ☰
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell />
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar user={user} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
