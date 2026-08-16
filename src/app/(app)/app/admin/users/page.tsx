"use client";

import { FormEvent, useEffect, useState } from "react";
import { createUser, getUsers } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Awaited<ReturnType<typeof getUsers>>>([]);
  const load = () => getUsers().then(setUsers).catch(() => setUsers([]));
  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createUser({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
      role: String(form.get("role")) as "STUDENT" | "STAFF" | "ADMIN",
    });
    e.currentTarget.reset();
    load();
  };

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-pending-bg text-xs uppercase tracking-wider text-foreground-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={onSubmit} className="card space-y-3 h-fit">
        <p className="eyebrow">Add user</p>
        <input name="name" required placeholder="Name" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
        <input name="password" required minLength={8} placeholder="Password" className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
        <select name="role" className="w-full rounded-lg border border-border px-3 py-2 text-sm">
          <option>STUDENT</option>
          <option>STAFF</option>
          <option>ADMIN</option>
        </select>
        <button className="btn-primary w-full">Create</button>
      </form>
    </div>
  );
}
