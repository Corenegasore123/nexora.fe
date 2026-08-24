"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { myFavorites } from "@/lib/api";
import type { PublicCard } from "@/lib/public";
import { AccountShell } from "@/components/account/AccountShell";
import { RestaurantCard } from "@/components/discover/RestaurantCard";
import { useFavorites } from "@/components/discover/Favorites";

export default function AccountFavoritesPage() {
  const [items, setItems] = useState<PublicCard[] | null>(null);
  const { ids, ready } = useFavorites();

  useEffect(() => {
    myFavorites()
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));
  }, []);

  const visible = useMemo(() => {
    if (!items) return [];
    if (!ready) return items;
    return items.filter((r) => ids.has(r.id));
  }, [items, ids, ready]);

  return (
    <AccountShell title="Favorites." subtitle="Restaurants you want to come back to. Open a card to book a table.">
      {items === null && <p className="text-sm text-foreground-muted">Loading saved restaurants…</p>}
      {items && visible.length > 0 && (
        <div className="nx-catalog-grid nx-catalog-grid-3">
          {visible.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
      {items && !visible.length && (
        <p className="text-sm text-foreground-muted">
          Nothing saved yet.{" "}
          <Link href="/restaurants" className="font-medium text-primary">
            Browse restaurants
          </Link>{" "}
          and tap the heart on a card.
        </p>
      )}
    </AccountShell>
  );
}
