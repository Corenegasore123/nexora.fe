"use client";

import { useEffect, useState } from "react";
import { getMe, AuthUser } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <p className="eyebrow">Settings</p>
      <h1 className="page-title mt-3">Preferences</h1>
      <p className="page-subtitle">Manage your account and display preferences.</p>

      <div className="mt-10 max-w-lg space-y-6">
        <section className="card">
          <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
          <p className="mt-1 text-sm text-foreground-secondary">
            Choose light, dark, or system theme.
          </p>
          <div className="mt-4">
            <ThemeToggle variant="settings" />
          </div>
        </section>

        {user && (
          <section className="card">
            <h2 className="text-sm font-semibold text-foreground">Account</h2>
            <p className="mt-2 text-sm text-foreground-secondary">{user.email}</p>
            <p className="mt-4 text-xs text-foreground-muted">
              Password change and email verification will be available in a future update.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
