"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AuthUser, getMe, logout } from "@/lib/api";
import { isAdmin } from "@/lib/roles";
import { NotificationBell } from "@/components/NotificationBell";
import { Icon, type IconName } from "@/components/icons/Icon";
import { AppPageProvider, useAppPageMeta } from "@/components/app/AppPageContext";

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  section?: string;
};

/** Engineer workspace navigation — no platform admin entries. */
const ENGINEER_NAV: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: "layout-dashboard", section: "Overview" },
  { href: "/app/projects", label: "Projects", icon: "folder", section: "Overview" },
  { href: "/app/calculator", label: "New Calculation", icon: "plus-circle", section: "Analysis" },
  { href: "/app/history", label: "History", icon: "history", section: "Analysis" },
  { href: "/app/reports", label: "Reports", icon: "file-text", section: "Output" },
  { href: "/app/rules", label: "Rules", icon: "book-open", section: "Resources" },
];

/** Shown only to administrators — separate from the engineer workspace. */
const ADMIN_NAV: NavItem[] = [
  { href: "/app/admin", label: "Platform Admin", icon: "shield", section: "Administration" },
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

  const navItems = useMemo(
    () => (user && isAdmin(user.role) ? [...ENGINEER_NAV, ...ADMIN_NAV] : ENGINEER_NAV),
    [user]
  );

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
        className={`app-sidebar ${collapsed ? "app-sidebar-collapsed" : ""} ${mobileOpen ? "app-sidebar-open" : ""}`}
      >
        <div className="app-sidebar-header">
          {collapsed ? (
            <div className="app-sidebar-header-collapsed">
              <Link href="/app" className="app-sidebar-logo-mark" onClick={onClose} title="QuantaScope">
                <Icon name="layers" size={16} />
              </Link>
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="app-sidebar-icon-btn hidden lg:inline-flex"
                aria-label="Expand sidebar"
              >
                <Icon name="menu" size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/app" className="app-sidebar-brand" onClick={onClose}>
                <span className="app-sidebar-logo-mark">
                  <Icon name="layers" size={16} />
                </span>
                <span className="app-sidebar-logo-text">QuantaScope</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="app-sidebar-icon-btn lg:hidden"
                aria-label="Close menu"
              >
                <Icon name="x" size={18} />
              </button>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="app-sidebar-icon-btn hidden lg:inline-flex"
                aria-label="Collapse sidebar"
              >
                <Icon name="menu" size={18} />
              </button>
            </>
          )}
        </div>

        <nav className="app-nav-body">
          {navItems.map((item) => {
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
          <Link href="/app/profile" onClick={onClose} className="app-sidebar-footer-link" title={collapsed ? "Profile" : undefined}>
            <Icon name="user" size={18} className="text-white/50" />
            {!collapsed && "Profile"}
          </Link>
          <Link href="/app/settings" onClick={onClose} className="app-sidebar-footer-link" title={collapsed ? "Settings" : undefined}>
            <Icon name="settings" size={18} className="text-white/50" />
            {!collapsed && "Settings"}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="app-sidebar-signout"
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

export function AppTopBar({
  onMenuClick,
  mobileOpen,
}: {
  onMenuClick: () => void;
  mobileOpen: boolean;
}) {
  const { title, subtitle, actions } = useAppPageMeta();

  return (
    <header className="app-topbar backdrop-blur-sm">
      {!mobileOpen && (
        <button type="button" onClick={onMenuClick} className="app-icon-btn shrink-0 lg:hidden" aria-label="Open menu">
          <Icon name="menu" size={20} />
        </button>
      )}
      <div className="app-topbar-title-wrap">
        <h1 className="app-topbar-title">{title}</h1>
        {subtitle && <p className="app-topbar-subtitle">{subtitle}</p>}
      </div>
      <div className="app-topbar-actions">
        {actions}
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
    <div className="app-shell-bg app-shell-layout">
      <AppSidebar user={user} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-main-column">
        <AppTopBar onMenuClick={() => setMobileOpen(true)} mobileOpen={mobileOpen} />
        <main className="app-main">{children}</main>
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
