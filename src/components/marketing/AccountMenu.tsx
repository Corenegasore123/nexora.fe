"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { logout } from "@/lib/api";

type Session = { ok: boolean; role?: string; home?: string };

const DINER_LINKS = [
  { href: "/account", label: "Overview" },
  { href: "/account/reservations", label: "Reservations" },
  { href: "/account/favorites", label: "Favorites" },
  { href: "/account/reviews", label: "Reviews" },
  { href: "/account/profile", label: "Profile" },
];

const itemClass =
  "block w-full rounded-xl px-3 py-2.5 text-left text-sm text-ink hover:bg-surface-elevated";

export function AccountMenu({ session }: { session: Session }) {
  const pathname = usePathname();
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const diner = session.role === "CUSTOMER";
  const workspace = session.home || (session.role === "PLATFORM_ADMIN" ? "/platform-admin" : "/app");
  const active = open || pathname.startsWith("/account");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrap}>
      <button
        type="button"
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider ${
          active ? "border-primary text-primary" : "border-border text-foreground hover:border-primary hover:text-primary"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="user" size={16} />
        <span>Account</span>
        <Icon name="chevron-down" size={14} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-40 mt-2 min-w-[13.5rem] rounded-2xl border border-border bg-surface p-1.5 shadow-elevated"
          role="menu"
        >
          {diner &&
            DINER_LINKS.map((item) => {
              const on =
                pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className={`${itemClass} ${on ? "bg-surface-elevated" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          {!diner && (
            <Link href={workspace} role="menuitem" className={itemClass}>
              Workspace
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            className={`${itemClass} mt-1 text-foreground-muted`}
            onClick={async () => {
              await logout();
              setOpen(false);
              router.push("/");
              router.refresh();
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
