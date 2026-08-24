"use client";

import { useEffect, useState } from "react";
import { getTables, rwf, setTableStatus, type DiningTable } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

const DOT: Record<string, string> = {
  AVAILABLE: "🟢",
  OCCUPIED: "🔴",
  RESERVED: "🟡",
  CLEANING: "🔵",
};

const CYCLE = ["AVAILABLE", "OCCUPIED", "RESERVED", "CLEANING"] as const;

export default function FloorPage() {
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [selected, setSelected] = useState<DiningTable | null>(null);

  const load = () => getTables().then(setTables).catch(() => undefined);

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const maxX = Math.max(1, ...tables.map((t) => t.posX));
  const maxY = Math.max(1, ...tables.map((t) => t.posY));

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[1fr_320px]">
      <article className="card">
        <p className="eyebrow">Restaurant</p>
        <div
          className="mt-6 grid min-h-[360px] gap-4 rounded-2xl border border-border bg-pending-bg/40 p-6"
          style={{ gridTemplateColumns: `repeat(${maxX}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${maxY}, minmax(80px, 1fr))` }}
        >
          {tables.map((table) => (
            <button
              key={table.id}
              type="button"
              onClick={() => setSelected(table)}
              className={`flex flex-col items-center justify-center rounded-xl border bg-surface-elevated px-3 py-4 text-sm font-semibold transition ${
                selected?.id === table.id ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-accent"
              }`}
              style={{ gridColumn: table.posX, gridRow: table.posY }}
            >
              <span>
                {table.code} {DOT[table.status] ?? "⚪"}
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-foreground-muted">
                {table.seats} seats
              </span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-foreground-muted">🟢 Available · 🔴 Occupied · 🟡 Reserved · 🔵 Cleaning</p>
      </article>

      <article className="card space-y-3">
        <p className="eyebrow">Table detail</p>
        {!selected && <p className="text-sm text-foreground-muted">Click a table to see guest, waiter, order, and bill.</p>}
        {selected && (
          <>
            <h2 className="text-xl font-bold">{selected.code}</h2>
            <StatusBadge status={selected.status} />
            <p className="text-sm">Seats: {selected.seats}</p>
            {selected.reservations[0] && <p className="text-sm">Guest: {selected.reservations[0].customer.name}</p>}
            {selected.orders[0]?.waiter && <p className="text-sm">Waiter: {selected.orders[0].waiter.name}</p>}
            {selected.orders[0] && (
              <>
                <p className="text-sm">Order #{selected.orders[0].number}</p>
                <p className="text-sm font-semibold">Bill {rwf(selected.orders[0].total)}</p>
                <ul className="text-sm text-foreground-secondary">
                  {selected.orders[0].lines.map((l, i) => (
                    <li key={i}>
                      {l.menuItem.name} × {l.quantity}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {CYCLE.map((status) => (
                <button
                  key={status}
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={async () => {
                    await setTableStatus(selected.id, status);
                    setSelected({ ...selected, status });
                    load();
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </>
        )}
      </article>
    </div>
  );
}
