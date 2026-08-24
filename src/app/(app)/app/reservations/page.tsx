"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  arriveReservation,
  cancelReservation,
  confirmReservation,
  createReservation,
  getBranches,
  getReservations,
  getTables,
  seatReservation,
  type Branch,
  type DiningTable,
  type Reservation,
} from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { clampDateToToday, todayKigali } from "@/lib/dates";

export default function ReservationsPage() {
  const [rows, setRows] = useState<Reservation[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    guests: 2,
    date: todayKigali(),
    time: "19:30",
    branchId: "",
    tableId: "",
    preference: "",
  });

  const load = () => {
    getReservations().then(setRows).catch(() => undefined);
    getBranches().then((b) => {
      setBranches(b);
      setForm((f) => ({ ...f, branchId: f.branchId || b[0]?.id || "" }));
    });
    getTables().then(setTables).catch(() => undefined);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const todayKey = new Date().toISOString().slice(0, 10);
  const today = rows.filter((r) => r.date.slice(0, 10) === todayKey).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = rows.filter((r) => r.date.slice(0, 10) !== todayKey);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createReservation({
      ...form,
      guests: Number(form.guests),
      tableId: form.tableId || undefined,
      preference: form.preference || undefined,
    });
    setForm((f) => ({ ...f, customerName: "", preference: "" }));
    load();
  };

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={onSubmit} className="card space-y-3">
        <p className="eyebrow">New reservation</p>
        <Field label="Customer" value={form.customerName} onChange={(v) => setForm({ ...form, customerName: v })} />
        <Field label="Guests" type="number" value={String(form.guests)} onChange={(v) => setForm({ ...form, guests: Number(v) })} />
        <Field label="Date" type="date" min={todayKigali()} value={form.date} onChange={(v) => setForm({ ...form, date: clampDateToToday(v) })} />
        <Field label="Time" type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Branch</span>
          <select className="w-full rounded-lg border border-border px-3 py-2" value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Table preference</span>
          <select className="w-full rounded-lg border border-border px-3 py-2" value={form.tableId} onChange={(e) => setForm({ ...form, tableId: e.target.value })}>
            <option value="">Any</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code} · {t.seats} seats
              </option>
            ))}
          </select>
        </label>
        <Field label="Notes" value={form.preference} onChange={(v) => setForm({ ...form, preference: v })} />
        <button className="btn-primary w-full" type="submit">
          Confirm booking
        </button>
      </form>

      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between">
            <p className="eyebrow">Today</p>
            <button className="btn-ghost text-xs" type="button" onClick={load}>
              Refresh
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {today.map((r) => (
              <ReservationCard key={r.id} r={r} load={load} />
            ))}
            {!today.length && <p className="card text-sm text-foreground-muted">No reservations today.</p>}
          </div>
        </section>
        {upcoming.length > 0 && (
          <section>
            <p className="eyebrow">Upcoming</p>
            <div className="mt-3 space-y-3">
              {upcoming.map((r) => (
                <ReservationCard key={r.id} r={r} load={load} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ReservationCard({ r, load }: { r: Reservation; load: () => void }) {
  return (
    <article className={`card flex flex-wrap items-start justify-between gap-4 ${r.status === "NEW" ? "border-accent" : ""}`}>
      <div>
        <p className="font-mono text-xs text-foreground-muted">{r.number}</p>
        <h2 className="mt-1 text-lg font-semibold">{r.customer.name}</h2>
        <p className="mt-1 text-sm text-foreground-secondary">
          {r.time} · {r.guests} guests · {r.branch.name}
          {r.table ? ` · Table ${r.table.code}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={r.status} />
        {(r.status === "NEW" || r.status === "PENDING") && (
          <button className="btn-secondary text-xs" type="button" onClick={() => confirmReservation(r.id).then(load)}>
            Confirm
          </button>
        )}
        {(r.status === "CONFIRMED" || r.status === "NEW") && (
          <button className="btn-secondary text-xs" type="button" onClick={() => arriveReservation(r.id).then(load)}>
            Arrived
          </button>
        )}
        {(r.status === "CONFIRMED" || r.status === "ARRIVED") && (
          <button className="btn-secondary text-xs" type="button" onClick={() => seatReservation(r.id).then(load)}>
            Seat guest
          </button>
        )}
        {r.status !== "CANCELLED" && r.status !== "COMPLETED" && (
          <button className="btn-ghost text-xs" type="button" onClick={() => cancelReservation(r.id).then(load)}>
            Cancel
          </button>
        )}
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  min?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input className="w-full rounded-lg border border-border px-3 py-2" type={type} min={min} value={value} onChange={(e) => onChange(e.target.value)} required={type !== "text" || label === "Customer"} />
    </label>
  );
}
