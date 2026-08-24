"use client";

import { useEffect, useState } from "react";
import { getInventory, type Ingredient } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default function InventoryPage() {
  const [rows, setRows] = useState<Ingredient[]>([]);
  useEffect(() => {
    getInventory().then(setRows);
  }, []);

  return (
    <div className="page-shell">
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-5 py-3">Ingredient</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Minimum</th>
              <th className="px-5 py-3">Supplier</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => {
              const status = i.stock <= i.minStock * 0.4 ? "CRITICAL" : i.stock <= i.minStock ? "LOW" : "HEALTHY";
              return (
                <tr key={i.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{i.name}</td>
                  <td className="px-5 py-3">
                    {i.stock} {i.unit}
                  </td>
                  <td className="px-5 py-3">
                    {i.minStock} {i.unit}
                  </td>
                  <td className="px-5 py-3 text-foreground-secondary">{i.supplier?.name ?? "—"}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
