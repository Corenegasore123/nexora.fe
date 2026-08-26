import type { PublicCard } from "./public";

export function getApiUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function apiUrl(path: string): string {
  const base = getApiUrl().replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {}),
    },
  });
  const isPublicMutation =
    path.includes("/discover/book") ||
    path.includes("/discover/lookup") ||
    path.includes("/auth/login") ||
    path.includes("/auth/register");
  if (
    res.status === 401 &&
    typeof window !== "undefined" &&
    !path.includes("/auth/check") &&
    !isPublicMutation
  ) {
    const from = encodeURIComponent(window.location.pathname);
    window.location.href = `/sign-in?from=${from}`;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? data.message ?? "Request failed", data.code);
  return data as T;
}

export type UserRole =
  | "PLATFORM_ADMIN"
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "CASHIER"
  | "WAITER"
  | "CHEF"
  | "KITCHEN"
  | "INVENTORY_MANAGER"
  | "ACCOUNTANT"
  | "CUSTOMER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  accountStatus?: string;
  mustChangePassword?: boolean;
  restaurantId: string | null;
  branchId: string | null;
  title: string | null;
  profileImage: string | null;
  timezone: string;
  language: string;
  createdAt: string;
  home?: string;
}

export const checkSession = () =>
  apiFetch<{ ok: boolean; role?: string; mustChangePassword?: boolean; restaurantId?: string | null; home?: string }>("/api/auth/check");
export const getMe = () => apiFetch<AuthUser>("/api/auth/me");
export const login = (email: string, password: string) =>
  apiFetch<{ user: AuthUser; home: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const register = (name: string, email: string, password: string) =>
  apiFetch<{ user: AuthUser; home: string }>("/api/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
export const changePassword = (currentPassword: string, newPassword: string) =>
  apiFetch<{ user: AuthUser; home: string }>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
export const logout = () => apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });

export function homePath(user: Pick<AuthUser, "role" | "mustChangePassword" | "restaurantId">) {
  if (user.mustChangePassword) return "/change-password";
  if (user.role === "PLATFORM_ADMIN") return "/platform-admin";
  if (user.role === "CUSTOMER") return "/account";
  if (user.role === "OWNER" && !user.restaurantId) return "/onboarding";
  return "/app";
}

export const getCommandCenter = () => apiFetch<CommandCenter>("/api/command-center");
export const getBranches = () => apiFetch<Branch[]>("/api/branches");
export const getTables = () => apiFetch<DiningTable[]>("/api/tables");
export const setTableStatus = (id: string, status: string) =>
  apiFetch(`/api/tables/${id}/status`, { method: "POST", body: JSON.stringify({ status }) });
export const getReservations = () => apiFetch<Reservation[]>("/api/reservations");
export const createReservation = (body: unknown) =>
  apiFetch("/api/reservations", { method: "POST", body: JSON.stringify(body) });
export const seatReservation = (id: string) => apiFetch(`/api/reservations/${id}/seat`, { method: "POST" });
export const confirmReservation = (id: string) => apiFetch(`/api/reservations/${id}/confirm`, { method: "POST" });
export const arriveReservation = (id: string) => apiFetch(`/api/reservations/${id}/arrive`, { method: "POST" });
export const cancelReservation = (id: string) => apiFetch(`/api/reservations/${id}/cancel`, { method: "POST" });
export const inviteStaff = (body: unknown) =>
  apiFetch<{ user: { email: string; name: string; role: string }; temporaryPassword: string }>("/api/staff/invite", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const getPlatformDashboard = () => apiFetch<PlatformDashboard>("/api/platform/dashboard");
export const createOwner = (body: unknown) =>
  apiFetch<{ user: AuthUser; temporaryPassword: string }>("/api/platform/owners", { method: "POST", body: JSON.stringify(body) });
export const createRestaurantProfile = (body: unknown) => apiFetch("/api/onboarding/restaurant", { method: "POST", body: JSON.stringify(body) });
export const saveBusinessSettings = (body: unknown) => apiFetch("/api/onboarding/settings", { method: "POST", body: JSON.stringify(body) });
export const addOnboardingBranch = (body: unknown) => apiFetch("/api/onboarding/branches", { method: "POST", body: JSON.stringify(body) });
export const getChecklist = () => apiFetch<SetupChecklist>("/api/onboarding/checklist");
export const discoverRestaurants = (params?: { city?: string; cuisine?: string; price?: string; rating?: string }) => {
  const q = new URLSearchParams();
  if (params?.city) q.set("city", params.city);
  if (params?.cuisine) q.set("cuisine", params.cuisine);
  if (params?.price) q.set("price", params.price);
  if (params?.rating) q.set("rating", params.rating);
  const qs = q.toString();
  return apiFetch<PublicRestaurant[]>(`/api/discover/restaurants${qs ? `?${qs}` : ""}`);
};
export const getPublicRestaurant = (id: string) => apiFetch<PublicRestaurantDetail>(`/api/discover/restaurants/${id}`);
export const getAvailability = (id: string, date: string, guests: number) =>
  apiFetch<{ time: string; available: number; label: string }[]>(
    `/api/public/restaurants/${id}/availability?date=${date}&guests=${guests}`
  );
export const publicBook = (body: unknown) =>
  apiFetch<{
    public: {
      restaurant: string;
      restaurantSlug?: string;
      date: string;
      time: string;
      guests: number;
      number: string;
      name?: string;
      email?: string | null;
      phone?: string | null;
      message: string;
    };
  }>("/api/discover/book", { method: "POST", body: JSON.stringify(body) });
export const lookupReservation = (body: { number: string; email?: string; phone?: string }) =>
  apiFetch<{
    number: string;
    status: string;
    date: string;
    time: string;
    guests: number;
    restaurant: string;
    restaurantSlug: string | null;
    address: string;
    table: string | null;
    name: string;
  }>("/api/discover/lookup", { method: "POST", body: JSON.stringify(body) });
export const myReservations = () => apiFetch<Reservation[]>("/api/discover/me/reservations");
export const cancelMyReservation = (id: string) =>
  apiFetch(`/api/discover/me/reservations/${id}/cancel`, { method: "POST" });
export const myFavorites = () => apiFetch<{ ids: string[]; items: PublicCard[] }>("/api/discover/me/favorites");
export const myReviews = () => apiFetch<CustomerReview[]>("/api/customer/reviews");
export const eligibleReviews = (restaurantId?: string) => {
  const q = restaurantId ? `?restaurantId=${encodeURIComponent(restaurantId)}` : "";
  return apiFetch<EligibleReviewVisit[]>(`/api/customer/reviews/eligible${q}`);
};
export const writeReview = (body: {
  reservationId: string;
  rating: number;
  food: number;
  service: number;
  ambience: number;
  comment?: string;
}) => apiFetch<CustomerReview>("/api/customer/reviews", { method: "POST", body: JSON.stringify(body) });
export const getPublicReviews = (slug: string, page = 1) =>
  apiFetch<PublicReviewsPayload>(`/api/public/restaurants/${slug}/reviews?page=${page}&pageSize=8`);
export const getModerationQueue = (status = "pending") =>
  apiFetch<ModerationReview[]>(`/api/platform/reviews?status=${status}`);
export const approveReview = (id: string) => apiFetch(`/api/platform/reviews/${id}/approve`, { method: "POST" });
export const rejectReview = (id: string, reason?: string) =>
  apiFetch(`/api/platform/reviews/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) });
export const updateMe = (body: { name: string; phone?: string }) =>
  apiFetch<AuthUser>("/api/auth/me", { method: "PATCH", body: JSON.stringify(body) });
export const getMenu = () => apiFetch<MenuItem[]>("/api/menu");
export const uploadMenuPhoto = (id: string, file: Blob) => {
  const body = new FormData();
  body.append("file", file, "dish.jpg");
  return apiFetch<MenuItem>(`/api/menu/${id}/photo`, { method: "POST", body });
};
export const getOrders = () => apiFetch<Order[]>("/api/orders");
export const createOrder = (body: unknown) => apiFetch<Order>("/api/orders", { method: "POST", body: JSON.stringify(body) });
export const sendOrder = (id: string) => apiFetch<Order>(`/api/orders/${id}/send`, { method: "POST" });
export const payOrder = (id: string, method: string) =>
  apiFetch(`/api/orders/${id}/pay`, { method: "POST", body: JSON.stringify({ method }) });
export const getKitchen = () => apiFetch<KitchenTicket[]>("/api/kitchen");
export const advanceTicket = (id: string, action: "START" | "READY" | "SERVE") =>
  apiFetch(`/api/kitchen/${id}/${action}`, { method: "POST" });
export const getInventory = () => apiFetch<Ingredient[]>("/api/inventory");
export const getRecommendations = () => apiFetch<Recommendation[]>("/api/procurement/recommendations");
export const getPurchaseOrders = () => apiFetch<PurchaseOrder[]>("/api/procurement");
export const createPurchase = (ingredientId: string, quantity: number) =>
  apiFetch("/api/procurement", { method: "POST", body: JSON.stringify({ ingredientId, quantity }) });
export const getSuppliers = () => apiFetch<Supplier[]>("/api/suppliers");
export const getWaste = () => apiFetch<WasteEntry[]>("/api/waste");
export const getStaff = () => apiFetch<StaffPayload>("/api/staff");
export const getCustomers = () => apiFetch<Customer[]>("/api/customers");
export const getDeliveries = () => apiFetch<Delivery[]>("/api/deliveries");
export const getAnalytics = () => apiFetch<Analytics>("/api/analytics");
export const getNotifications = () => apiFetch<AppNotification[]>("/api/notifications");
export const markNotificationRead = (id: string) => apiFetch(`/api/notifications/${id}/read`, { method: "POST" });
export const markAllNotificationsRead = () => apiFetch("/api/notifications/read-all", { method: "POST" });

export function rwf(n: number) {
  return `${Math.round(n).toLocaleString("en-US")} RWF`;
}

export type CommandCenter = {
  today: { revenue: number; orders: number; customers: number; avgOrderValue: number; tablesOccupiedPct: number };
  live: { occupied: number; preparing: number; ready: number; delayed: number };
  inventory: { name: string; stock: number; minStock: number; status: string }[];
  staff: { active: number; late: number; absent: number };
};
export type Branch = { id: string; code: string; name: string; city: string; address: string };
export type DiningTable = {
  id: string;
  code: string;
  seats: number;
  status: string;
  posX: number;
  posY: number;
  orders: Order[];
  reservations: Reservation[];
};
export type Reservation = {
  id: string;
  number: string;
  guests: number;
  date: string;
  time: string;
  preference: string | null;
  status: string;
  review?: { id: string; status: string } | null;
  customer: { name: string };
  table: { code: string } | null;
  branch: {
    name: string;
    restaurant?: {
      id?: string;
      name: string;
      slug: string;
      coverUrl?: string | null;
      images?: { url: string }[];
    } | null;
  };
};
export type CustomerReview = {
  id: string;
  rating: number;
  food: number | null;
  service: number | null;
  ambience: number | null;
  comment: string;
  author?: string;
  createdAt: string;
  reservationId?: string | null;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  rejectReason?: string | null;
  images?: { url: string; alt: string }[];
  restaurant: { id: string; slug: string; name: string; coverUrl: string | null };
};
export type EligibleReviewVisit = {
  reservationId: string;
  number: string;
  date: string;
  time: string;
  restaurant: { id: string; slug: string; name: string; coverUrl: string | null } | null;
};
export type PublicReviewsPayload = {
  restaurant: {
    id: string;
    slug: string;
    rating: number;
    ratingFood: number;
    ratingService: number;
    ratingAmbience: number;
    reviewCount: number;
  };
  page: number;
  pageSize: number;
  total: number;
  pages: number;
  items: CustomerReview[];
};
export type ModerationReview = {
  id: string;
  author: string;
  rating: number;
  food: number;
  service: number;
  ambience: number;
  comment: string;
  status: string;
  createdAt: string;
  restaurant: { id: string; slug: string; name: string };
  customer: { name: string; email: string | null } | null;
  reservation: { number: string; date: string; time: string } | null;
  images: { url: string; alt: string }[];
};
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  ingredientCost: number;
  classification: string;
  imageUrl?: string | null;
  category: { name: string };
  recipe: { quantity: number; ingredient: { name: string; unit: string } }[];
  orderLines: { quantity: number }[];
};
export type Order = {
  id: string;
  number: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  table: { code: string } | null;
  waiter?: { name: string } | null;
  lines: { quantity: number; unitPrice: number; menuItem: { name: string } }[];
};
export type KitchenTicket = {
  id: string;
  status: string;
  createdAt: string;
  order: Order;
};
export type Ingredient = {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  costPerUnit: number;
  supplier: { name: string } | null;
};
export type Recommendation = {
  ingredientId: string;
  name: string;
  current: number;
  minimum: number;
  avgDailyUsage: number;
  projectedNeed: number;
  recommendedQty: number;
  supplier: string;
  estimatedCost: number;
  unit: string;
};
export type PurchaseOrder = {
  id: string;
  number: string;
  status: string;
  total: number;
  supplier: { name: string };
  lines: { quantity: number; ingredient: { name: string; unit: string } }[];
};
export type Supplier = { id: string; name: string; onTimeRate: number; qualityScore: number; avgDelayHours: number };
export type WasteEntry = { id: string; quantity: number; reason: string; cost: number; ingredient: { name: string; unit: string } };
export type StaffPayload = {
  users: AuthUser[];
  shifts: { name: string; startsAt: string; endsAt: string; user: { name: string; title: string | null } }[];
  attendance: { status: string; user: { name: string } }[];
};
export type Customer = {
  id: string;
  name: string;
  visits: number;
  totalSpent: number;
  favorite: string | null;
  loyalty: string;
  points: number;
  lastVisit: string | null;
};
export type Delivery = { id: string; status: string; driver: string | null; order: { number: string } };
export type Analytics = {
  revenue: number;
  cogs: number;
  grossProfit: number;
  orders: number;
  customers: number;
  byMethod: Record<string, number>;
  branches: { name: string; revenue: number; orders: number }[];
  bestProduct: { name: string; revenue: number } | null;
  wasteByBranch: { branch: string; cost: number }[];
  products: { name: string; qty: number; revenue: number; margin: number }[];
  satisfaction: { food: number; service: number; ambience: number };
};
export type AppNotification = { id: string; title: string; body: string; read: boolean; createdAt: string };
export type PlatformDashboard = {
  restaurants: number;
  active: number;
  pending: number;
  suspended: number;
  owners: number;
  users: number;
  reservationsToday: number;
  ordersToday: number;
  list: { id: string; name: string; city: string; status: string; owner: string }[];
};
export type SetupChecklist = Record<
  | "restaurant"
  | "business"
  | "branches"
  | "tables"
  | "categories"
  | "menu"
  | "recipes"
  | "ingredients"
  | "inventory"
  | "staff"
  | "reservations"
  | "payments"
  | "notifications",
  boolean
>;
export type PublicRestaurant = {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  cuisine: string;
  priceTier: string;
  rating: number;
  reviewCount: number;
  branch: string;
  available: boolean;
};
export type PublicRestaurantDetail = PublicRestaurant & {
  address: string;
  phone: string;
  website?: string;
  features?: string;
  coverUrl?: string | null;
  openingHours: { day: string; open: string; close: string }[];
  branches: Branch[];
  reviews: { author: string; rating: number; comment: string }[];
  menu: { id: string; name: string; price: number; category: { name: string } }[];
};
