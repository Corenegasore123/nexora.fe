"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMe,
  getAdminStats,
  getAdminUsers,
  getAdminAudit,
  getAdminAuditActions,
  updateAdminUser,
  AdminStats,
  SystemHealth,
  AdminUser,
  AuditLogEntry,
} from "@/lib/api";

type Tab = "overview" | "users" | "audit";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditAction, setAuditAction] = useState("");
  const [auditActions, setAuditActions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe().then((user) => {
      if (!user || user.role !== "ADMIN") {
        router.replace("/app");
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    });
  }, [router]);

  const loadOverview = useCallback(async () => {
    const data = await getAdminStats();
    setStats(data.stats);
    setHealth(data.health);
  }, []);

  const loadUsers = useCallback(async () => {
    const data = await getAdminUsers({ search: userSearch || undefined });
    setUsers(data.users);
    setUserTotal(data.total);
  }, [userSearch]);

  const loadAudit = useCallback(async () => {
    const [data, actions] = await Promise.all([
      getAdminAudit({ action: auditAction || undefined }),
      getAdminAuditActions(),
    ]);
    setAuditLogs(data.logs);
    setAuditTotal(data.total);
    setAuditActions(actions.actions);
  }, [auditAction]);

  useEffect(() => {
    if (!authorized) return;
    if (tab === "overview") loadOverview().catch((e) => setError(String(e)));
    if (tab === "users") loadUsers().catch((e) => setError(String(e)));
    if (tab === "audit") loadAudit().catch((e) => setError(String(e)));
  }, [authorized, tab, loadOverview, loadUsers, loadAudit]);

  const handleRoleChange = async (userId: string, role: "USER" | "ADMIN") => {
    try {
      await updateAdminUser(userId, { role });
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (authorized === null) {
    return (
      <div className="page-shell">
        <p className="text-foreground-muted">Loading…</p>
      </div>
    );
  }

  if (!authorized) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "audit", label: "Audit Log" },
  ];

  return (
    <div className="page-shell">
      <div>
        <p className="eyebrow">Administration</p>
        <h1 className="page-title mt-3">Platform Admin</h1>
        <p className="page-subtitle">User management, system health, and audit trail.</p>
      </div>

      {error && (
        <div className="mt-6 alert-error text-sm">
          {error}
        </div>
      )}

      <div className="mt-8 flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
              tab === t.id
                ? "border-b-2 border-primary text-foreground"
                : "text-foreground-muted hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && stats && health && (
        <div className="mt-8 space-y-10">
          <section>
            <h2 className="section-label">System Health</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Status" value={health.status} />
              <StatCard label="Database" value={health.database} />
              <StatCard label="Redis" value={health.redis} />
              <StatCard label="CV Service" value={health.cvService} />
            </div>
            <p className="mt-4 text-xs text-foreground-placeholder">
              Uptime {formatUptime(health.uptimeSeconds)} · {health.nodeVersion} · {health.env}
            </p>
          </section>

          <section>
            <h2 className="section-label">Platform Stats</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Users" value={stats.users} />
              <StatCard label="New (7d)" value={stats.recentUsers} />
              <StatCard label="Active Sessions" value={stats.activeSessions} />
              <StatCard label="Projects" value={stats.projects} />
              <StatCard label="Calculations" value={stats.calculations} />
              <StatCard label="Completed" value={stats.completedCalculations} />
              <StatCard label="Pending" value={stats.pendingCalculations} />
              <StatCard label="Failed" value={stats.failedCalculations} />
              <StatCard label="Documents" value={stats.documents} />
              <StatCard label="Audit Entries" value={stats.auditLogs} />
            </div>
          </section>
        </div>
      )}

      {tab === "users" && (
        <div className="mt-8">
          <div className="mb-4 flex gap-3">
            <input
              type="search"
              placeholder="Search by name or email…"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="input-field max-w-sm flex-1"
            />
            <button type="button" onClick={loadUsers} className="btn-secondary py-2 text-xs">
              Search
            </button>
          </div>
          <p className="mb-4 text-xs text-foreground-muted">{userTotal} users total</p>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Projects</th>
                  <th>Calculations</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium text-foreground">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value as "USER" | "ADMIN")
                        }
                        className="input-field py-1.5 text-xs"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td>{u._count?.projects ?? 0}</td>
                    <td>{u._count?.calculationJobs ?? 0}</td>
                    <td className="text-foreground-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="mt-8">
          <div className="mb-4 flex gap-3">
            <select
              value={auditAction}
              onChange={(e) => setAuditAction(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="">All actions</option>
              {auditActions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <button type="button" onClick={loadAudit} className="btn-secondary py-2 text-xs">
              Filter
            </button>
          </div>
          <p className="mb-4 text-xs text-foreground-muted">{auditTotal} entries</p>
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="card flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-foreground">
                    {log.user?.name ?? "System"} —{" "}
                    <span className="font-mono text-foreground-secondary">{log.action}</span>
                  </p>
                  {log.resource && (
                    <p className="mt-1 text-xs text-foreground-muted">{log.resource}</p>
                  )}
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <p className="mt-1 font-mono text-[10px] text-foreground-placeholder">
                      {JSON.stringify(log.metadata)}
                    </p>
                  )}
                </div>
                <time className="shrink-0 text-xs text-foreground-muted">
                  {new Date(log.createdAt).toLocaleString()}
                </time>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-sm text-foreground-muted">No audit entries found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
