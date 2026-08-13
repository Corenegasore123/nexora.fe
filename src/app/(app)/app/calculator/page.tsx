"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiUrl, apiFetch, getProjects, Project } from "@/lib/api";

const STATUS_LABELS: Record<string, string> = {
  UPLOADING: "Uploading…",
  QUEUED: "Queued…",
  PROCESSING: "Processing…",
  PROCESSING_IMAGE: "Processing image…",
  EXTRACTING_MEASUREMENTS: "Extracting measurements…",
  INTERPRETING_DIAGRAM: "Interpreting diagram…",
  VALIDATING: "Validating…",
  CALCULATING: "Calculating…",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

const PIPELINE_STEPS = [
  "UPLOADING",
  "QUEUED",
  "PROCESSING_IMAGE",
  "EXTRACTING_MEASUREMENTS",
  "INTERPRETING_DIAGRAM",
  "VALIDATING",
  "CALCULATING",
  "COMPLETED",
];

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

  const onFileSelect = useCallback((selected: File) => {
    setFile(selected);
    setError(null);
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }, []);

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

  const currentStepIndex = status ? PIPELINE_STEPS.indexOf(status) : -1;

  return (
    <div className="page-shell">
      <div className="max-w-2xl">
        <p className="eyebrow">Calculator</p>
        <h1 className="page-title mt-3">Upload &amp; Calculate</h1>
        <p className="page-subtitle">
          Drop a building diagram with dimension labels. The system handles the rest.
        </p>
        {projects.length > 0 && (
          <div className="mt-6 max-w-sm">
            <label htmlFor="project" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
              Project
            </label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="input-field w-full"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {projects.length === 0 && (
          <p className="mt-4 text-sm text-foreground-muted">
            <Link href="/app/projects/new" className="text-foreground underline underline-offset-4">
              Create a project
            </Link>{" "}
            to organize uploads.
          </p>
        )}
      </div>

      <div
        className={`mt-10 flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all ${
          dragOver
            ? "border-primary bg-selected"
            : "border-border bg-surface hover:border-border-strong hover:bg-surface-elevated"
        }`}
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
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-72 rounded-xl object-contain" />
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border-strong">
              <svg className="h-6 w-6 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Drop image here or click to browse</p>
            <p className="mt-1 text-xs text-foreground-muted">JPG, PNG, WEBP, PDF · Max 20 MB</p>
          </div>
        )}
        {file && (
          <p className="mt-4 text-xs uppercase tracking-wider text-foreground-muted">{file.name}</p>
        )}
      </div>

      {status && loading && (
        <div className="mt-6 card">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm font-medium text-foreground">
              {STATUS_LABELS[status] ?? status}
            </span>
          </div>
          <div className="mt-4 flex gap-1">
            {PIPELINE_STEPS.slice(0, -1).map((step, i) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStepIndex ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 alert-error text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleCalculate}
        disabled={!file || loading}
        className="btn-primary mt-8 w-full md:w-auto"
      >
        {loading ? "Processing…" : "Calculate"}
      </button>
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
