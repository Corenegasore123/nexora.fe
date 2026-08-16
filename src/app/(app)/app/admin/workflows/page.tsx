"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWorkflows } from "@/lib/api";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Awaited<ReturnType<typeof getWorkflows>>>([]);
  useEffect(() => {
    getWorkflows().then(setWorkflows).catch(() => setWorkflows([]));
  }, []);

  return (
    <div className="page-shell grid gap-4">
      {workflows.map((wf) => (
        <Link key={wf.id} href={`/app/admin/workflows/${wf.id}`} className="card-raised block">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{wf.name}</h3>
              <p className="mt-1 text-sm text-foreground-secondary">{wf.description}</p>
              <p className="mt-3 text-sm">{wf.steps.map((s) => s.name).join(" → ")}</p>
            </div>
            <span className="text-xs uppercase tracking-wider text-foreground-muted">{wf.requestTypes.map((t) => t.name).join(", ") || "Unassigned"}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
