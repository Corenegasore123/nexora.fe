"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons/Icon";
import { NewProjectForm } from "@/components/NewProjectForm";

type NewProjectOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function NewProjectOverlay({ open, onClose }: NewProjectOverlayProps) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="project-overlay" role="dialog" aria-modal="true" aria-labelledby="project-overlay-title">
      <button type="button" className="project-overlay-backdrop" onClick={onClose} aria-label="Close dialog" />
      <div className="project-overlay-panel">
        <div className="project-overlay-header">
          <div className="project-overlay-heading">
            <span className="project-overlay-icon">
              <Icon name="folder" size={18} />
            </span>
            <div>
              <h2 id="project-overlay-title" className="project-overlay-title">
                New project
              </h2>
              <p className="project-overlay-subtitle">Name your workspace and add an optional one-line note.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="project-overlay-close" aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        <NewProjectForm
          idPrefix="overlay-project"
          onCancel={onClose}
          onSuccess={(projectId) => {
            onClose();
            router.push(`/app/projects/${projectId}`);
          }}
        />
      </div>
    </div>
  );
}
