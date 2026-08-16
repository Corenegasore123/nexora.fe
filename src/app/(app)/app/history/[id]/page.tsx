"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ImageAnnotation } from "@/components/ImageAnnotation";
import { CalculationEditor } from "@/components/CalculationEditor";
import { ReportExportMenu } from "@/components/ReportExportMenu";
import { ComparisonView } from "@/components/ComparisonView";
import { classifyConfidence } from "@/lib/confidence";
import { apiUrl, apiFetch } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { SkeletonTable } from "@/components/ui/Skeleton";

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

type DetailTab = "overview" | "measurements" | "calculation" | "compare";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "measurements", label: "Measurements" },
  { id: "calculation", label: "Calculation" },
  { id: "compare", label: "Compare" },
];

function confidenceBadge(cls: string) {
  if (cls === "accepted") return "status-badge status-completed";
  if (cls === "flagged") return "status-badge status-processing";
  return "status-badge status-failed";
}

function statusClass(status: string) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

function confidenceTone(value: number | null) {
  if (value === null) return "calc-detail-confidence-neutral";
  if (value >= 0.85) return "calc-detail-confidence-high";
  if (value >= 0.65) return "calc-detail-confidence-medium";
  return "calc-detail-confidence-low";
}

export default function CalculationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [job, setJob] = useState<JobDetail | null>(null);
  const [tab, setTab] = useState<DetailTab>("overview");

  const reload = () => {
    apiFetch<JobDetail>(`/api/app/history/${id}`)
      .then(setJob)
      .catch(() => setJob(null));
  };

  useEffect(() => {
    reload();
  }, [id]);

  const lowConfidenceCount = useMemo(
    () => job?.result?.validation?.lowConfidenceIds?.length ?? 0,
    [job]
  );

  const pageSubtitle = useMemo(() => {
    if (!job) return "Loading result…";
    const parts = [
      job.workItem?.replace(/_/g, " "),
      job.method?.replace(/_/g, " "),
      `v${job.version}`,
    ].filter(Boolean);
    return parts.join(" · ");
  }, [job]);

  useSetAppPageMeta({
    title: job?.image.filename ?? "Calculation",
    subtitle: pageSubtitle,
  });

  if (!job) {
    return (
      <div className="dashboard-shell">
        <SkeletonTable rows={8} />
      </div>
    );
  }

  if (job.status === "FAILED") {
    return (
      <div className="dashboard-shell">
        <section className="dashboard-section">
          <div className="dashboard-empty">
            <span className="history-detail-error-icon">
              <Icon name="x" size={24} />
            </span>
            <p className="text-lg font-semibold text-error">Calculation failed</p>
            <p className="mt-2 max-w-lg text-sm text-foreground-secondary">{job.errorMessage}</p>
            <Link href="/app/calculator" className="btn-primary mt-6 inline-flex gap-2">
              <Icon name="upload" size={16} />
              Try again
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const confidencePct = job.overallConfidence ? Math.round(job.overallConfidence * 100) : null;

  return (
    <div className="dashboard-shell calc-detail">
      <header className="calc-detail-header">
        <div className="calc-detail-header-main">
          <Link href="/app/history" className="project-detail-back">
            <Icon name="arrow-right" size={14} className="rotate-180" />
            All calculations
          </Link>
          <div className="calc-detail-chips">
            <span className={statusClass(job.status)}>{job.status.replace(/_/g, " ")}</span>
            {job.workItem && (
              <span className="calc-detail-chip">{job.workItem.replace(/_/g, " ")}</span>
            )}
            {job.method && (
              <span className="calc-detail-chip">{job.method.replace(/_/g, " ")}</span>
            )}
            <span className="calc-detail-chip">v{job.version}</span>
          </div>
          {job.scenarioName && (
            <p className="text-sm text-foreground-secondary">{job.scenarioName}</p>
          )}
          {job.parentJob && (
            <Link href={`/app/history/${job.parentJob.id}`} className="text-xs text-primary hover:underline">
              ← Original calculation (v{job.parentJob.version})
            </Link>
          )}
        </div>
        <ReportExportMenu jobId={id} filename={job.image.filename} />
      </header>

      <div className="calc-detail-hero">
        <div className="calc-detail-hero-result">
          <p className="calc-detail-hero-label">Quantity result</p>
          {job.result ? (
            <p className="calc-detail-hero-value">
              {job.result.result}
              <span className="calc-detail-hero-unit">{job.result.unit}</span>
            </p>
          ) : (
            <p className="calc-detail-hero-value">—</p>
          )}
          {job.result && (
            <code className="calc-detail-formula">{job.result.formula}</code>
          )}
        </div>
        <div className={`calc-detail-confidence ${confidenceTone(job.overallConfidence)}`}>
          <p className="calc-detail-confidence-label">Overall confidence</p>
          <p className="calc-detail-confidence-value">
            {confidencePct !== null ? `${confidencePct}%` : "—"}
          </p>
          {confidencePct !== null && (
            <div className="calc-detail-confidence-bar" aria-hidden>
              <span style={{ width: `${confidencePct}%` }} />
            </div>
          )}
          <dl className="calc-detail-confidence-stats">
            <div>
              <dt>Measurements</dt>
              <dd>{job.measurements.length}</dd>
            </div>
            <div>
              <dt>Variables</dt>
              <dd>{job.variables.length}</dd>
            </div>
            <div>
              <dt>Steps</dt>
              <dd>{job.steps.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      {job.result?.validation?.status === "needs_review" && (
        <div className="dashboard-notice">
          <Icon name="eye" size={18} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Review recommended</p>
            <p className="mt-0.5 text-xs opacity-90">
              {lowConfidenceCount > 0
                ? `${lowConfidenceCount} measurement${lowConfidenceCount === 1 ? "" : "s"} flagged for review.`
                : "Some measurements have low confidence."}{" "}
              Verify values before using professionally.
            </p>
            {job.result.validation.warnings && job.result.validation.warnings.length > 0 && (
              <ul className="mt-2 space-y-0.5 text-xs opacity-80">
                {job.result.validation.warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            )}
          </div>
          <button type="button" onClick={() => setTab("measurements")} className="dashboard-notice-link">
            Review
          </button>
        </div>
      )}

      <nav className="project-detail-tabs" role="tablist" aria-label="Calculation sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`project-detail-tab ${tab === t.id ? "project-detail-tab-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="calc-detail-overview">
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <span className="settings-section-icon">
                <Icon name="scan" size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-foreground">Annotated diagram</h2>
                <p className="mt-1 text-xs text-foreground-muted">
                  Detected measurements overlaid on the source image.
                </p>
              </div>
            </div>
            <div className="calc-detail-image-wrap">
              <ImageAnnotation
                imageUrl={apiUrl(`/api/images/${id}`)}
                measurements={job.measurements}
                variables={job.variables}
              />
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <span className="settings-section-icon">
                <Icon name="clipboard-check" size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-foreground">Summary</h2>
                <p className="mt-1 text-xs text-foreground-muted">Key metadata for this run.</p>
              </div>
            </div>
            <dl className="calc-detail-summary">
              <div className="calc-detail-summary-item">
                <dt>Filename</dt>
                <dd>{job.image.filename}</dd>
              </div>
              <div className="calc-detail-summary-item">
                <dt>Work item</dt>
                <dd>{job.workItem?.replace(/_/g, " ") ?? "—"}</dd>
              </div>
              <div className="calc-detail-summary-item">
                <dt>Method</dt>
                <dd>{job.method?.replace(/_/g, " ") ?? "—"}</dd>
              </div>
              <div className="calc-detail-summary-item">
                <dt>Validation</dt>
                <dd className="capitalize">{job.result?.validation?.status?.replace(/_/g, " ") ?? "—"}</dd>
              </div>
              {job.result?.validation?.provenance && (
                <div className="calc-detail-summary-item calc-detail-summary-wide">
                  <dt>Pipeline</dt>
                  <dd>
                    {job.result.validation.provenance.provider} · v
                    {job.result.validation.provenance.pipelineVersion}
                    {job.result.validation.provenance.fallbackUsed && " · enhanced preprocessing"}
                  </dd>
                </div>
              )}
            </dl>
            <div className="calc-detail-overview-actions">
              <button type="button" onClick={() => setTab("calculation")} className="btn-secondary py-2 text-xs">
                Edit variables
              </button>
              <button type="button" onClick={() => setTab("measurements")} className="btn-ghost py-2 text-xs">
                View measurements
              </button>
            </div>
          </section>
        </div>
      )}

      {tab === "measurements" && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <span className="settings-section-icon">
              <Icon name="microscope" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">Detected measurements</h2>
              <p className="mt-1 text-xs text-foreground-muted">
                OCR-extracted labels with confidence scores.
              </p>
            </div>
          </div>
          <div className="dashboard-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Raw text</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th className="hidden sm:table-cell">Confidence</th>
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
                      <td className="tabular-nums">{m.value}</td>
                      <td>{m.unit}</td>
                      <td className="hidden tabular-nums sm:table-cell">
                        {(m.confidence * 100).toFixed(0)}%
                      </td>
                      <td>
                        <span className={confidenceBadge(cls)}>{cls}</span>
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
      )}

      {tab === "calculation" && (
        <div className="calc-detail-calculation">
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <span className="settings-section-icon">
                <Icon name="calculator" size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-foreground">Variables & scenarios</h2>
                <p className="mt-1 text-xs text-foreground-muted">
                  Correct inputs and create what-if scenarios.
                </p>
              </div>
            </div>
            <div className="history-detail-panel-body">
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

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <span className="settings-section-icon">
                <Icon name="git-branch" size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-foreground">Calculation steps</h2>
                <p className="mt-1 text-xs text-foreground-muted">Rules applied in sequence.</p>
              </div>
            </div>
            <ol className="calc-detail-timeline">
              {job.steps.map((step, index) => (
                <li key={step.stepOrder} className="calc-detail-timeline-item">
                  <span className="calc-detail-timeline-marker">{index + 1}</span>
                  <div className="calc-detail-timeline-body">
                    <p className="font-semibold text-foreground">{step.ruleName}</p>
                    <code className="calc-detail-step-formula">{step.formula}</code>
                    <div className="calc-detail-step-inputs">
                      {Object.entries(step.inputs).map(([key, val]) => (
                        <span key={key} className="calc-detail-input-chip">
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                    <p className="calc-detail-step-result">
                      = {step.result} {step.unit}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}

      {tab === "compare" && (
        <ComparisonView jobId={id} embedded />
      )}
    </div>
  );
}
