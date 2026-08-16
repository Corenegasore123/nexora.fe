"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRequest, getRequestTypes } from "@/lib/api";

export default function NewRequestPage() {
  const router = useRouter();
  const [types, setTypes] = useState<Awaited<ReturnType<typeof getRequestTypes>>>([]);
  const [typeId, setTypeId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRequestTypes().then((rows) => {
      setTypes(rows);
      if (rows[0]) setTypeId(rows[0].id);
    });
  }, []);

  const selected = types.find((t) => t.id === typeId);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { request } = await createRequest({
        typeId,
        priority,
        formData: { purpose },
        submit: true,
      });
      router.push(`/app/requests/${request.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create request");
      setLoading(false);
    }
  };

  return (
    <div className="page-shell max-w-2xl">
      <form onSubmit={onSubmit} className="card space-y-5">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Request type</span>
          <select className="w-full rounded-lg border border-border bg-input-background px-3 py-2" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        {selected && (
          <p className="text-sm text-foreground-secondary">
            SLA {selected.slaHours}h · Workflow: {selected.workflow.steps.map((s) => s.name).join(" → ")}
          </p>
        )}
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Priority</span>
          <select className="w-full rounded-lg border border-border px-3 py-2" value={priority} onChange={(e) => setPriority(e.target.value)}>
            {["LOW", "NORMAL", "HIGH", "URGENT"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Purpose / notes</span>
          <textarea className="w-full rounded-lg border border-border px-3 py-2" rows={4} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </label>
        {error && <p className="text-sm text-error">{error}</p>}
        <button className="btn-primary" disabled={loading || !typeId}>
          {loading ? "Submitting…" : "Submit request"}
        </button>
      </form>
    </div>
  );
}
