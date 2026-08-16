export function getApiUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function apiUrl(path: string): string {
  const base = getApiUrl().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export type UserRole = "STUDENT" | "STAFF" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string | null;
  studentId: string | null;
  staffTitle: string | null;
  profileImage: string | null;
  timezone: string;
  language: string;
  createdAt: string;
}

export interface SlaState {
  dueAt: string | null;
  slaHours: number | null;
  remainingMs: number | null;
  breached: boolean;
  warning: boolean;
}

export interface CampusRequest {
  id: string;
  number: string;
  status: string;
  priority: string;
  formData: Record<string, unknown>;
  submittedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sla: SlaState;
  type: {
    id: string;
    code: string;
    name: string;
    slaHours: number;
    workflow?: {
      id: string;
      name: string;
      steps: { id: string; key: string; name: string; type: string; sortOrder: number }[];
      transitions: { id: string; fromStepId: string | null; toStepId: string | null; action: string }[];
    };
  };
  requester: { id: string; name: string; email: string; role: string; studentId?: string | null };
  department: { id: string; name: string; code: string } | null;
  assignedOfficer: { id: string; name: string } | null;
  currentApprover: { id: string; name: string } | null;
  currentStep: { id: string; name: string; key: string; type: string; slaHours: number | null } | null;
  events?: { id: string; action: string; message: string; createdAt: string; actorId: string | null }[];
  tasks?: { id: string; title: string; status: string; kind: string; dueAt: string | null; assigneeId: string }[];
  approvals?: { id: string; decision: string; comment: string | null; createdAt: string; actor?: { name: string } }[];
  attachments?: { id: string; filename: string; mimeType: string; sizeBytes: number; generated: boolean; createdAt: string }[];
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function handleUnauthorized() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (path.startsWith("/sign-in") || path.startsWith("/sign-up")) return;
  window.location.href = `/sign-in?from=${encodeURIComponent(path)}`;
}

export async function apiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  if (res.headers.get("content-type")?.includes("application/octet-stream") || path.includes("/attachments/")) {
    if (!res.ok) throw new ApiError("Download failed", res.status);
    return res as T;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) handleUnauthorized();
    throw new ApiError((data as { error?: string }).error ?? "Request failed", res.status, (data as { code?: string }).code);
  }
  return data as T;
}

export async function checkSession(): Promise<boolean> {
  try {
    await apiFetch("/api/auth/check");
    return true;
  } catch {
    return false;
  }
}

export async function getMe() {
  return apiFetch<AuthUser>("/api/auth/me");
}

export async function login(email: string, password: string) {
  return apiFetch<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string) {
  return apiFetch<{ user: AuthUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function logout() {
  return apiFetch("/api/auth/logout", { method: "POST" });
}

export async function getNotifications() {
  return apiFetch<{ notifications: Notification[]; unreadCount: number }>("/api/notifications");
}

export async function markNotificationRead(id: string) {
  return apiFetch(`/api/notifications/${id}/read`, { method: "POST" });
}

export async function markAllNotificationsRead() {
  return apiFetch("/api/notifications/read-all", { method: "POST" });
}

export async function getOverview() {
  return apiFetch<{
    totals: { total: number; pending: number; overdue: number; completed: number };
    avgProcessingMs: number;
    slaCompliance: number;
    topBottleneck: string;
    byType: { typeId: string; name: string; count: number }[];
    volume: { date: string; count: number }[];
  }>("/api/reports/overview");
}

export async function getRequests(status?: string) {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<{ requests: CampusRequest[] }>(`/api/requests${q}`);
}

export async function getRequest(id: string) {
  return apiFetch<{ request: CampusRequest }>(`/api/requests/${id}`);
}

export async function createRequest(input: { typeId: string; priority?: string; formData?: Record<string, unknown>; submit?: boolean }) {
  return apiFetch<{ request: CampusRequest }>("/api/requests", { method: "POST", body: JSON.stringify(input) });
}

export async function submitRequest(id: string) {
  return apiFetch<{ request: CampusRequest }>(`/api/requests/${id}/submit`, { method: "POST" });
}

export async function decideRequest(id: string, action: "approve" | "reject" | "complete" | "clear" | "outstanding", comment?: string) {
  return apiFetch<{ request: CampusRequest }>(`/api/requests/${id}/${action}`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}

export async function uploadAttachment(id: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiFetch(`/api/requests/${id}/attachments`, { method: "POST", body: form });
}

export async function getTasks() {
  return apiFetch<{
    tasks: Array<{
      id: string;
      title: string;
      status: string;
      kind: string;
      dueAt: string | null;
      request: CampusRequest;
    }>;
    counts: { approvals: number; tasks: number; overdue: number };
  }>("/api/tasks");
}

export async function getRequestTypes() {
  return apiFetch<Array<{ id: string; code: string; name: string; description: string | null; slaHours: number; workflow: { name: string; steps: { name: string }[] } }>>(
    "/api/request-types"
  );
}

export async function getWorkflows() {
  return apiFetch<Array<{
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    steps: Array<{ id: string; name: string; type: string; slaHours: number | null; department?: { name: string } | null }>;
    transitions: Array<{ id: string; action: string; fromStepId: string | null; toStepId: string | null }>;
    requestTypes: Array<{ name: string }>;
  }>>("/api/workflows");
}

export async function getUsers() {
  return apiFetch<AuthUser[]>("/api/users");
}

export async function getDepartments() {
  return apiFetch<Array<{ id: string; code: string; name: string; head: { name: string } | null; _count: { members: number } }>>(
    "/api/departments"
  );
}

export async function getAssets() {
  return apiFetch<Array<{
    id: string;
    tag: string;
    name: string;
    category: string;
    status: string;
    department: { name: string } | null;
    assignee: { name: string } | null;
  }>>("/api/assets");
}

export async function transitionAsset(id: string, status: string, notes?: string) {
  return apiFetch(`/api/assets/${id}/transition`, { method: "POST", body: JSON.stringify({ status, notes }) });
}

export async function getAuditLogs() {
  return apiFetch<Array<{ id: string; action: string; resource: string | null; createdAt: string; user: { name: string } | null }>>(
    "/api/audit-logs"
  );
}

export async function getDocuments() {
  return apiFetch<Array<{ id: string; filename: string; generated: boolean; createdAt: string; request: { id: string; number: string; type: { name: string } } }>>(
    "/api/documents"
  );
}

export async function searchAll(q: string) {
  return apiFetch<{
    requests: CampusRequest[];
    users: AuthUser[];
    assets: Array<{ id: string; tag: string; name: string; status: string }>;
  }>(`/api/search?q=${encodeURIComponent(q)}`);
}

export async function askAssistant(question: string) {
  return apiFetch<{ question: string; answer: string; provider: string }>("/api/assistant/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function updateMe(data: Partial<AuthUser>) {
  return apiFetch<AuthUser>("/api/users/me", { method: "PATCH", body: JSON.stringify(data) });
}

export async function createUser(input: { name: string; email: string; password: string; role: UserRole }) {
  return apiFetch("/api/users", { method: "POST", body: JSON.stringify(input) });
}

export function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  if (h >= 48) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m`;
}

export function formatProcessing(ms: number) {
  if (!ms) return "—";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  return `${d}d ${h}h`;
}
