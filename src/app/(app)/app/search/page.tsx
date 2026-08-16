"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { searchAll } from "@/lib/api";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Awaited<ReturnType<typeof searchAll>> | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(await searchAll(q));
  };

  return (
    <div className="page-shell space-y-6">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input className="flex-1 rounded-lg border border-border px-3 py-2" placeholder="Search requests, people, assets" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-primary">Search</button>
      </form>
      {result && (
        <div className="grid gap-4 md:grid-cols-3">
          <Result title="Requests">
            {result.requests.map((r) => (
              <Link key={r.id} href={`/app/requests/${r.id}`} className="block py-2 text-sm text-primary">
                {r.number} · {r.type.name}
              </Link>
            ))}
          </Result>
          <Result title="People">
            {result.users.map((u) => (
              <p key={u.id} className="py-2 text-sm">
                {u.name} · {u.role}
              </p>
            ))}
          </Result>
          <Result title="Assets">
            {result.assets.map((a) => (
              <p key={a.id} className="py-2 text-sm">
                {a.tag} · {a.name}
              </p>
            ))}
          </Result>
        </div>
      )}
    </div>
  );
}

function Result({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="card">
      <p className="eyebrow">{title}</p>
      <div className="mt-2">{children}</div>
    </article>
  );
}
