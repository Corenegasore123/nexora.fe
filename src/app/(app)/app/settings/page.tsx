"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMe, AuthUser } from "@/lib/api";
import { Icon } from "@/components/icons/Icon";
import { SkeletonCard } from "@/components/ui/Skeleton";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-3xl space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="w-full max-w-3xl space-y-6">
        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">
              <Icon name="user" size={18} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Account</h2>
              <p className="mt-1 text-xs text-foreground-muted">Identity and sign-in details.</p>
            </div>
          </div>
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
              {user.emailVerifiedAt ? `Verified on ${formatDate(user.emailVerifiedAt)}` : "Not verified"}
            </span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">Member since</span>
            <span className="settings-row-value">{formatDate(user.createdAt)}</span>
          </div>
          <Link href="/app/profile" className="inline-flex text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
            View full profile
          </Link>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">
              <Icon name="map-pin" size={18} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Regional</h2>
              <p className="mt-1 text-xs text-foreground-muted">Locale and timezone preferences.</p>
            </div>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">Timezone</span>
            <span className="settings-row-value">{user.timezone}</span>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">Language</span>
            <span className="settings-row-value">{user.language.toUpperCase()}</span>
          </div>
          <p className="settings-coming-soon">Timezone and language editing will be available in a future update.</p>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">
              <Icon name="lock" size={18} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Security</h2>
              <p className="mt-1 text-xs text-foreground-muted">Password and session management.</p>
            </div>
          </div>
          <div className="settings-row">
            <span className="settings-row-label">Password</span>
            <span className="settings-row-value">••••••••</span>
          </div>
          <p className="settings-coming-soon">Password change and two-factor authentication are coming soon.</p>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">
              <Icon name="bell" size={18} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
              <p className="mt-1 text-xs text-foreground-muted">Email and in-app alerts.</p>
            </div>
          </div>
          <p className="settings-coming-soon">
            Notification preferences for calculation completion and review reminders will be available soon.
          </p>
        </section>
      </div>
    </div>
  );
}
