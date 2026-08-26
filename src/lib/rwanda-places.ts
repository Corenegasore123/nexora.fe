/** Search places: All Rwanda, Kigali, plus all 30 districts. */
export const ALL_PLACES_LABEL = "All";

export const RWANDA_PLACES = [
  { name: "Kigali", region: "City of Kigali", city: "Kigali" },
  // City of Kigali — 3 districts
  { name: "Gasabo", region: "City of Kigali", city: "Kigali" },
  { name: "Kicukiro", region: "City of Kigali", city: "Kigali" },
  { name: "Nyarugenge", region: "City of Kigali", city: "Kigali" },
  // Northern Province
  { name: "Burera", region: "Northern Province", city: "Burera" },
  { name: "Gakenke", region: "Northern Province", city: "Gakenke" },
  { name: "Gicumbi", region: "Northern Province", city: "Gicumbi" },
  { name: "Musanze", region: "Northern Province", city: "Musanze" },
  { name: "Rulindo", region: "Northern Province", city: "Rulindo" },
  // Southern Province
  { name: "Gisagara", region: "Southern Province", city: "Gisagara" },
  { name: "Huye", region: "Southern Province", city: "Huye" },
  { name: "Kamonyi", region: "Southern Province", city: "Kamonyi" },
  { name: "Muhanga", region: "Southern Province", city: "Muhanga" },
  { name: "Nyamagabe", region: "Southern Province", city: "Nyamagabe" },
  { name: "Nyanza", region: "Southern Province", city: "Nyanza" },
  { name: "Nyaruguru", region: "Southern Province", city: "Nyaruguru" },
  { name: "Ruhango", region: "Southern Province", city: "Ruhango" },
  // Eastern Province
  { name: "Bugesera", region: "Eastern Province", city: "Bugesera" },
  { name: "Gatsibo", region: "Eastern Province", city: "Gatsibo" },
  { name: "Kayonza", region: "Eastern Province", city: "Kayonza" },
  { name: "Kirehe", region: "Eastern Province", city: "Kirehe" },
  { name: "Ngoma", region: "Eastern Province", city: "Ngoma" },
  { name: "Nyagatare", region: "Eastern Province", city: "Nyagatare" },
  { name: "Rwamagana", region: "Eastern Province", city: "Rwamagana" },
  // Western Province
  { name: "Karongi", region: "Western Province", city: "Karongi" },
  { name: "Ngororero", region: "Western Province", city: "Ngororero" },
  { name: "Nyabihu", region: "Western Province", city: "Nyabihu" },
  { name: "Nyamasheke", region: "Western Province", city: "Nyamasheke" },
  { name: "Rubavu", region: "Western Province", city: "Rubavu" },
  { name: "Rusizi", region: "Western Province", city: "Rusizi" },
  { name: "Rutsiro", region: "Western Province", city: "Rutsiro" },
] as const;

export type RwandaPlaceName = (typeof RWANDA_PLACES)[number]["name"] | typeof ALL_PLACES_LABEL;

/** Resolve a place label to the API `city` filter. Empty = nationwide. */
export function placeToCityFilter(place: string) {
  if (!place.trim() || place.toLowerCase() === "all") return "";
  const row = RWANDA_PLACES.find((p) => p.name.toLowerCase() === place.toLowerCase());
  return row?.city ?? place;
}

/** Pick a place label from a city query (defaults to All). */
export function cityToPlace(city?: string) {
  if (!city?.trim()) return ALL_PLACES_LABEL;
  if (city.toLowerCase() === "all") return ALL_PLACES_LABEL;
  const exact = RWANDA_PLACES.find((p) => p.name.toLowerCase() === city.toLowerCase());
  if (exact) return exact.name;
  if (city.toLowerCase() === "kigali") return "Kigali";
  return city;
}
