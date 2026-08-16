"use client";

import { useEffect, useState } from "react";
import { getRequestTypes } from "@/lib/api";

export default function RequestTypesPage() {
  const [types, setTypes] = useState<Awaited<ReturnType<typeof getRequestTypes>>>([]);
  useEffect(() => {
    getRequestTypes().then(setTypes).catch(() => setTypes([]));
  }, []);
  return (
    <div className="page-shell grid gap-4 md:grid-cols-2">
      {types.map((t) => (
        <article key={t.id} className="card">
          <p className="text-xs uppercase tracking-wider text-foreground-muted">{t.code}</p>
          <h3 className="mt-1 text-lg font-semibold">{t.name}</h3>
          <p className="mt-2 text-sm text-foreground-secondary">SLA {t.slaHours} hours</p>
          <p className="mt-3 text-sm">{t.workflow.steps.map((s) => s.name).join(" → ")}</p>
        </article>
      ))}
    </div>
  );
}
