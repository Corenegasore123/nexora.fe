"use client";

import { useEffect, useState } from "react";
import { getDeliveries, type Delivery } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default function DeliveryPage() {
  const [rows, setRows] = useState<Delivery[]>([]);
  useEffect(() => {
    getDeliveries().then(setRows);
  }, []);

  return (
    <div className="page-shell space-y-3">
      <p className="text-sm text-foreground-secondary">
        Internal delivery queue — order, assigned, picked up, on the way, delivered.
      </p>
      {rows.map((d) => (
        <article key={d.id} className="card flex items-center justify-between">
          <div>
            <p className="font-medium">Order #{d.order.number}</p>
            <p className="text-sm text-foreground-muted">Driver {d.driver ?? "Unassigned"}</p>
          </div>
          <StatusBadge status={d.status} />
        </article>
      ))}
      {!rows.length && <p className="card text-sm text-foreground-muted">No deliveries in the queue.</p>}
    </div>
  );
}
