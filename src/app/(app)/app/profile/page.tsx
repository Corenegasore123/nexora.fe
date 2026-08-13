"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMe, AuthUser } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/Skeleton";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
  }, []);

  if (!user) {
    return (
      <div className="p-6 lg:p-8">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <p className="eyebrow">Profile</p>
      <h1 className="page-title mt-3">{greeting()}, {user.name.split(" ")[0]}</h1>

      <div className="mt-10 max-w-lg card space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-foreground-muted">Name</p>
          <p className="mt-1 text-foreground">{user.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-foreground-muted">Email</p>
          <p className="mt-1 text-foreground">{user.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-foreground-muted">Role</p>
          <p className="mt-1 text-foreground">{user.role}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-foreground-muted">Timezone</p>
          <p className="mt-1 text-foreground">{user.timezone}</p>
        </div>
      </div>

      <Link href="/app/settings" className="btn-secondary mt-6 inline-flex">
        Account settings
      </Link>
    </div>
  );
}
