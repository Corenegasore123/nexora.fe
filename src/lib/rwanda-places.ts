/** Search places: All Rwanda, Kigali (all districts), plus all 30 districts. */
export const ALL_PLACES_LABEL = "All";

export const KIGALI_DISTRICT_NAMES = ["Gasabo", "Nyarugenge", "Kicukiro"] as const;

export const RWANDA_PLACES = [
  // Kigali metro groups Gasabo + Nyarugenge + Kicukiro in search.
  { name: "Kigali", region: "City of Kigali", city: "Kigali", groupsDistricts: true },
  // City of Kigali - 3 districts (catalog city is still often "Kigali" until venues are district-tagged)
  { name: "Gasabo", region: "City of Kigali", city: "Kigali", groupsDistricts: false },
  { name: "Nyarugenge", region: "City of Kigali", city: "Kigali", groupsDistricts: false },
  { name: "Kicukiro", region: "City of Kigali", city: "Kigali", groupsDistricts: false },
  // Northern Province
  { name: "Burera", region: "Northern Province", city: "Burera", groupsDistricts: false },
  { name: "Gakenke", region: "Northern Province", city: "Gakenke", groupsDistricts: false },
  { name: "Gicumbi", region: "Northern Province", city: "Gicumbi", groupsDistricts: false },
  { name: "Musanze", region: "Northern Province", city: "Musanze", groupsDistricts: false },
  { name: "Rulindo", region: "Northern Province", city: "Rulindo", groupsDistricts: false },
  // Southern Province
  { name: "Gisagara", region: "Southern Province", city: "Gisagara", groupsDistricts: false },
  { name: "Huye", region: "Southern Province", city: "Huye", groupsDistricts: false },
  { name: "Kamonyi", region: "Southern Province", city: "Kamonyi", groupsDistricts: false },
  { name: "Muhanga", region: "Southern Province", city: "Muhanga", groupsDistricts: false },
  { name: "Nyamagabe", region: "Southern Province", city: "Nyamagabe", groupsDistricts: false },
  { name: "Nyanza", region: "Southern Province", city: "Nyanza", groupsDistricts: false },
  { name: "Nyaruguru", region: "Southern Province", city: "Nyaruguru", groupsDistricts: false },
  { name: "Ruhango", region: "Southern Province", city: "Ruhango", groupsDistricts: false },
  // Eastern Province
  { name: "Bugesera", region: "Eastern Province", city: "Bugesera", groupsDistricts: false },
  { name: "Gatsibo", region: "Eastern Province", city: "Gatsibo", groupsDistricts: false },
  { name: "Kayonza", region: "Eastern Province", city: "Kayonza", groupsDistricts: false },
  { name: "Kirehe", region: "Eastern Province", city: "Kirehe", groupsDistricts: false },
  { name: "Ngoma", region: "Eastern Province", city: "Ngoma", groupsDistricts: false },
  { name: "Nyagatare", region: "Eastern Province", city: "Nyagatare", groupsDistricts: false },
  { name: "Rwamagana", region: "Eastern Province", city: "Rwamagana", groupsDistricts: false },
  // Western Province
  { name: "Karongi", region: "Western Province", city: "Karongi", groupsDistricts: false },
  { name: "Ngororero", region: "Western Province", city: "Ngororero", groupsDistricts: false },
  { name: "Nyabihu", region: "Western Province", city: "Nyabihu", groupsDistricts: false },
  { name: "Nyamasheke", region: "Western Province", city: "Nyamasheke", groupsDistricts: false },
  { name: "Rubavu", region: "Western Province", city: "Rubavu", groupsDistricts: false },
  { name: "Rusizi", region: "Western Province", city: "Rusizi", groupsDistricts: false },
  { name: "Rutsiro", region: "Western Province", city: "Rutsiro", groupsDistricts: false },
] as const;

export type RwandaPlaceName = (typeof RWANDA_PLACES)[number]["name"] | typeof ALL_PLACES_LABEL;

/** Resolve a place label to the API `city` filter. Empty = nationwide. */
export function placeToCityFilter(place: string) {
  if (!place.trim() || place.toLowerCase() === "all") return "";
  const row = RWANDA_PLACES.find((p) => p.name.toLowerCase() === place.toLowerCase());
  // Kigali metro groups all City of Kigali districts on the API side.
  if (row?.groupsDistricts) return "Kigali";
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
