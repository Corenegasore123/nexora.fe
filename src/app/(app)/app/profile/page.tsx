"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMe, AuthUser } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { SkeletonCard } from "@/components/ui/Skeleton";

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

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Full name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Role", value: roleLabel(user.role) },
    { label: "Timezone", value: user.timezone },
    { label: "Language", value: user.language.toUpperCase() },
    {
      label: "Email status",
      value: user.emailVerifiedAt ? "Verified" : "Not verified",
    },
    { label: "Member since", value: formatDate(user.createdAt) },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="profile-hero">
        <div className="profile-avatar" aria-hidden>
          {initials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
            <span className={user.role === "ADMIN" ? "status-badge status-processing" : "status-badge status-pending"}>
              {roleLabel(user.role)}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground-secondary">{user.email}</p>
          <p className="mt-3 text-xs text-foreground-muted">
            Member since {formatDate(user.createdAt)}
            {user.emailVerifiedAt ? " · Email verified" : " · Email not verified"}
          </p>
        </div>
        <Link href="/app/settings" className="btn-secondary shrink-0 self-start sm:self-center">
          Edit settings
        </Link>
      </div>

      <div className="profile-stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="profile-stat-card">
            <p className="profile-stat-label">{stat.label}</p>
            <p className="profile-stat-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="card">
          <div className="flex items-center gap-3">
            <span className="settings-section-icon">
              <Icon name="shield" size={18} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Workspace access</h3>
              <p className="mt-1 text-xs text-foreground-muted">
                Your role controls project permissions and admin tools.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-foreground-secondary">
            {user.role === "ADMIN"
              ? "You can manage platform settings, users, and all workspace data."
              : "You can create projects, run calculations, and export reports within your workspace."}
          </p>
        </section>

        <section className="card">
          <div className="flex items-center gap-3">
            <span className="settings-section-icon">
              <Icon name="settings" size={18} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Account preferences</h3>
              <p className="mt-1 text-xs text-foreground-muted">Timezone, language, and security settings.</p>
            </div>
          </div>
          <Link href="/app/settings" className="btn-primary mt-4 inline-flex gap-2">
            Open settings
            <Icon name="arrow-right" size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
