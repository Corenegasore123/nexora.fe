"use client";

import { useEffect, useState } from "react";
import { getBranches, getStaff, inviteStaff, type Branch, type StaffPayload } from "@/lib/api";
import { displayRole } from "@/lib/roles";
import { StatusBadge } from "@/components/StatusBadge";

export default function StaffPage() {
  const [data, setData] = useState<StaffPayload | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [invite, setInvite] = useState({ name: "", email: "", role: "WAITER", branchId: "" });
  const [temp, setTemp] = useState<string | null>(null);
  useEffect(() => {
    getStaff().then(setData);
    getBranches().then(setBranches);
  }, []);
  if (!data) return null;

  const present = data.attendance.filter((a) => a.status === "PRESENT").length;
  const late = data.attendance.filter((a) => a.status === "LATE").length;
  const absent = data.attendance.filter((a) => a.status === "ABSENT").length;

  return (
    <div className="page-shell space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="card">
          <p className="eyebrow">Present</p>
          <p className="mt-2 text-3xl font-bold">{present}</p>
        </article>
        <article className="card">
          <p className="eyebrow">Late</p>
          <p className="mt-2 text-3xl font-bold">{late}</p>
        </article>
        <article className="card">
          <p className="eyebrow">Absent</p>
          <p className="mt-2 text-3xl font-bold">{absent}</p>
        </article>
      </div>

      <section>
        <p className="eyebrow">Add employee</p>
        <form
          className="card mt-3 grid gap-3 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await inviteStaff({ ...invite, branchId: invite.branchId || undefined });
            setTemp(`${res.user.email} · ${res.temporaryPassword}`);
            getStaff().then(setData);
          }}
        >
          <input className="rounded-lg border border-border px-3 py-2" placeholder="Name" value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} required />
          <input className="rounded-lg border border-border px-3 py-2" placeholder="Email" type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} required />
          <select className="rounded-lg border border-border px-3 py-2" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
            {["MANAGER", "CASHIER", "WAITER", "CHEF", "KITCHEN", "INVENTORY_MANAGER", "ACCOUNTANT"].map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <select className="rounded-lg border border-border px-3 py-2" value={invite.branchId} onChange={(e) => setInvite({ ...invite, branchId: e.target.value })}>
            <option value="">Any branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <button className="btn-primary md:col-span-2">Send invitation</button>
          {temp && <p className="text-sm text-foreground-secondary md:col-span-2">Invitation created: {temp}</p>}
        </form>
      </section>

      <section>
        <p className="eyebrow">Employees</p>
        <div className="mt-3 card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Title</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3">{displayRole(u.role)}</td>
                  <td className="px-5 py-3 text-foreground-secondary">{u.title ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <p className="eyebrow">Shifts</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {data.shifts.map((s, i) => (
            <article key={i} className="card">
              <p className="font-semibold">{s.name}</p>
              <p className="mt-1 text-sm text-foreground-secondary">
                {new Date(s.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                {new Date(s.endsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="mt-2 text-sm">
                {s.user.title ?? "Staff"} · {s.user.name}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <p className="eyebrow">Attendance</p>
        <div className="mt-3 space-y-2">
          {data.attendance.map((a, i) => (
            <div key={i} className="card flex items-center justify-between">
              <p className="text-sm">{a.user.name}</p>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
