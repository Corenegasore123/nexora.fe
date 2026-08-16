"use client";

import { FormEvent, useEffect, useState } from "react";
import { AuthUser, getMe, updateMe } from "@/lib/api";
import { displayRole } from "@/lib/roles";

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMe().then((u) => {
      setUser(u);
      setName(u.name);
    });
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = await updateMe({ name });
    setUser(next);
    setSaved(true);
  };

  if (!user) return null;

  return (
    <div className="page-shell max-w-xl">
      <form onSubmit={onSubmit} className="card space-y-4">
        <p className="text-sm text-foreground-secondary">{displayRole(user.role)} · {user.email}</p>
        {user.studentId && <p className="text-sm">Student ID {user.studentId}</p>}
        {user.staffTitle && <p className="text-sm">{user.staffTitle}</p>}
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Name</span>
          <input className="w-full rounded-lg border border-border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button className="btn-primary">Save profile</button>
        {saved && <p className="text-sm text-success">Saved.</p>}
      </form>
    </div>
  );
}
