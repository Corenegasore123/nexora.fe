"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4">
      <div
        className={`marketing-nav-shell justify-between gap-6 transition-all duration-300 ${
          scrolled ? "shadow-modal ring-1 ring-white/10" : ""
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center gap-3 text-sm font-bold tracking-tight text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-xs font-bold text-[var(--color-on-accent)] transition-transform duration-300 hover:scale-105">
            QS
          </span>
          <span className="hidden sm:inline">QuantScope</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-medium uppercase tracking-wider transition-colors hover:text-accent ${
                pathname === item.href ? "text-accent" : "text-white/75"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/sign-in" className="btn-marketing-signin">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
