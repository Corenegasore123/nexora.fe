"use client";

import { useEffect, useState } from "react";
import { getDepartments } from "@/lib/api";

export default function DepartmentsPage() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof getDepartments>>>([]);
  useEffect(() => {
    getDepartments().then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <div className="page-shell grid gap-4 md:grid-cols-2">
      {rows.map((d) => (
        <article key={d.id} className="card">
          <p className="text-xs uppercase tracking-wider text-foreground-muted">{d.code}</p>
          <h3 className="mt-1 text-lg font-semibold">{d.name}</h3>
          <p className="mt-2 text-sm text-foreground-secondary">Head: {d.head?.name ?? "Unassigned"} · {d._count.members} members</p>
        </article>
      ))}
    </div>
  );
}
