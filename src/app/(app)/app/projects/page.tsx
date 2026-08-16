"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getProjects, Project } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { NewProjectOverlay } from "@/components/app/NewProjectOverlay";
import { SkeletonTable } from "@/components/ui/Skeleton";

type ProjectFilter = "all" | Project["status"];
type ViewMode = "table" | "grid";

const FILTER_OPTIONS: { key: ProjectFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ACTIVE", label: "Active" },
  { key: "COMPLETED", label: "Completed" },
  { key: "ARCHIVED", label: "Archived" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusClass(status: Project["status"]) {
  if (status === "COMPLETED") return "status-badge status-completed";
  if (status === "ARCHIVED") return "status-badge status-pending";
  return "status-badge status-processing";
}

function roleLabel(role?: Project["role"]) {
  if (!role || role === "OWNER") return "Owner";
  if (role === "EDITOR") return "Editor";
  return "Viewer";
}

function matchesSearch(project: Project, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    project.name.toLowerCase().includes(q) ||
    (project.description?.toLowerCase().includes(q) ?? false) ||
    (project.owner?.name.toLowerCase().includes(q) ?? false)
  );
}

function ProjectGridCard({ project }: { project: Project }) {
  return (
    <Link href={`/app/projects/${project.id}`} className="projects-grid-card">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-foreground">{project.name}</p>
        <span className={statusClass(project.status)}>{project.status}</span>
      </div>
      {project.description && (
        <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary">{project.description}</p>
      )}
      {project.owner && !project.isOwner && (
        <p className="mt-2 text-xs text-foreground-placeholder">Shared by {project.owner.name}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
        <span>{roleLabel(project.role)}</span>
        <span>{project._count?.calculationJobs ?? 0} calculations</span>
        <span>{project._count?.images ?? 0} documents</span>
      </div>
      <p className="mt-3 text-xs text-foreground-muted">Updated {formatDate(project.updatedAt)}</p>
    </Link>
  );
}

function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="dashboard-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Status</th>
            <th className="hidden md:table-cell">Role</th>
            <th>Calculations</th>
            <th className="hidden sm:table-cell">Documents</th>
            <th className="hidden lg:table-cell">Updated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>
                <Link href={`/app/projects/${p.id}`} className="dashboard-row-link">
                  {p.name}
                </Link>
                {p.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-foreground-muted">{p.description}</p>
                )}
                {p.owner && !p.isOwner && (
                  <p className="mt-0.5 text-xs text-foreground-placeholder">Shared by {p.owner.name}</p>
                )}
              </td>
              <td>
                <span className={statusClass(p.status)}>{p.status}</span>
              </td>
              <td className="hidden text-foreground-muted md:table-cell">{roleLabel(p.role)}</td>
              <td className="tabular-nums">{p._count?.calculationJobs ?? 0}</td>
              <td className="hidden tabular-nums sm:table-cell">{p._count?.images ?? 0}</td>
              <td className="hidden text-foreground-muted lg:table-cell">{formatDate(p.updatedAt)}</td>
              <td className="text-right">
                <Link href={`/app/projects/${p.id}`} className="dashboard-section-link">
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="dashboard-shell">
          <div className="mt-6">
            <SkeletonTable rows={6} />
          </div>
        </div>
      }
    >
      <ProjectsPageContent />
    </Suspense>
  );
}

function ProjectsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setCreateOpen(true);
    }
  }, [searchParams]);

  const closeCreate = () => {
    setCreateOpen(false);
    if (searchParams.get("create")) {
      router.replace("/app/projects", { scroll: false });
    }
  };

  const openCreate = () => setCreateOpen(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((p) => p.status === "ACTIVE").length,
      completed: projects.filter((p) => p.status === "COMPLETED").length,
      calculations: projects.reduce((sum, p) => sum + (p._count?.calculationJobs ?? 0), 0),
    }),
    [projects]
  );

  const filtered = useMemo(() => {
    const byStatus = filter === "all" ? projects : projects.filter((p) => p.status === filter);
    return byStatus.filter((p) => matchesSearch(p, search));
  }, [projects, filter, search]);

  const pageSubtitle = loading
    ? "Loading workspaces…"
    : `${stats.total} workspace${stats.total === 1 ? "" : "s"}`;

  useSetAppPageMeta({ title: "Projects", subtitle: pageSubtitle });

  const emptyMessage =
    projects.length === 0
      ? {
          title: "No projects yet",
          description: "Create a workspace to organize documents and calculations.",
        }
      : search.trim()
        ? {
            title: "No matching projects",
            description: "Try a different search term or clear the search field.",
          }
        : {
            title: "No projects in this view",
            description: "Try another filter or create a new project.",
          };

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-metrics">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dashboard-metric animate-pulse">
              <div className="h-3 w-20 rounded bg-border" />
              <div className="mt-3 h-8 w-12 rounded bg-border" />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <SkeletonTable rows={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <NewProjectOverlay open={createOpen} onClose={closeCreate} />
      <div className="dashboard-metrics">
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Total projects</span>
          <span className="dashboard-metric-value">{stats.total}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Active</span>
          <span className="dashboard-metric-value">{stats.active}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Completed</span>
          <span className="dashboard-metric-value">{stats.completed}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Calculations</span>
          <span className="dashboard-metric-value">{stats.calculations}</span>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <span className="settings-section-icon">
            <Icon name="folder" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-foreground">All projects</h2>
            <p className="mt-1 text-xs text-foreground-muted">
              Search, filter, and browse your workspaces.
            </p>
          </div>
          <button type="button" onClick={openCreate} className="dashboard-section-link">
            New project
          </button>
        </div>

        <div className="projects-toolbar">
          <label className="projects-search">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, description, or owner…"
              className="input-field projects-search-input"
            />
          </label>
          <div className="projects-view-toggle" role="group" aria-label="Project view">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`projects-view-btn ${viewMode === "table" ? "projects-view-btn-active" : ""}`}
              aria-pressed={viewMode === "table"}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`projects-view-btn ${viewMode === "grid" ? "projects-view-btn-active" : ""}`}
              aria-pressed={viewMode === "grid"}
            >
              Grid
            </button>
          </div>
        </div>

        <div className="projects-filter-bar">
          {FILTER_OPTIONS.map((option) => {
            const count =
              option.key === "all"
                ? projects.length
                : projects.filter((p) => p.status === option.key).length;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setFilter(option.key)}
                className={`projects-filter-tab ${filter === option.key ? "projects-filter-tab-active" : ""}`}
              >
                {option.label}
                <span className="projects-filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="dashboard-empty">
            <p className="text-sm font-medium text-foreground">{emptyMessage.title}</p>
            <p className="mt-1 text-sm text-foreground-muted">{emptyMessage.description}</p>
            {projects.length === 0 && (
              <button type="button" onClick={openCreate} className="btn-primary mt-4 inline-flex">
                Create project
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          <ProjectTable projects={filtered} />
        ) : (
          <div className="projects-grid">
            {filtered.map((p) => (
              <ProjectGridCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
