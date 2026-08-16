"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNotifications, markAllNotificationsRead, markNotificationRead, type Notification } from "@/lib/api";

export default function NotificationsPage() {
  const [data, setData] = useState<{ notifications: Notification[]; unreadCount: number }>({ notifications: [], unreadCount: 0 });
  const load = () => getNotifications().then(setData).catch(() => undefined);
  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page-shell space-y-4">
      <div className="flex justify-end">
        <button className="btn-ghost" onClick={() => markAllNotificationsRead().then(load)}>
          Mark all read
        </button>
      </div>
      <div className="card divide-y divide-border p-0">
        {data.notifications.map((n) => (
          <Link
            key={n.id}
            href={n.link ?? "/app"}
            onClick={() => markNotificationRead(n.id)}
            className={`block px-5 py-4 hover:bg-pending-bg ${n.read ? "opacity-60" : ""}`}
          >
            <p className="font-medium">{n.title}</p>
            {n.body && <p className="mt-1 text-sm text-foreground-secondary">{n.body}</p>}
            <time className="mt-2 block text-[11px] text-foreground-muted">{new Date(n.createdAt).toLocaleString()}</time>
          </Link>
        ))}
        {!data.notifications.length && <p className="px-5 py-10 text-center text-foreground-muted">No notifications.</p>}
      </div>
    </div>
  );
}
