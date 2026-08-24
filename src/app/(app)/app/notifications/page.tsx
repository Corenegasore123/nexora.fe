"use client";

import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, markNotificationRead, type AppNotification } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const load = () => getNotifications().then(setNotifications).catch(() => undefined);
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
        {notifications.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => markNotificationRead(n.id).then(load)}
            className={`block w-full px-5 py-4 text-left hover:bg-pending-bg ${n.read ? "opacity-60" : ""}`}
          >
            <p className="font-medium">{n.title}</p>
            {n.body && <p className="mt-1 text-sm text-foreground-secondary">{n.body}</p>}
            <time className="mt-2 block text-[11px] text-foreground-muted">{new Date(n.createdAt).toLocaleString()}</time>
          </button>
        ))}
        {!notifications.length && <p className="px-5 py-10 text-center text-foreground-muted">No notifications.</p>}
      </div>
    </div>
  );
}
