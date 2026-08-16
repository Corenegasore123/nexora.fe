"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { BrandMark } from "@/components/BrandMark";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isNavActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href;
}

export function MarketingHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className="marketing-header fixed inset-x-0 top-0 z-50">
      <div className="marketing-header-wrap">
        <div
          className={`marketing-nav-shell ${scrolled || menuOpen ? "marketing-nav-shell-raised" : ""}`}
        >
          {/* Logo */}
          <Link href="/" prefetch className="marketing-nav-logo">
            <span className="marketing-nav-logo-mark">
              <BrandMark size={18} />
            </span>
            <span className="marketing-nav-logo-text">Nexora</span>
          </Link>

          {/* Desktop nav — centered */}
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

          {/* Actions — far right */}
          <div className="marketing-nav-actions">
            <Link href="/sign-in" prefetch className="btn-marketing-signin marketing-nav-signin-full">
              Sign In
            </Link>
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

      {/* Mobile / tablet menu */}
      <div
        className={`marketing-mobile-nav ${menuOpen ? "marketing-mobile-nav-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="marketing-mobile-nav-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <nav className="marketing-mobile-nav-panel" aria-label="Mobile navigation">
          <div className="marketing-mobile-nav-header">
            <p className="text-xs font-bold uppercase tracking-widest text-white/45">Navigation</p>
            <button
              type="button"
              className="marketing-nav-menu-btn"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
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
          <div className="marketing-mobile-nav-cta">
            <Link href="/sign-in" prefetch className="btn-marketing-primary w-full justify-center">
              Sign In
            </Link>
            <Link href="/sign-up" prefetch className="marketing-mobile-nav-secondary">
              Create account
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
