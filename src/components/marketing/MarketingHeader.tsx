"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons/Icon";

const NAV = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return (
      <div className="absolute inset-x-0 top-0 z-50 px-4 pt-4">
        <div className="marketing-nav-shell flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold tracking-tight text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              QS
            </span>
            QuantScope
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-medium uppercase tracking-wider transition-colors hover:text-primary ${
                  pathname === item.href ? "text-white" : "text-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/80 hover:text-white sm:inline-flex"
            >
              Sign In
            </Link>
            <Link href="/sign-up" className="btn-marketing-primary py-2 text-xs">
              Get Started
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-[var(--color-on-primary)]">
            QS
          </span>
          QuantScope
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-foreground-secondary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="btn-ghost hidden sm:inline-flex">
            Sign In
          </Link>
          <Link href="/sign-up" className="btn-primary py-2.5 text-sm">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
