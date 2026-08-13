"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects, Project } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Projects</p>
          <h1 className="page-title mt-3">Your Workspaces</h1>
          <p className="page-subtitle">Organize documents and calculations by project.</p>
        </div>
        <Link href="/app/projects/new" className="btn-primary">
          New Project
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-foreground-muted">Loading…</p>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/app/projects/${p.id}`} className="card-raised block">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground">{p.name}</p>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs uppercase tracking-wider text-foreground-muted">{p.status}</span>
                  {p.role && p.role !== "OWNER" && (
                    <span className="text-[10px] text-foreground-placeholder">{p.role}</span>
                  )}
                </div>
              </div>
              {p.owner && !p.isOwner && (
                <p className="mt-1 text-xs text-foreground-placeholder">Shared by {p.owner.name}</p>
              )}
              {p.description && (
                <p className="mt-2 line-clamp-2 text-sm text-foreground-secondary">{p.description}</p>
              )}
              <p className="mt-4 text-xs text-foreground-muted">
                {p._count?.calculationJobs ?? 0} calculations · {p._count?.images ?? 0} documents
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
