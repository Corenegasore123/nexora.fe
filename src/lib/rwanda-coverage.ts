/** Places where the live catalog currently has restaurants. */
export const NEXORA_LIVE_CITIES = ["Kigali", "Musanze", "Rubavu", "Huye"] as const;

export const NEXORA_LIVE_DISTRICTS = [
  "Kigali",
  "Gasabo",
  "Kicukiro",
  "Nyarugenge",
  "Musanze",
  "Rubavu",
  "Huye",
] as const;

const LIVE = new Set(NEXORA_LIVE_DISTRICTS.map((d) => d.toLowerCase()));

export function isNexoraLivePlace(name: string) {
  return LIVE.has(name.trim().toLowerCase());
}

/** Approximate district centers for a stylized Rwanda map (SVG user space). */
export const RWANDA_DISTRICT_POINTS: {
  name: string;
  slug: string;
  region: string;
  x: number;
  y: number;
}[] = [
  // City of Kigali
  { name: "Nyarugenge", slug: "nyarugenge", region: "City of Kigali", x: 268, y: 168 },
  { name: "Kicukiro", slug: "kicukiro", region: "City of Kigali", x: 286, y: 182 },
  { name: "Gasabo", slug: "gasabo", region: "City of Kigali", x: 278, y: 152 },
  { name: "Kigali", slug: "kigali", region: "City of Kigali", x: 274, y: 168 },
  // Northern
  { name: "Musanze", slug: "musanze", region: "Northern Province", x: 168, y: 78 },
  { name: "Burera", slug: "burera", region: "Northern Province", x: 198, y: 58 },
  { name: "Gakenke", slug: "gakenke", region: "Northern Province", x: 198, y: 108 },
  { name: "Gicumbi", slug: "gicumbi", region: "Northern Province", x: 248, y: 98 },
  { name: "Rulindo", slug: "rulindo", region: "Northern Province", x: 228, y: 128 },
  // Southern
  { name: "Huye", slug: "huye", region: "Southern Province", x: 188, y: 318 },
  { name: "Nyanza", slug: "nyanza", region: "Southern Province", x: 208, y: 278 },
  { name: "Ruhango", slug: "ruhango", region: "Southern Province", x: 218, y: 248 },
  { name: "Muhanga", slug: "muhanga", region: "Southern Province", x: 198, y: 218 },
  { name: "Kamonyi", slug: "kamonyi", region: "Southern Province", x: 238, y: 208 },
  { name: "Nyamagabe", slug: "nyamagabe", region: "Southern Province", x: 148, y: 308 },
  { name: "Nyaruguru", slug: "nyaruguru", region: "Southern Province", x: 158, y: 348 },
  { name: "Gisagara", slug: "gisagara", region: "Southern Province", x: 228, y: 338 },
  // Eastern
  { name: "Rwamagana", slug: "rwamagana", region: "Eastern Province", x: 318, y: 178 },
  { name: "Kayonza", slug: "kayonza", region: "Eastern Province", x: 348, y: 188 },
  { name: "Ngoma", slug: "ngoma", region: "Eastern Province", x: 338, y: 228 },
  { name: "Bugesera", slug: "bugesera", region: "Eastern Province", x: 298, y: 228 },
  { name: "Gatsibo", slug: "gatsibo", region: "Eastern Province", x: 348, y: 138 },
  { name: "Nyagatare", slug: "nyagatare", region: "Eastern Province", x: 328, y: 78 },
  { name: "Kirehe", slug: "kirehe", region: "Eastern Province", x: 368, y: 248 },
  // Western
  { name: "Rubavu", slug: "rubavu", region: "Western Province", x: 98, y: 108 },
  { name: "Nyabihu", slug: "nyabihu", region: "Western Province", x: 128, y: 128 },
  { name: "Ngororero", slug: "ngororero", region: "Western Province", x: 148, y: 168 },
  { name: "Rutsiro", slug: "rutsiro", region: "Western Province", x: 108, y: 168 },
  { name: "Karongi", slug: "karongi", region: "Western Province", x: 118, y: 218 },
  { name: "Nyamasheke", slug: "nyamasheke", region: "Western Province", x: 108, y: 278 },
  { name: "Rusizi", slug: "rusizi", region: "Western Province", x: 88, y: 328 },
];
