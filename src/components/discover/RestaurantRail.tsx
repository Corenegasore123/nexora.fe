"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicCard } from "@/lib/public";
import { RestaurantCard } from "@/components/discover/RestaurantCard";

export function RestaurantRail({ title, items }: { title: string; items: PublicCard[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  if (!items.length) return null;

  const scrollBy = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.min(320, Math.max(240, el.clientWidth * 0.8));
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className="nx-rail">
      <div className="nx-rail-head">
        <h2 className="nx-section-title">{title}</h2>
        <div className="nx-rail-nav" aria-label={`${title} scroll controls`}>
          <button type="button" className="nx-rail-nav-btn" aria-label="Scroll left" onClick={() => scrollBy(-1)}>
            <ChevronLeft size={18} strokeWidth={2.1} />
          </button>
          <button type="button" className="nx-rail-nav-btn" aria-label="Scroll right" onClick={() => scrollBy(1)}>
            <ChevronRight size={18} strokeWidth={2.1} />
          </button>
        </div>
      </div>
      <div className="nx-rail-track" ref={trackRef}>
        {items.map((r) => (
          <div key={r.id} className="nx-rail-item">
            <RestaurantCard restaurant={r} />
          </div>
        ))}
      </div>
    </section>
  );
}
