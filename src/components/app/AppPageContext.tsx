"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

export type AppPageMeta = {
  title: string;
  subtitle?: string;
};

function resolvePageMeta(pathname: string): AppPageMeta {
  const routes: Record<string, AppPageMeta> = {
    "/app": { title: "Dashboard", subtitle: "Overview" },
    "/app/projects": { title: "Projects", subtitle: "Your workspaces" },
    "/app/projects/new": { title: "New Project", subtitle: "Create a workspace" },
    "/app/calculator": { title: "New Calculation", subtitle: "Upload & calculate" },
    "/app/history": { title: "History", subtitle: "Past calculations" },
    "/app/reports": { title: "Reports", subtitle: "Exports & downloads" },
    "/app/rules": { title: "Rules", subtitle: "Calculation engine" },
    "/app/admin": { title: "Admin", subtitle: "Platform administration" },
    "/app/profile": { title: "Profile", subtitle: "Your account" },
    "/app/settings": { title: "Settings", subtitle: "Preferences" },
  };

  if (routes[pathname]) return routes[pathname];
  if (/^\/app\/projects\/[^/]+$/.test(pathname)) return { title: "Project", subtitle: "Workspace" };
  if (/^\/app\/history\/[^/]+$/.test(pathname)) return { title: "Calculation", subtitle: "Analysis detail" };
  return { title: "QuantScope" };
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

  return (
    <AppPageContext.Provider value={{ meta, setMeta: setOverride }}>{children}</AppPageContext.Provider>
  );
}

export function useAppPageMeta() {
  const ctx = useContext(AppPageContext);
  if (!ctx) throw new Error("useAppPageMeta must be used within AppPageProvider");
  return ctx.meta;
}

export function useSetAppPageMeta(meta: AppPageMeta) {
  const ctx = useContext(AppPageContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.setMeta(meta);
    return () => ctx.setMeta(null);
  }, [ctx, meta.title, meta.subtitle]);
}
