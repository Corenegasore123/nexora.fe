"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiUrl, apiFetch, getProjects, Project } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";

const STATUS_LABELS: Record<string, string> = {
  UPLOADING: "Uploading your diagram…",
  QUEUED: "Waiting in queue…",
  PROCESSING: "Processing…",
  PROCESSING_IMAGE: "Reading the diagram…",
  EXTRACTING_MEASUREMENTS: "Extracting dimensions…",
  INTERPRETING_DIAGRAM: "Interpreting layout…",
  VALIDATING: "Validating measurements…",
  CALCULATING: "Running calculations…",
  COMPLETED: "Complete",
  FAILED: "Failed",
};

const PIPELINE_STEPS = [
  { key: "upload", label: "Upload", desc: "Send diagram to server" },
  { key: "image", label: "Read", desc: "Prepare image for OCR" },
  { key: "extract", label: "Extract", desc: "Find dimension labels" },
  { key: "interpret", label: "Interpret", desc: "Map geometry context" },
  { key: "validate", label: "Validate", desc: "Check measurement quality" },
  { key: "calculate", label: "Calculate", desc: "Apply quantity rules" },
];

function pipelineIndex(status: string | null) {
  if (!status) return -1;
  const map: Record<string, number> = {
    UPLOADING: 0,
    QUEUED: 0,
    PROCESSING: 1,
    PROCESSING_IMAGE: 1,
    EXTRACTING_MEASUREMENTS: 2,
    INTERPRETING_DIAGRAM: 3,
    VALIDATING: 4,
    CALCULATING: 5,
    COMPLETED: 6,
  };
  return map[status] ?? -1;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function CalculatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProject = searchParams.get("project");

  const inputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    getProjects().then((list) => {
      setProjects(list);
      if (initialProject && list.some((p) => p.id === initialProject)) {
        setProjectId(initialProject);
      } else if (list.length > 0) {
        setProjectId(list[0].id);
      }
    });
  }, [initialProject]);

  const selectedProject = projects.find((p) => p.id === projectId);
  const stepIndex = pipelineIndex(status);
  const workflowStep = loading ? 3 : file ? 2 : 1;

  useSetAppPageMeta({
    title: "New calculation",
    subtitle: loading
      ? (STATUS_LABELS[status ?? ""] ?? "Processing…")
      : selectedProject
        ? `${selectedProject.name} · upload a diagram`
        : "Upload a diagram to analyze",
  });

  const onFileSelect = useCallback((selected: File) => {
    setFile(selected);
    setError(null);
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }, []);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileSelect(dropped);
    },
    [onFileSelect]
  );

  const pollJob = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const job = await apiFetch<{ status: string; errorMessage?: string }>(
          `/api/app/history/${jobId}`
        );
        handleJobStatus(jobId, job.status, job.errorMessage, () => clearInterval(interval));
      } catch {
        clearInterval(interval);
        setLoading(false);
        setError("Lost connection while processing");
      }
    }, 1500);
  };

  const handleJobStatus = (
    jobId: string,
    jobStatus: string,
    errorMessage: string | undefined,
    cleanup: () => void
  ) => {
    setStatus(jobStatus);
    if (jobStatus === "COMPLETED") {
      cleanup();
      setLoading(false);
      router.push(`/app/history/${jobId}`);
    } else if (jobStatus === "FAILED") {
      cleanup();
      setLoading(false);
      setError(errorMessage ?? "Processing failed");
    }
  };

  const watchJob = (jobId: string) => {
    const es = new EventSource(apiUrl(`/api/app/history/${jobId}/stream`));

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as {
          status: string;
          message?: string;
          fallback?: string;
        };
        if (data.fallback === "poll") {
          es.close();
          pollJob(jobId);
          return;
        }
        handleJobStatus(jobId, data.status, data.message, () => es.close());
      } catch {
        // ignore malformed events
      }
    };

    es.onerror = () => {
      es.close();
      pollJob(jobId);
    };
  };

  const handleCalculate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setStatus("UPLOADING");

    const formData = new FormData();
    formData.append("file", file);
    if (projectId) formData.append("projectId", projectId);

    try {
      const data = await apiFetch<{ jobId: string; status: string }>("/api/app/history", {
        method: "POST",
        body: formData,
        headers: {},
      });
      setStatus(data.status);
      watchJob(data.jobId);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <div className="dashboard-shell calc-workspace">
      <ol className="calc-workflow" aria-label="Calculation workflow">
        <li className={`calc-workflow-step ${workflowStep >= 1 ? "calc-workflow-step-done" : ""} ${workflowStep === 1 ? "calc-workflow-step-active" : ""}`}>
          <span className="calc-workflow-num">1</span>
          <span className="calc-workflow-label">Workspace</span>
        </li>
        <li className={`calc-workflow-step ${workflowStep >= 2 ? "calc-workflow-step-done" : ""} ${workflowStep === 2 ? "calc-workflow-step-active" : ""}`}>
          <span className="calc-workflow-num">2</span>
          <span className="calc-workflow-label">Upload</span>
        </li>
        <li className={`calc-workflow-step ${workflowStep >= 3 ? "calc-workflow-step-done" : ""} ${workflowStep === 3 ? "calc-workflow-step-active" : ""}`}>
          <span className="calc-workflow-num">3</span>
          <span className="calc-workflow-label">Analyze</span>
        </li>
      </ol>

      <section className="dashboard-section calc-main">
        <div className="calc-project-bar">
          <div className="calc-project-bar-main">
            <span className="settings-section-icon">
              <Icon name="folder" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                Target workspace
              </p>
              {projects.length > 0 ? (
                <select
                  id="project"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="calc-project-select"
                  disabled={loading}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-foreground-secondary">
                  <Link href="/app/projects?create=1" className="font-medium text-primary hover:underline">
                    Create a project
                  </Link>{" "}
                  to save results
                </p>
              )}
            </div>
          </div>
          {selectedProject && (
            <Link href={`/app/projects/${selectedProject.id}`} className="dashboard-section-link">
              Open project
            </Link>
          )}
        </div>

        {loading ? (
          <div className="calc-processing">
            <div className="calc-processing-header">
              <span className="calculator-spinner" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {STATUS_LABELS[status ?? ""] ?? "Processing…"}
                </p>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  {file?.name} · this usually takes under a minute
                </p>
              </div>
            </div>
            <ol className="calc-pipeline-list">
              {PIPELINE_STEPS.map((step, i) => {
                const done = stepIndex > i;
                const active = stepIndex === i;
                return (
                  <li
                    key={step.key}
                    className={`calc-pipeline-item ${done ? "calc-pipeline-item-done" : ""} ${active ? "calc-pipeline-item-active" : ""}`}
                  >
                    <span className="calc-pipeline-dot" aria-hidden>
                      {done ? <Icon name="check" size={12} /> : active ? <span className="calc-pipeline-pulse" /> : null}
                    </span>
                    <div>
                      <p className="calc-pipeline-title">{step.label}</p>
                      <p className="calc-pipeline-desc">{step.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : file ? (
          <div className="calc-ready">
            <div className="calc-ready-preview">
              {preview ? (
                <img src={preview} alt="Diagram preview" className="calc-ready-image" />
              ) : (
                <div className="calc-ready-file-placeholder">
                  <Icon name="file-text" size={40} />
                  <p className="mt-3 text-sm font-medium text-foreground">PDF document</p>
                </div>
              )}
            </div>
            <div className="calc-ready-panel">
              <h2 className="text-sm font-semibold text-foreground">Ready to analyze</h2>
              <dl className="calc-ready-meta">
                <div>
                  <dt>File</dt>
                  <dd className="truncate">{file.name}</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd>{formatBytes(file.size)}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{file.type || "Unknown"}</dd>
                </div>
                {selectedProject && (
                  <div>
                    <dt>Project</dt>
                    <dd>{selectedProject.name}</dd>
                  </div>
                )}
              </dl>
              <ul className="calc-ready-checklist">
                <li><Icon name="check" size={14} /> Dimension labels visible</li>
                <li><Icon name="check" size={14} /> Supported format</li>
                <li><Icon name="check" size={14} /> Under 20 MB limit</li>
              </ul>
              {error && (
                <div className="calculator-error">
                  <Icon name="x" size={16} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              <div className="calc-ready-actions">
                <button type="button" onClick={handleCalculate} className="btn-primary calc-ready-run">
                  <Icon name="calculator" size={16} />
                  Run calculation
                </button>
                <button type="button" onClick={clearFile} className="btn-ghost">
                  Choose different file
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="calc-upload-stage">
            <div
              className={`calc-dropzone ${dragOver ? "calc-dropzone-active" : ""}`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
              />
              <span className="calc-dropzone-icon">
                <Icon name="upload" size={28} />
              </span>
              <p className="calc-dropzone-title">Drop your building diagram here</p>
              <p className="calc-dropzone-subtitle">or click to browse · JPG, PNG, WEBP, PDF</p>
              <span className="calc-dropzone-btn">Select file</span>
            </div>
            <div className="calc-upload-tips">
              <div className="calc-tip">
                <Icon name="scan" size={16} />
                <div>
                  <p className="calc-tip-title">Clear labels</p>
                  <p className="calc-tip-desc">Sharp dimension text improves OCR accuracy.</p>
                </div>
              </div>
              <div className="calc-tip">
                <Icon name="layers" size={16} />
                <div>
                  <p className="calc-tip-title">One drawing</p>
                  <p className="calc-tip-desc">Upload a single plan or section per run.</p>
                </div>
              </div>
              <div className="calc-tip">
                <Icon name="history" size={16} />
                <div>
                  <p className="calc-tip-title">Saved to history</p>
                  <p className="calc-tip-desc">Results appear in History when complete.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense>
      <CalculatorContent />
    </Suspense>
  );
}
