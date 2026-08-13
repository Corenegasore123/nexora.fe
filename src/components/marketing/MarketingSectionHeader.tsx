"use client";

import { ScrollReveal } from "@/components/marketing/lazy-motion";

export function MarketingSectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <ScrollReveal animation="fade-up" className={centered ? `text-center ${className}` : className}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`page-title ${eyebrow ? "mt-3" : ""} ${centered ? "mx-auto" : ""}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-foreground-secondary ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
