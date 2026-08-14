"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getProject,
  getProjectDocuments,
  getProjectCalculations,
  getProjectActivity,
  getProjectMembers,
  getMe,
  uploadProjectDocument,
  deleteDocument,
  Project,
  Document,
  ActivityEntry,
  ProjectMember,
  AuthUser,
  apiUrl,
} from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { ProjectTeam } from "@/components/ProjectTeam";
import { ProjectChat } from "@/components/project/ProjectChat";
import { ProjectTasks, type TaskAssignee } from "@/components/project/ProjectTasks";
import { SkeletonTable } from "@/components/ui/Skeleton";

type Tab = "overview" | "documents" | "calculations" | "collaboration" | "team" | "activity";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "calculations", label: "Calculations" },
  { id: "collaboration", label: "Collaboration" },
  { id: "team", label: "Team" },
  { id: "activity", label: "Activity" },
];

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function projectStatusClass(status: Project["status"]) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "ARCHIVED") return "status-badge status-pending";
  return "status-badge status-processing";
}

function docStatusClass(status: string) {
  if (status === "PROCESSED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

function calcStatusClass(status: string) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "FAILED") return "status-badge status-failed";
  return "status-badge status-processing";
}

function roleLabel(role?: Project["role"]) {
  if (!role || role === "OWNER") return "Owner";
  if (role === "EDITOR") return "Editor";
  return "Viewer";
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [tab, setTab] = useState<Tab>("overview");
  const [project, setProject] = useState<Project | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
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
    Promise.all([load(), getMe().then(setCurrentUser)]).catch(() => undefined);
  }, [load]);

  const assignees = useMemo<TaskAssignee[]>(() => {
    if (!team) return [];
    const list: TaskAssignee[] = [];
    if (team.owner) list.push({ id: team.owner.userId, name: team.owner.name });
    for (const member of team.members) {
      list.push({ id: member.userId, name: member.name });
    }
    return list;
  }, [team]);

  const pageSubtitle = useMemo(() => {
    if (!project) return "Loading workspace…";
    const parts = [roleLabel(project.role), `Updated ${formatDate(project.updatedAt)}`];
    if (project.owner && !project.isOwner) parts.push(`Shared by ${project.owner.name}`);
    return parts.join(" · ");
  }, [project]);

  useSetAppPageMeta({
    title: project?.name ?? "Project",
    subtitle: pageSubtitle,
  });

  const canEdit = project?.role === "OWNER" || project?.role === "EDITOR";

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
      <div className="dashboard-shell">
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="dashboard-shell project-workspace">
      <header className="project-workspace-header">
        <div className="project-workspace-header-main">
          <Link href="/app/projects" className="project-detail-back">
            <Icon name="arrow-right" size={14} className="rotate-180" />
            All projects
          </Link>
          <div className="project-workspace-meta">
            <span className={projectStatusClass(project.status)}>{project.status}</span>
            <span className="project-detail-role">{roleLabel(project.role)}</span>
            {project.owner && !project.isOwner && (
              <span className="project-workspace-shared">Shared by {project.owner.name}</span>
            )}
          </div>
          {project.description && (
            <p className="project-detail-description">{project.description}</p>
          )}
        </div>
        {canEdit && (
          <Link href={`/app/calculator?project=${projectId}`} className="btn-primary shrink-0">
            <Icon name="upload" size={16} />
            Upload &amp; analyze
          </Link>
        )}
      </header>

      <div className="project-workspace-metrics">
        <div className="project-workspace-metric">
          <span className="project-workspace-metric-value">{project._count?.images ?? 0}</span>
          <span className="project-workspace-metric-label">Documents</span>
        </div>
        <div className="project-workspace-metric">
          <span className="project-workspace-metric-value">{project._count?.calculationJobs ?? 0}</span>
          <span className="project-workspace-metric-label">Calculations</span>
        </div>
        <div className="project-workspace-metric">
          <span className="project-workspace-metric-value">{assignees.length}</span>
          <span className="project-workspace-metric-label">Members</span>
        </div>
      </div>

      <div className="project-detail-main">
        <nav className="project-detail-tabs" role="tablist" aria-label="Project sections">
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
            <div className="project-detail-panels">
              <section className="dashboard-section project-overview-collab">
                <div className="dashboard-section-header">
                  <span className="settings-section-icon">
                    <Icon name="users" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-foreground">Collaboration</h2>
                    <p className="mt-1 text-xs text-foreground-muted">
                      Chat with your team and track assigned tasks.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("collaboration")}
                    className="dashboard-section-link"
                  >
                    Open workspace
                  </button>
                </div>
                <div className="project-overview-collab-preview">
                  <div className="project-overview-collab-item">
                    <Icon name="mail" size={16} />
                    <span>Team chat synced to the server</span>
                  </div>
                  <div className="project-overview-collab-item">
                    <Icon name="clipboard-check" size={16} />
                    <span>Tasks with assignees and status tracking</span>
                  </div>
                </div>
              </section>

              <section className="dashboard-section">
                <div className="dashboard-section-header">
                  <span className="settings-section-icon">
                    <Icon name="file-text" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-foreground">Recent documents</h2>
                    <p className="mt-1 text-xs text-foreground-muted">Latest uploads in this workspace.</p>
                  </div>
                  <button type="button" onClick={() => setTab("documents")} className="dashboard-section-link">
                    View all
                  </button>
                </div>
                {documents.length === 0 ? (
                  <div className="dashboard-empty">
                    <p className="text-sm text-foreground-muted">No documents uploaded yet.</p>
                  </div>
                ) : (
                  <ul className="dashboard-queue">
                    {documents.slice(0, 5).map((doc) => (
                      <li key={doc.id} className="dashboard-queue-item">
                        <p className="font-medium text-foreground">{doc.filename}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={docStatusClass(doc.status)}>{doc.status}</span>
                          <span className="text-xs text-foreground-muted">{formatBytes(doc.sizeBytes)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="dashboard-section">
                <div className="dashboard-section-header">
                  <span className="settings-section-icon">
                    <Icon name="history" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-foreground">Recent calculations</h2>
                    <p className="mt-1 text-xs text-foreground-muted">Latest analysis results.</p>
                  </div>
                  <button type="button" onClick={() => setTab("calculations")} className="dashboard-section-link">
                    View all
                  </button>
                </div>
                {calculations.length === 0 ? (
                  <div className="dashboard-empty">
                    <p className="text-sm text-foreground-muted">No calculations yet.</p>
                  </div>
                ) : (
                  <ul className="dashboard-queue">
                    {calculations.slice(0, 5).map((job) => (
                      <li key={job.id} className="dashboard-queue-item">
                        <Link href={`/app/history/${job.id}`} className="dashboard-row-link">
                          {job.image.filename}
                        </Link>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={calcStatusClass(job.status)}>
                            {job.status.replace(/_/g, " ")}
                          </span>
                          {job.result && (
                            <span className="font-mono text-xs text-foreground-secondary">
                              {job.result.result} {job.result.unit}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}

          {tab === "documents" && (
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <span className="settings-section-icon">
                  <Icon name="file-text" size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-foreground">Documents</h2>
                  <p className="mt-1 text-xs text-foreground-muted">Drawings and files for this project.</p>
                </div>
                {canEdit && (
                  <>
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
                      className="dashboard-section-link"
                    >
                      {uploading ? "Uploading…" : "Upload"}
                    </button>
                  </>
                )}
              </div>
              {uploadError && <div className="project-form-error mx-6 mt-4">{uploadError}</div>}
              {documents.length === 0 ? (
                <div className="dashboard-empty">
                  <p className="text-sm font-medium text-foreground">No documents yet</p>
                  <p className="mt-1 text-sm text-foreground-muted">Upload a drawing or PDF to begin.</p>
                </div>
              ) : (
                <div className="dashboard-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Filename</th>
                        <th>Size</th>
                        <th>Status</th>
                        <th className="hidden sm:table-cell">Date</th>
                        {canEdit && <th />}
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td className="font-medium text-foreground">{doc.filename}</td>
                          <td className="tabular-nums">{formatBytes(doc.sizeBytes)}</td>
                          <td>
                            <span className={docStatusClass(doc.status)}>{doc.status}</span>
                          </td>
                          <td className="hidden text-foreground-muted sm:table-cell">
                            {formatDate(doc.createdAt)}
                          </td>
                          {canEdit && (
                            <td className="text-right">
                              <button
                                type="button"
                                onClick={() => handleDelete(doc.id)}
                                className="dashboard-section-link !text-error"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {tab === "calculations" && (
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <span className="settings-section-icon">
                  <Icon name="history" size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-foreground">Calculations</h2>
                  <p className="mt-1 text-xs text-foreground-muted">Analysis jobs for this workspace.</p>
                </div>
              </div>
              {calculations.length > 0 && (
                <div className="project-detail-export-bar">
                  <a
                    href={apiUrl(`/api/app/projects/${projectId}/report?format=csv&template=summary`)}
                    className="btn-secondary py-2 text-xs"
                  >
                    Export CSV
                  </a>
                  <a
                    href={apiUrl(`/api/app/projects/${projectId}/report?format=csv&template=client`)}
                    className="btn-ghost py-2 text-xs"
                  >
                    Client bundle
                  </a>
                  <a
                    href={apiUrl(`/api/app/projects/${projectId}/report?format=pdf`)}
                    className="btn-ghost py-2 text-xs"
                  >
                    PDF summary
                  </a>
                </div>
              )}
              {calculations.length === 0 ? (
                <div className="dashboard-empty">
                  <p className="text-sm font-medium text-foreground">No calculations yet</p>
                  {canEdit && (
                    <Link href={`/app/calculator?project=${projectId}`} className="btn-primary mt-4 inline-flex">
                      Run analysis
                    </Link>
                  )}
                </div>
              ) : (
                <div className="dashboard-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>File</th>
                        <th>Status</th>
                        <th>Result</th>
                        <th className="hidden sm:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <Link href={`/app/history/${job.id}`} className="dashboard-row-link">
                              {job.image.filename}
                            </Link>
                          </td>
                          <td>
                            <span className={calcStatusClass(job.status)}>
                              {job.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="font-mono text-sm">
                            {job.result ? `${job.result.result} ${job.result.unit}` : "—"}
                          </td>
                          <td className="hidden text-foreground-muted sm:table-cell">
                            {formatDate(job.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {tab === "collaboration" && (
            <div className="project-collab-grid">
              <ProjectChat
                projectId={projectId}
                currentUser={currentUser ? { id: currentUser.id, name: currentUser.name } : null}
              />
              <ProjectTasks
                projectId={projectId}
                assignees={assignees}
                canAssign={canEdit}
                currentUserId={currentUser?.id}
              />
            </div>
          )}

          {tab === "team" && team && (
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <span className="settings-section-icon">
                  <Icon name="users" size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-foreground">Team</h2>
                  <p className="mt-1 text-xs text-foreground-muted">Manage members and permissions.</p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <ProjectTeam
                  projectId={projectId}
                  currentRole={team.currentRole}
                  owner={team.owner}
                  members={team.members}
                  onChanged={load}
                />
              </div>
            </section>
          )}

          {tab === "activity" && (
            <section className="dashboard-section">
              <div className="dashboard-section-header">
                <span className="settings-section-icon">
                  <Icon name="clipboard-check" size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-foreground">Activity</h2>
                  <p className="mt-1 text-xs text-foreground-muted">Audit log for this workspace.</p>
                </div>
              </div>
              {activity.length === 0 ? (
                <div className="dashboard-empty">
                  <p className="text-sm text-foreground-muted">No activity recorded yet.</p>
                </div>
              ) : (
                <ul className="dashboard-queue">
                  {activity.map((entry) => (
                    <li key={entry.id} className="dashboard-queue-item">
                      <p className="text-sm font-medium text-foreground">
                        {entry.user?.name ?? "System"}
                      </p>
                      <p className="mt-0.5 text-sm text-foreground-secondary">
                        {entry.action.replace(/\./g, " ")}
                      </p>
                      <p className="mt-1 text-xs text-foreground-muted">{entry.resource}</p>
                      <time className="mt-2 block text-xs text-foreground-muted">
                        {formatDateTime(entry.createdAt)}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
      </div>
    </div>
  );
}
