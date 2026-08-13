"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  Notification,
} from "@/lib/api";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = () => {
    getNotifications()
      .then((data) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => undefined);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleRead = async (n: Notification) => {
    if (!n.read) {
      await markNotificationRead(n.id);
      load();
    }
    setOpen(false);
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    load();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg px-2 py-1 text-xs font-medium text-foreground-muted hover:bg-pending-bg hover:text-primary"
        aria-label="Notifications"
      >
        Alerts
        {unreadCount > 0 && (
          <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-[var(--color-on-primary)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl border border-border bg-surface-elevated shadow-elevated">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-foreground">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleReadAll}
                className="text-[10px] text-foreground-muted hover:text-primary"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-foreground-muted">No notifications</p>
            )}
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link ?? "#"}
                onClick={() => handleRead(n)}
                className={`block border-b border-border px-4 py-3 transition-colors hover:bg-pending-bg ${
                  n.read ? "opacity-60" : ""
                }`}
              >
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                {n.body && <p className="mt-1 text-xs text-foreground-muted">{n.body}</p>}
                <time className="mt-2 block text-[10px] text-foreground-placeholder">
                  {new Date(n.createdAt).toLocaleString()}
                </time>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
