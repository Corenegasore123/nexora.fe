"use client";

import { useEffect, useState } from "react";
import { getMenu, rwf, uploadMenuPhoto, type MenuItem } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { Photo } from "@/components/discover/Photo";

const LABELS: Record<string, string> = {
  STAR: "Stars — high sales + high margin",
  PLOW_HORSE: "Plow Horses — high sales + low margin",
  PUZZLE: "Puzzles — low sales + high margin",
  DOG: "Dogs — low sales + low margin",
};

const MIN_PX = 800;

async function squareCrop(file: File) {
  const bmp = await createImageBitmap(file);
  if (Math.min(bmp.width, bmp.height) < MIN_PX) {
    throw new Error(`Use a restaurant photo at least ${MIN_PX}×${MIN_PX}.`);
  }
  const size = Math.min(bmp.width, bmp.height);
  const canvas = document.createElement("canvas");
  canvas.width = MIN_PX;
  canvas.height = MIN_PX;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not crop photo");
  ctx.drawImage(bmp, (bmp.width - size) / 2, (bmp.height - size) / 2, size, size, 0, 0, MIN_PX, MIN_PX);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
  if (!blob) throw new Error("Could not encode photo");
  return blob;
}

function DishPhoto({
  item,
  onUploaded,
}: {
  item: MenuItem;
  onUploaded: (next: MenuItem) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const letter = item.category.name.trim().charAt(0).toUpperCase() || "M";

  return (
    <label className="relative cursor-pointer self-start">
      <span className="relative grid size-[5.5rem] shrink-0 place-items-center overflow-hidden rounded-xl bg-[var(--nx-ink-50)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        {item.imageUrl ? (
          <Photo src={item.imageUrl} alt="" className="size-[5.5rem] object-cover" sizes="88px" />
        ) : (
          <span className="font-display text-[1.75rem] font-medium leading-none text-[var(--nx-ink-200)]">{letter}</span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-[rgba(23,23,23,0.5)] px-1 py-0.5 text-center text-[0.5625rem] font-semibold uppercase tracking-[0.06em] text-white">
          {busy ? "Saving…" : "Restaurant photo"}
        </span>
      </span>
      <input
        type="file"
        accept="image/jpeg,image/png"
        className="sr-only"
        disabled={busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          setError(null);
          try {
            const cropped = await squareCrop(file);
            const next = await uploadMenuPhoto(item.id, cropped);
            onUploaded(next);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not upload photo");
          } finally {
            setBusy(false);
          }
        }}
      />
      {error && <span className="absolute left-0 top-[calc(100%+0.35rem)] w-44 text-[0.6875rem] text-error">{error}</span>}
    </label>
  );
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    getMenu().then(setItems);
  }, []);

  return (
    <div className="page-shell space-y-4">
      {items.map((item) => {
        const sold = item.orderLines.reduce((s, l) => s + l.quantity, 0);
        const revenue = sold * item.price;
        const margin = item.price ? Math.round(((item.price - item.ingredientCost) / item.price) * 100) : 0;
        return (
          <article key={item.id} className="card grid gap-4 md:grid-cols-[88px_1fr_280px]">
            <DishPhoto
              item={item}
              onUploaded={(next) => setItems((rows) => rows.map((row) => (row.id === next.id ? { ...row, imageUrl: next.imageUrl } : row)))}
            />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <StatusBadge status={item.classification} />
              </div>
              <p className="mt-2 text-xs text-foreground-muted">{LABELS[item.classification]}</p>
              <p className="mt-3 text-sm">
                Selling price {rwf(item.price)} · Ingredient cost {rwf(item.ingredientCost)} · Gross margin {margin}%
              </p>
              <p className="mt-1 text-sm text-foreground-secondary">
                Orders {sold.toLocaleString()} · Revenue {rwf(revenue)}
              </p>
            </div>
            <div>
              <p className="eyebrow">Recipe</p>
              <ul className="mt-2 space-y-1 text-sm">
                {item.recipe.map((line) => (
                  <li key={line.ingredient.name}>
                    {line.ingredient.name} · {line.quantity}
                    {line.ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
