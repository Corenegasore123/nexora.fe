"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";

type Workflow = {
  id: string;
  name: string;
  description: string | null;
  steps: Array<{ id: string; name: string; type: string; slaHours: number | null; department?: { name: string } | null }>;
  transitions: Array<{ id: string; action: string; fromStepId: string | null; toStepId: string | null; toStatus: string | null }>;
};

export default function WorkflowDetailPage() {
  const params = useParams<{ id: string }>();
  const [wf, setWf] = useState<Workflow | null>(null);
  useSetAppPageMeta({ title: wf?.name ?? "Workflow", subtitle: "Configurable steps and transitions" });

  useEffect(() => {
    apiFetch<Workflow>(`/api/workflows/${params.id}`).then(setWf);
  }, [params.id]);

  if (!wf) return <div className="page-shell">Loading…</div>;
  const nameOf = (id: string | null) => wf.steps.find((s) => s.id === id)?.name ?? (id ? "Unknown" : "Start / End");

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-2">
      <article className="card">
        <p className="eyebrow">Steps</p>
        <ol className="mt-4 space-y-3">
          {wf.steps.map((step, i) => (
            <li key={step.id} className="rounded-xl border border-border px-3 py-3">
              <p className="font-medium">{i + 1}. {step.name}</p>
              <p className="text-xs uppercase tracking-wider text-foreground-muted">
                {step.type} · {step.department?.name ?? "System"} · SLA {step.slaHours ?? "—"}h
              </p>
            </li>
          ))}
        </ol>
      </article>
      <article className="card">
        <p className="eyebrow">Transitions</p>
        <ul className="mt-4 space-y-2 text-sm">
          {wf.transitions.map((t) => (
            <li key={t.id} className="rounded-lg border border-border px-3 py-2">
              {nameOf(t.fromStepId)} — {t.action} → {nameOf(t.toStepId)}
              {t.toStatus ? ` (${t.toStatus})` : ""}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
