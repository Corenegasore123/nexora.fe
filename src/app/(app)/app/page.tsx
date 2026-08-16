"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthUser, formatProcessing, getMe, getOverview, getTasks } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof getOverview>> | null>(null);
  const [inbox, setInbox] = useState<Awaited<ReturnType<typeof getTasks>> | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
    getOverview().then(setOverview).catch(() => setOverview(null));
    getTasks().then(setInbox).catch(() => setInbox(null));
  }, []);

  if (!overview) {
    return (
      <div className="page-shell grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const greeting = user?.role === "ADMIN" ? "Operations overview" : user?.role === "STAFF" ? "Staff dashboard" : "Student dashboard";

  return (
    <div className="page-shell space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{greeting}</p>
          <h2 className="mt-1 text-2xl font-bold">Hello{user ? `, ${user.name.split(" ")[0]}` : ""}</h2>
        </div>
        {user?.role === "STUDENT" && (
          <Link href="/app/requests/new" className="btn-primary">
            + New Request
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={user?.role === "STAFF" ? "Pending approvals" : "Requests"} value={user?.role === "STAFF" ? inbox?.counts.approvals ?? 0 : overview.totals.total} />
        <Stat label={user?.role === "STAFF" ? "Assigned tasks" : "Pending"} value={user?.role === "STAFF" ? inbox?.counts.tasks ?? 0 : overview.totals.pending} />
        <Stat label="Overdue" value={overview.totals.overdue} warn={overview.totals.overdue > 0} />
        <Stat label="Completed" value={overview.totals.completed} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card">
          <p className="eyebrow">Average processing time</p>
          <p className="mt-3 text-3xl font-bold">{formatProcessing(overview.avgProcessingMs)}</p>
        </article>
        <article className="card">
          <p className="eyebrow">SLA compliance</p>
          <p className="mt-3 text-3xl font-bold">{overview.slaCompliance}%</p>
        </article>
        <article className="card">
          <p className="eyebrow">Top bottleneck</p>
          <p className="mt-3 text-3xl font-bold">{overview.topBottleneck}</p>
        </article>
      </div>

      <article className="card">
        <p className="eyebrow">Request volume · 14 days</p>
        <div className="mt-6 flex h-40 items-end gap-2">
          {overview.volume.map((d) => {
            const max = Math.max(1, ...overview.volume.map((v) => v.count));
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t bg-primary" style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 6 : 2 }} />
                <span className="text-[10px] text-foreground-muted">{d.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </article>

      {inbox && (
        <article className="card">
          <div className="flex items-center justify-between">
            <p className="eyebrow">My work</p>
            <Link href="/app/inbox" className="text-sm font-medium text-primary">
              Open inbox
            </Link>
          </div>
          <p className="mt-3 text-sm text-foreground-secondary">
            {inbox.counts.approvals} approvals · {inbox.counts.tasks} tasks · {inbox.counts.overdue} overdue
          </p>
        </article>
      )}
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <article className="card">
      <p className="eyebrow">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${warn ? "text-error" : ""}`}>{value}</p>
    </article>
  );
}
