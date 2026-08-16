"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  createProjectTask,
  deleteProjectTask,
  getProjectTasks,
  updateProjectTask,
  type ProjectTask,
} from "@/lib/api";
import { Icon } from "@/components/icons/Icon";

export type TaskAssignee = {
  id: string;
  name: string;
};

const STATUS_ORDER: ProjectTask["status"][] = ["TODO", "IN_PROGRESS", "DONE"];

function taskStatusLabel(status: ProjectTask["status"]) {
  if (status === "IN_PROGRESS") return "In progress";
  if (status === "DONE") return "Done";
  return "To do";
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ProjectTasksProps = {
  projectId: string;
  assignees: TaskAssignee[];
  canAssign: boolean;
  currentUserId?: string;
  compact?: boolean;
};

export function ProjectTasks({
  projectId,
  assignees,
  canAssign,
  currentUserId,
  compact,
}: ProjectTasksProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "mine">("all");

  const load = useCallback(async () => {
    try {
      const data = await getProjectTasks(projectId);
      setTasks(data.tasks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    setLoading(true);
    load();
    const interval = setInterval(load, 20_000);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    if (assignees.length > 0 && !assigneeId) {
      setAssigneeId(currentUserId ?? assignees[0].id);
    }
  }, [assignees, assigneeId, currentUserId]);

  const stats = useMemo(() => {
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const done = tasks.filter((t) => t.status === "DONE").length;
    const open = todo + inProgress;
    const total = tasks.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { todo, inProgress, done, open, total, pct };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (filter === "open") return tasks.filter((t) => t.status !== "DONE");
    if (filter === "mine" && currentUserId) {
      return tasks.filter((t) => t.assigneeId === currentUserId);
    }
    return tasks;
  }, [tasks, filter, currentUserId]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !assigneeId || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const { task } = await createProjectTask(projectId, {
        title: trimmed,
        assigneeId,
      });
      setTasks((prev) => [task, ...prev]);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const cycleStatus = async (task: ProjectTask) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    const canManage =
      canAssign || (currentUserId && task.assigneeId === currentUserId);
    if (!canManage) return;

    try {
      const { task: updated } = await updateProjectTask(projectId, task.id, {
        status: next,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const removeTask = async (taskId: string) => {
    if (!canAssign) return;
    try {
      await deleteProjectTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  return (
    <div className={`project-collab-panel ${compact ? "project-collab-panel-compact" : ""}`}>
      <header className="project-collab-panel-header">
        <div className="project-collab-panel-icon">
          <Icon name="clipboard-check" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="project-collab-panel-title">Tasks</h3>
            {stats.open > 0 && <span className="project-task-badge">{stats.open} open</span>}
          </div>
          <p className="project-collab-panel-desc">
            {stats.total > 0
              ? `${stats.pct}% complete · ${stats.done} of ${stats.total} done`
              : "Track assignments and progress across the team."}
          </p>
        </div>
      </header>

      {stats.total > 0 && (
        <div className="project-task-progress-wrap">
          <div className="project-task-progress-bar" role="progressbar" aria-valuenow={stats.pct} aria-valuemin={0} aria-valuemax={100}>
            <span className="project-task-progress-fill" style={{ width: `${stats.pct}%` }} />
          </div>
          <div className="project-task-stats">
            <span className="project-task-stat project-task-stat-todo">
              <span className="project-task-stat-dot" />
              {stats.todo} to do
            </span>
            <span className="project-task-stat project-task-stat-progress">
              <span className="project-task-stat-dot" />
              {stats.inProgress} active
            </span>
            <span className="project-task-stat project-task-stat-done">
              <span className="project-task-stat-dot" />
              {stats.done} done
            </span>
          </div>
        </div>
      )}

      <div className="project-task-filters">
        {(["all", "open", "mine"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`project-task-filter ${filter === key ? "project-task-filter-active" : ""}`}
          >
            {key === "all" ? "All" : key === "open" ? "Open" : "Mine"}
            {key === "open" && stats.open > 0 && (
              <span className="project-task-filter-count">{stats.open}</span>
            )}
          </button>
        ))}
      </div>

      {canAssign && assignees.length > 0 && !compact && (
        <form onSubmit={handleCreate} className="project-task-form">
          <div className="project-task-form-inner">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a task…"
              className="project-form-input project-task-input"
              maxLength={200}
              disabled={submitting}
            />
            <div className="project-task-form-row">
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="project-form-input project-task-select"
                disabled={submitting}
                aria-label="Assign to"
              >
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!title.trim() || submitting}
                className="btn-primary project-task-add"
              >
                <Icon name="plus" size={14} />
                Add
              </button>
            </div>
          </div>
        </form>
      )}

      {error && <p className="project-collab-error">{error}</p>}

      <ul className="project-task-list">
        {loading && tasks.length === 0 ? (
          <li className="project-task-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="project-task-skeleton-row" />
            ))}
          </li>
        ) : visibleTasks.length === 0 ? (
          <li className="project-task-empty-state">
            <span className="project-task-empty-icon">
              <Icon name="clipboard-check" size={22} />
            </span>
            <p className="text-sm font-semibold text-foreground">
              {filter === "mine" ? "Nothing assigned to you" : "No tasks yet"}
            </p>
            <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-foreground-muted">
              {canAssign
                ? "Create a task and assign it to keep the team aligned."
                : "Tasks assigned to the team will appear here."}
            </p>
          </li>
        ) : (
          visibleTasks.map((task) => {
            const canUpdate =
              canAssign || (currentUserId && task.assigneeId === currentUserId);
            return (
              <li
                key={task.id}
                className={`project-task-item ${task.status === "DONE" ? "project-task-item-done" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => canUpdate && cycleStatus(task)}
                  disabled={!canUpdate}
                  className={`project-task-check project-task-check-${task.status.toLowerCase().replace("_", "-")}`}
                  title={canUpdate ? `Status: ${taskStatusLabel(task.status)} — click to update` : taskStatusLabel(task.status)}
                  aria-label={`Status: ${taskStatusLabel(task.status)}`}
                >
                  {task.status === "DONE" && <Icon name="check" size={12} />}
                  {task.status === "IN_PROGRESS" && <span className="project-task-check-partial" />}
                </button>
                <div className="project-task-main">
                  <p
                    className={`project-task-title ${task.status === "DONE" ? "project-task-title-done" : ""}`}
                  >
                    {task.title}
                  </p>
                  <div className="project-task-meta">
                    <span className="project-task-assignee-chip">
                      <span className="project-task-assignee-avatar" aria-hidden>
                        {initials(task.assignee.name)}
                      </span>
                      {task.assignee.name}
                    </span>
                    <span className="project-task-time">{relativeTime(task.updatedAt)}</span>
                    {task.createdBy.id !== task.assignee.id && (
                      <span className="project-task-by">by {task.createdBy.name}</span>
                    )}
                  </div>
                </div>
                <span className={`project-task-status-pill project-task-status-pill-${task.status.toLowerCase().replace("_", "-")}`}>
                  {taskStatusLabel(task.status)}
                </span>
                {canAssign && (
                  <button
                    type="button"
                    onClick={() => removeTask(task.id)}
                    className="project-task-remove"
                    aria-label="Remove task"
                  >
                    <Icon name="x" size={14} />
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
