"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ImageAnnotation } from "@/components/ImageAnnotation";
import { classifyConfidence } from "@/lib/confidence";
import { apiUrl, apiFetch } from "@/lib/api";

interface JobDetail {
  id: string;
  status: string;
  workItem: string | null;
  method: string | null;
  overallConfidence: number | null;
  errorMessage: string | null;
  image: { id: string; filename: string };
  measurements: Array<{
    id: string;
    value: number;
    unit: string;
    rawText: string;
    confidence: number;
    boundingBox: { x: number; y: number; width: number; height: number };
    label: string | null;
  }>;
  variables: Array<{
    name: string;
    value: number;
    unit: string;
    confidence: number;
    measurementId: string | null;
  }>;
  steps: Array<{
    stepOrder: number;
    ruleName: string;
    formula: string;
    inputs: Record<string, number>;
    result: number;
    unit: string;
  }>;
  result: {
    formula: string;
    formulaLatex: string;
    result: number;
    unit: string;
    validation: { status?: string; warnings?: string[] };
  } | null;
}

function confidenceBadge(cls: string) {
  if (cls === "accepted") return "text-emerald-400";
  if (cls === "flagged") return "text-amber-400";
  return "text-red-400";
}

export default function CalculationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<JobDetail | null>(null);

  useEffect(() => {
    apiFetch<JobDetail>(`/api/calculations/${id}`)
      .then(setJob)
      .catch(console.error);
  }, [id]);

  if (!job) {
    return (
      <div className="page-shell">
        <p className="text-neutral-500">Loading…</p>
      </div>
    );
  }

  if (job.status === "FAILED") {
    return (
      <div className="page-shell">
        <p className="eyebrow">Error</p>
        <h1 className="page-title mt-3 text-red-400">Calculation Failed</h1>
        <p className="mt-4 text-neutral-400">{job.errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Result</p>
          <h1 className="page-title mt-3">{job.image.filename}</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {job.workItem?.replace(/_/g, " ")} · {job.method?.replace(/_/g, " ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={apiUrl(`/api/calculations/${id}/report?format=pdf`)} className="btn-ghost">
            PDF
          </a>
          <a href={apiUrl(`/api/calculations/${id}/report?format=json`)} className="btn-ghost">
            JSON
          </a>
          <a href={apiUrl(`/api/calculations/${id}/report?format=csv`)} className="btn-ghost">
            CSV
          </a>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="section-label">Input Image</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface p-3">
            <ImageAnnotation
              imageUrl={apiUrl(`/api/images/${id}`)}
              measurements={job.measurements}
              variables={job.variables}
            />
          </div>
        </section>

        <section>
          <h2 className="section-label">Final Result</h2>
          {job.result && (
            <div className="mt-4 rounded-2xl border border-border-strong bg-surface-raised p-8">
              <p className="text-5xl font-bold tracking-tight text-white">
                {job.result.result}
                <span className="ml-2 text-2xl font-light text-neutral-400">
                  {job.result.unit}
                </span>
              </p>
              {job.overallConfidence && (
                <p className="mt-4 text-sm text-neutral-500">
                  Overall confidence{" "}
                  <span className="font-medium text-white">
                    {(job.overallConfidence * 100).toFixed(0)}%
                  </span>
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      <section className="mt-12">
        <h2 className="section-label">Detected Measurements</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="data-table">
            <thead>
              <tr>
                <th>Raw Text</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Confidence</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {job.measurements.map((m) => {
                const cls = classifyConfidence(m.confidence);
                return (
                  <tr key={m.id}>
                    <td className="font-mono text-white">{m.rawText}</td>
                    <td>{m.value}</td>
                    <td>{m.unit}</td>
                    <td>{(m.confidence * 100).toFixed(0)}%</td>
                    <td className={`capitalize ${confidenceBadge(cls)}`}>{cls}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="section-label">Variables Assigned</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {job.variables.map((v) => (
            <div key={v.name} className="card-raised">
              <p className="text-xs uppercase tracking-wider text-neutral-500">
                {v.name.replace(/_/g, " ")}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {v.value} {v.unit}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {(v.confidence * 100).toFixed(0)}% confidence
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="section-label">Calculation Steps</h2>
        <div className="mt-4 space-y-3">
          {job.steps.map((step) => (
            <div key={step.stepOrder} className="card-raised">
              <p className="font-semibold text-white">
                {String(step.stepOrder + 1).padStart(2, "0")}. {step.ruleName}
              </p>
              <p className="mt-2 font-mono text-sm text-neutral-400">{step.formula}</p>
              <p className="mt-2 text-xs text-neutral-600">
                Inputs: {JSON.stringify(step.inputs)}
              </p>
              <p className="mt-3 text-lg font-bold text-white">
                = {step.result} {step.unit}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
