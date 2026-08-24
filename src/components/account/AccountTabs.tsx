"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/account/reservations", label: "Reservations", match: (p: string) => p === "/account" || p.startsWith("/account/reservations") },
  { href: "/account/favorites", label: "Favorites", match: (p: string) => p.startsWith("/account/favorites") || p.startsWith("/account/saved") },
  { href: "/account/reviews", label: "Reviews", match: (p: string) => p.startsWith("/account/reviews") },
  { href: "/account/profile", label: "Profile", match: (p: string) => p.startsWith("/account/profile") },
];

export function AccountTabs() {
  const pathname = usePathname();
  return (
    <nav className="nx-cat-tabs mt-8" aria-label="Account">
      {TABS.map((tab) => {
        const on = tab.match(pathname);
        return (
          <Link key={tab.href} href={tab.href} className={`nx-cat-tab no-underline ${on ? "is-on" : ""}`} aria-current={on ? "page" : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
