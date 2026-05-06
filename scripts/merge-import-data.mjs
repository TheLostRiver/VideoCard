import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, "..", "src", "data");

const VALID_BRANDS = new Set(["nvidia", "amd", "intel"]);
const VALID_SEGMENTS = new Set(["desktop", "mobile"]);

function detectSegment(name) {
  const lower = name.toLowerCase();
  if (/\blaptop\b|\bm\b\bmobile\b|\bm\d{3,4}\b/i.test(name)) return "mobile";
  return "desktop";
}

function detectGeneration(name) {
  const lower = name.toLowerCase();
  if (/rtx\s*40/.test(lower)) return "RTX 40";
  if (/rtx\s*30/.test(lower)) return "RTX 30";
  if (/rtx\s*20/.test(lower)) return "RTX 20";
  if (/gtx\s*16/.test(lower)) return "GTX 16";
  if (/gtx\s*10/.test(lower)) return "GTX 10";
  if (/gtx\s*9/.test(lower)) return "GTX 9";
  if (/gtx\s*7/.test(lower)) return "GTX 7";
  if (/rx\s*7/.test(lower)) return "RX 7000";
  if (/rx\s*6/.test(lower)) return "RX 6000";
  if (/rx\s*5/.test(lower)) return "RX 5000";
  if (/rx\s*5[0-9]{2}/.test(lower)) return "RX 500";
  if (/rx\s*4[0-9]{2}/.test(lower)) return "RX 400";
  if (/r9/.test(lower)) return "R9";
  if (/r7/.test(lower)) return "R7";
  if (/r5/.test(lower)) return "R5";
  if (/arc\s*a/.test(lower)) return "Arc";
  if (/quadro/.test(lower)) return "Quadro";
  if (/firepro|firegl/.test(lower)) return "FirePro";
  if (/geforce\s*gt/.test(lower)) return "GT";
  if (/radeon\s*hd/.test(lower)) return "Radeon HD";
  return "";
}

function sanitizeGpu(g, usedIds) {
  // Skip brands not in BRANDS
  if (!VALID_BRANDS.has(g.brand)) return null;

  const segment = detectSegment(g.segment || detectSegment(g.name));
  const generation = g.generation || detectGeneration(g.name) || g.architecture || g._chip || "";
  const architecture = g.architecture || g._chip || generation;

  if (!architecture) return null;

  // Deduplicate ID
  let id = g.id;
  if (usedIds.has(id)) {
    let suffix = 2;
    while (usedIds.has(`${id}-${suffix}`)) suffix++;
    id = `${id}-${suffix}`;
  }
  usedIds.add(id);

  return {
    id,
    name: g.name,
    brand: g.brand,
    segment,
    generation,
    architecture,
    releaseDate: g.releaseDate || null,
    performanceIndex: 1,
    tier: "legacy",
    specs: {
      coresLabel: "Shaders",
      cores: g.specs?.cores ?? null,
      baseClockMHz: g.specs?.baseClockMHz ?? null,
      boostClockMHz: g.specs?.boostClockMHz ?? null,
      memorySizeGB: g.specs?.memorySizeGB ?? null,
      memoryType: g.specs?.memoryType ?? null,
      memoryBusBit: g.specs?.memoryBusBit ?? null,
      bandwidthGBs: null,
      powerW: null,
      tgpRangeW: null
    },
    benchmarks: {
      timeSpyGraphics: null,
      steelNomadGraphics: null,
      passMarkG3D: null
    },
    gaming: {
      recommendedResolution: "待补充",
      rayTracingLevel: "unknown",
      efficiencyNote: ""
    },
    notes: [],
    sources: [{ title: "External GPU Database", url: "" }],
    confidence: "low"
  };
}

async function main() {
  // Read import data
  const gpuImport = JSON.parse(await readFile(join(__dirname, "output", "gpus-import.json"), "utf8"));
  const cpuImport = JSON.parse(await readFile(join(__dirname, "output", "desktop-cpu-import.items.json"), "utf8"));

  // Read existing data
  const existingGpus = JSON.parse(await readFile(join(SRC_DIR, "gpus.json"), "utf8"));
  const existingCpus = JSON.parse(await readFile(join(SRC_DIR, "hardware", "desktop-cpu.items.json"), "utf8"));

  const existingGpuNames = new Set(existingGpus.map((g) => g.name.toLowerCase()));
  const existingCpuNames = new Set(existingCpus.map((c) => c.item.name.toLowerCase()));
  const usedGpuIds = new Set(existingGpus.map((g) => g.id));

  // Filter and sanitize GPUs
  const newGpus = [];
  for (const g of gpuImport) {
    if (existingGpuNames.has(g.name.toLowerCase())) continue;
    if (!g.releaseDate) continue;
    const year = Number(g.releaseDate.slice(0, 4));
    if (year < 2012) continue;
    const sanitized = sanitizeGpu(g, usedGpuIds);
    if (sanitized) newGpus.push(sanitized);
  }

  // Filter CPUs: known brands, year >= 2012, not duplicate names
  const filteredCpus = cpuImport.filter((c) => {
    if (!VALID_BRANDS.has(c.item.manufacturerId)) return false;
    if (!c.item.releaseDate) return false;
    const year = Number(c.item.releaseDate.slice(0, 4));
    if (year < 2012) return false;
    if (existingCpuNames.has(c.item.name.toLowerCase())) return false;
    return true;
  });

  console.log(`Filtered GPUs: ${newGpus.length} (from ${gpuImport.length})`);
  console.log(`Filtered CPUs: ${filteredCpus.length} (from ${cpuImport.length})`);

  // Merge
  const mergedGpus = [...existingGpus, ...newGpus];
  const mergedCpus = [...existingCpus, ...filteredCpus];

  console.log(`\nMerged GPUs: ${existingGpus.length} + ${newGpus.length} = ${mergedGpus.length}`);
  console.log(`Merged CPUs: ${existingCpus.length} + ${filteredCpus.length} = ${mergedCpus.length}`);

  // Write merged data
  await writeFile(join(SRC_DIR, "gpus.json"), JSON.stringify(mergedGpus, null, 2) + "\n");
  const gpusJsContent = `export const gpus = ${JSON.stringify(mergedGpus, null, 2)};\n`;
  await writeFile(join(SRC_DIR, "gpus.js"), gpusJsContent);
  await writeFile(join(SRC_DIR, "hardware", "desktop-cpu.items.json"), JSON.stringify(mergedCpus, null, 2) + "\n");

  console.log("\nMerge complete. Files updated:");
  console.log("  src/data/gpus.json");
  console.log("  src/data/gpus.js");
  console.log("  src/data/hardware/desktop-cpu.items.json");
}

main().catch((err) => {
  console.error("Merge failed:", err);
  process.exit(1);
});
