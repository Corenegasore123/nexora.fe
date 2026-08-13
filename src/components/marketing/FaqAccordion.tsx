"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/Icon";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-pending-bg/50"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-foreground">{item.q}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground-muted">
                <Icon name={isOpen ? "minus" : "plus"} size={16} />
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-border px-6 pb-5 pt-4">
                <p className="text-sm leading-relaxed text-foreground-secondary">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
