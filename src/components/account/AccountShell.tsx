"use client";

import type { ReactNode } from "react";
import { AccountTabs } from "@/components/account/AccountTabs";

export function AccountShell({
  eyebrow = "Your Nexora",
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="nx-discover">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="nx-page-title">{title}</h1>
      <p className="nx-hero-sub">{subtitle}</p>
      <AccountTabs />
      <div className="mt-10">{children}</div>
    </div>
  );
}
