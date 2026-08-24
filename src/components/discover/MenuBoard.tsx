"use client";

import { useMemo, useState } from "react";
import { MenuModal, type MenuDish, type MenuSection } from "@/components/discover/MenuModal";

export function MenuBoard({
  restaurantName,
  sections,
  items,
  bookHref = "#book",
}: {
  restaurantName: string;
  sections?: MenuSection[];
  items: MenuDish[];
  bookHref?: string;
}) {
  const grouped = useMemo(() => {
    if (sections?.length) return sections;
    const map = new Map<string, MenuDish[]>();
    for (const item of items) {
      const key = item.category || "Menu";
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()].map(([name, list]) => ({ name, items: list }));
  }, [items, sections]);

  const [open, setOpen] = useState(false);
  const preview = grouped.flatMap((g) => g.items).slice(0, 3);

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">Menu</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            {grouped.map((g) => g.name).join(" · ")} · {items.length} dishes
          </p>
        </div>
        <button type="button" className="btn-primary min-h-11" onClick={() => setOpen(true)}>
          Open menu
        </button>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {preview.map((item) => (
          <li key={item.id} className="py-4">
            <p className="font-display text-lg font-medium text-ink">{item.name}</p>
            <p className="mt-2 font-mono text-sm font-normal text-ink-faint">
              <span className="text-ink-muted">{Math.round(item.price).toLocaleString("en-US")}</span> RWF
            </p>
          </li>
        ))}
      </ul>

      <MenuModal
        restaurantName={restaurantName}
        sections={grouped}
        open={open}
        onClose={() => setOpen(false)}
        bookHref={bookHref}
      />
    </section>
  );
}
