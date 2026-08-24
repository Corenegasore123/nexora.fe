"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  approveReview,
  createOwner,
  getModerationQueue,
  getPlatformDashboard,
  rejectReview,
  type ModerationReview,
  type PlatformDashboard,
} from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { RatingStars } from "@/components/discover/RatingStars";

export default function PlatformAdminPage() {
  const [data, setData] = useState<PlatformDashboard | null>(null);
  const [queue, setQueue] = useState<ModerationReview[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [created, setCreated] = useState<{ name: string; email: string; temporaryPassword: string } | null>(null);

  const load = () => {
    getPlatformDashboard().then(setData);
    getModerationQueue("pending").then(setQueue).catch(() => setQueue([]));
  };
  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createOwner(form);
    setCreated({ name: res.user.name, email: res.user.email, temporaryPassword: res.temporaryPassword });
    setForm({ name: "", email: "", phone: "" });
    load();
  };

  if (!data) return null;

  return (
    <div className="page-shell space-y-8 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Nexora Platform</p>
          <h1 className="mt-2 text-3xl font-bold">Platform admin</h1>
        </div>
        <Link href="/platform-admin/moderation" className="btn-secondary min-h-11">
          Moderation queue ({queue.length})
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Restaurants" value={data.restaurants} />
        <Stat label="Active" value={data.active} />
        <Stat label="Pending" value={data.pending} />
        <Stat label="Suspended" value={data.suspended} />
        <Stat label="Restaurant owners" value={data.owners} />
        <Stat label="Platform users" value={data.users} />
        <Stat label="Reservations today" value={data.reservationsToday} />
        <Stat label="Orders today" value={data.ordersToday} />
      </div>

      {queue.length > 0 && (
        <section className="space-y-3">
          <p className="eyebrow">Pending reviews</p>
          {queue.slice(0, 3).map((r) => (
            <article key={r.id} className="card flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">{r.restaurant.name}</p>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {r.author} · <RatingStars value={r.rating} size={12} />
                </p>
                <p className="mt-2 text-sm">{r.comment || "No comment"}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-xs" type="button" onClick={() => approveReview(r.id).then(load)}>
                  Approve
                </button>
                <button className="btn-ghost text-xs" type="button" onClick={() => rejectReview(r.id).then(load)}>
                  Reject
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <article className="card overflow-x-auto p-0">
          <p className="eyebrow px-5 pt-5">Restaurants</p>
          <table className="mt-3 w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-5 py-3">Restaurant</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.list.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3">{r.owner}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <div className="space-y-4">
          <form onSubmit={onCreate} className="card space-y-3">
            <p className="eyebrow">Create restaurant owner</p>
            <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <p className="text-xs text-foreground-muted">Account status: INVITED · temporary password generated on create</p>
            <button className="btn-primary w-full">Create Owner</button>
          </form>
          {created && (
            <article className="card space-y-2">
              <p className="eyebrow">Owner account created</p>
              <p>{created.name}</p>
              <p className="text-sm">{created.email}</p>
              <p className="font-mono text-sm">Temporary password: {created.temporaryPassword}</p>
              <p className="text-xs text-foreground-muted">Share this once through a secure invitation. They must change it on first login.</p>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="card">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </article>
  );
}
