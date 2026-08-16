"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNotifications, getTasks } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

export default function InboxPage() {
  const [tasks, setTasks] = useState<Awaited<ReturnType<typeof getTasks>> | null>(null);
  const [notes, setNotes] = useState<Awaited<ReturnType<typeof getNotifications>> | null>(null);

  useEffect(() => {
    getTasks().then(setTasks).catch(() => setTasks({ tasks: [], counts: { approvals: 0, tasks: 0, overdue: 0 } }));
    getNotifications().then(setNotes).catch(() => setNotes({ notifications: [], unreadCount: 0 }));
  }, []);

  const open = tasks?.tasks.filter((t) => t.status === "OPEN") ?? [];

  return (
    <div className="page-shell space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <article className="card"><p className="eyebrow">Approvals</p><p className="mt-2 text-3xl font-bold">{tasks?.counts.approvals ?? 0}</p></article>
        <article className="card"><p className="eyebrow">Tasks</p><p className="mt-2 text-3xl font-bold">{tasks?.counts.tasks ?? 0}</p></article>
        <article className="card"><p className="eyebrow">Overdue</p><p className="mt-2 text-3xl font-bold">{tasks?.counts.overdue ?? 0}</p></article>
        <article className="card"><p className="eyebrow">Notifications</p><p className="mt-2 text-3xl font-bold">{notes?.unreadCount ?? 0}</p></article>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-pending-bg text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {open.map((task) => (
              <tr key={task.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href={`/app/requests/${task.request.id}`} className="font-medium text-primary">
                    {task.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{task.kind}</td>
                <td className="px-4 py-3"><StatusBadge status={task.request.status} /></td>
                <td className="px-4 py-3 text-foreground-secondary">{task.dueAt ? new Date(task.dueAt).toLocaleString() : "—"}</td>
              </tr>
            ))}
            {!open.length && (
              <tr>
                <td className="px-4 py-8 text-center text-foreground-muted" colSpan={4}>Inbox is clear.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
