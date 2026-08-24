const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export type PublicCard = {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  neighborhood: string;
  cuisine: string;
  priceTier: string;
  rating: number;
  reviewCount: number;
  coverUrl: string | null;
  tags: string[];
  featuredTags: string[];
  openNow: boolean;
  publishedAt: string | null;
  nextSlots: { time: string; available: number }[];
  score: number;
  reasons: string[];
};

export type HomePayload = {
  city: string;
  demo: boolean;
  rails: { id: string; title: string; items: PublicCard[] }[];
};

export type CitySummary = {
  slug: string;
  name: string;
  region: string;
  restaurantCount: number;
  coverUrl: string | null;
  cuisines: string[];
  neighborhoods: string[];
};

export type CityPagePayload = {
  city: { slug: string; name: string; region: string };
  restaurantCount: number;
  cuisines: { name: string; count: number }[];
  neighborhoods: { name: string; count: number }[];
  featured: PublicCard[];
  availableTonight: PublicCard[];
  coverUrl: string | null;
};

export type ListPayload = {
  items: PublicCard[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

export type PublicProfile = PublicCard & {
  phone: string;
  website: string;
  address: string;
  openingHours: { day: string; open: string; close: string }[];
  openUntil: string;
  ratingFood?: number;
  ratingService?: number;
  ratingAmbience?: number;
  images: { url: string; alt: string }[];
  branches: { id: string; name: string; city: string; neighborhood: string; address: string; lat: number | null; lng: number | null }[];
  reviews: {
    id?: string;
    author: string;
    rating: number;
    food?: number;
    service?: number;
    ambience?: number;
    comment: string;
    createdAt: string;
    images?: { url: string; alt: string }[];
  }[];
  menu: { id: string; name: string; description: string; price: number; dietary: string; popular: boolean; imageUrl: string | null; category: string }[];
  menuSections?: { name: string; items: PublicProfile["menu"] }[];
  mapUrl: string | null;
};

function qs(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function publicGet<T>(path: string, revalidate = 20): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function fetchHome(city?: string) {
  return publicGet<HomePayload>(`/api/public/home${qs({ city })}`);
}

export function fetchCities() {
  return publicGet<CitySummary[]>("/api/public/cities");
}

export function fetchCity(slug: string) {
  return publicGet<CityPagePayload>(`/api/public/cities/${slug}`, 20);
}

export function fetchRestaurants(params: Record<string, string | undefined>) {
  return publicGet<ListPayload>(`/api/public/restaurants${qs(params)}`, 15);
}

export function fetchSearch(params: Record<string, string | undefined>) {
  return publicGet<ListPayload>(`/api/public/search${qs(params)}`, 10);
}

export function fetchRestaurant(slug: string) {
  return publicGet<PublicProfile>(`/api/public/restaurants/${slug}`, 30);
}

export function fetchSitemapRestaurants() {
  return publicGet<ListPayload>("/api/public/restaurants?pageSize=24&sort=reviews", 300);
}
