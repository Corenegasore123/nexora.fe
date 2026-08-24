"use client";

import { useEffect, useState } from "react";
import { getAnalytics, rwf, type Analytics } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  useEffect(() => {
    getAnalytics().then(setData);
  }, []);
  if (!data) return null;

  const selected = data.branches.find((b) => b.name === branch);
  const waste = data.wasteByBranch.find((w) => w.branch === branch);
  const best = data.branches.slice().sort((a, b) => b.revenue - a.revenue)[0];
  const worstWaste = data.wasteByBranch.slice().sort((a, b) => b.cost - a.cost)[0];

  return (
    <div className="page-shell space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue" value={rwf(data.revenue)} />
        <Stat label="COGS" value={rwf(data.cogs)} />
        <Stat label="Gross profit" value={rwf(data.grossProfit)} />
        <Stat label="Orders" value={String(data.orders)} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <p className="eyebrow">Payment methods</p>
          <p className="mt-3 text-sm">Cash {rwf(data.byMethod.CASH ?? 0)}</p>
          <p className="text-sm">Card {rwf(data.byMethod.CARD ?? 0)}</p>
          <p className="text-sm">Mobile money {rwf(data.byMethod.MOBILE_MONEY ?? 0)}</p>
        </article>
        <article className="card">
          <p className="eyebrow">Customer satisfaction</p>
          <p className="mt-3 text-sm">Food {data.satisfaction.food}</p>
          <p className="text-sm">Service {data.satisfaction.service}</p>
          <p className="text-sm">Ambience {data.satisfaction.ambience}</p>
        </article>
        <article className="card">
          <p className="eyebrow">Highlights</p>
          <p className="mt-3 text-sm">Best branch {best?.name ?? "—"}</p>
          <p className="text-sm">Best product {data.bestProduct?.name ?? "—"}</p>
          <p className="text-sm">Highest waste {worstWaste?.branch ?? "—"}</p>
        </article>
      </section>

      <section>
        <p className="eyebrow">Branches</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {data.branches.map((b) => (
            <button key={b.name} type="button" onClick={() => setBranch(b.name)} className="card-raised text-left">
              <p className="font-semibold">{b.name}</p>
              <p className="mt-1 text-sm text-foreground-secondary">
                {rwf(b.revenue)} · {b.orders} orders
              </p>
            </button>
          ))}
        </div>
        {selected && (
          <article className="card mt-4">
            <p className="eyebrow">{selected.name}</p>
            <p className="mt-2 text-sm">Revenue {rwf(selected.revenue)}</p>
            <p className="text-sm">Orders {selected.orders}</p>
            <p className="text-sm">Waste {rwf(waste?.cost ?? 0)}</p>
          </article>
        )}
      </section>

      <section>
        <p className="eyebrow">Products</p>
        <div className="mt-3 card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Revenue</th>
                <th className="px-5 py-3">Margin</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr key={p.name} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3">{p.qty}</td>
                  <td className="px-5 py-3">{rwf(p.revenue)}</td>
                  <td className="px-5 py-3">{Math.round(p.margin * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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
