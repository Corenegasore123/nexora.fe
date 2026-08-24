"use client";

import { useEffect, useState } from "react";
import { getCommandCenter, rwf, type CommandCenter } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function CommandCenterPage() {
  const [data, setData] = useState<CommandCenter | null>(null);

  useEffect(() => {
    const load = () => getCommandCenter().then(setData).catch(() => undefined);
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  if (!data) {
    return (
      <div className="page-shell grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const max = Math.max(data.today.revenue, data.today.orders * 6000, data.today.customers * 4000, 1);

  return (
    <div className="page-shell space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Revenue" value={rwf(data.today.revenue)} />
        <Stat label="Orders" value={String(data.today.orders)} />
        <Stat label="Customers" value={String(data.today.customers)} />
        <Stat label="Avg. Order Value" value={rwf(data.today.avgOrderValue)} />
        <Stat label="Tables Occupied" value={`${data.today.tablesOccupiedPct}%`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card">
          <p className="eyebrow">Live operations</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>🟢 {data.live.occupied} tables occupied</li>
            <li>🟡 {data.live.preparing} orders preparing</li>
            <li>🔵 {data.live.ready} orders ready</li>
            <li>🔴 {data.live.delayed} delayed orders</li>
          </ul>
        </article>
        <article className="card">
          <p className="eyebrow">Inventory alerts</p>
          <ul className="mt-4 space-y-2 text-sm">
            {data.inventory.slice(0, 8).map((i) => (
              <li key={i.name}>
                {i.status === "Healthy" ? "✓" : "⚠"} {i.name}
                <span className="ml-2 text-foreground-muted">{i.status}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="card">
          <p className="eyebrow">Staff</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>{data.staff.active} active</li>
            <li>{data.staff.late} late</li>
            <li>{data.staff.absent} absent</li>
          </ul>
        </article>
      </div>

      <article className="card">
        <p className="eyebrow">Today&apos;s performance</p>
        <div className="mt-4 space-y-3">
          <Bar label="Revenue" pct={(data.today.revenue / max) * 100} />
          <Bar label="Orders" pct={(data.today.orders * 6000) / max * 100} />
          <Bar label="Customers" pct={(data.today.customers * 4000) / max * 100} />
        </div>
      </article>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="card">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </article>
  );
}

function Bar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0 text-foreground-muted">{label}</span>
      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-pending-bg">
        <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Math.max(6, pct))}%` }} />
      </span>
    </div>
  );
}
