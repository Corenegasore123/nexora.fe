export function getApiUrl(): string {
  // Browser uses same-origin proxy (next.config rewrites) so session cookies work
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function apiUrl(path: string): string {
  const base = getApiUrl().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  profileImage: string | null;
  timezone: string;
  language: string;
  emailVerifiedAt: string | null;
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
  const from = encodeURIComponent(path);
  window.location.href = `/sign-in?from=${from}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401) {
      handleUnauthorized();
    }
    throw new ApiError(
      (data as { error?: string }).error ?? "Request failed",
      res.status,
      (data as { code?: string }).code
    );
  }

  return data as T;
}

export async function checkSession(): Promise<boolean> {
  try {
    await apiFetch<{ ok: boolean }>("/api/auth/check");
    return true;
  } catch {
    return false;
  }
}

async function readApi<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    return await apiFetch<T>(path, init);
  } catch {
    return fallback;
  }
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    const data = await apiFetch<{ user: AuthUser }>("/api/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  return apiFetch<{ user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string, confirmPassword: string) {
  return apiFetch<{ user: AuthUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
}

export async function logout() {
  try {
    return await apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  } catch {
    return { ok: false };
  }
}

// ─── Dashboard & Projects ───────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  role?: "OWNER" | "EDITOR" | "VIEWER";
  isOwner?: boolean;
  owner?: { id: string; name: string; email?: string };
  _count?: { calculationJobs: number; images: number; members?: number };
}

export interface ProjectMember {
  id?: string;
  userId: string;
  name: string;
  email: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  createdAt?: string;
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

export interface Document {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  createdAt: string;
  projectId: string | null;
  calculations?: Array<{
    id: string;
    status: string;
    overallConfidence: number | null;
  }>;
}

export interface DashboardData {
  stats: {
    projects: number;
    calculations: number;
    completedAnalyses: number;
    pendingAnalyses: number;
    documents: number;
    revisedCalculations: number;
    correctedMeasurements: number;
    needsReview: number;
  };
  recentProjects: Project[];
  recentCalculations: Array<{
    id: string;
    status: string;
    createdAt: string;
    overallConfidence: number | null;
    image: { filename: string };
    result: { result: number; unit: string; validation?: { status?: string } } | null;
    project: { id: string; name: string } | null;
  }>;
  recentDocuments: Array<Document & { project: { id: string; name: string } | null }>;
  needsReview: Array<{
    id: string;
    image: { filename: string };
    result: { result: number; unit: string } | null;
  }>;
}

export interface ActivityEntry {
  id: string;
  action: string;
  resource: string | null;
  createdAt: string;
  user: { id: string; name: string } | null;
}

export async function getDashboard(): Promise<DashboardData> {
  try {
    return await apiFetch<DashboardData>("/api/dashboard");
  } catch {
    return {
      stats: {
        projects: 0,
        calculations: 0,
        completedAnalyses: 0,
        pendingAnalyses: 0,
        documents: 0,
        revisedCalculations: 0,
        correctedMeasurements: 0,
        needsReview: 0,
      },
      recentProjects: [],
      recentCalculations: [],
      recentDocuments: [],
      needsReview: [],
    };
  }
}

export async function getProjects(): Promise<Project[]> {
  const data = await readApi("/api/projects", { projects: [] as Project[] });
  return data.projects;
}

export async function createProject(name: string, description?: string) {
  return apiFetch<{ project: Project }>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function getProject(id: string) {
  return readApi(`/api/projects/${id}`, { project: null as unknown as Project });
}

export async function updateProject(
  id: string,
  data: Partial<{ name: string; description: string; status: Project["status"] }>
) {
  return apiFetch<{ project: Project }>(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getProjectDocuments(projectId: string) {
  return readApi(`/api/projects/${projectId}/documents`, { documents: [] as Document[] });
}

export async function getProjectCalculations(projectId: string) {
  return readApi(`/api/projects/${projectId}/calculations`, {
    calculations: [] as DashboardData["recentCalculations"],
  });
}

export async function getProjectActivity(projectId: string) {
  return readApi(`/api/projects/${projectId}/activity`, { activity: [] as ActivityEntry[] });
}

export async function getProjectMembers(projectId: string) {
  return readApi(`/api/projects/${projectId}/members`, {
    owner: null,
    members: [] as ProjectMember[],
    currentRole: "VIEWER" as const,
  });
}

export async function addProjectMember(
  projectId: string,
  email: string,
  role: "EDITOR" | "VIEWER" = "VIEWER"
) {
  return apiFetch<{ member: ProjectMember }>(`/api/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
}

export async function updateProjectMemberRole(
  projectId: string,
  userId: string,
  role: "EDITOR" | "VIEWER"
) {
  return apiFetch<{ member: ProjectMember }>(`/api/projects/${projectId}/members/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function removeProjectMember(projectId: string, userId: string) {
  return apiFetch<{ ok: boolean }>(`/api/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });
}

// ─── Project collaboration (chat & tasks) ───────────────────────────────────

export interface ProjectMessage {
  id: string;
  projectId: string;
  authorId: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string };
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assigneeId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  assignee: { id: string; name: string };
  createdBy: { id: string; name: string };
}

export async function getProjectMessages(projectId: string) {
  return readApi(`/api/projects/${projectId}/collaboration/messages`, {
    messages: [] as ProjectMessage[],
  });
}

export async function sendProjectMessage(projectId: string, body: string) {
  return apiFetch<{ message: ProjectMessage }>(
    `/api/projects/${projectId}/collaboration/messages`,
    { method: "POST", body: JSON.stringify({ body }) }
  );
}

export async function getProjectTasks(projectId: string) {
  return readApi(`/api/projects/${projectId}/collaboration/tasks`, {
    tasks: [] as ProjectTask[],
  });
}

export async function createProjectTask(
  projectId: string,
  data: { title: string; assigneeId: string }
) {
  return apiFetch<{ task: ProjectTask }>(`/api/projects/${projectId}/collaboration/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProjectTask(
  projectId: string,
  taskId: string,
  data: Partial<{ title: string; status: ProjectTask["status"]; assigneeId: string }>
) {
  return apiFetch<{ task: ProjectTask }>(
    `/api/projects/${projectId}/collaboration/tasks/${taskId}`,
    { method: "PATCH", body: JSON.stringify(data) }
  );
}

export async function deleteProjectTask(projectId: string, taskId: string) {
  return apiFetch<{ ok: boolean }>(
    `/api/projects/${projectId}/collaboration/tasks/${taskId}`,
    { method: "DELETE" }
  );
}

export async function getNotifications() {
  try {
    return await apiFetch<{ notifications: Notification[]; unreadCount: number }>("/api/notifications");
  } catch {
    return { notifications: [], unreadCount: 0 };
  }
}

export async function markNotificationRead(id: string) {
  try {
    return await apiFetch<{ notification: Notification }>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
  } catch {
    return null;
  }
}

export async function markAllNotificationsRead() {
  try {
    return await apiFetch<{ ok: boolean }>("/api/notifications/read-all", { method: "POST" });
  } catch {
    return { ok: false };
  }
}

export async function uploadProjectDocument(projectId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<{ jobId: string; document: Document; status: string }>(
    `/api/projects/${projectId}/documents`,
    { method: "POST", body: formData, headers: {} }
  );
}

export async function deleteDocument(documentId: string) {
  return apiFetch<{ ok: boolean }>(`/api/documents/${documentId}`, { method: "DELETE" });
}

// ─── Calculation correction & scenarios ─────────────────────────────────────

export async function correctVariable(
  jobId: string,
  variableName: string,
  value: number,
  unit = "m"
) {
  return apiFetch<{ jobId: string; version: number; result: number; unit: string }>(
    `/api/calculations/${jobId}/variables/${variableName}`,
    { method: "PATCH", body: JSON.stringify({ value, unit }) }
  );
}

export async function createScenario(
  jobId: string,
  name: string,
  overrides: Record<string, { value: number; unit?: string }>
) {
  return apiFetch<{ jobId: string }>(`/api/calculations/${jobId}/scenarios`, {
    method: "POST",
    body: JSON.stringify({ name, overrides }),
  });
}

export async function recalculateJob(jobId: string) {
  return apiFetch<{ jobId: string; version: number; result: number; unit: string }>(
    `/api/calculations/${jobId}/recalculate`,
    { method: "POST", body: JSON.stringify({}) }
  );
}

// ─── Admin API removed from engineer app ────────────────────────────────────

export interface HistoryJobSummary {
  id: string;
  status: string;
  createdAt: string;
  overallConfidence: number | null;
  image: { filename: string };
  result: { result: number; unit: string } | null;
  project?: { id: string; name: string } | null;
  version?: number;
}

export async function getHistoryJobs() {
  return readApi<HistoryJobSummary[]>("/api/app/history", []);
}

export async function getCalculations() {
  return readApi<HistoryJobSummary[]>("/api/calculations", []);
}

export async function getCalculationRules() {
  return readApi("/api/calculation-rules", { rules: [] as Array<{
    id: string;
    name: string;
    category: string;
    method: string;
    formula: { expression: string; latex: string };
    outputUnit: string;
  }> });
}
