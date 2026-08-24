"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Suggest = {
  restaurants?: { slug: string; name: string; cuisine: string; city: string }[];
  dishes?: { name: string; restaurant: string; slug: string }[];
  neighborhoods?: { name: string; city: string }[];
  popular?: { slug: string; name: string; cuisine: string; city: string }[];
};

const RECENT_KEY = "nexora-recent-searches";

export function SuggestSearch({ city }: { city?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Suggest | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const t = useRef<number | null>(null);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(async () => {
      const res = await fetch(`/api/public/search/suggest?q=${encodeURIComponent(q)}`, { credentials: "include" });
      if (res.ok) setData(await res.json());
    }, 300);
    return () => {
      if (t.current) window.clearTimeout(t.current);
    };
  }, [q]);

  const go = (term: string) => {
    const next = [term, ...recent.filter((x) => x !== term)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    const params = new URLSearchParams({ q: term });
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm"
        placeholder="Search restaurants, dishes, neighborhoods"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && q.trim()) go(q.trim());
        }}
      />
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-surface p-3 shadow-lg">
          {q.length < 2 && recent.length > 0 && (
            <p className="mb-2 text-xs uppercase tracking-wider text-foreground-muted">Recent</p>
          )}
          {q.length < 2 &&
            recent.map((r) => (
              <button key={r} type="button" className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-primary-soft" onClick={() => go(r)}>
                {r}
              </button>
            ))}
          {(data?.restaurants ?? []).map((r) => (
            <Link key={r.slug} href={`/restaurants/${r.slug}`} className="block rounded-lg px-2 py-2 text-sm hover:bg-primary-soft" onClick={() => setOpen(false)}>
              {r.name} · {r.city}
            </Link>
          ))}
          {(data?.dishes ?? []).map((d) => (
            <Link key={`${d.slug}-${d.name}`} href={`/restaurants/${d.slug}`} className="block rounded-lg px-2 py-2 text-sm hover:bg-primary-soft">
              {d.name} at {d.restaurant}
            </Link>
          ))}
          {(data?.neighborhoods ?? []).map((n) => (
            <button key={n.name} type="button" className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-primary-soft" onClick={() => go(n.name)}>
              {n.name}, {n.city}
            </button>
          ))}
          {q.length < 2 && (data?.popular ?? []).length > 0 && (
            <>
              <p className="mb-2 mt-3 text-xs uppercase tracking-wider text-foreground-muted">Popular</p>
              {data?.popular?.map((r) => (
                <Link key={r.slug} href={`/restaurants/${r.slug}`} className="block rounded-lg px-2 py-2 text-sm hover:bg-primary-soft">
                  {r.name}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
