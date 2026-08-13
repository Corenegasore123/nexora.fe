import Link from "next/link";
import { NewProjectForm } from "@/components/NewProjectForm";

export default function NewProjectPage() {
  return (
    <div className="page-shell">
      <p className="eyebrow">Projects</p>
      <h1 className="page-title mt-3">New Project</h1>
      <p className="page-subtitle">Create a workspace for documents and calculations.</p>
      <NewProjectForm />
      <p className="mt-8">
        <Link href="/projects" className="text-sm text-foreground-muted hover:text-primary">
          ← Back to projects
        </Link>
      </p>
    </div>
  );
}
