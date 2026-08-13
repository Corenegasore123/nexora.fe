"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getProject,
  getProjectDocuments,
  getProjectCalculations,
  getProjectActivity,
  getProjectMembers,
  uploadProjectDocument,
  deleteDocument,
  Project,
  Document,
  ActivityEntry,
  ProjectMember,
} from "@/lib/api";
import { ProjectTeam } from "@/components/ProjectTeam";
import { apiUrl } from "@/lib/api";

type Tab = "overview" | "documents" | "calculations" | "activity" | "team";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function docStatusClass(status: string) {
  if (status === "PROCESSED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [tab, setTab] = useState<Tab>("overview");
  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [calculations, setCalculations] = useState<
    Awaited<ReturnType<typeof getProjectCalculations>>["calculations"]
  >([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [team, setTeam] = useState<{
    owner: ProjectMember | null;
    members: ProjectMember[];
    currentRole: "OWNER" | "EDITOR" | "VIEWER";
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const [p, docs, calcs, act, members] = await Promise.all([
      getProject(projectId),
      getProjectDocuments(projectId),
      getProjectCalculations(projectId),
      getProjectActivity(projectId),
      getProjectMembers(projectId),
    ]);
    setProject(p.project);
    setDocuments(docs.documents);
    setCalculations(calcs.calculations);
    setActivity(act.activity);
    setTeam(members);
  }, [projectId]);

  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      await uploadProjectDocument(projectId, file);
      await load();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(docId);
    await load();
  };

  if (!project) {
    return (
      <div className="page-shell">
        <p className="text-foreground-muted">Loading project…</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "documents", label: "Documents" },
    { id: "calculations", label: "Calculations" },
    { id: "team", label: "Team" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Project</p>
          <h1 className="page-title mt-3">{project.name}</h1>
          {project.description && (
            <p className="page-subtitle">{project.description}</p>
          )}
          <p className="mt-2 text-xs text-foreground-muted">
            {project.isOwner ? "You own this project" : `Shared · ${project.role}`}
            {project.owner && !project.isOwner && ` · Owner: ${project.owner.name}`}
          </p>
        </div>
        {(project.role === "OWNER" || project.role === "EDITOR") && (
          <Link href={`/calculator?project=${projectId}`} className="btn-primary">
            Upload &amp; Analyze
          </Link>
        )}
      </div>

      <div className="mt-8 flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
              tab === t.id
                ? "border-b-2 border-primary text-foreground"
                : "text-foreground-muted hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="card">
            <p className="eyebrow">Documents</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{project._count?.images ?? 0}</p>
          </div>
          <div className="card">
            <p className="eyebrow">Calculations</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {project._count?.calculationJobs ?? 0}
            </p>
          </div>
          <div className="card">
            <p className="eyebrow">Status</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{project.status}</p>
          </div>
        </div>
      )}

      {tab === "documents" && (
        <div className="mt-8">
          {(project.role === "OWNER" || project.role === "EDITOR") && (
          <div className="flex items-center gap-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="btn-secondary"
            >
              {uploading ? "Uploading…" : "Upload document"}
            </button>
          </div>
          )}
          {uploadError && (
            <div className="mt-4 alert-error text-sm">
              {uploadError}
            </div>
          )}
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="font-medium text-foreground">{doc.filename}</td>
                    <td>{formatBytes(doc.sizeBytes)}</td>
                    <td>
                      <span className={docStatusClass(doc.status)}>{doc.status}</span>
                    </td>
                    <td className="text-foreground-muted">
                      {new Date(doc.createdAt).toLocaleString()}
                    </td>
                    <td>
                      {(project.role === "OWNER" || project.role === "EDITOR") && (
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id)}
                        className="text-xs text-foreground-muted hover:text-error"
                      >
                        Delete
                      </button>
                      )}
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-foreground-muted">
                      No documents yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "calculations" && (
        <div className="mt-8">
          {calculations.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <a
                href={apiUrl(`/api/projects/${projectId}/report?format=csv&template=summary`)}
                className="btn-secondary py-2 text-xs"
              >
                Export all (CSV)
              </a>
              <a
                href={apiUrl(`/api/projects/${projectId}/report?format=csv&template=client`)}
                className="btn-ghost py-2 text-xs"
              >
                Client bundle
              </a>
              <a
                href={apiUrl(`/api/projects/${projectId}/report?format=pdf`)}
                className="btn-ghost py-2 text-xs"
              >
                PDF summary
              </a>
            </div>
          )}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="data-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Status</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {calculations.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link
                      href={`/calculations/${job.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {job.image.filename}
                    </Link>
                  </td>
                  <td>{job.status.replace(/_/g, " ")}</td>
                  <td className="font-mono text-foreground">
                    {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                  </td>
                  <td className="text-foreground-muted">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {calculations.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-foreground-muted">
                    No calculations in this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {tab === "team" && team && (
        <div className="mt-8">
          <ProjectTeam
            projectId={projectId}
            currentRole={team.currentRole}
            owner={team.owner}
            members={team.members}
            onChanged={load}
          />
        </div>
      )}

      {tab === "activity" && (
        <div className="mt-8 space-y-3">
          {activity.map((entry) => (
            <div key={entry.id} className="card flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-foreground">
                  {entry.user?.name ?? "System"} — {entry.action.replace(/\./g, " ")}
                </p>
                <p className="mt-1 text-xs text-foreground-muted">{entry.resource}</p>
              </div>
              <time className="shrink-0 text-xs text-foreground-muted">
                {new Date(entry.createdAt).toLocaleString()}
              </time>
            </div>
          ))}
          {activity.length === 0 && (
            <p className="text-sm text-foreground-muted">No activity recorded yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
