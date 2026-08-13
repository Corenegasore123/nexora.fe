"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/api";

export function NewProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { project } = await createProject(name, description || undefined);
      router.push(`/app/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-lg space-y-5">
      <div>
        <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
          Project name
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field w-full"
          placeholder="Bridge Analysis"
        />
      </div>
      <div>
        <label htmlFor="desc" className="mb-2 block text-xs uppercase tracking-wider text-foreground-muted">
          Description (optional)
        </label>
        <textarea
          id="desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field w-full resize-none"
        />
      </div>
      {error && (
        <div className="alert-error text-sm">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Creating…" : "Create project"}
      </button>
    </form>
  );
}
