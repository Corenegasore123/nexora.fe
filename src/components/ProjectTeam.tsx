"use client";

import { useState } from "react";
import {
  ProjectMember,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
} from "@/lib/api";

interface ProjectTeamProps {
  projectId: string;
  currentRole: "OWNER" | "EDITOR" | "VIEWER";
  owner: ProjectMember | null;
  members: ProjectMember[];
  onChanged: () => void;
}

export function ProjectTeam({
  projectId,
  currentRole,
  owner,
  members,
  onChanged,
}: ProjectTeamProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("VIEWER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = currentRole === "OWNER";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await addProjectMember(projectId, email.trim(), role);
      setEmail("");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "EDITOR" | "VIEWER") => {
    try {
      await updateProjectMemberRole(projectId, userId, newRole);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this member from the project?")) return;
    try {
      await removeProjectMember(projectId, userId);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    }
  };

  return (
    <div>
      {canManage && (
        <form onSubmit={handleInvite} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="invite-email" className="mb-2 block text-xs uppercase tracking-wider text-neutral-500">
              Invite by email
            </label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="input-field w-full"
            />
          </div>
          <div>
            <label htmlFor="invite-role" className="mb-2 block text-xs uppercase tracking-wider text-neutral-500">
              Role
            </label>
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as "EDITOR" | "VIEWER")}
              className="input-field"
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
            </select>
          </div>
          <button type="submit" disabled={loading || !email.trim()} className="btn-primary">
            {loading ? "Adding…" : "Add member"}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              {canManage && <th />}
            </tr>
          </thead>
          <tbody>
            {owner && (
              <tr>
                <td className="font-medium text-white">{owner.name}</td>
                <td>{owner.email}</td>
                <td>
                  <span className="status-badge status-completed">Owner</span>
                </td>
                {canManage && <td />}
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.userId}>
                <td className="font-medium text-white">{m.name}</td>
                <td>{m.email}</td>
                <td>
                  {canManage ? (
                    <select
                      value={m.role}
                      onChange={(e) =>
                        handleRoleChange(m.userId, e.target.value as "EDITOR" | "VIEWER")
                      }
                      className="input-field py-1.5 text-xs"
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="EDITOR">Editor</option>
                    </select>
                  ) : (
                    <span className="text-neutral-400">{m.role}</span>
                  )}
                </td>
                {canManage && (
                  <td>
                    <button
                      type="button"
                      onClick={() => handleRemove(m.userId)}
                      className="text-xs text-neutral-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!owner && members.length === 0 && (
              <tr>
                <td colSpan={canManage ? 4 : 3} className="py-8 text-center text-neutral-500">
                  No team members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-neutral-600">
        Editors can upload documents and correct calculations. Viewers have read-only access.
      </p>
    </div>
  );
}
