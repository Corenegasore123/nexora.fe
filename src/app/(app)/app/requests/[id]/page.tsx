"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AuthUser,
  CampusRequest,
  decideRequest,
  formatDuration,
  getMe,
  getRequest,
  uploadAttachment,
} from "@/lib/api";
import { SlaBadge, StatusBadge } from "@/components/StatusBadge";
import { useSetAppPageMeta } from "@/components/app/AppPageContext";

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [request, setRequest] = useState<CampusRequest | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useSetAppPageMeta({ title: request?.number ?? "Request", subtitle: request?.type.name });

  const load = () => getRequest(params.id).then((d) => setRequest(d.request));

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null));
    load().catch(() => setRequest(null));
  }, [params.id]);

  if (!request) return <div className="page-shell text-foreground-muted">Loading request…</div>;

  const canAct =
    user &&
    (user.role === "ADMIN" || user.id === request.currentApprover?.id || user.id === request.assignedOfficer?.id);
  const stepType = request.currentStep?.type;
  const submitted = request.submittedAt ? new Date(request.submittedAt) : null;

  const act = async (action: "approve" | "reject" | "complete" | "clear" | "outstanding") => {
    setBusy(true);
    setError(null);
    try {
      const { request: next } = await decideRequest(request.id, action, comment);
      setRequest(next);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = (e.currentTarget.elements.namedItem("file") as HTMLInputElement).files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      await uploadAttachment(request.id, file);
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <article className="card space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={request.status} />
            <SlaBadge sla={request.sla} />
            <span className="text-xs uppercase tracking-wider text-foreground-muted">{request.priority}</span>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Info label="Requester" value={request.requester.name} />
            <Info label="Department" value={request.department?.name ?? "—"} />
            <Info label="Assigned officer" value={request.assignedOfficer?.name ?? "—"} />
            <Info label="Current approver" value={request.currentApprover?.name ?? "—"} />
            <Info label="Current step" value={request.currentStep?.name ?? "Complete"} />
            <Info label="Submitted" value={submitted ? submitted.toLocaleString() : "—"} />
            <Info label="SLA" value={request.sla.slaHours ? `${request.sla.slaHours} hours` : "—"} />
            <Info
              label="Remaining"
              value={request.sla.breached ? "Breached" : formatDuration(request.sla.remainingMs)}
            />
          </dl>
          {request.sla.breached && (
            <p className="rounded-lg border border-error-border bg-error-bg px-3 py-2 text-sm text-error">
              SLA BREACHED — this request was escalated and recorded in the audit trail.
            </p>
          )}
        </article>

        {canAct && ["PENDING_APPROVAL", "UNDER_REVIEW", "APPROVED"].includes(request.status) && request.currentStep && (
          <article className="card space-y-4">
            <p className="eyebrow">Take action</p>
            <textarea className="w-full rounded-lg border border-border px-3 py-2 text-sm" rows={3} placeholder="Comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
            {error && <p className="text-sm text-error">{error}</p>}
            <div className="flex flex-wrap gap-2">
              {stepType === "APPROVAL" && (
                <>
                  <button className="btn-primary" disabled={busy} onClick={() => act("approve")}>Approve</button>
                  <button className="btn-secondary" disabled={busy} onClick={() => act("reject")}>Reject</button>
                </>
              )}
              {stepType === "CONDITION" && (
                <>
                  <button className="btn-primary" disabled={busy} onClick={() => act("clear")}>Clear</button>
                  <button className="btn-secondary" disabled={busy} onClick={() => act("outstanding")}>Outstanding balance</button>
                </>
              )}
              {stepType === "TASK" && (
                <button className="btn-primary" disabled={busy} onClick={() => act("complete")}>Complete task</button>
              )}
            </div>
          </article>
        )}

        <article className="card">
          <p className="eyebrow">Attachments</p>
          <ul className="mt-4 space-y-2 text-sm">
            {(request.attachments ?? []).map((file) => (
              <li key={file.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span>📄 {file.filename}{file.generated ? " · generated" : ""}</span>
                <a className="text-primary" href={`/api/requests/${request.id}/attachments/${file.id}`}>Download</a>
              </li>
            ))}
            {!request.attachments?.length && <li className="text-foreground-muted">No files yet.</li>}
          </ul>
          <form onSubmit={onUpload} className="mt-4 flex gap-2">
            <input name="file" type="file" className="text-sm" />
            <button className="btn-ghost" disabled={busy}>Upload</button>
          </form>
        </article>
      </div>

      <div className="space-y-6">
        <article className="card">
          <p className="eyebrow">Workflow</p>
          <ol className="mt-4 space-y-3">
            {(request.type.workflow?.steps ?? []).map((step) => {
              const active = request.currentStep?.id === step.id;
              const done = (request.approvals ?? []).some((a) => a.decision !== "REJECT") && !active;
              return (
                <li key={step.id} className={`rounded-xl border px-3 py-2 text-sm ${active ? "border-accent bg-accent-soft" : "border-border"}`}>
                  <p className="font-medium">{step.name}</p>
                  <p className="text-xs uppercase tracking-wider text-foreground-muted">{step.type}</p>
                </li>
              );
            })}
          </ol>
        </article>
        <article className="card">
          <p className="eyebrow">Audit trail</p>
          <ol className="mt-4 space-y-3">
            {(request.events ?? []).map((event) => (
              <li key={event.id} className="border-l-2 border-accent pl-3 text-sm">
                <time className="text-[11px] text-foreground-muted">{new Date(event.createdAt).toLocaleString()}</time>
                <p>{event.message}</p>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-foreground-muted">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
