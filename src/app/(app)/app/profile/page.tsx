"use client";

import { useEffect, useState } from "react";
import { getMe, type AuthUser } from "@/lib/api";
import { displayRole } from "@/lib/roles";

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  if (!user) return null;

  return (
    <div className="page-shell max-w-xl">
      <article className="card space-y-3">
        <p className="text-sm text-foreground-secondary">
          {displayRole(user.role)} · {user.email}
        </p>
        {user.title && <p className="text-sm">{user.title}</p>}
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-foreground-muted">Language {user.language} · Timezone {user.timezone}</p>
      </article>
    </div>
  );
}
