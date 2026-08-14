"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMe, AuthUser } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";
import { SkeletonTable } from "@/components/ui/Skeleton";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const SECTIONS = [
  { id: "account", label: "Account", icon: "user" as const },
  { id: "regional", label: "Regional", icon: "map-pin" as const },
  { id: "security", label: "Security", icon: "lock" as const },
  { id: "notifications", label: "Notifications", icon: "bell" as const },
];

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  useSetAppPageMeta({
    title: "Settings",
    subtitle: user ? `${user.name} · account preferences` : "Loading preferences…",
  });

  if (!user) {
    return (
      <div className="dashboard-shell">
        <SkeletonTable rows={8} />
      </div>
    );
  }

  return (
    <div className="dashboard-shell settings-page">
      <nav className="settings-nav" aria-label="Settings sections">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="settings-nav-link">
            <Icon name={section.icon} size={16} />
            {section.label}
          </a>
        ))}
      </nav>

      <div className="settings-content space-y-6">
        <section id="account" className="dashboard-section settings-panel">
          <div className="dashboard-section-header">
            <span className="settings-section-icon">
              <Icon name="user" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">Account</h2>
              <p className="mt-1 text-xs text-foreground-muted">Identity and sign-in details.</p>
            </div>
            <Link href="/app/profile" className="dashboard-section-link">
              View profile
            </Link>
          </div>
          <div className="settings-panel-body">
            <div className="settings-row">
              <span className="settings-row-label">Name</span>
              <span className="settings-row-value">{user.name}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Email</span>
              <span className="settings-row-value">{user.email}</span>
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
            <div className="settings-row">
              <span className="settings-row-label">Member since</span>
              <span className="settings-row-value">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </section>

        <section id="regional" className="dashboard-section settings-panel">
          <div className="dashboard-section-header">
            <span className="settings-section-icon">
              <Icon name="map-pin" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">Regional</h2>
              <p className="mt-1 text-xs text-foreground-muted">Locale and timezone preferences.</p>
            </div>
          </div>
          <div className="settings-panel-body">
            <div className="settings-row">
              <span className="settings-row-label">Timezone</span>
              <span className="settings-row-value">{user.timezone}</span>
            </div>
            <div className="settings-row">
              <span className="settings-row-label">Language</span>
              <span className="settings-row-value">{user.language.toUpperCase()}</span>
            </div>
            <div className="settings-coming-soon">
              <Icon name="sparkles" size={16} className="shrink-0 text-foreground-muted" />
              <p>Timezone and language editing will be available in a future update.</p>
            </div>
          </div>
        </section>

        <section id="security" className="dashboard-section settings-panel">
          <div className="dashboard-section-header">
            <span className="settings-section-icon">
              <Icon name="lock" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">Security</h2>
              <p className="mt-1 text-xs text-foreground-muted">Password and session management.</p>
            </div>
          </div>
          <div className="settings-panel-body">
            <div className="settings-row">
              <span className="settings-row-label">Password</span>
              <span className="settings-row-value font-mono tracking-widest">••••••••</span>
            </div>
            <div className="settings-coming-soon">
              <Icon name="shield" size={16} className="shrink-0 text-foreground-muted" />
              <p>Password change and two-factor authentication are coming soon.</p>
            </div>
          </div>
        </section>

        <section id="notifications" className="dashboard-section settings-panel">
          <div className="dashboard-section-header">
            <span className="settings-section-icon">
              <Icon name="bell" size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
              <p className="mt-1 text-xs text-foreground-muted">Email and in-app alerts.</p>
            </div>
          </div>
          <div className="settings-panel-body">
            <div className="settings-coming-soon">
              <Icon name="bell" size={16} className="shrink-0 text-foreground-muted" />
              <p>
                Notification preferences for calculation completion and review reminders will be
                available soon.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
