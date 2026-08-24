"use client";

import { useEffect, useState } from "react";
import {
  createPurchase,
  getPurchaseOrders,
  getRecommendations,
  getSuppliers,
  rwf,
  type PurchaseOrder,
  type Recommendation,
  type Supplier,
} from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default function ProcurementPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const load = () => {
    getRecommendations().then(setRecs);
    getPurchaseOrders().then(setPos);
    getSuppliers().then(setSuppliers);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-shell space-y-8">
      <section className="space-y-3">
        <p className="eyebrow">Purchase recommendations</p>
        {recs.map((r) => (
          <article key={r.ingredientId} className="card grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-lg font-semibold">{r.name}</h2>
              <p className="mt-2 text-sm text-foreground-secondary">
                Current {r.current} {r.unit} · Minimum {r.minimum} {r.unit} · Avg daily {r.avgDailyUsage} {r.unit} ·
                Projected need {r.projectedNeed} {r.unit}
              </p>
              <p className="mt-2 text-sm">
                Recommended order {r.recommendedQty} {r.unit} · {r.supplier} · {rwf(r.estimatedCost)}
              </p>
            </div>
            <button className="btn-primary self-start" type="button" onClick={() => createPurchase(r.ingredientId, r.recommendedQty).then(load)}>
              Create purchase order
            </button>
          </article>
        ))}
        {!recs.length && <p className="card text-sm text-foreground-muted">Stock is healthy. No purchase recommendations.</p>}
      </section>

      <section>
        <p className="eyebrow">Purchase orders</p>
        <div className="mt-3 space-y-3">
          {pos.map((po) => (
            <article key={po.id} className="card flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-foreground-muted">{po.number}</p>
                <p className="font-medium">{po.supplier.name}</p>
                <p className="text-sm text-foreground-secondary">
                  {po.lines.map((l) => `${l.ingredient.name} ${l.quantity}${l.ingredient.unit}`).join(", ")}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={po.status} />
                <p className="mt-2 text-sm font-semibold">{rwf(po.total)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <p className="eyebrow">Supplier performance</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {suppliers.map((s) => (
            <article key={s.id} className="card">
              <h2 className="font-semibold">{s.name}</h2>
              <p className="mt-2 text-sm">On-time delivery: {s.onTimeRate}%</p>
              <p className="text-sm">Quality score: {s.qualityScore}%</p>
              <p className="text-sm">Average delay: {s.avgDelayHours}h</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
