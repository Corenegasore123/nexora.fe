"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function MobileUploadPage() {
  const router = useRouter();
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProjects().then((list) => {
      setProjects(list);
      if (list.length > 0) setProjectId(list[0].id);
    });
  }, []);

  const onFileSelect = useCallback((selected: File) => {
    setFile(selected);
    setError(null);
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  }, []);

  const pollJob = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const job = await apiFetch<{ status: string; errorMessage?: string }>(
          `/api/calculations/${jobId}`
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
      router.push(`/calculations/${jobId}`);
    } else if (jobStatus === "FAILED") {
      cleanup();
      setLoading(false);
      setError(errorMessage ?? "Processing failed");
    }
  };

  const watchJob = (jobId: string) => {
    const es = new EventSource(apiUrl(`/api/calculations/${jobId}/stream`));
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
        // ignore
      }
    };
    es.onerror = () => {
      es.close();
      pollJob(jobId);
    };
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setStatus("UPLOADING");

    const formData = new FormData();
    formData.append("file", file);
    if (projectId) formData.append("projectId", projectId);

    try {
      const data = await apiFetch<{ jobId: string; status: string }>("/api/calculations", {
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
    <div className="page-shell min-h-[calc(100vh-5rem)] pb-12">
      <div className="mx-auto max-w-md">
        <Link href="/dashboard" className="text-xs text-foreground-muted hover:text-primary">
          ← Dashboard
        </Link>
        <p className="eyebrow mt-6">Quick Upload</p>
        <h1 className="page-title mt-3">Snap &amp; Calculate</h1>
        <p className="page-subtitle">
          Take a photo or pick a file. Processing starts immediately.
        </p>

        {projects.length > 0 && (
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="input-field mt-6 w-full"
            aria-label="Project"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {projects.length === 0 && (
          <p className="mt-6 text-sm text-foreground-muted">
            <Link href="/projects/new" className="text-foreground underline underline-offset-4">
              Create a project
            </Link>{" "}
            first to organize uploads.
          </p>
        )}

        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={loading}
            className="btn-primary w-full py-5 text-base"
          >
            Take Photo
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="btn-secondary w-full py-5 text-base"
          >
            Choose File
          </button>
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        />

        {preview && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface p-3">
            <img src={preview} alt="Preview" className="w-full rounded-xl object-contain" />
            {file && (
              <p className="mt-3 truncate text-center text-xs text-foreground-muted">{file.name}</p>
            )}
          </div>
        )}

        {file && !preview && (
          <p className="mt-8 text-center text-sm text-foreground-secondary">{file.name}</p>
        )}

        {status && loading && (
          <div className="mt-8 card">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-medium text-foreground">
                {STATUS_LABELS[status] ?? status}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 alert-error text-sm">
            {error}
          </div>
        )}

        {file && !loading && (
          <button type="button" onClick={handleUpload} className="btn-primary mt-8 w-full py-4">
            Start Analysis
          </button>
        )}

        <p className="mt-8 text-center text-xs text-foreground-placeholder">
          Need drag-and-drop?{" "}
          <Link href="/calculator" className="inline-link text-xs">
            Full calculator
          </Link>
        </p>
      </div>
    </div>
  );
}
