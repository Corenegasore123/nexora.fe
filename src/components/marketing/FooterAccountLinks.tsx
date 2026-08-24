"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const GUEST = [
  { href: "/about", label: "About Nexora" },
  { href: "/reservations/lookup", label: "Find a reservation" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up", label: "Create account" },
];

const DINER = [
  { href: "/account", label: "Overview" },
  { href: "/account/reservations", label: "Reservations" },
  { href: "/account/favorites", label: "Favorites" },
  { href: "/account/reviews", label: "Reviews" },
  { href: "/account/profile", label: "Profile" },
];

export function FooterAccountLinks() {
  const [diner, setDiner] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setDiner(data?.ok && data?.role === "CUSTOMER"))
      .catch(() => setDiner(false));
  }, []);

  const links = diner ? DINER : GUEST;

  return (
    <ul className="marketing-footer-links">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="marketing-footer-link">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
