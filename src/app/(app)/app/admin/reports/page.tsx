"use client";

import { useEffect, useState } from "react";
import { formatProcessing, getOverview } from "@/lib/api";

export default function ReportsPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getOverview>> | null>(null);
  useEffect(() => {
    getOverview().then(setData);
  }, []);
  if (!data) return <div className="page-shell">Loading live metrics…</div>;
  return (
    <div className="page-shell space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <article className="card"><p className="eyebrow">Requests</p><p className="mt-2 text-3xl font-bold">{data.totals.total}</p></article>
        <article className="card"><p className="eyebrow">Pending</p><p className="mt-2 text-3xl font-bold">{data.totals.pending}</p></article>
        <article className="card"><p className="eyebrow">Overdue</p><p className="mt-2 text-3xl font-bold">{data.totals.overdue}</p></article>
        <article className="card"><p className="eyebrow">Completed</p><p className="mt-2 text-3xl font-bold">{data.totals.completed}</p></article>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="card"><p className="eyebrow">Average processing time</p><p className="mt-2 text-2xl font-bold">{formatProcessing(data.avgProcessingMs)}</p></article>
        <article className="card"><p className="eyebrow">SLA compliance</p><p className="mt-2 text-2xl font-bold">{data.slaCompliance}%</p></article>
        <article className="card"><p className="eyebrow">Top bottleneck</p><p className="mt-2 text-2xl font-bold">{data.topBottleneck}</p></article>
      </div>
      <article className="card">
        <p className="eyebrow">By type</p>
        <ul className="mt-4 space-y-2 text-sm">
          {data.byType.map((row) => (
            <li key={row.typeId} className="flex justify-between">
              <span>{row.name}</span>
              <span className="font-medium">{row.count}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
