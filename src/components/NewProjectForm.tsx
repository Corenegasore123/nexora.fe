"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/api";

type NewProjectFormProps = {
  onCancel: () => void;
  onSuccess?: (projectId: string) => void;
  idPrefix?: string;
};

export function NewProjectForm({ onCancel, onSuccess, idPrefix = "project" }: NewProjectFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nameId = `${idPrefix}-name`;
  const descId = `${idPrefix}-desc`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { project } = await createProject(name.trim(), description.trim() || undefined);
      if (onSuccess) {
        onSuccess(project.id);
      } else {
        router.push(`/app/projects/${project.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <div className="project-form-body">
        <div className="project-form-field">
          <label htmlFor={nameId} className="project-form-label">
            Name <span className="project-form-required">*</span>
          </label>
          <input
            id={nameId}
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="project-form-input"
            placeholder="e.g. Riverside Bridge Analysis"
            autoFocus
          />
        </div>

        <div className="project-form-field">
          <div className="project-form-label-row">
            <label htmlFor={descId} className="project-form-label">
              Short description
            </label>
            <span className="project-form-counter">{description.length}/80</span>
          </div>
          <input
            id={descId}
            type="text"
            maxLength={80}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="project-form-input"
            placeholder="e.g. Phase 2 bridge quantities"
          />
        </div>
      </div>

      {error && <div className="project-form-error">{error}</div>}

      <div className="project-form-footer">
        <button type="button" onClick={onCancel} className="btn-secondary project-form-btn">
          Cancel
        </button>
        <button type="submit" disabled={loading || !name.trim()} className="btn-primary project-form-btn">
          {loading ? "Creating…" : "Create project"}
        </button>
      </div>
    </form>
  );
}
