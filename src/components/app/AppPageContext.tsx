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
    "/app": { title: "Command Center", subtitle: "What is happening in my restaurant right now?" },
    "/app/floor": { title: "Floor", subtitle: "Interactive table status" },
    "/app/reservations": { title: "Reservations", subtitle: "Bookings, seating, and guest flow" },
    "/app/pos": { title: "Point of Sale", subtitle: "Orders and payments" },
    "/app/kitchen": { title: "Kitchen Display", subtitle: "Live preparation board" },
    "/app/menu": { title: "Menu Engineering", subtitle: "Sales, cost, and classification" },
    "/app/inventory": { title: "Inventory", subtitle: "Stock, recipes, and alerts" },
    "/app/procurement": { title: "Procurement", subtitle: "Purchase recommendations and suppliers" },
    "/app/waste": { title: "Waste", subtitle: "Where money is disappearing" },
    "/app/staff": { title: "Staff", subtitle: "People, shifts, and attendance" },
    "/app/setup": { title: "Setup", subtitle: "Restaurant launch checklist" },
    "/app/customers": { title: "Customers", subtitle: "Profiles, loyalty, and visits" },
    "/app/delivery": { title: "Delivery", subtitle: "Internal delivery queue" },
    "/app/analytics": { title: "Analytics", subtitle: "Revenue, margins, and branches" },
    "/app/notifications": { title: "Notifications", subtitle: "Operational alerts" },
    "/app/profile": { title: "Profile", subtitle: "Your account" },
    "/app/settings": { title: "Settings", subtitle: "Appearance and preferences" },
  };
  return routes[pathname] ?? { title: "Nexora" };
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
