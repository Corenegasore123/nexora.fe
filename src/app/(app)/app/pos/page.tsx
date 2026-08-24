"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createOrder,
  getMenu,
  getOrders,
  getTables,
  payOrder,
  rwf,
  sendOrder,
  type DiningTable,
  type MenuItem,
  type Order,
} from "@/lib/api";

type Line = { menuItem: MenuItem; quantity: number };

export default function PosPage() {
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableId, setTableId] = useState("");
  const [cart, setCart] = useState<Line[]>([]);
  const [current, setCurrent] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    getTables().then(setTables);
    getMenu().then(setMenu);
    getOrders().then(setOrders);
  };

  useEffect(() => {
    load();
  }, []);

  const ticket = current;
  const lines = ticket?.lines.map((l) => ({ name: l.menuItem.name, quantity: l.quantity, unitPrice: l.unitPrice })) ?? cart.map((l) => ({ name: l.menuItem.name, quantity: l.quantity, unitPrice: l.menuItem.price }));
  const subtotal = ticket?.subtotal ?? cart.reduce((s, l) => s + l.quantity * l.menuItem.price, 0);
  const tax = ticket?.tax ?? Math.round(subtotal * 0.1);
  const total = ticket?.total ?? subtotal + tax;
  const tableCode = ticket?.table?.code ?? tables.find((t) => t.id === tableId)?.code;

  const add = (item: MenuItem) => {
    setCurrent(null);
    setCart((prev) => {
      const found = prev.find((l) => l.menuItem.id === item.id);
      if (found) return prev.map((l) => (l.menuItem.id === item.id ? { ...l, quantity: l.quantity + 1 } : l));
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const submit = async () => {
    if (!cart.length) return;
    setBusy(true);
    try {
      const order = await createOrder({
        tableId: tableId || undefined,
        lines: cart.map((l) => ({ menuItemId: l.menuItem.id, quantity: l.quantity })),
      });
      setCurrent(order);
      setCart([]);
      load();
    } finally {
      setBusy(false);
    }
  };

  const openOrders = useMemo(() => orders.filter((o) => o.status !== "PAID"), [orders]);

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <article className="card">
          <p className="eyebrow">Table</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tables.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTableId(t.id)}
                className={`rounded-lg border px-3 py-2 text-sm ${tableId === t.id ? "border-accent bg-accent-soft" : "border-border"}`}
              >
                {t.code}
              </button>
            ))}
          </div>
        </article>
        <article className="card">
          <p className="eyebrow">Menu</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {menu.map((item) => (
              <button key={item.id} type="button" onClick={() => add(item)} className="flex items-center justify-between rounded-lg border border-border px-3 py-3 text-left hover:border-accent">
                <span>
                  <span className="block font-medium">{item.name}</span>
                  <span className="text-xs text-foreground-muted">{item.category.name}</span>
                </span>
                <span className="text-sm font-semibold">{rwf(item.price)}</span>
              </button>
            ))}
          </div>
        </article>
        {openOrders.length > 0 && (
          <article className="card">
            <p className="eyebrow">Open tickets</p>
            <ul className="mt-3 space-y-2 text-sm">
              {openOrders.map((o) => (
                <li key={o.id}>
                  <button type="button" className="inline-link" onClick={() => setCurrent(o)}>
                    #{o.number} · {o.table?.code ?? "No table"} · {o.status} · {rwf(o.total)}
                  </button>
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>

      <article className="card space-y-4">
        <p className="eyebrow">Table {tableCode ?? "—"}</p>
        {lines.map((l) => (
          <div key={l.name} className="flex justify-between text-sm">
            <span>
              {l.name} × {l.quantity}
            </span>
            <span>{rwf(l.unitPrice * l.quantity)}</span>
          </div>
        ))}
        {!lines.length && <p className="text-sm text-foreground-muted">Tap menu items to build a ticket.</p>}
        <div className="border-t border-border pt-3 text-sm">
          <Row label="Subtotal" value={rwf(subtotal)} />
          <Row label="Tax" value={rwf(tax)} />
          <Row label="Discount" value={rwf(ticket?.discount ?? 0)} />
          <p className="mt-3 flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{rwf(total)}</span>
          </p>
        </div>
        {!ticket && (
          <button className="btn-primary w-full" disabled={busy || !cart.length} onClick={submit}>
            Create order
          </button>
        )}
        {ticket && ticket.status === "OPEN" && (
          <button className="btn-secondary w-full" onClick={() => sendOrder(ticket.id).then((o) => { setCurrent(o); load(); })}>
            Send to kitchen
          </button>
        )}
        {ticket && ticket.status !== "PAID" && (
          <div className="grid gap-2">
            {(["CASH", "CARD", "MOBILE_MONEY"] as const).map((method) => (
              <button
                key={method}
                className="btn-primary w-full"
                onClick={async () => {
                  await payOrder(ticket.id, method);
                  setCurrent(null);
                  load();
                }}
              >
                {method.replace("_", " ")}
              </button>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between text-foreground-secondary">
      <span>{label}</span>
      <span>{value}</span>
    </p>
  );
}
