import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.argv[2] || "Q:\\SoftwareData\\CPU_GPU_Data";
const OUTPUT_DIR = join(__dirname, "output");

// ── Date Parsing ──

const MONTH_NAMES = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
};

export function parseExternalDate(value) {
  if (value == null) return null;
  const str = String(value).trim();
  if (!str || str === "N/A") return null;

  // "2023-04" already in correct format
  if (/^\d{4}-\d{2}$/.test(str)) return str;

  // "2022" year only
  if (/^\d{4}$/.test(str)) return `${str}-01`;

  // "Aug 2024" / "October 2024"
  const monthYear = str.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTH_NAMES[monthYear[1].toLowerCase().slice(0, 3)];
    if (month) return `${monthYear[2]}-${month}`;
  }

  // "Sep 1st, 2004" / "Aug 17th, 2011"
  const mdy = str.match(/([A-Za-z]+)\s+\d{1,2}(?:st|nd|rd|th)?,?\s*(\d{4})/);
  if (mdy) {
    const month = MONTH_NAMES[mdy[1].toLowerCase().slice(0, 3)];
    if (month) return `${mdy[2]}-${month}`;
  }

  // Fallback: extract year
  const yearMatch = str.match(/(19|20)\d{2}/);
  return yearMatch ? `${yearMatch[0]}-01` : null;
}

// ── Field Parsers ──

export function parseNumber(value) {
  if (value == null || value === "") return null;
  const str = String(value).trim().replace(/,/g, "");
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
}

export function parseTdp(value) {
  if (value == null) return null;
  const str = String(value).trim();
  const match = str.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

export function parseFrequency(value) {
  if (value == null) return null;
  const str = String(value).trim();
  // "4.1 GHz" → 4100, "500 MHz" → 500
  const ghzMatch = str.match(/(\d+(?:\.\d+)?)\s*GHz/i);
  if (ghzMatch) return Math.round(Number(ghzMatch[1]) * 1000);
  const mhzMatch = str.match(/(\d+(?:\.\d+)?)\s*MHz/i);
  if (mhzMatch) return Math.round(Number(mhzMatch[1]));
  // Pure number assume MHz
  const num = Number(str.replace(/[^\d.]/g, ""));
  return Number.isFinite(num) && num > 0 ? Math.round(num) : null;
}

export function parseCacheSize(value) {
  if (value == null) return null;
  const str = String(value).trim().toUpperCase();
  const mbMatch = str.match(/(\d+(?:\.\d+)?)\s*MB/);
  if (mbMatch) return Number(mbMatch[1]);
  const gbMatch = str.match(/(\d+(?:\.\d+)?)\s*GB/);
  if (gbMatch) return Number(gbMatch[1]) * 1024;
  return null;
}

export function parseCoresField(value) {
  if (value == null) return { count: null, threads: null };
  const str = String(value).trim();
  const parts = str.split("/").map((s) => parseNumber(s.trim()));
  return {
    count: parts[0] ?? null,
    threads: parts.length > 1 ? parts[1] : parts[0] ?? null
  };
}

export function parseMemoryField(value) {
  if (value == null) return { size: null, type: null, busWidth: null };
  const str = String(value).trim();
  // "128 MB, DDR, 128 bit" or "2 GB, GDDR5, 128 bit" or "16 GB / GDDR6 / 128 bit"
  const parts = str.split(/[,/]/).map((s) => s.trim());
  let size = null;
  let type = null;
  let busWidth = null;

  for (const part of parts) {
    const gbMatch = part.match(/(\d+(?:\.\d+)?)\s*GB/i);
    const mbMatch = part.match(/(\d+(?:\.\d+)?)\s*MB/i);
    const bitMatch = part.match(/(\d+)\s*bit/i);
    if (gbMatch) size = Number(gbMatch[1]) * 1024;
    else if (mbMatch) size = Number(mbMatch[1]);
    else if (bitMatch) busWidth = Number(bitMatch[1]);
    else if (/GDDR|DDR|HBM|LPDDR/i.test(part)) type = part;
  }

  return { size, type, busWidth };
}

export function parseShadersField(value) {
  if (value == null) return { shaders: null, tmus: null, rops: null };
  const str = String(value).trim();
  const parts = str.split("/").map((s) => parseNumber(s.trim()));
  return {
    shaders: parts[0] ?? null,
    tmus: parts[1] ?? null,
    rops: parts[2] ?? null
  };
}

export function parseClockRange(value) {
  if (value == null) return { base: null, boost: null };
  const str = String(value).trim();
  // "2.1 to 2.4 GHz" or "3.5 GHz"
  const rangeMatch = str.match(/(\d+(?:\.\d+)?)\s*to\s*(\d+(?:\.\d+)?)\s*(GHz|MHz)/i);
  if (rangeMatch) {
    const unit = rangeMatch[3].toLowerCase();
    const mult = unit === "ghz" ? 1000 : 1;
    return {
      base: Math.round(Number(rangeMatch[1]) * mult),
      boost: Math.round(Number(rangeMatch[2]) * mult)
    };
  }
  const freq = parseFrequency(str);
  return { base: freq, boost: freq };
}

// ── ID Generation ──

export function generateId(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[®™()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ── GPU Conversion ──

export function convertToProjectGpu(item) {
  const memory = parseMemoryField(item.Memory);
  const shaders = parseShadersField(item.Shaders_TMUs_ROPs);
  const clock = parseFrequency(item.GPU_clock);
  const memClock = parseFrequency(item.Memory_clock);
  const name = item.Product_Name || item.Name || "Unknown GPU";

  return {
    id: generateId(name),
    name,
    brand: detectBrand(name),
    segment: "desktop",
    generation: detectGeneration(name),
    architecture: item.GPU_Chip || "",
    releaseDate: parseExternalDate(item.Released),
    performanceIndex: 0,
    tier: "unranked",
    specs: {
      coresLabel: "Shaders",
      cores: shaders.shaders,
      baseClockMHz: clock,
      boostClockMHz: clock,
      memorySizeGB: memory.size ? Math.round(memory.size / 1024) : null,
      memoryType: memory.type,
      memoryBusBit: memory.busWidth,
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
    confidence: "low",
    _chip: item.GPU_Chip || null,
    _bus: item.Bus || null,
    _memoryClock: memClock,
    _tmus: shaders.tmus,
    _rops: shaders.rops
  };
}

// ── CPU Conversion ──

export function convertFromCpusJson(item) {
  const cores = parseCoresField(item.Cores);
  const clock = parseClockRange(item.Clock);
  const name = item.Name || "Unknown CPU";

  return {
    name,
    id: generateId(name),
    codename: item.Codename || null,
    process: item.Process || null,
    cores: cores.count,
    threads: cores.threads,
    baseClock: clock.base,
    boostClock: clock.boost,
    socket: item.Socket || null,
    cacheL3: parseCacheSize(item["L3 Cache"]),
    tdp: parseTdp(item.TDP),
    releaseDate: parseExternalDate(item.Released),
    price: null,
    cpuMark: null,
    threadMark: null,
    cpuValue: null,
    powerPerf: null
  };
}

export function convertFromBenchmarkCsv(item) {
  const name = item.cpuName || "Unknown CPU";
  return {
    name,
    id: generateId(name),
    codename: null,
    process: null,
    cores: parseNumber(item.cores),
    threads: null,
    baseClock: null,
    boostClock: null,
    socket: item.socket || null,
    cacheL3: null,
    tdp: parseNumber(item.TDP),
    releaseDate: item.testDate ? `${item.testDate}-01` : null,
    price: parseNumber(item.price),
    cpuMark: parseNumber(item.cpuMark),
    threadMark: parseNumber(item.threadMark),
    cpuValue: parseNumber(item.cpuValue),
    powerPerf: parseNumber(item.powerPerf)
  };
}

export function convertFromTpuCsv(item) {
  const cores = parseCoresField(item.Cores);
  const clock = parseClockRange(item.Clock);
  const name = item.Name || "Unknown CPU";

  return {
    name,
    id: generateId(name),
    codename: item.Codename || null,
    process: item.Process || null,
    cores: cores.count,
    threads: cores.threads,
    baseClock: clock.base,
    boostClock: clock.boost,
    socket: item.Socket || null,
    cacheL3: parseCacheSize(item.L3_Cache),
    tdp: parseTdp(item.TDP),
    releaseDate: parseExternalDate(item.Release),
    price: null,
    cpuMark: null,
    threadMark: null,
    cpuValue: null,
    powerPerf: null
  };
}

export function mergeCpuRecords(records) {
  const byId = new Map();
  for (const record of records) {
    const existing = byId.get(record.id);
    if (!existing) {
      byId.set(record.id, { ...record });
    } else {
      // Merge: prefer non-null values from newer records
      for (const key of Object.keys(record)) {
        if (key === "id" || key === "name") continue;
        if (record[key] != null && existing[key] == null) {
          existing[key] = record[key];
        }
      }
    }
  }
  return [...byId.values()];
}

export function convertToProjectCpuItem(record) {
  const brand = detectBrand(record.name);
  return {
    item: {
      id: record.id,
      categoryId: "desktop-cpu",
      name: record.name,
      manufacturerId: brand,
      generation: record.codename || "",
      architecture: record.process || "",
      releaseDate: record.releaseDate,
      marketSegmentIds: ["desktop"],
      status: "published",
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    metricValues: [
      metricVal("cpu.performance.index", record.cpuMark ? Math.round(record.cpuMark / 1000) : null),
      metricVal("cpu.release.date", record.releaseDate),
      metricVal("cpu.confidence", record.cpuMark ? "medium" : "low"),
      metricVal("cpu.core.count", record.cores),
      metricVal("cpu.core.threads", record.threads),
      metricVal("cpu.clock.base", record.baseClock),
      metricVal("cpu.clock.boost", record.boostClock),
      metricVal("cpu.cache.l3", record.cacheL3),
      metricVal("cpu.socket", record.socket),
      metricVal("cpu.power.tdp", record.tdp),
      metricVal("cpu.codename", record.codename),
      metricVal("cpu.process", record.process),
      metricVal("cpu.price", record.price),
      metricVal("cpu.benchmark.cpuMark", record.cpuMark),
      metricVal("cpu.benchmark.threadMark", record.threadMark),
      metricVal("cpu.value.cpuValue", record.cpuValue),
      metricVal("cpu.value.powerPerf", record.powerPerf)
    ].filter((m) => m.valueNumber != null || m.valueText != null),
    rankingScore: {
      profileId: "cpu-performance",
      score: record.cpuMark ? Math.round(record.cpuMark / 1000) : 0,
      components: []
    },
    sources: [{ title: "External CPU Database", url: "" }]
  };
}

function metricVal(metricId, value) {
  if (value == null) return { metricId, valueNumber: null, valueText: null };
  if (typeof value === "number") return { metricId, valueNumber: value, valueText: null };
  return { metricId, valueNumber: null, valueText: String(value) };
}

// ── Brand Detection ──

function detectBrand(name) {
  const lower = name.toLowerCase();
  if (lower.includes("nvidia") || lower.includes("geforce") || lower.includes("rtx") || lower.includes("gtx") || lower.includes("quadro") || lower.includes("tesla")) return "nvidia";
  if (lower.includes("amd") || lower.includes("radeon") || lower.includes("rx ") || lower.includes("ryzen") || lower.includes("threadripper") || lower.includes("athlon") || lower.includes("phenom") || lower.includes("fx-") || lower.includes("epyc")) return "amd";
  if (lower.includes("intel") || lower.includes("core") || lower.includes("pentium") || lower.includes("celeron") || lower.includes("xeon") || lower.includes("atom")) return "intel";
  if (lower.includes("arc ") || lower.includes("a380") || lower.includes("a750") || lower.includes("a770")) return "intel";
  if (lower.includes("qualcomm") || lower.includes("snapdragon") || lower.includes("dimensity")) return "qualcomm";
  if (lower.includes("apple") || lower.includes("m1") || lower.includes("m2") || lower.includes("m3") || lower.includes("m4")) return "apple";
  if (lower.includes("samsung") || lower.includes("exynos")) return "samsung";
  return "unknown";
}

function detectGeneration(name) {
  const lower = name.toLowerCase();
  if (lower.includes("rtx 40")) return "RTX 40";
  if (lower.includes("rtx 30")) return "RTX 30";
  if (lower.includes("rtx 20")) return "RTX 20";
  if (lower.includes("gtx 16")) return "GTX 16";
  if (lower.includes("gtx 10")) return "GTX 10";
  if (lower.includes("rx 7")) return "RX 7000";
  if (lower.includes("rx 6")) return "RX 6000";
  if (lower.includes("rx 5")) return "RX 5000";
  if (lower.includes("arc a")) return "Arc";
  return "";
}

// ── CSV Parser ──

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = (values[i] || "").trim();
    });
    return obj;
  });
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ── Main ──

async function main() {
  console.log("External data directory:", DATA_DIR);
  console.log("Output directory:", OUTPUT_DIR);

  await mkdir(OUTPUT_DIR, { recursive: true });

  // Read external data
  console.log("\nReading gpus.json...");
  const gpusRaw = JSON.parse(await readFile(join(DATA_DIR, "gpus.json"), "utf8"));
  console.log(`  Found ${gpusRaw.length} external GPUs`);

  console.log("Reading cpus.json...");
  const cpusRaw = JSON.parse(await readFile(join(DATA_DIR, "cpus.json"), "utf8"));
  console.log(`  Found ${cpusRaw.length} external CPUs (JSON)`);

  let benchmarkCsv = [];
  try {
    console.log("Reading CPU_benchmark_v4.csv...");
    benchmarkCsv = parseCsv(await readFile(join(DATA_DIR, "CPU_benchmark_v4.csv"), "utf8"));
    console.log(`  Found ${benchmarkCsv.length} CPU benchmark records`);
  } catch {
    console.log("  CPU_benchmark_v4.csv not found, skipping");
  }

  let tpuCsv = [];
  try {
    console.log("Reading tpu_cpus.csv...");
    tpuCsv = parseCsv(await readFile(join(DATA_DIR, "tpu_cpus.csv"), "utf8"));
    console.log(`  Found ${tpuCsv.length} TPU CPU records`);
  } catch {
    console.log("  tpu_cpus.csv not found, skipping");
  }

  // Convert GPUs
  console.log("\nConverting GPUs...");
  const projectGpus = gpusRaw.map(convertToProjectGpu);
  console.log(`  Converted ${projectGpus.length} GPUs`);

  // Convert and merge CPUs
  console.log("Converting and merging CPUs...");
  const cpusFromJson = cpusRaw.map(convertFromCpusJson);
  const cpusFromBenchmark = benchmarkCsv.map(convertFromBenchmarkCsv);
  const cpusFromTpu = tpuCsv.map(convertFromTpuCsv);
  const allCpuRecords = [...cpusFromJson, ...cpusFromBenchmark, ...cpusFromTpu];
  console.log(`  Total raw CPU records: ${allCpuRecords.length}`);
  const mergedCpus = mergeCpuRecords(allCpuRecords);
  console.log(`  After dedup: ${mergedCpus.length} unique CPUs`);
  const projectCpus = mergedCpus.map(convertToProjectCpuItem);

  // Read existing project data for dedup
  console.log("\nReading existing project data...");
  const existingGpus = JSON.parse(await readFile(join(__dirname, "..", "src", "data", "gpus.json"), "utf8"));
  const existingGpuIds = new Set(existingGpus.map((g) => g.id));
  console.log(`  Existing GPUs: ${existingGpuIds.size}`);

  let existingCpuItems = [];
  try {
    existingCpuItems = JSON.parse(await readFile(join(__dirname, "..", "src", "data", "hardware", "desktop-cpu.items.json"), "utf8"));
  } catch {
    // File may not exist
  }
  const existingCpuIds = new Set(existingCpuItems.map((c) => c.item?.id).filter(Boolean));
  console.log(`  Existing Desktop CPUs: ${existingCpuIds.size}`);

  // Filter out existing items
  const newGpus = projectGpus.filter((g) => !existingGpuIds.has(g.id));
  const newCpus = projectCpus.filter((c) => !existingCpuIds.has(c.item.id));
  console.log(`\nNew GPUs to import: ${newGpus.length} (skipped ${projectGpus.length - newGpus.length} existing)`);
  console.log(`New CPUs to import: ${newCpus.length} (skipped ${projectCpus.length - newCpus.length} existing)`);

  // Write output
  const gpuPath = join(OUTPUT_DIR, "gpus-import.json");
  const cpuPath = join(OUTPUT_DIR, "desktop-cpu-import.items.json");

  await writeFile(gpuPath, JSON.stringify(newGpus, null, 2));
  await writeFile(cpuPath, JSON.stringify(newCpus, null, 2));

  console.log(`\nOutput written to:`);
  console.log(`  ${gpuPath}`);
  console.log(`  ${cpuPath}`);
  console.log("\nReview the output files before merging into the project.");
}

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith("import-external-data.mjs") ||
  process.argv[1].endsWith("import-external-data")
);

if (isDirectRun) {
  main().catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  });
}
