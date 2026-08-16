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
  getProjectMessages,
  getProjectTasks,
  getMe,
  uploadProjectDocument,
  deleteDocument,
  Project,
  Document,
  ActivityEntry,
  ProjectMember,
  ProjectMessage,
  ProjectTask,
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

const TABS: { id: Tab; label: string; icon: "layout-dashboard" | "file-text" | "history" | "users" | "clipboard-check" | "mail" }[] = [
  { id: "overview", label: "Overview", icon: "layout-dashboard" },
  { id: "documents", label: "Documents", icon: "file-text" },
  { id: "calculations", label: "Calculations", icon: "history" },
  { id: "collaboration", label: "Collaboration", icon: "mail" },
  { id: "team", label: "Team", icon: "users" },
  { id: "activity", label: "Activity", icon: "clipboard-check" },
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [team, setTeam] = useState<{
    owner: ProjectMember | null;
    members: ProjectMember[];
    currentRole: "OWNER" | "EDITOR" | "VIEWER";
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const [p, docs, calcs, act, members, msgs, tks] = await Promise.all([
      getProject(projectId),
      getProjectDocuments(projectId),
      getProjectCalculations(projectId),
      getProjectActivity(projectId),
      getProjectMembers(projectId),
      getProjectMessages(projectId),
      getProjectTasks(projectId),
    ]);
    setProject(p.project);
    setDocuments(docs.documents);
    setCalculations(calcs.calculations);
    setActivity(act.activity);
    setTeam(members);
    setMessages(msgs.messages);
    setTasks(tks.tasks);
  }, [projectId]);

  useEffect(() => {
    Promise.all([load(), getMe().then(setCurrentUser)]).catch(() => undefined);
  }, [load]);

  const assignees = useMemo<TaskAssignee[]>(() => {
    if (!team) return [];
    const byId = new Map<string, TaskAssignee>();
    if (team.owner) byId.set(team.owner.userId, { id: team.owner.userId, name: team.owner.name });
    for (const member of team.members) {
      byId.set(member.userId, { id: member.userId, name: member.name });
    }
    return Array.from(byId.values());
  }, [team]);

  const openTasks = useMemo(() => tasks.filter((t) => t.status !== "DONE"), [tasks]);

  const tabCounts = useMemo(
    () => ({
      documents: documents.length,
      calculations: calculations.length,
      collaboration: openTasks.length + (messages.length > 0 ? 1 : 0),
      team: assignees.length,
      activity: activity.length,
    }),
    [documents.length, calculations.length, openTasks.length, messages.length, assignees.length, activity.length]
  );

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
      <header className="project-workspace-hero">
        <div className="project-workspace-hero-main">
          <Link href="/app/projects" className="project-detail-back">
            <Icon name="arrow-right" size={14} className="rotate-180" />
            All projects
          </Link>
          <div className="project-workspace-title-row">
            <h1 className="project-workspace-title">{project.name}</h1>
            <span className={projectStatusClass(project.status)}>{project.status}</span>
          </div>
          <div className="project-workspace-meta">
            <span className="project-detail-role">{roleLabel(project.role)}</span>
            <span className="project-workspace-meta-sep" aria-hidden>·</span>
            <span className="text-xs text-foreground-muted">Updated {formatDate(project.updatedAt)}</span>
            {project.owner && !project.isOwner && (
              <>
                <span className="project-workspace-meta-sep" aria-hidden>·</span>
                <span className="project-workspace-shared">Shared by {project.owner.name}</span>
              </>
            )}
          </div>
          {project.description && (
            <p className="project-detail-description">{project.description}</p>
          )}
        </div>
        <div className="project-workspace-hero-actions">
          {assignees.length > 0 && (
            <div className="project-workspace-avatars" aria-label={`${assignees.length} team members`}>
              {assignees.slice(0, 5).map((m) => (
                <span key={m.id} className="project-workspace-avatar" title={m.name}>
                  {initials(m.name)}
                </span>
              ))}
              {assignees.length > 5 && (
                <span className="project-workspace-avatar project-workspace-avatar-more">
                  +{assignees.length - 5}
                </span>
              )}
            </div>
          )}
          {canEdit && (
            <Link href={`/app/calculator?project=${projectId}`} className="btn-primary shrink-0">
              <Icon name="upload" size={16} />
              Upload &amp; analyze
            </Link>
          )}
        </div>
      </header>

      <div className="project-workspace-metrics">
        <button type="button" onClick={() => setTab("documents")} className="project-workspace-metric">
          <span className="project-workspace-metric-icon">
            <Icon name="file-text" size={18} />
          </span>
          <span className="project-workspace-metric-value">{project._count?.images ?? 0}</span>
          <span className="project-workspace-metric-label">Documents</span>
        </button>
        <button type="button" onClick={() => setTab("calculations")} className="project-workspace-metric">
          <span className="project-workspace-metric-icon">
            <Icon name="history" size={18} />
          </span>
          <span className="project-workspace-metric-value">{project._count?.calculationJobs ?? 0}</span>
          <span className="project-workspace-metric-label">Calculations</span>
        </button>
        <button type="button" onClick={() => setTab("collaboration")} className="project-workspace-metric">
          <span className="project-workspace-metric-icon">
            <Icon name="clipboard-check" size={18} />
          </span>
          <span className="project-workspace-metric-value">{openTasks.length}</span>
          <span className="project-workspace-metric-label">Open tasks</span>
        </button>
        <button type="button" onClick={() => setTab("team")} className="project-workspace-metric">
          <span className="project-workspace-metric-icon">
            <Icon name="users" size={18} />
          </span>
          <span className="project-workspace-metric-value">{assignees.length}</span>
          <span className="project-workspace-metric-label">Members</span>
        </button>
      </div>

      <div className="project-detail-main">
        <nav className="project-detail-tabs-wrap" role="tablist" aria-label="Project sections">
          <div className="project-detail-tabs">
            {TABS.map((t) => {
              const count =
                t.id === "documents"
                  ? tabCounts.documents
                  : t.id === "calculations"
                    ? tabCounts.calculations
                    : t.id === "collaboration"
                      ? openTasks.length
                      : t.id === "team"
                        ? tabCounts.team
                        : t.id === "activity"
                          ? tabCounts.activity
                          : null;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`project-detail-tab ${tab === t.id ? "project-detail-tab-active" : ""}`}
                >
                  <Icon name={t.icon} size={14} />
                  {t.label}
                  {count !== null && count > 0 && t.id !== "overview" && (
                    <span className="project-detail-tab-count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="project-detail-content">
          {tab === "overview" && (
            <div className="project-detail-panels">
              <section className="dashboard-section project-overview-collab">
                <div className="dashboard-section-header">
                  <span className="settings-section-icon">
                    <Icon name="mail" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-foreground">Collaboration</h2>
                    <p className="mt-1 text-xs text-foreground-muted">
                      {messages.length} messages · {openTasks.length} open tasks
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
                <div className="project-overview-collab-grid">
                  <div className="project-overview-preview">
                    <h3 className="project-overview-preview-title">Recent messages</h3>
                    {messages.length === 0 ? (
                      <p className="project-overview-preview-empty">No messages yet — start the conversation.</p>
                    ) : (
                      <ul className="project-overview-preview-list">
                        {messages.slice(-3).map((msg) => (
                          <li key={msg.id} className="project-overview-preview-item">
                            <span className="project-overview-preview-author">{msg.author.name}</span>
                            <p className="project-overview-preview-text">{msg.body}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="project-overview-preview">
                    <h3 className="project-overview-preview-title">Open tasks</h3>
                    {openTasks.length === 0 ? (
                      <p className="project-overview-preview-empty">All caught up — no open tasks.</p>
                    ) : (
                      <ul className="project-overview-preview-list">
                        {openTasks.slice(0, 4).map((task) => (
                          <li key={task.id} className="project-overview-preview-task">
                            <span className={`project-task-check project-task-check-${task.status.toLowerCase().replace("_", "-")}`} aria-hidden>
                              {task.status === "DONE" && <Icon name="check" size={10} />}
                            </span>
                            <span className="project-overview-preview-task-title">{task.title}</span>
                            <span className="project-overview-preview-task-assignee">{task.assignee.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
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
            <div className="project-collab-layout">
              <div className="project-collab-intro">
                <p className="project-collab-intro-text">
                  Coordinate with your team in real time. Messages and tasks are stored on the server and sync across all members.
                </p>
                {assignees.length > 0 && (
                  <div className="project-collab-team-strip">
                    {assignees.map((m) => (
                      <span key={m.id} className="project-collab-team-member">
                        <span className="project-collab-team-avatar">{initials(m.name)}</span>
                        {m.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="project-collab-grid">
                <ProjectChat
                  projectId={projectId}
                  currentUser={currentUser ? { id: currentUser.id, name: currentUser.name } : null}
                  memberCount={assignees.length}
                />
                <ProjectTasks
                  projectId={projectId}
                  assignees={assignees}
                  canAssign={canEdit}
                  currentUserId={currentUser?.id}
                />
              </div>
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
              <div className="dashboard-section-body">
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
                <ul className="project-activity-list">
                  {activity.map((entry) => (
                    <li key={entry.id} className="project-activity-item">
                      <span className="project-activity-marker" aria-hidden />
                      <div className="project-activity-body">
                        <p className="text-sm font-medium text-foreground">
                          {entry.user?.name ?? "System"}
                        </p>
                        <p className="mt-0.5 text-sm text-foreground-secondary">
                          {entry.action.replace(/\./g, " ")}
                        </p>
                        <p className="mt-1 text-xs text-foreground-muted">{entry.resource}</p>
                      </div>
                      <time className="project-activity-time">{formatDateTime(entry.createdAt)}</time>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
