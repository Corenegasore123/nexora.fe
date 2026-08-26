"use client";

import { useEffect, useState } from "react";
import { getCustomers, rwf, type Customer } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default function CustomersPage() {
  const [rows, setRows] = useState<Customer[]>([]);
  useEffect(() => {
    getCustomers().then(setRows);
  }, []);

  return (
    <div className="page-shell grid gap-4 md:grid-cols-2">
      {rows.map((c) => (
        <article key={c.id} className="card space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <StatusBadge status={c.loyalty} />
          </div>
          <p className="text-sm">Visits {c.visits}</p>
          <p className="text-sm">Total spent {rwf(c.totalSpent)}</p>
          <p className="text-sm">Average order {rwf(c.visits ? c.totalSpent / c.visits : 0)}</p>
          <p className="text-sm">Favorite {c.favorite ?? "-"}</p>
          <p className="text-sm">Points {c.points}</p>
          <p className="text-sm text-foreground-muted">
            Last visit {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : "-"}
          </p>
        </article>
      ))}
      {!rows.length && <p className="card text-sm text-foreground-muted">No customers yet.</p>}
    </div>
  );
}
