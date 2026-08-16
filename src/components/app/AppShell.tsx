"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthUser, getMe, logout } from "@/lib/api";
import { NotificationBell } from "@/components/NotificationBell";
import { Icon, type IconName } from "@/components/icons/Icon";
import { BrandMark } from "@/components/BrandMark";
import { AppPageProvider, useAppPageMeta } from "@/components/app/AppPageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavItem = { href: string; label: string; icon: IconName; section?: string };

function navFor(role: AuthUser["role"] | undefined): NavItem[] {
  const student: NavItem[] = [
    { href: "/app", label: "Dashboard", icon: "layout-dashboard", section: "Overview" },
    { href: "/app/requests", label: "My Requests", icon: "file-text", section: "Work" },
    { href: "/app/inbox", label: "My Work", icon: "inbox", section: "Work" },
    { href: "/app/documents", label: "Documents", icon: "clipboard", section: "Work" },
    { href: "/app/notifications", label: "Notifications", icon: "bell", section: "Work" },
  ];
  const staff: NavItem[] = [
    { href: "/app", label: "Dashboard", icon: "layout-dashboard", section: "Overview" },
    { href: "/app/inbox", label: "Inbox", icon: "inbox", section: "Operations" },
    { href: "/app/requests", label: "Requests", icon: "file-text", section: "Operations" },
    { href: "/app/assets", label: "Assets", icon: "package", section: "Operations" },
    { href: "/app/notifications", label: "Notifications", icon: "bell", section: "Operations" },
  ];
  const admin: NavItem[] = [
    { href: "/app", label: "Dashboard", icon: "layout-dashboard", section: "Overview" },
    { href: "/app/inbox", label: "Inbox", icon: "inbox", section: "Operations" },
    { href: "/app/requests", label: "Requests", icon: "file-text", section: "Operations" },
    { href: "/app/admin/users", label: "Users", icon: "users", section: "Administration" },
    { href: "/app/admin/departments", label: "Departments", icon: "building", section: "Administration" },
    { href: "/app/admin/workflows", label: "Workflows", icon: "git-branch", section: "Administration" },
    { href: "/app/admin/request-types", label: "Request Types", icon: "layers", section: "Administration" },
    { href: "/app/admin/assets", label: "Assets", icon: "package", section: "Administration" },
    { href: "/app/admin/reports", label: "Reports", icon: "target", section: "Administration" },
    { href: "/app/admin/audit", label: "Audit Logs", icon: "shield", section: "Administration" },
  ];
  if (role === "ADMIN") return admin;
  if (role === "STAFF") return staff;
  return student;
}

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
  const navItems = navFor(user?.role);

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
    router.refresh();
  };

  let lastSection = "";

  return (
    <>
      {mobileOpen && (
        <button type="button" className="fixed inset-0 z-40 bg-[#354554]/40 lg:hidden" onClick={onClose} aria-label="Close menu" />
      )}
      <aside className={`app-sidebar ${collapsed ? "app-sidebar-collapsed" : ""} ${mobileOpen ? "app-sidebar-open" : ""}`}>
        <div className="app-sidebar-header">
          {collapsed ? (
            <div className="app-sidebar-header-collapsed">
              <Link href="/app" className="app-sidebar-logo-mark" onClick={onClose} title="Nexora Campus">
                <BrandMark size={16} />
              </Link>
              <button type="button" onClick={() => setCollapsed(false)} className="app-sidebar-icon-btn hidden lg:inline-flex" aria-label="Expand sidebar">
                <Icon name="menu" size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/app" className="app-sidebar-brand" onClick={onClose}>
                <span className="app-sidebar-logo-mark">
                  <BrandMark size={16} />
                </span>
                <span className="app-sidebar-logo-text">Nexora Campus</span>
              </Link>
              <button type="button" onClick={onClose} className="app-sidebar-icon-btn lg:hidden" aria-label="Close menu">
                <Icon name="x" size={18} />
              </button>
              <button type="button" onClick={() => setCollapsed(true)} className="app-sidebar-icon-btn hidden lg:inline-flex" aria-label="Collapse sidebar">
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
                <Link href={item.href} onClick={onClose} title={collapsed ? item.label : undefined} className={`app-nav-link ${active ? "app-nav-link-active" : ""}`}>
                  <Icon name={item.icon} size={18} className={active ? "text-accent" : "text-white/50"} />
                  {!collapsed && item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="app-sidebar-footer">
          {user && !collapsed && (
            <p className="app-sidebar-user">
              {user.name}
              <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-white/40">{user.role}</span>
            </p>
          )}
          <Link href="/app/profile" onClick={onClose} className="app-sidebar-footer-link" title={collapsed ? "Profile" : undefined}>
            <Icon name="user" size={18} className="text-white/50" />
            {!collapsed && "Profile"}
          </Link>
          <Link href="/app/settings" onClick={onClose} className="app-sidebar-footer-link" title={collapsed ? "Settings" : undefined}>
            <Icon name="settings" size={18} className="text-white/50" />
            {!collapsed && "Settings"}
          </Link>
          <button type="button" onClick={handleLogout} className="app-sidebar-signout" title={collapsed ? "Sign out" : undefined}>
            <Icon name="log-out" size={18} className="app-sidebar-signout-icon shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}

export function AppTopBar({ onMenuClick, mobileOpen }: { onMenuClick: () => void; mobileOpen: boolean }) {
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
        <Link href="/app/search" className="app-icon-btn" aria-label="Search">
          <Icon name="search" size={18} />
        </Link>
        <ThemeToggle variant="header" />
        <NotificationBell />
      </div>
    </header>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null));
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
