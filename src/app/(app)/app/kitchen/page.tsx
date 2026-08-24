"use client";

import { useEffect, useState } from "react";
import { advanceTicket, getKitchen, type KitchenTicket } from "@/lib/api";

const COLS = [
  { status: "NEW", label: "New", action: "START" as const, cta: "Start" },
  { status: "PREPARING", label: "Preparing", action: "READY" as const, cta: "Ready" },
  { status: "READY", label: "Ready", action: "SERVE" as const, cta: "Serve" },
];

export default function KitchenPage() {
  const [tickets, setTickets] = useState<KitchenTicket[]>([]);

  const load = () => getKitchen().then(setTickets).catch(() => undefined);

  useEffect(() => {
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page-shell grid gap-4 md:grid-cols-3">
      {COLS.map((col) => (
        <section key={col.status} className="space-y-3">
          <p className="eyebrow">{col.label}</p>
          {tickets
            .filter((t) => t.status === col.status)
            .map((ticket) => (
              <article key={ticket.id} className="card space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-xl font-bold">#{ticket.order.number}</p>
                  <p className="text-sm text-foreground-muted">{ticket.order.table?.code ?? "—"}</p>
                </div>
                <ul className="text-sm">
                  {ticket.order.lines.map((l, i) => (
                    <li key={i}>
                      {l.quantity} {l.menuItem.name}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary w-full" type="button" onClick={() => advanceTicket(ticket.id, col.action).then(load)}>
                  {col.cta}
                </button>
              </article>
            ))}
          {!tickets.some((t) => t.status === col.status) && (
            <p className="card text-sm text-foreground-muted">Empty</p>
          )}
        </section>
      ))}
    </div>
  );
}
