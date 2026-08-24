"use client";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="page-shell max-w-xl">
      <article className="card space-y-4">
        <p className="eyebrow">Appearance</p>
        <p className="text-sm text-foreground-secondary">Light, dark, or follow the system.</p>
        <ThemeToggle variant="settings" />
      </article>
    </div>
  );
}
