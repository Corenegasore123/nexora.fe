"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, getMe, logout } from "@/lib/api";
import { NotificationBell } from "@/components/NotificationBell";
import { Icon, type IconName } from "@/components/icons/Icon";
import { AppPageProvider, useAppPageMeta } from "@/components/app/AppPageContext";

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  section?: string;
  adminOnly?: boolean;
};

const NAV: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: "layout-dashboard", section: "Overview" },
  { href: "/app/projects", label: "Projects", icon: "folder", section: "Overview" },
  { href: "/app/calculator", label: "New Calculation", icon: "plus-circle", section: "Analysis" },
  { href: "/app/history", label: "History", icon: "history", section: "Analysis" },
  { href: "/app/reports", label: "Reports", icon: "file-text", section: "Output" },
  { href: "/app/rules", label: "Rules", icon: "book-open", section: "System" },
  { href: "/app/admin", label: "Admin", icon: "shield", section: "System", adminOnly: true },
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
          className="fixed inset-0 z-40 bg-[#354554]/40 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}
      <aside
        className={`app-sidebar lg:relative ${collapsed ? "app-sidebar-collapsed" : ""} ${mobileOpen ? "app-sidebar-mobile app-sidebar-mobile-open" : "app-sidebar-mobile"} lg:translate-x-0`}
      >
        <div className="app-sidebar-header">
          {!collapsed && (
            <Link href="/app" className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
              <span className="app-sidebar-logo-mark">QS</span>
              <span className="app-sidebar-logo-text">QuantScope</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:block"
            aria-label="Toggle sidebar"
          >
            <Icon name="menu" size={18} />
          </button>
        </div>

        <nav className="app-nav-body">
          {NAV.filter((item) => !item.adminOnly || user?.role === "ADMIN").map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            const active = isActive(pathname, item.href);
            return (
              <div key={item.href}>
                {showSection && !collapsed && <p className="app-nav-section">{item.section}</p>}
                <Link
                  href={item.href}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                  className={`app-nav-link ${active ? "app-nav-link-active" : ""}`}
                >
                  <Icon name={item.icon} size={18} className={active ? "text-accent" : "text-white/50"} />
                  {!collapsed && item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="app-sidebar-footer">
          {user && !collapsed && <p className="app-sidebar-user">{user.name}</p>}
          <Link href="/app/profile" onClick={onClose} className="app-sidebar-footer-link mt-2">
            <Icon name="user" size={18} className="text-white/50" />
            {!collapsed && "Profile"}
          </Link>
          <Link href="/app/settings" onClick={onClose} className="app-sidebar-footer-link">
            <Icon name="settings" size={18} className="text-white/50" />
            {!collapsed && "Settings"}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`app-sidebar-signout ${collapsed ? "!mt-2 !px-2" : ""}`}
            title={collapsed ? "Sign out" : undefined}
          >
            <Icon name="log-out" size={18} className="app-sidebar-signout-icon shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}

export function AppTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { title, subtitle } = useAppPageMeta();

  return (
    <header className="app-topbar backdrop-blur-sm">
      <button type="button" onClick={onMenuClick} className="app-icon-btn shrink-0 lg:hidden" aria-label="Open menu">
        <Icon name="menu" size={20} />
      </button>
      <div className="app-topbar-title-wrap">
        <h1 className="app-topbar-title">{title}</h1>
        {subtitle && <p className="app-topbar-subtitle">{subtitle}</p>}
      </div>
      <div className="app-topbar-actions">
        <NotificationBell />
      </div>
    </header>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <div className="app-shell-bg flex min-h-screen">
      <AppSidebar user={user} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppPageProvider>
      <AppShellInner>{children}</AppShellInner>
    </AppPageProvider>
  );
}
