"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { BrandMark } from "@/components/BrandMark";
import { AccountMenu } from "@/components/marketing/AccountMenu";

const NAV = [
  { href: "/", label: "Discover" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/cities", label: "Cities" },
  { href: "/about", label: "About" },
];

type Session = { ok: boolean; role?: string; home?: string };

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/discover") || pathname.startsWith("/search");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MarketingHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/check", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive) setSession(data?.ok ? data : null);
      })
      .catch(() => {
        if (alive) setSession(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <header className="marketing-header fixed inset-x-0 top-0 z-50">
      <div className="marketing-header-wrap">
        <div className={`marketing-nav-shell ${scrolled || menuOpen ? "marketing-nav-shell-raised" : ""}`}>
          <Link href="/" prefetch className="marketing-nav-logo">
            <span className="marketing-nav-logo-mark">
              <BrandMark size={18} />
            </span>
            <span className="marketing-nav-logo-text">Nexora</span>
          </Link>

          <nav className="marketing-nav-desktop" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`marketing-nav-link ${isNavActive(pathname, item.href) ? "marketing-nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="marketing-nav-actions">
            {session ? (
              <AccountMenu session={session} />
            ) : (
              <Link href="/sign-in" prefetch className="btn-marketing-signin">
                Sign In
              </Link>
            )}
            <button
              type="button"
              className="marketing-nav-menu-btn"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? "x" : "menu"} size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className={`marketing-mobile-nav ${menuOpen ? "marketing-mobile-nav-open" : ""}`} aria-hidden={!menuOpen}>
        <button type="button" className="marketing-mobile-nav-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
        <nav className="marketing-mobile-nav-panel" aria-label="Mobile navigation">
          <div className="marketing-mobile-nav-header">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground-muted">Navigation</p>
            <button type="button" className="marketing-nav-menu-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <Icon name="x" size={18} />
            </button>
          </div>
          <ul className="marketing-mobile-nav-list">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch
                  className={`marketing-mobile-nav-item ${isNavActive(pathname, item.href) ? "marketing-mobile-nav-item-active" : ""}`}
                >
                  <span>{item.label}</span>
                  <Icon name="arrow-right" size={16} />
                </Link>
              </li>
            ))}
          </ul>
          {!session && (
            <div className="marketing-mobile-nav-cta">
              <Link href="/sign-in" prefetch className="btn-marketing-primary w-full justify-center">
                Sign In
              </Link>
              <Link href="/sign-up" prefetch className="marketing-mobile-nav-secondary">
                Create account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
