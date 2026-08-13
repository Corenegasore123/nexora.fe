"use client";

import { useState } from "react";
import { apiUrl } from "@/lib/api";

const TEMPLATES = [
  { id: "full", label: "Full report", desc: "All measurements, steps, and metadata" },
  { id: "summary", label: "Summary", desc: "Result and confidence only" },
  { id: "audit", label: "Audit trail", desc: "Corrections, versions, OCR provenance" },
  { id: "client", label: "Client deliverable", desc: "Professional output without internal IDs" },
] as const;

const FORMATS = ["pdf", "csv", "json"] as const;

interface Props {
  jobId: string;
  filename: string;
}

export function ReportExportMenu({ jobId, filename }: Props) {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<(typeof TEMPLATES)[number]["id"]>("full");

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="btn-secondary py-2 text-xs">
        Export report
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl border border-border bg-surface-elevated p-4 shadow-xl">
          <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted">Template</p>
          <div className="mt-2 space-y-2">
            {TEMPLATES.map((t) => (
              <label
                key={t.id}
                className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors ${
                  template === t.id ? "border-primary bg-selected" : "border-border hover:border-border-strong"
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={t.id}
                  checked={template === t.id}
                  onChange={() => setTemplate(t.id)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{t.label}</p>
                  <p className="text-xs text-foreground-muted">{t.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-foreground-muted">Format</p>
          <div className="mt-2 flex gap-2">
            {FORMATS.map((fmt) => (
              <a
                key={fmt}
                href={apiUrl(`/api/calculations/${jobId}/report?format=${fmt}&template=${template}`)}
                download={`report-${filename}-${template}.${fmt}`}
                onClick={() => setOpen(false)}
                className="btn-ghost flex-1 py-2 text-center uppercase"
              >
                {fmt}
              </a>
            ))}
          </div>

          <a
            href={apiUrl(`/api/calculations/${jobId}/compare?format=csv`)}
            download={`comparison-${jobId}.csv`}
            className="mt-3 block text-center text-xs text-foreground-muted hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Export comparison CSV
          </a>
        </div>
      )}
    </div>
  );
}
