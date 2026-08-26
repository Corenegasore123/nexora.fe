import mapPaths from "@/lib/rwanda-map-paths.json";

export type ProvinceId = "RW01" | "RW02" | "RW03" | "RW04" | "RW05";

export const RWANDA_MAP = mapPaths as {
  viewBox: string;
  paths: { id: ProvinceId; name: string; d: string }[];
  labels: { id: ProvinceId; label: string; cx: number; cy: number }[];
};

/** Districts that roll up into each province on the official Rwanda map. */
export const RWANDA_PROVINCES: {
  id: ProvinceId;
  name: string;
  region: string;
  /** City/district page to open when this province is live. */
  primarySlug: string;
  districts: string[];
}[] = [
  {
    id: "RW01",
    name: "Kigali City",
    region: "City of Kigali",
    primarySlug: "kigali",
    districts: ["Kigali", "Gasabo", "Kicukiro", "Nyarugenge"],
  },
  {
    id: "RW02",
    name: "Eastern",
    region: "Eastern Province",
    primarySlug: "rwamagana",
    districts: ["Rwamagana", "Kayonza", "Ngoma", "Bugesera", "Gatsibo", "Nyagatare", "Kirehe"],
  },
  {
    id: "RW03",
    name: "Northern",
    region: "Northern Province",
    primarySlug: "musanze",
    districts: ["Musanze", "Burera", "Gakenke", "Gicumbi", "Rulindo"],
  },
  {
    id: "RW04",
    name: "Western",
    region: "Western Province",
    primarySlug: "rubavu",
    districts: ["Rubavu", "Nyabihu", "Ngororero", "Rutsiro", "Karongi", "Nyamasheke", "Rusizi"],
  },
  {
    id: "RW05",
    name: "Southern",
    region: "Southern Province",
    primarySlug: "huye",
    districts: ["Huye", "Nyanza", "Ruhango", "Muhanga", "Kamonyi", "Nyamagabe", "Nyaruguru", "Gisagara"],
  },
];

export function isPlaceLive(restaurantCount: number | undefined | null) {
  return (restaurantCount ?? 0) > 0;
}

/** Sum restaurant counts for every district belonging to a province. */
export function provinceRestaurantCount(districts: string[], counts: Record<string, number>) {
  // Kigali metro: district rows can double-count venues also under "Kigali". Prefer the capital total.
  if (districts.includes("Kigali")) {
    const kigali = counts.Kigali ?? 0;
    if (kigali > 0) return kigali;
  }
  return districts.reduce((sum, name) => sum + (counts[name] ?? 0), 0);
}

export function buildProvinceCoverage(counts: Record<string, number>) {
  return RWANDA_PROVINCES.map((province) => {
    const count = provinceRestaurantCount(province.districts, counts);
    const path = RWANDA_MAP.paths.find((p) => p.id === province.id)!;
    const label = RWANDA_MAP.labels.find((l) => l.id === province.id)!;
    return {
      ...province,
      d: path.d,
      cx: label.cx,
      cy: label.cy,
      count,
      live: isPlaceLive(count),
    };
  });
}
