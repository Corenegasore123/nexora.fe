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
    throw new ApiError(
      (data as { error?: string }).error ?? "Request failed",
      res.status,
      (data as { code?: string }).code
    );
  }

  return data as T;
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
  return apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

// ─── Dashboard & Projects ───────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  _count?: { calculationJobs: number; images: number };
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
  };
  recentProjects: Project[];
  recentCalculations: Array<{
    id: string;
    status: string;
    createdAt: string;
    overallConfidence: number | null;
    image: { filename: string };
    result: { result: number; unit: string } | null;
    project: { id: string; name: string } | null;
  }>;
  recentDocuments: Array<Document & { project: { id: string; name: string } | null }>;
}

export interface ActivityEntry {
  id: string;
  action: string;
  resource: string | null;
  createdAt: string;
  user: { id: string; name: string } | null;
}

export async function getDashboard(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/api/dashboard");
}

export async function getProjects(): Promise<Project[]> {
  const data = await apiFetch<{ projects: Project[] }>("/api/projects");
  return data.projects;
}

export async function createProject(name: string, description?: string) {
  return apiFetch<{ project: Project }>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function getProject(id: string) {
  return apiFetch<{ project: Project }>(`/api/projects/${id}`);
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
  return apiFetch<{ documents: Document[] }>(`/api/projects/${projectId}/documents`);
}

export async function getProjectCalculations(projectId: string) {
  return apiFetch<{ calculations: DashboardData["recentCalculations"] }>(
    `/api/projects/${projectId}/calculations`
  );
}

export async function getProjectActivity(projectId: string) {
  return apiFetch<{ activity: ActivityEntry[] }>(`/api/projects/${projectId}/activity`);
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
