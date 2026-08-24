"use client";

import { useEffect, useState } from "react";
import { Photo } from "@/components/discover/Photo";
import { Icon } from "@/components/icons/Icon";

export type MenuDish = {
  id: string;
  name: string;
  description: string;
  price: number;
  dietary: string;
  popular: boolean;
  imageUrl: string | null;
  category: string;
};

export type MenuSection = { name: string; items: MenuDish[] };

function menuCopy(text: string) {
  const t = text.trim().replace(/[.]+$/, "");
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function priceParts(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

export function MenuItemRow({ item }: { item: MenuDish }) {
  const description = menuCopy(item.description);
  const letter = (item.category || item.name).trim().charAt(0).toUpperCase() || "M";

  return (
    <li className="relative mt-8 pt-8 first:mt-0 first:pt-0 before:absolute before:inset-x-2 before:top-0 before:h-px before:bg-border first:before:hidden">
      <div className="flex items-center gap-5">
        <div className="grid size-[5.5rem] shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--nx-ink-50)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          {item.imageUrl ? (
            <Photo src={item.imageUrl} alt={item.name} className="size-[5.5rem] object-cover" sizes="88px" />
          ) : (
            <span className="font-display text-[1.75rem] font-medium leading-none text-[var(--nx-ink-200)]" aria-hidden>
              {letter}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="inline-flex max-w-[calc(100%-7.5rem)] flex-wrap items-baseline gap-2 font-display text-[1.1875rem] font-medium leading-snug text-ink">
              {item.name}
              {item.popular && (
                <span className="inline-flex items-center rounded-full border border-violet px-1.5 py-[0.15rem] font-sans text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-violet">
                  Popular
                </span>
              )}
            </span>
            <span className="mb-[0.28em] min-w-6 flex-1 border-b-[1.5px] border-dotted border-border" aria-hidden />
            <span className="inline-flex shrink-0 items-baseline gap-[0.35rem] whitespace-nowrap font-mono text-sm font-normal">
              <span className="text-ink-muted">{priceParts(item.price)}</span>
              <span className="text-ink-faint">RWF</span>
            </span>
          </div>
          {description && (
            <p className="mt-2 max-w-xl overflow-hidden text-ellipsis whitespace-nowrap font-sans text-sm leading-normal text-ink-faint">
              {description}
            </p>
          )}
          {item.dietary && (
            <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.06em] text-ink-faint">{item.dietary}</p>
          )}
        </div>
      </div>
    </li>
  );
}

export function MenuModal({
  restaurantName,
  sections,
  open,
  onClose,
  bookHref = "#book",
}: {
  restaurantName: string;
  sections: MenuSection[];
  open: boolean;
  onClose: () => void;
  bookHref?: string;
}) {
  const [section, setSection] = useState(sections[0]?.name ?? "");
  const current = sections.find((g) => g.name === section) ?? sections[0];
  const firstSection = sections[0]?.name ?? "";

  useEffect(() => {
    if (open) setSection(firstSection);
  }, [open, firstSection]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !current) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nx-menu-title"
    >
      <button
        type="button"
        className="absolute inset-0 border-0 bg-[color-mix(in_srgb,var(--nx-ink-900)_45%,transparent)] backdrop-blur-[6px]"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="relative z-[1] flex max-h-[min(90vh,52rem)] w-full max-w-[44rem] flex-col overflow-hidden rounded-3xl border border-border bg-surface-elevated p-10 pb-8 shadow-modal sm:p-12 sm:pb-10">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink-faint">Menu</p>
            <h3 id="nx-menu-title" className="mt-2 font-display text-[clamp(2rem,4vw,2.25rem)] font-medium leading-tight tracking-[-0.03em] text-ink">
              {restaurantName}
            </h3>
          </div>
          <button
            type="button"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-transparent text-ink-faint hover:border-border-strong hover:text-ink [&>svg]:stroke-[1.5]"
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="x" size={16} />
          </button>
        </header>

        {sections.length > 1 && (
          <nav className="nx-cat-tabs mt-8" aria-label="Menu categories">
            {sections.map((g) => (
              <button
                key={g.name}
                type="button"
                className={`nx-cat-tab ${g.name === current.name ? "is-on" : ""}`}
                onClick={() => setSection(g.name)}
              >
                {g.name}
              </button>
            ))}
          </nav>
        )}

        <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">{current.name}</p>
          <ul>
            {current.items.map((item) => (
              <MenuItemRow key={item.id} item={item} />
            ))}
          </ul>
        </div>

        <footer className="mt-8 flex justify-center pt-6">
          <a href={bookHref} className="btn-primary min-h-11 min-w-48" onClick={onClose}>
            Book a Table
          </a>
        </footer>
      </div>
    </div>
  );
}
