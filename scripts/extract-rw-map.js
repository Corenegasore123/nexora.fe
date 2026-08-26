const fs = require("fs");
const svg = fs.readFileSync("C:/corene/nexora/rw.svg", "utf8");
const paths = [...svg.matchAll(/<path d="([^"]+)" id="(RW0[1-5])" name="([^"]+)">/g)].map((m) => ({
  id: m[2],
  name: m[3],
  d: m[1],
}));
const labels = [...svg.matchAll(/<circle class="([^"]+)" cx="([^"]+)" cy="([^"]+)" id="(RW0[1-5])">/g)].map((m) => ({
  id: m[4],
  label: m[1],
  cx: Number(m[2]),
  cy: Number(m[3]),
}));
fs.copyFileSync("C:/corene/nexora/rw.svg", "C:/corene/nexora/frontend/public/rwanda-provinces.svg");
fs.writeFileSync(
  "C:/corene/nexora/frontend/src/lib/rwanda-map-paths.json",
  JSON.stringify({ viewBox: "0 0 1000 873", paths, labels }, null, 2)
);
console.log(paths.map((p) => `${p.name} (${p.d.length})`).join(", "));
console.log(labels);
