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

function taskStatusClass(status: ProjectTask["status"]) {
  if (status === "DONE") return "project-task-status project-task-status-done";
  if (status === "IN_PROGRESS") return "project-task-status project-task-status-progress";
  return "project-task-status project-task-status-todo";
}

function taskStatusLabel(status: ProjectTask["status"]) {
  if (status === "IN_PROGRESS") return "In progress";
  if (status === "DONE") return "Done";
  return "To do";
}

const STATUS_ORDER: ProjectTask["status"][] = ["TODO", "IN_PROGRESS", "DONE"];

type ProjectTasksProps = {
  projectId: string;
  assignees: TaskAssignee[];
  canAssign: boolean;
  currentUserId?: string;
};

export function ProjectTasks({
  projectId,
  assignees,
  canAssign,
  currentUserId,
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
  }, [load]);

  useEffect(() => {
    if (assignees.length > 0 && !assigneeId) {
      setAssigneeId(currentUserId ?? assignees[0].id);
    }
  }, [assignees, assigneeId, currentUserId]);

  const openCount = useMemo(
    () => tasks.filter((t) => t.status !== "DONE").length,
    [tasks]
  );

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
    <div className="project-collab-panel">
      <header className="project-collab-panel-header">
        <div className="project-collab-panel-icon">
          <Icon name="clipboard-check" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="project-collab-panel-title">Tasks</h3>
            {openCount > 0 && <span className="project-task-badge">{openCount} open</span>}
          </div>
          <p className="project-collab-panel-desc">Track assignments and progress.</p>
        </div>
      </header>

      <div className="project-task-filters">
        {(["all", "open", "mine"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`project-task-filter ${filter === key ? "project-task-filter-active" : ""}`}
          >
            {key === "all" ? "All" : key === "open" ? "Open" : "Assigned to me"}
          </button>
        ))}
      </div>

      {canAssign && assignees.length > 0 && (
        <form onSubmit={handleCreate} className="project-task-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="project-form-input"
            maxLength={200}
            disabled={submitting}
          />
          <div className="project-task-form-row">
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="project-form-input project-task-select"
              disabled={submitting}
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
              {submitting ? "…" : "Add task"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="project-collab-error">{error}</p>}

      <ul className="project-task-list">
        {loading && tasks.length === 0 ? (
          <li className="project-task-empty">Loading tasks…</li>
        ) : visibleTasks.length === 0 ? (
          <li className="project-task-empty-state">
            <span className="project-task-empty-icon">
              <Icon name="clipboard-check" size={22} />
            </span>
            <p className="text-sm font-medium text-foreground">No tasks yet</p>
            <p className="mt-1 text-xs text-foreground-muted">
              {canAssign
                ? "Create a task and assign it to a team member."
                : "Tasks assigned to the team will appear here."}
            </p>
          </li>
        ) : (
          visibleTasks.map((task) => {
            const canUpdate =
              canAssign || (currentUserId && task.assigneeId === currentUserId);
            return (
              <li key={task.id} className="project-task-item">
                <button
                  type="button"
                  onClick={() => canUpdate && cycleStatus(task)}
                  disabled={!canUpdate}
                  className={taskStatusClass(task.status)}
                  title={canUpdate ? "Click to update status" : undefined}
                >
                  {taskStatusLabel(task.status)}
                </button>
                <div className="project-task-main">
                  <p
                    className={`project-task-title ${task.status === "DONE" ? "project-task-title-done" : ""}`}
                  >
                    {task.title}
                  </p>
                  <p className="project-task-assignee">
                    {task.assignee.name}
                    {task.createdBy.id !== task.assignee.id && (
                      <span className="text-foreground-muted">
                        {" "}
                        · added by {task.createdBy.name}
                      </span>
                    )}
                  </p>
                </div>
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
