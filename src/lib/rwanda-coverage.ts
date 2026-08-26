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

/** Stylized Rwanda outline in the same SVG space as district points. */
export const RWANDA_OUTLINE: [number, number][] = [
  [118, 46],
  [170, 36],
  [230, 40],
  [286, 52],
  [330, 88],
  [358, 140],
  [366, 200],
  [352, 260],
  [320, 320],
  [270, 372],
  [210, 398],
  [150, 390],
  [100, 350],
  [70, 290],
  [58, 220],
  [68, 150],
  [90, 95],
  [118, 46],
];

export function isPlaceLive(restaurantCount: number | undefined | null) {
  return (restaurantCount ?? 0) > 0;
}

function pointInPolygon(x: number, y: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.00001) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Dense dotted fill for the Rwanda landmass (reference: dotted continent maps). */
export function buildRwandaLandDots(step = 7) {
  const dots: { x: number; y: number }[] = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of RWANDA_OUTLINE) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  for (let y = minY; y <= maxY; y += step) {
    for (let x = minX; x <= maxX; x += step) {
      if (pointInPolygon(x, y, RWANDA_OUTLINE)) dots.push({ x, y });
    }
  }
  return dots;
}
