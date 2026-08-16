"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "@/lib/api";

export default function AuditPage() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getAuditLogs>>>([]);
  useEffect(() => {
    getAuditLogs().then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <div className="page-shell">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-pending-bg text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground-muted">{new Date(row.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">{row.user?.name ?? "System"}</td>
                <td className="px-4 py-3 font-medium">{row.action}</td>
                <td className="px-4 py-3">{row.resource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
