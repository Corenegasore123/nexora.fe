"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

export type AppPageMeta = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

function resolvePageMeta(pathname: string): AppPageMeta {
  const routes: Record<string, AppPageMeta> = {
    "/app": { title: "Dashboard", subtitle: "Campus operations" },
    "/app/requests": { title: "Requests", subtitle: "Workflow-backed cases" },
    "/app/requests/new": { title: "New Request", subtitle: "Start a campus process" },
    "/app/inbox": { title: "My Work", subtitle: "Approvals, tasks, and overdue items" },
    "/app/documents": { title: "Documents", subtitle: "Generated and uploaded files" },
    "/app/notifications": { title: "Notifications", subtitle: "Activity that needs your attention" },
    "/app/profile": { title: "Profile", subtitle: "Your account" },
    "/app/settings": { title: "Settings", subtitle: "Preferences" },
    "/app/assets": { title: "Assets", subtitle: "Campus equipment" },
    "/app/search": { title: "Search", subtitle: "Requests, people, and assets" },
    "/app/admin/users": { title: "Users", subtitle: "People and roles" },
    "/app/admin/departments": { title: "Departments", subtitle: "Campus units" },
    "/app/admin/workflows": { title: "Workflows", subtitle: "Configurable approval paths" },
    "/app/admin/request-types": { title: "Request Types", subtitle: "What students and staff can submit" },
    "/app/admin/assets": { title: "Assets", subtitle: "Lifecycle register" },
    "/app/admin/reports": { title: "Reports", subtitle: "Live operational analytics" },
    "/app/admin/audit": { title: "Audit Logs", subtitle: "Immutable activity trail" },
  };
  if (routes[pathname]) return routes[pathname];
  if (/^\/app\/requests\/[^/]+$/.test(pathname)) return { title: "Request", subtitle: "Workflow, SLA, and audit trail" };
  if (/^\/app\/admin\/workflows\/[^/]+$/.test(pathname)) return { title: "Workflow", subtitle: "Steps and transitions" };
  return { title: "Nexora Campus" };
}

type AppPageContextValue = {
  meta: AppPageMeta;
  setMeta: (meta: AppPageMeta | null) => void;
};

const AppPageContext = createContext<AppPageContextValue | null>(null);

export function AppPageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [override, setOverride] = useState<AppPageMeta | null>(null);

  useEffect(() => {
    setOverride(null);
  }, [pathname]);

  const meta = override ?? resolvePageMeta(pathname);
  const value = useMemo(() => ({ meta, setMeta: setOverride }), [meta.title, meta.subtitle, meta.actions]);
  return <AppPageContext.Provider value={value}>{children}</AppPageContext.Provider>;
}

export function useAppPageMeta() {
  const ctx = useContext(AppPageContext);
  if (!ctx) throw new Error("useAppPageMeta must be used within AppPageProvider");
  return ctx.meta;
}

export function useSetAppPageMeta({ title, subtitle }: { title: string; subtitle?: string }) {
  const setMeta = useContext(AppPageContext)?.setMeta;
  useEffect(() => {
    if (!setMeta) return;
    setMeta({ title, subtitle });
    return () => setMeta(null);
  }, [setMeta, title, subtitle]);
}
