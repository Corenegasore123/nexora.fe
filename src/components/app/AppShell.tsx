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
  const ops: NavItem[] = [
    { href: "/app", label: "Command Center", icon: "layout-dashboard", section: "Live" },
    { href: "/app/floor", label: "Floor", icon: "map-pin", section: "Front of house" },
    { href: "/app/reservations", label: "Reservations", icon: "clock", section: "Front of house" },
    { href: "/app/pos", label: "POS", icon: "calculator", section: "Front of house" },
    { href: "/app/kitchen", label: "Kitchen", icon: "clipboard", section: "Kitchen" },
    { href: "/app/menu", label: "Menu", icon: "book-open", section: "Kitchen" },
    { href: "/app/inventory", label: "Inventory", icon: "package", section: "Back office" },
    { href: "/app/procurement", label: "Procurement", icon: "clipboard-check", section: "Back office" },
    { href: "/app/waste", label: "Waste", icon: "alert-triangle", section: "Back office" },
    { href: "/app/staff", label: "Staff", icon: "users", section: "Back office" },
    { href: "/app/setup", label: "Setup", icon: "clipboard-check", section: "Back office" },
    { href: "/app/customers", label: "Customers", icon: "user", section: "Back office" },
    { href: "/app/delivery", label: "Delivery", icon: "route", section: "Back office" },
    { href: "/app/analytics", label: "Analytics", icon: "target", section: "Intelligence" },
    { href: "/app/notifications", label: "Notifications", icon: "bell", section: "Intelligence" },
  ];
  if (role === "CHEF" || role === "KITCHEN") {
    return ops.filter((i) => ["/app", "/app/kitchen", "/app/menu", "/app/notifications"].includes(i.href));
  }
  if (role === "WAITER") {
    return ops.filter((i) => ["/app", "/app/floor", "/app/reservations", "/app/pos", "/app/kitchen", "/app/notifications"].includes(i.href));
  }
  if (role === "CASHIER") {
    return ops.filter((i) => ["/app", "/app/floor", "/app/pos", "/app/notifications"].includes(i.href));
  }
  if (role === "INVENTORY_MANAGER") {
    return ops.filter((i) => ["/app", "/app/inventory", "/app/procurement", "/app/waste", "/app/menu", "/app/notifications"].includes(i.href));
  }
  if (role !== "OWNER" && role !== "ADMIN") {
    return ops.filter((i) => i.href !== "/app/setup");
  }
  return ops;
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
              <Link href="/app" className="app-sidebar-logo-mark" onClick={onClose} title="Nexora">
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
                <span className="app-sidebar-logo-text">Nexora</span>
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
