"use client";

import { useEffect, useState } from "react";
import { getAssets, transitionAsset } from "@/lib/api";

const NEXT: Record<string, string[]> = {
  PURCHASED: ["IN_STOCK"],
  IN_STOCK: ["ASSIGNED", "MAINTENANCE", "RETIRED"],
  ASSIGNED: ["TRANSFERRED", "MAINTENANCE", "IN_STOCK", "RETIRED"],
  TRANSFERRED: ["ASSIGNED", "IN_STOCK", "MAINTENANCE"],
  MAINTENANCE: ["IN_STOCK", "RETIRED"],
  RETIRED: [],
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Awaited<ReturnType<typeof getAssets>>>([]);
  const load = () => getAssets().then(setAssets).catch(() => setAssets([]));
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-shell">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-pending-bg text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Advance</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="border-t border-border">
                <td className="px-4 py-3 font-mono">{asset.tag}</td>
                <td className="px-4 py-3">{asset.name}</td>
                <td className="px-4 py-3">{asset.status.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">{asset.assignee?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    className="rounded-lg border border-border px-2 py-1 text-xs"
                    defaultValue=""
                    onChange={async (e) => {
                      if (!e.target.value) return;
                      await transitionAsset(asset.id, e.target.value);
                      load();
                    }}
                  >
                    <option value="">Move to…</option>
                    {(NEXT[asset.status] ?? []).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
