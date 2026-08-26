import mapPaths from "@/lib/rwanda-map-paths.json";

export type ProvinceId = "RW01" | "RW02" | "RW03" | "RW04" | "RW05";

export const RWANDA_MAP = mapPaths as {
  viewBox: string;
  paths: { id: ProvinceId; name: string; d: string }[];
  labels: { id: ProvinceId; label: string; cx: number; cy: number }[];
};

/** Approximate district centers aligned to the district reference map. */
export const RWANDA_DISTRICT_POINTS: {
  name: string;
  slug: string;
  region: string;
  x: number;
  y: number;
}[] = [
  { name: "Nyarugenge", slug: "nyarugenge", region: "City of Kigali", x: 638, y: 350 },
  { name: "Kicukiro", slug: "kicukiro", region: "City of Kigali", x: 681, y: 385 },
  { name: "Gasabo", slug: "gasabo", region: "City of Kigali", x: 662, y: 317 },
  { name: "Kigali", slug: "kigali", region: "City of Kigali", x: 655, y: 353 },
  { name: "Musanze", slug: "musanze", region: "Northern Province", x: 400, y: 181 },
  { name: "Burera", slug: "burera", region: "Northern Province", x: 471, y: 133 },
  { name: "Gakenke", slug: "gakenke", region: "Northern Province", x: 471, y: 250 },
  { name: "Gicumbi", slug: "gicumbi", region: "Northern Province", x: 590, y: 224 },
  { name: "Rulindo", slug: "rulindo", region: "Northern Province", x: 543, y: 297 },
  { name: "Huye", slug: "huye", region: "Southern Province", x: 447, y: 741 },
  { name: "Nyanza", slug: "nyanza", region: "Southern Province", x: 495, y: 647 },
  { name: "Ruhango", slug: "ruhango", region: "Southern Province", x: 519, y: 575 },
  { name: "Muhanga", slug: "muhanga", region: "Southern Province", x: 471, y: 499 },
  { name: "Kamonyi", slug: "kamonyi", region: "Southern Province", x: 567, y: 478 },
  { name: "Nyamagabe", slug: "nyamagabe", region: "Southern Province", x: 352, y: 716 },
  { name: "Nyaruguru", slug: "nyaruguru", region: "Southern Province", x: 376, y: 811 },
  { name: "Gisagara", slug: "gisagara", region: "Southern Province", x: 543, y: 784 },
  { name: "Rwamagana", slug: "rwamagana", region: "Eastern Province", x: 757, y: 376 },
  { name: "Kayonza", slug: "kayonza", region: "Eastern Province", x: 829, y: 399 },
  { name: "Ngoma", slug: "ngoma", region: "Eastern Province", x: 805, y: 494 },
  { name: "Bugesera", slug: "bugesera", region: "Eastern Province", x: 710, y: 504 },
  { name: "Gatsibo", slug: "gatsibo", region: "Eastern Province", x: 829, y: 305 },
  { name: "Nyagatare", slug: "nyagatare", region: "Eastern Province", x: 781, y: 166 },
  { name: "Kirehe", slug: "kirehe", region: "Eastern Province", x: 876, y: 544 },
  { name: "Rubavu", slug: "rubavu", region: "Western Province", x: 233, y: 247 },
  { name: "Nyabihu", slug: "nyabihu", region: "Western Province", x: 305, y: 296 },
  { name: "Ngororero", slug: "ngororero", region: "Western Province", x: 352, y: 385 },
  { name: "Rutsiro", slug: "rutsiro", region: "Western Province", x: 257, y: 385 },
  { name: "Karongi", slug: "karongi", region: "Western Province", x: 281, y: 504 },
  { name: "Nyamasheke", slug: "nyamasheke", region: "Western Province", x: 257, y: 647 },
  { name: "Rusizi", slug: "rusizi", region: "Western Province", x: 210, y: 782 },
];

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

export function buildDistrictCoverage(counts: Record<string, number>) {
  return RWANDA_DISTRICT_POINTS.filter((district) => district.name !== "Kigali").map((district) => ({
    ...district,
    count: counts[district.name] ?? 0,
    live: isPlaceLive(counts[district.name]),
  }));
}
