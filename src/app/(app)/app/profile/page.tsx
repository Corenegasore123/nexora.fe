"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMe, AuthUser } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { SkeletonTable } from "@/components/ui/Skeleton";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function roleLabel(role: AuthUser["role"]) {
  return role === "ADMIN" ? "Administrator" : "Workspace member";
}

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  useSetAppPageMeta({
    title: user?.name ?? "Profile",
    subtitle: user ? user.email : "Loading profile…",
  });

  if (!user) {
    return (
      <div className="dashboard-shell">
        <div className="profile-hero animate-pulse">
          <div className="h-20 w-20 rounded-2xl bg-border" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 rounded bg-border" />
            <div className="h-4 w-64 rounded bg-border" />
          </div>
        </div>
        <div className="mt-6">
          <SkeletonTable rows={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="profile-hero">
        <div className="profile-avatar" aria-hidden>
          {initials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{user.name}</h2>
            <span
              className={
                user.role === "ADMIN" ? "status-badge status-processing" : "status-badge status-pending"
              }
            >
              {roleLabel(user.role)}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground-secondary">{user.email}</p>
          <p className="mt-2 text-xs text-foreground-muted">
            Member since {formatDate(user.createdAt)}
          </p>
        </div>
        <Link href="/app/settings" className="btn-secondary shrink-0 self-start gap-2 sm:self-center">
          <Icon name="settings" size={16} />
          Settings
        </Link>
      </div>

      <div className="dashboard-metrics">
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Email status</span>
          <span className="dashboard-metric-value text-xl sm:text-3xl">
            {user.emailVerifiedAt ? "Verified" : "Pending"}
          </span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Timezone</span>
          <span className="dashboard-metric-value text-lg sm:text-2xl">{user.timezone}</span>
        </div>
        <div className="dashboard-metric">
          <span className="dashboard-metric-label">Language</span>
          <span className="dashboard-metric-value">{user.language.toUpperCase()}</span>
        </div>
      </div>

      <div className="profile-sections">
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <span className="settings-section-icon">
              <Icon name="user" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">Account details</h2>
              <p className="mt-1 text-xs text-foreground-muted">Your workspace identity.</p>
            </div>
          </div>
          <div className="settings-panel-body">
            <div className="settings-row">
              <span className="settings-row-label">Full name</span>
              <span className="settings-row-value">{user.name}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Email</span>
              <span className="settings-row-value">{user.email}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Role</span>
              <span className="settings-row-value">{roleLabel(user.role)}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Verification</span>
              <span className="settings-row-value">
                {user.emailVerifiedAt ? (
                  <span className="settings-value-verified">Verified · {formatDate(user.emailVerifiedAt)}</span>
                ) : (
                  <span className="settings-value-pending">Not verified</span>
                )}
              </span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <span className="settings-section-icon">
              <Icon name="shield" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">Workspace access</h2>
              <p className="mt-1 text-xs text-foreground-muted">
                Permissions and capabilities for your account.
              </p>
            </div>
          </div>
          <div className="settings-panel-body">
            <p className="text-sm leading-relaxed text-foreground-secondary">
              {user.role === "ADMIN"
                ? "You can manage platform settings, users, and all workspace data across the organization."
                : "You can create projects, run calculations, collaborate with your team, and export reports within your workspace."}
            </p>
            {user.role === "ADMIN" && (
              <Link href="/app/admin" className="btn-ghost mt-4 inline-flex gap-2">
                Open admin console
                <Icon name="arrow-right" size={14} />
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
