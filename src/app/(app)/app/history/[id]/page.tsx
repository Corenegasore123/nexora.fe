"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ImageAnnotation } from "@/components/ImageAnnotation";
import { CalculationEditor } from "@/components/CalculationEditor";
import { ReportExportMenu } from "@/components/ReportExportMenu";
import { ComparisonView } from "@/components/ComparisonView";
import { classifyConfidence } from "@/lib/confidence";
import { apiUrl, apiFetch } from "@/lib/api";

interface JobDetail {
  id: string;
  status: string;
  version: number;
  scenarioName: string | null;
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
    userCorrected?: boolean;
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
  revisions?: Array<{
    id: string;
    version: number;
    label: string | null;
    result: number;
    unit: string;
    createdAt: string;
  }>;
  scenarios?: Array<{
    id: string;
    scenarioName: string | null;
    version: number;
    result: { result: number; unit: string } | null;
  }>;
  parentJob?: { id: string; scenarioName: string | null; version: number } | null;
  result: {
    formula: string;
    formulaLatex: string;
    result: number;
    unit: string;
    validation: {
      status?: string;
      warnings?: string[];
      lowConfidenceIds?: string[];
      provenance?: {
        provider: string;
        pipelineVersion: string;
        preprocessed: boolean;
        preprocessingOps: string[];
        fallbackUsed: boolean;
      };
    };
  } | null;
}

function confidenceBadge(cls: string) {
  if (cls === "accepted") return "confidence-high";
  if (cls === "flagged") return "confidence-medium";
  return "confidence-low";
}

export default function CalculationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<JobDetail | null>(null);

  const reload = () => {
    apiFetch<JobDetail>(`/api/app/history/${id}`)
      .then(setJob)
      .catch(console.error);
  };

  useEffect(() => {
    reload();
  }, [id]);

  if (!job) {
    return (
      <div className="page-shell">
        <p className="text-foreground-muted">Loading…</p>
      </div>
    );
  }

  if (job.status === "FAILED") {
    return (
      <div className="page-shell">
        <p className="eyebrow">Error</p>
        <h1 className="page-title mt-3 text-error">Calculation Failed</h1>
        <p className="mt-4 text-foreground-secondary">{job.errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="eyebrow">Result</p>
          <h1 className="page-title mt-3">{job.image.filename}</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            {job.scenarioName ? `${job.scenarioName} · ` : ""}
            {job.workItem?.replace(/_/g, " ")} · {job.method?.replace(/_/g, " ")} · v
            {job.version}
          </p>
          {job.parentJob && (
            <a
              href={`/app/history/${job.parentJob.id}`}
              className="mt-1 inline-block text-xs text-foreground-muted hover:text-foreground"
            >
              ← Original calculation
            </a>
          )}
        </div>
        <ReportExportMenu jobId={id} filename={job.image.filename} />
      </div>

      {job.result?.validation?.status === "needs_review" && (
        <div className="alert-warning mt-8">
          <p className="text-sm font-medium">Review recommended</p>
          <p className="mt-1 text-sm opacity-90">
            Some measurements have low confidence. Verify values before using this result
            professionally.
          </p>
          {job.result.validation.warnings && job.result.validation.warnings.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs opacity-80">
              {job.result.validation.warnings.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {job.result?.validation?.provenance && (
        <div className="mt-6 text-xs text-foreground-placeholder">
          OCR: {job.result.validation.provenance.provider} · Pipeline{" "}
          {job.result.validation.provenance.pipelineVersion}
          {job.result.validation.provenance.fallbackUsed && " · Aggressive preprocessing used"}
        </div>
      )}

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
            <div className="mt-4 rounded-2xl border border-border-strong bg-surface-elevated p-8">
              <p className="text-5xl font-bold tracking-tight text-foreground">
                {job.result.result}
                <span className="ml-2 text-2xl font-light text-foreground-secondary">
                  {job.result.unit}
                </span>
              </p>
              {job.overallConfidence && (
                <p className="mt-4 text-sm text-foreground-muted">
                  Overall confidence{" "}
                  <span className="font-medium text-foreground">
                    {(job.overallConfidence * 100).toFixed(0)}%
                  </span>
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      <section className="mt-12">
        <h2 className="section-label">Variables — Edit &amp; Recalculate</h2>
        <div className="mt-4">
          <CalculationEditor
            jobId={id}
            version={job.version}
            variables={job.variables}
            revisions={job.revisions ?? []}
            scenarios={job.scenarios ?? []}
            onUpdated={reload}
          />
        </div>
      </section>

      <ComparisonView jobId={id} />

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
                    <td className="font-mono text-foreground">
                      {m.rawText}
                      {m.userCorrected && (
                        <span className="ml-2 text-xs text-user-correction">corrected</span>
                      )}
                    </td>
                    <td>{m.value}</td>
                    <td>{m.unit}</td>
                    <td>{(m.confidence * 100).toFixed(0)}%</td>
                    <td className={`capitalize ${confidenceBadge(cls)}`}>
                      {cls}
                      {job.result?.validation?.lowConfidenceIds?.includes(m.id) && (
                        <span className="ml-2 text-warning" title="Low confidence">
                          ⚠
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="section-label">Calculation Steps</h2>
        <div className="mt-4 space-y-3">
          {job.steps.map((step) => (
            <div key={step.stepOrder} className="card-raised">
              <p className="font-semibold text-foreground">
                {String(step.stepOrder + 1).padStart(2, "0")}. {step.ruleName}
              </p>
              <p className="mt-2 font-mono text-sm text-foreground-secondary">{step.formula}</p>
              <p className="mt-2 text-xs text-foreground-placeholder">
                Inputs: {JSON.stringify(step.inputs)}
              </p>
              <p className="mt-3 text-lg font-bold text-foreground">
                = {step.result} {step.unit}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
