"use client";

import { useEffect, useState } from "react";
import { getWaste, rwf, type WasteEntry } from "@/lib/api";

export default function WastePage() {
  const [rows, setRows] = useState<WasteEntry[]>([]);
  useEffect(() => {
    getWaste().then(setRows);
  }, []);
  const loss = rows.reduce((s, r) => s + r.cost, 0);

  return (
    <div className="page-shell space-y-6">
      <article className="card">
        <p className="eyebrow">Estimated loss</p>
        <p className="mt-3 text-3xl font-bold">{rwf(loss)}</p>
      </article>
      <div className="card divide-y divide-border p-0">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-5 py-4 text-sm">
            <div>
              <p className="font-medium">{r.ingredient.name}</p>
              <p className="text-foreground-muted">
                {r.quantity} {r.ingredient.unit} · {r.reason.replaceAll("_", " ")}
              </p>
            </div>
            <p className="font-semibold">{rwf(r.cost)}</p>
          </div>
        ))}
        {!rows.length && <p className="px-5 py-10 text-center text-foreground-muted">No waste recorded.</p>}
      </div>
    </div>
  );
}
