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
        <Link href="/projects/new" className="btn-primary">
          New Project
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-neutral-500">Loading…</p>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="card-raised block">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-white">{p.name}</p>
                <span className="text-xs uppercase tracking-wider text-neutral-500">{p.status}</span>
              </div>
              {p.description && (
                <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{p.description}</p>
              )}
              <p className="mt-4 text-xs text-neutral-500">
                {p._count?.calculationJobs ?? 0} calculations · {p._count?.images ?? 0} documents
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
