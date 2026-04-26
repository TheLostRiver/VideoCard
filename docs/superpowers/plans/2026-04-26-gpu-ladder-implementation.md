# GPU Ladder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working static HTML version of the interactive GPU ladder chart.

**Architecture:** The app is a no-framework static frontend. GPU data lives in focused JavaScript modules, pure utility functions handle filtering and formatting, and `src/app.js` renders the list, detail panel, and mobile drawer from data.

**Tech Stack:** HTML, CSS, vanilla JavaScript ES modules, Node.js built-in test runner, custom Node data validation script, custom Node static server.

---

## Execution Contract

Every task must follow this loop:

1. Read `PROJECT_STATE.md`.
2. Complete exactly one task from this plan.
3. Run the verification commands listed in that task.
4. Update this plan by changing that task's checkbox from `- [ ]` to `- [x]`.
5. Update `PROJECT_STATE.md` with current task, completed work, verification, latest commit, and next step.
6. Commit only the files touched by the task.
7. Push the commit with `git push origin main`.

Do not start the next task until the previous task has been committed and pushed.

If verification fails:

- Do not commit.
- Do not push.
- Fix the failure inside the same task if the fix is small.
- If blocked, update `PROJECT_STATE.md` with the blocker and stop.

## File Map

Create and maintain these files:

- `PROJECT_STATE.md`: single source of truth for current operation status.
- `.gitignore`: excludes local/generated files.
- `package.json`: project scripts for testing, validation, and local serving.
- `index.html`: static app shell.
- `src/styles.css`: all visual styling and responsive behavior.
- `src/app.js`: UI state, rendering, event binding, URL hash handling.
- `src/data/gpus.js`: GPU records.
- `src/data/constants.js`: brands, segments, tiers, generations, sort options.
- `src/utils/format.js`: display formatting helpers.
- `src/utils/filters.js`: pure filtering and sorting helpers.
- `src/utils/performance.js`: tier and performance helpers.
- `scripts/validate-data.mjs`: data integrity validation.
- `scripts/serve.mjs`: local static server.
- `tests/format.test.mjs`: tests for display helpers.
- `tests/filters.test.mjs`: tests for filter and sort helpers.
- `tests/performance.test.mjs`: tests for performance helpers.

## Task 1: Project Runtime Skeleton

**Files:**

- Create: `package.json`
- Create: `scripts/serve.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [x] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: The file says implementation has not started.

- [x] **Step 2: Create package scripts**

Create `package.json`:

```json
{
  "name": "video-card-gpu-ladder",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "serve": "node scripts/serve.mjs",
    "test": "node --test --test-isolation=none tests/*.test.mjs",
    "validate:data": "node scripts/validate-data.mjs",
    "verify": "npm run validate:data && npm test"
  }
}
```

- [x] **Step 3: Create local static server**

Create `scripts/serve.mjs`:

```js
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

function resolvePath(urlPath) {
  const cleanPath = urlPath === "/" ? "/index.html" : decodeURIComponent(urlPath);
  const normalized = normalize(cleanPath).replace(/^(\.\.[/\\])+/, "");
  return join(root, normalized);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const filePath = resolvePath(url.pathname);
    const body = await readFile(filePath);
    res.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`GPU ladder server running at http://localhost:${port}`);
});
```

- [x] **Step 4: Verify scripts are visible**

Run:

```bash
npm run
```

Expected: Output lists `serve`, `test`, `validate:data`, and `verify`.

- [x] **Step 5: Update docs, commit, push**

Update `PROJECT_STATE.md` with:

- Current task: Task 1 complete.
- Verification: `npm run` listed expected scripts.
- Next step: Task 2.

Update this task checkbox to checked.

Run:

```bash
git add package.json scripts/serve.mjs PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "chore: add project runtime skeleton"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 2: Data Constants and Formatting Utilities

**Files:**

- Create: `src/data/constants.js`
- Create: `src/utils/format.js`
- Create: `tests/format.test.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [x] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 2.

- [x] **Step 2: Add constants**

Create `src/data/constants.js`:

```js
export const BRANDS = {
  nvidia: { label: "NVIDIA", color: "#76b900" },
  amd: { label: "AMD", color: "#ed1c24" },
  intel: { label: "Intel", color: "#0071c5" }
};

export const SEGMENTS = {
  desktop: "Desktop",
  mobile: "Mobile"
};

export const TIERS = {
  flagship: { label: "旗舰", hint: "4K 高画质或高刷新" },
  enthusiast: { label: "次旗舰", hint: "1440p 高刷或部分 4K" },
  high: { label: "高端", hint: "1440p 体验较好" },
  mainstream: { label: "主流甜点", hint: "1080p/1440p" },
  entry: { label: "入门", hint: "1080p 或轻量游戏" },
  legacy: { label: "旧卡参考", hint: "升级对比" }
};

export const TIER_ORDER = ["flagship", "enthusiast", "high", "mainstream", "entry", "legacy"];

export const SORT_OPTIONS = {
  performance: "综合性能",
  timeSpy: "Time Spy",
  memory: "显存容量",
  efficiency: "能效"
};
```

- [x] **Step 3: Add formatting helpers**

Create `src/utils/format.js`:

```js
export function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "待补充";
  return new Intl.NumberFormat("zh-CN").format(value);
}

export function formatClock(value) {
  if (value === null || value === undefined) return "待补充";
  return `${formatNumber(value)} MHz`;
}

export function formatMemory(gpu) {
  const size = gpu.specs?.memorySizeGB;
  const type = gpu.specs?.memoryType;
  if (!size && !type) return "待补充";
  if (!size) return type;
  if (!type) return `${size}GB`;
  return `${size}GB ${type}`;
}

export function formatPower(gpu) {
  if (gpu.segment === "mobile") return gpu.specs?.tgpRangeW || "待补充";
  const power = gpu.specs?.powerW;
  return power ? `${power}W` : "待补充";
}

export function formatBenchmark(value) {
  if (value === null || value === undefined) return "待补充";
  return formatNumber(value);
}
```

- [x] **Step 4: Add formatting tests**

Create `tests/format.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { formatBenchmark, formatClock, formatMemory, formatNumber, formatPower } from "../src/utils/format.js";

test("formatNumber renders missing values as pending", () => {
  assert.equal(formatNumber(null), "待补充");
  assert.equal(formatNumber(undefined), "待补充");
});

test("formatClock renders MHz", () => {
  assert.equal(formatClock(2475), "2,475 MHz");
});

test("formatMemory combines capacity and type", () => {
  assert.equal(formatMemory({ specs: { memorySizeGB: 12, memoryType: "GDDR6X" } }), "12GB GDDR6X");
});

test("formatPower uses TGP range for mobile GPUs", () => {
  const gpu = { segment: "mobile", specs: { tgpRangeW: "35-115W", powerW: null } };
  assert.equal(formatPower(gpu), "35-115W");
});

test("formatPower uses powerW for desktop GPUs", () => {
  const gpu = { segment: "desktop", specs: { powerW: 200 } };
  assert.equal(formatPower(gpu), "200W");
});

test("formatBenchmark renders score with separators", () => {
  assert.equal(formatBenchmark(17800), "17,800");
});
```

- [x] **Step 5: Verify tests**

Run:

```bash
npm test
```

Expected: All formatting tests pass.

- [x] **Step 6: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 2 completion, test result, and next step Task 3.

Update this task checkbox to checked.

Run:

```bash
git add src/data/constants.js src/utils/format.js tests/format.test.mjs PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "feat: add data constants and format helpers"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 3: Seed GPU Data

**Files:**

- Create: `src/data/gpus.js`
- Create: `scripts/validate-data.mjs`
- Modify: `package.json`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [x] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 3.

- [x] **Step 2: Add seed GPU records**

Create `src/data/gpus.js` with 12 representative records:

```js
export const gpus = [
  {
    id: "rtx-4090-desktop",
    name: "GeForce RTX 4090",
    brand: "nvidia",
    segment: "desktop",
    generation: "RTX 40",
    architecture: "Ada Lovelace",
    releaseDate: "2022-10",
    performanceIndex: 245,
    tier: "flagship",
    specs: {
      coresLabel: "CUDA Cores",
      cores: 16384,
      baseClockMHz: 2235,
      boostClockMHz: 2520,
      memorySizeGB: 24,
      memoryType: "GDDR6X",
      memoryBusBit: 384,
      bandwidthGBs: 1008,
      powerW: 450,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 36000, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "公开评测均值参考" },
    gaming: { recommendedResolution: "4K", rayTracingLevel: "excellent", efficiencyNote: "旗舰性能，功耗较高" },
    notes: ["支持 DLSS 3", "适合高端 4K 游戏"],
    sources: [{ label: "NVIDIA GeForce", url: "https://www.nvidia.com/en-us/geforce/" }],
    confidence: "aggregate"
  },
  {
    id: "rtx-4070-desktop",
    name: "GeForce RTX 4070",
    brand: "nvidia",
    segment: "desktop",
    generation: "RTX 40",
    architecture: "Ada Lovelace",
    releaseDate: "2023-04",
    performanceIndex: 170,
    tier: "high",
    specs: {
      coresLabel: "CUDA Cores",
      cores: 5888,
      baseClockMHz: 1920,
      boostClockMHz: 2475,
      memorySizeGB: 12,
      memoryType: "GDDR6X",
      memoryBusBit: 192,
      bandwidthGBs: 504,
      powerW: 200,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 17800, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "公开评测均值参考" },
    gaming: { recommendedResolution: "1440p", rayTracingLevel: "good", efficiencyNote: "能效较好" },
    notes: ["支持 DLSS 3"],
    sources: [{ label: "NVIDIA GeForce", url: "https://www.nvidia.com/en-us/geforce/" }],
    confidence: "aggregate"
  },
  {
    id: "rtx-4060-desktop",
    name: "GeForce RTX 4060",
    brand: "nvidia",
    segment: "desktop",
    generation: "RTX 40",
    architecture: "Ada Lovelace",
    releaseDate: "2023-06",
    performanceIndex: 100,
    tier: "mainstream",
    specs: {
      coresLabel: "CUDA Cores",
      cores: 3072,
      baseClockMHz: 1830,
      boostClockMHz: 2460,
      memorySizeGB: 8,
      memoryType: "GDDR6",
      memoryBusBit: 128,
      bandwidthGBs: 272,
      powerW: 115,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 10600, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "基准卡" },
    gaming: { recommendedResolution: "1080p", rayTracingLevel: "medium", efficiencyNote: "首版性能指数基准" },
    notes: ["performanceIndex 基准值为 100"],
    sources: [{ label: "NVIDIA GeForce", url: "https://www.nvidia.com/en-us/geforce/" }],
    confidence: "aggregate"
  },
  {
    id: "rtx-4070-laptop",
    name: "GeForce RTX 4070 Laptop GPU",
    brand: "nvidia",
    segment: "mobile",
    generation: "RTX 40",
    architecture: "Ada Lovelace",
    releaseDate: "2023-02",
    performanceIndex: 135,
    tier: "mainstream",
    specs: {
      coresLabel: "CUDA Cores",
      cores: 4608,
      baseClockMHz: null,
      boostClockMHz: null,
      memorySizeGB: 8,
      memoryType: "GDDR6",
      memoryBusBit: 128,
      bandwidthGBs: 256,
      powerW: null,
      tgpRangeW: "35-115W"
    },
    benchmarks: { timeSpyGraphics: null, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "移动版参考典型高 TGP 机型" },
    gaming: { recommendedResolution: "1080p/1440p", rayTracingLevel: "medium", efficiencyNote: "实际表现受 TGP 和散热影响明显" },
    notes: ["移动版不可直接等同桌面 RTX 4070", "同一 GPU 在不同笔记本中性能差异可能明显"],
    sources: [{ label: "NVIDIA GeForce Laptop", url: "https://www.nvidia.com/en-us/geforce/laptops/" }],
    confidence: "estimated"
  },
  {
    id: "rx-7900-xtx-desktop",
    name: "Radeon RX 7900 XTX",
    brand: "amd",
    segment: "desktop",
    generation: "RX 7000",
    architecture: "RDNA 3",
    releaseDate: "2022-12",
    performanceIndex: 210,
    tier: "enthusiast",
    specs: {
      coresLabel: "Stream Processors",
      cores: 6144,
      baseClockMHz: null,
      boostClockMHz: 2500,
      memorySizeGB: 24,
      memoryType: "GDDR6",
      memoryBusBit: 384,
      bandwidthGBs: 960,
      powerW: 355,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 30000, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "公开评测均值参考" },
    gaming: { recommendedResolution: "4K", rayTracingLevel: "good", efficiencyNote: "传统光栅性能强" },
    notes: ["支持 FSR"],
    sources: [{ label: "AMD Radeon", url: "https://www.amd.com/en/products/graphics/desktops.html" }],
    confidence: "aggregate"
  },
  {
    id: "rx-7800-xt-desktop",
    name: "Radeon RX 7800 XT",
    brand: "amd",
    segment: "desktop",
    generation: "RX 7000",
    architecture: "RDNA 3",
    releaseDate: "2023-09",
    performanceIndex: 155,
    tier: "high",
    specs: {
      coresLabel: "Stream Processors",
      cores: 3840,
      baseClockMHz: null,
      boostClockMHz: 2430,
      memorySizeGB: 16,
      memoryType: "GDDR6",
      memoryBusBit: 256,
      bandwidthGBs: 624,
      powerW: 263,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 20000, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "公开评测均值参考" },
    gaming: { recommendedResolution: "1440p", rayTracingLevel: "medium", efficiencyNote: "大显存甜点级" },
    notes: ["16GB 显存适合 1440p 高画质"],
    sources: [{ label: "AMD Radeon", url: "https://www.amd.com/en/products/graphics/desktops.html" }],
    confidence: "aggregate"
  },
  {
    id: "rx-7600-desktop",
    name: "Radeon RX 7600",
    brand: "amd",
    segment: "desktop",
    generation: "RX 7000",
    architecture: "RDNA 3",
    releaseDate: "2023-05",
    performanceIndex: 92,
    tier: "mainstream",
    specs: {
      coresLabel: "Stream Processors",
      cores: 2048,
      baseClockMHz: null,
      boostClockMHz: 2655,
      memorySizeGB: 8,
      memoryType: "GDDR6",
      memoryBusBit: 128,
      bandwidthGBs: 288,
      powerW: 165,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 10500, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "公开评测均值参考" },
    gaming: { recommendedResolution: "1080p", rayTracingLevel: "entry", efficiencyNote: "1080p 主流选择" },
    notes: ["支持 FSR"],
    sources: [{ label: "AMD Radeon", url: "https://www.amd.com/en/products/graphics/desktops.html" }],
    confidence: "aggregate"
  },
  {
    id: "rx-7700s-mobile",
    name: "Radeon RX 7700S",
    brand: "amd",
    segment: "mobile",
    generation: "RX 7000",
    architecture: "RDNA 3",
    releaseDate: "2023-01",
    performanceIndex: 105,
    tier: "mainstream",
    specs: {
      coresLabel: "Stream Processors",
      cores: 2048,
      baseClockMHz: null,
      boostClockMHz: null,
      memorySizeGB: 8,
      memoryType: "GDDR6",
      memoryBusBit: 128,
      bandwidthGBs: 288,
      powerW: null,
      tgpRangeW: "75-100W"
    },
    benchmarks: { timeSpyGraphics: null, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "移动版参考典型高 TGP 机型" },
    gaming: { recommendedResolution: "1080p/1440p", rayTracingLevel: "entry", efficiencyNote: "轻薄性能本取向" },
    notes: ["移动版性能受整机功耗和散热影响"],
    sources: [{ label: "AMD Radeon", url: "https://www.amd.com/en/products/graphics/laptops.html" }],
    confidence: "estimated"
  },
  {
    id: "arc-a770-desktop",
    name: "Intel Arc A770",
    brand: "intel",
    segment: "desktop",
    generation: "Arc A",
    architecture: "Alchemist",
    releaseDate: "2022-10",
    performanceIndex: 110,
    tier: "mainstream",
    specs: {
      coresLabel: "Xe Cores",
      cores: 32,
      baseClockMHz: null,
      boostClockMHz: 2100,
      memorySizeGB: 16,
      memoryType: "GDDR6",
      memoryBusBit: 256,
      bandwidthGBs: 560,
      powerW: 225,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 14000, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "公开评测均值参考" },
    gaming: { recommendedResolution: "1080p/1440p", rayTracingLevel: "medium", efficiencyNote: "驱动成熟度会影响不同游戏表现" },
    notes: ["支持 XeSS", "老游戏表现可能波动"],
    sources: [{ label: "Intel Arc", url: "https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html" }],
    confidence: "aggregate"
  },
  {
    id: "arc-b580-desktop",
    name: "Intel Arc B580",
    brand: "intel",
    segment: "desktop",
    generation: "Arc B",
    architecture: "Battlemage",
    releaseDate: "2024-12",
    performanceIndex: 125,
    tier: "mainstream",
    specs: {
      coresLabel: "Xe Cores",
      cores: 20,
      baseClockMHz: null,
      boostClockMHz: 2670,
      memorySizeGB: 12,
      memoryType: "GDDR6",
      memoryBusBit: 192,
      bandwidthGBs: 456,
      powerW: 190,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: null, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "公开评测均值参考" },
    gaming: { recommendedResolution: "1080p/1440p", rayTracingLevel: "medium", efficiencyNote: "新一代 Arc 主流卡" },
    notes: ["支持 XeSS"],
    sources: [{ label: "Intel Arc", url: "https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html" }],
    confidence: "estimated"
  },
  {
    id: "gtx-1080-ti-desktop",
    name: "GeForce GTX 1080 Ti",
    brand: "nvidia",
    segment: "desktop",
    generation: "GTX 10",
    architecture: "Pascal",
    releaseDate: "2017-03",
    performanceIndex: 95,
    tier: "legacy",
    specs: {
      coresLabel: "CUDA Cores",
      cores: 3584,
      baseClockMHz: 1480,
      boostClockMHz: 1582,
      memorySizeGB: 11,
      memoryType: "GDDR5X",
      memoryBusBit: 352,
      bandwidthGBs: 484,
      powerW: 250,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 10000, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "旧卡公开评测参考" },
    gaming: { recommendedResolution: "1080p/1440p", rayTracingLevel: "none", efficiencyNote: "旧旗舰，缺少现代特性" },
    notes: ["不支持硬件光追", "适合作为升级对比基准"],
    sources: [{ label: "NVIDIA GeForce", url: "https://www.nvidia.com/en-us/geforce/" }],
    confidence: "aggregate"
  },
  {
    id: "rx-580-desktop",
    name: "Radeon RX 580",
    brand: "amd",
    segment: "desktop",
    generation: "RX 500",
    architecture: "Polaris",
    releaseDate: "2017-04",
    performanceIndex: 48,
    tier: "legacy",
    specs: {
      coresLabel: "Stream Processors",
      cores: 2304,
      baseClockMHz: 1257,
      boostClockMHz: 1340,
      memorySizeGB: 8,
      memoryType: "GDDR5",
      memoryBusBit: 256,
      bandwidthGBs: 256,
      powerW: 185,
      tgpRangeW: null
    },
    benchmarks: { timeSpyGraphics: 4300, steelNomadGraphics: null, passMarkG3D: null, sourceNote: "旧卡公开评测参考" },
    gaming: { recommendedResolution: "1080p", rayTracingLevel: "none", efficiencyNote: "旧主流卡，功耗偏高" },
    notes: ["适合作为老平台升级参考"],
    sources: [{ label: "AMD Radeon", url: "https://www.amd.com/en/products/graphics/desktops.html" }],
    confidence: "aggregate"
  }
];
```

- [x] **Step 3: Add data validator**

Create `scripts/validate-data.mjs`:

```js
import { gpus } from "../src/data/gpus.js";
import { BRANDS, SEGMENTS, TIERS } from "../src/data/constants.js";

const errors = [];
const ids = new Set();

for (const gpu of gpus) {
  if (!gpu.id) errors.push("GPU missing id");
  if (ids.has(gpu.id)) errors.push(`Duplicate id: ${gpu.id}`);
  ids.add(gpu.id);

  if (!gpu.name) errors.push(`${gpu.id} missing name`);
  if (!BRANDS[gpu.brand]) errors.push(`${gpu.id} has invalid brand: ${gpu.brand}`);
  if (!SEGMENTS[gpu.segment]) errors.push(`${gpu.id} has invalid segment: ${gpu.segment}`);
  if (!TIERS[gpu.tier]) errors.push(`${gpu.id} has invalid tier: ${gpu.tier}`);
  if (typeof gpu.performanceIndex !== "number" || gpu.performanceIndex <= 0) {
    errors.push(`${gpu.id} has invalid performanceIndex`);
  }
  if (!gpu.specs?.coresLabel) errors.push(`${gpu.id} missing specs.coresLabel`);
  if (gpu.segment === "mobile" && !gpu.specs?.tgpRangeW) {
    errors.push(`${gpu.id} mobile GPU missing specs.tgpRangeW`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${gpus.length} GPU records.`);
```

- [x] **Step 4: Verify data**

Run:

```bash
npm run validate:data
```

Expected: `Validated 12 GPU records.`

- [x] **Step 5: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 3 completion, validation result, and next step Task 4.

Update this task checkbox to checked.

Run:

```bash
git add src/data/gpus.js scripts/validate-data.mjs PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "feat: add seed gpu data"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 4: Filtering, Sorting, and Performance Utilities

**Files:**

- Create: `src/utils/filters.js`
- Create: `src/utils/performance.js`
- Create: `tests/filters.test.mjs`
- Create: `tests/performance.test.mjs`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [x] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 4.

- [x] **Step 2: Add filter and sort helpers**

Create `src/utils/filters.js`:

```js
export function filterGpus(gpus, filters) {
  const query = filters.query.trim().toLowerCase();
  return gpus.filter((gpu) => {
    const matchesQuery = !query || [
      gpu.name,
      gpu.brand,
      gpu.segment,
      gpu.generation,
      gpu.architecture
    ].join(" ").toLowerCase().includes(query);

    const matchesBrand = filters.brands.size === 0 || filters.brands.has(gpu.brand);
    const matchesSegment = filters.segments.size === 0 || filters.segments.has(gpu.segment);
    const matchesGeneration = filters.generations.size === 0 || filters.generations.has(gpu.generation);

    return matchesQuery && matchesBrand && matchesSegment && matchesGeneration;
  });
}

export function sortGpus(gpus, sortBy) {
  return [...gpus].sort((a, b) => getSortValue(b, sortBy) - getSortValue(a, sortBy));
}

function getSortValue(gpu, sortBy) {
  if (sortBy === "timeSpy") return gpu.benchmarks?.timeSpyGraphics || 0;
  if (sortBy === "memory") return gpu.specs?.memorySizeGB || 0;
  if (sortBy === "efficiency") {
    const power = gpu.specs?.powerW || parseMobileTgp(gpu.specs?.tgpRangeW);
    return power ? gpu.performanceIndex / power : 0;
  }
  return gpu.performanceIndex;
}

function parseMobileTgp(value) {
  if (!value) return null;
  const matches = value.match(/\d+/g);
  if (!matches?.length) return null;
  return Number(matches[matches.length - 1]);
}
```

- [x] **Step 3: Add performance helpers**

Create `src/utils/performance.js`:

```js
import { TIER_ORDER } from "../data/constants.js";

export function groupByTier(gpus) {
  const groups = new Map(TIER_ORDER.map((tier) => [tier, []]));
  for (const gpu of gpus) {
    if (!groups.has(gpu.tier)) groups.set(gpu.tier, []);
    groups.get(gpu.tier).push(gpu);
  }
  return [...groups.entries()].filter(([, items]) => items.length > 0);
}

export function getPerformanceWidth(index, maxIndex) {
  if (!index || !maxIndex) return 8;
  return Math.max(8, Math.round((index / maxIndex) * 100));
}

export function getMaxPerformanceIndex(gpus) {
  return Math.max(...gpus.map((gpu) => gpu.performanceIndex), 1);
}
```

- [x] **Step 4: Add tests**

Create `tests/filters.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import { filterGpus, sortGpus } from "../src/utils/filters.js";

test("filterGpus searches model names", () => {
  const result = filterGpus(gpus, {
    query: "4070",
    brands: new Set(),
    segments: new Set(),
    generations: new Set()
  });
  assert.ok(result.some((gpu) => gpu.id === "rtx-4070-desktop"));
  assert.ok(result.some((gpu) => gpu.id === "rtx-4070-laptop"));
});

test("filterGpus filters mobile GPUs", () => {
  const result = filterGpus(gpus, {
    query: "",
    brands: new Set(),
    segments: new Set(["mobile"]),
    generations: new Set()
  });
  assert.ok(result.length > 0);
  assert.ok(result.every((gpu) => gpu.segment === "mobile"));
});

test("sortGpus sorts by performance descending", () => {
  const result = sortGpus(gpus, "performance");
  assert.equal(result[0].id, "rtx-4090-desktop");
});
```

Create `tests/performance.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import { getMaxPerformanceIndex, getPerformanceWidth, groupByTier } from "../src/utils/performance.js";

test("groupByTier omits empty groups", () => {
  const groups = groupByTier(gpus);
  assert.ok(groups.length > 0);
  assert.ok(groups.every(([, items]) => items.length > 0));
});

test("getPerformanceWidth keeps a readable minimum", () => {
  assert.equal(getPerformanceWidth(1, 1000), 8);
});

test("getMaxPerformanceIndex returns strongest index", () => {
  assert.equal(getMaxPerformanceIndex(gpus), 245);
});
```

- [x] **Step 5: Verify utilities**

Run:

```bash
npm run verify
```

Expected: Data validation passes and all tests pass.

- [x] **Step 6: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 4 completion, verification result, and next step Task 5.

Update this task checkbox to checked.

Run:

```bash
git add src/utils/filters.js src/utils/performance.js tests/filters.test.mjs tests/performance.test.mjs PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "feat: add gpu filtering and performance helpers"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 5: Static HTML Shell and Base Layout

**Files:**

- Create: `index.html`
- Create: `src/styles.css`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [x] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 5.

- [x] **Step 2: Add app shell**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>游戏显卡天梯图</title>
    <link rel="stylesheet" href="./src/styles.css">
  </head>
  <body>
    <main class="app-shell">
      <header class="toolbar" aria-label="显卡筛选">
        <div class="title-block">
          <h1>游戏显卡天梯图</h1>
          <p>桌面版与移动版独立排序，RTX 4060 桌面版 = 100。</p>
        </div>
        <label class="search-field">
          <span>搜索</span>
          <input id="searchInput" type="search" placeholder="4070, RX 7800, Laptop, Arc">
        </label>
        <div id="filterBar" class="filter-bar"></div>
        <label class="sort-field">
          <span>排序</span>
          <select id="sortSelect"></select>
        </label>
        <button id="resetButton" class="ghost-button" type="button" hidden>重置筛选</button>
      </header>

      <section class="content-grid">
        <section class="ladder-panel" aria-label="显卡天梯列表">
          <div id="ladderList" class="ladder-list"></div>
        </section>
        <aside id="detailPanel" class="detail-panel" aria-label="显卡详情"></aside>
      </section>
    </main>

    <div id="mobileDrawer" class="mobile-drawer" hidden></div>
    <script type="module" src="./src/app.js"></script>
  </body>
</html>
```

- [x] **Step 3: Add base styles**

Create `src/styles.css`:

```css
:root {
  color-scheme: light;
  font-family: Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif;
  background: #f4f6f8;
  color: #17202a;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f4f6f8;
}

.app-shell {
  width: min(1440px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 18px 0 32px;
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(220px, 320px) auto auto auto;
  gap: 12px;
  align-items: end;
  padding: 14px;
  border: 1px solid #d9e2ec;
  background: #ffffff;
  border-radius: 8px;
}

.title-block h1 {
  margin: 0 0 4px;
  font-size: 24px;
  letter-spacing: 0;
}

.title-block p {
  margin: 0;
  color: #5c6b7a;
  font-size: 13px;
}

.search-field,
.sort-field {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #526171;
}

input,
select,
button {
  font: inherit;
}

input,
select {
  min-height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0 10px;
  background: #fff;
  color: #17202a;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ghost-button {
  min-height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  color: #17202a;
  cursor: pointer;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 14px;
  margin-top: 14px;
}

.ladder-panel,
.detail-panel {
  border: 1px solid #d9e2ec;
  border-radius: 8px;
  background: #ffffff;
}

.ladder-panel {
  min-height: 70vh;
  padding: 12px;
}

.detail-panel {
  position: sticky;
  top: 14px;
  align-self: start;
  padding: 14px;
  min-height: 360px;
}

.mobile-drawer {
  display: none;
}

@media (max-width: 1040px) {
  .toolbar {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .detail-panel {
    display: none;
  }

  .mobile-drawer {
    display: block;
    position: fixed;
    inset: auto 0 0;
    max-height: 82vh;
    overflow: auto;
    border-radius: 12px 12px 0 0;
    border: 1px solid #d9e2ec;
    background: #fff;
    box-shadow: 0 -12px 30px rgba(15, 23, 42, 0.18);
    padding: 16px;
    z-index: 20;
  }
}
```

- [x] **Step 4: Verify static files are present**

Run:

```bash
Test-Path index.html; Test-Path src/styles.css
```

Expected: Both commands return `True`.

- [x] **Step 5: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 5 completion, verification result, and next step Task 6.

Update this task checkbox to checked.

Run:

```bash
git add index.html src/styles.css PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "feat: add static app shell"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 6: Render Ladder, Filters, and Details

**Files:**

- Create: `src/app.js`
- Create: `tests/app-render.test.mjs`
- Modify: `src/styles.css`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [x] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 6.

- [x] **Step 2: Add app rendering**

Create `src/app.js`:

```js
import { BRANDS, SEGMENTS, SORT_OPTIONS, TIERS } from "./data/constants.js";
import { gpus } from "./data/gpus.js";
import { filterGpus, sortGpus } from "./utils/filters.js";
import { formatBenchmark, formatClock, formatMemory, formatNumber, formatPower } from "./utils/format.js";
import { getMaxPerformanceIndex, getPerformanceWidth, groupByTier } from "./utils/performance.js";

const state = {
  query: "",
  brands: new Set(),
  segments: new Set(),
  generations: new Set(),
  sortBy: "performance",
  selectedId: location.hash.replace("#", "") || gpus[0].id
};

const elements = {
  searchInput: document.querySelector("#searchInput"),
  filterBar: document.querySelector("#filterBar"),
  sortSelect: document.querySelector("#sortSelect"),
  resetButton: document.querySelector("#resetButton"),
  ladderList: document.querySelector("#ladderList"),
  detailPanel: document.querySelector("#detailPanel"),
  mobileDrawer: document.querySelector("#mobileDrawer")
};

function uniqueValues(key) {
  return [...new Set(gpus.map((gpu) => gpu[key]))].sort();
}

function init() {
  renderControls();
  bindEvents();
  render();
}

function renderControls() {
  elements.sortSelect.innerHTML = Object.entries(SORT_OPTIONS)
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join("");

  elements.filterBar.innerHTML = [
    ...Object.entries(BRANDS).map(([value, meta]) => chip("brands", value, meta.label)),
    ...Object.entries(SEGMENTS).map(([value, label]) => chip("segments", value, label)),
    ...uniqueValues("generation").map((value) => chip("generations", value, value))
  ].join("");
}

function chip(type, value, label) {
  return `<button class="filter-chip" type="button" data-filter-type="${type}" data-filter-value="${value}">${label}</button>`;
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    render();
  });

  elements.filterBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter-type]");
    if (!button) return;
    const set = state[button.dataset.filterType];
    const value = button.dataset.filterValue;
    if (set.has(value)) set.delete(value);
    else set.add(value);
    render();
  });

  elements.resetButton.addEventListener("click", () => {
    state.query = "";
    state.brands.clear();
    state.segments.clear();
    state.generations.clear();
    elements.searchInput.value = "";
    render();
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (gpus.some((gpu) => gpu.id === id)) {
      state.selectedId = id;
      render();
    }
  });
}

function render() {
  updateControlState();
  const filtered = sortGpus(filterGpus(gpus, state), state.sortBy);
  const maxIndex = getMaxPerformanceIndex(gpus);
  renderLadder(filtered, maxIndex);
  renderDetails(gpus.find((gpu) => gpu.id === state.selectedId) || filtered[0]);
}

function updateControlState() {
  document.querySelectorAll("[data-filter-type]").forEach((button) => {
    const active = state[button.dataset.filterType].has(button.dataset.filterValue);
    button.classList.toggle("is-active", active);
  });
  const hasFilters = state.query || state.brands.size || state.segments.size || state.generations.size;
  elements.resetButton.hidden = !hasFilters;
}

function renderLadder(items, maxIndex) {
  if (!items.length) {
    elements.ladderList.innerHTML = `<div class="empty-state">没有匹配的显卡</div>`;
    return;
  }

  elements.ladderList.innerHTML = groupByTier(items).map(([tier, tierItems]) => {
    const tierMeta = TIERS[tier];
    return `
      <section class="tier-group">
        <header class="tier-header">
          <h2>${tierMeta?.label || tier}</h2>
          <span>${tierMeta?.hint || ""}</span>
        </header>
        <div class="gpu-rows">
          ${tierItems.map((gpu) => renderGpuRow(gpu, maxIndex)).join("")}
        </div>
      </section>
    `;
  }).join("");

  elements.ladderList.querySelectorAll("[data-gpu-id]").forEach((row) => {
    row.addEventListener("click", () => selectGpu(row.dataset.gpuId));
  });
}

function renderGpuRow(gpu, maxIndex) {
  const brand = BRANDS[gpu.brand];
  const width = getPerformanceWidth(gpu.performanceIndex, maxIndex);
  return `
    <article class="gpu-row ${state.selectedId === gpu.id ? "is-selected" : ""}" data-gpu-id="${gpu.id}" style="--brand:${brand.color}">
      <div class="gpu-main">
        <strong>${gpu.name}</strong>
        <span class="gpu-meta">${brand.label} · ${gpu.generation} · ${formatMemory(gpu)}</span>
      </div>
      <span class="segment-badge ${gpu.segment}">${SEGMENTS[gpu.segment]}</span>
      <div class="perf-cell">
        <span>${gpu.performanceIndex}</span>
        <div class="perf-track"><div style="width:${width}%"></div></div>
      </div>
      <span class="power-cell">${formatPower(gpu)}</span>
      <span class="resolution-cell">${gpu.gaming.recommendedResolution}</span>
    </article>
  `;
}

function selectGpu(id) {
  state.selectedId = id;
  if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
  render();
}

function renderDetails(gpu) {
  if (!gpu) {
    elements.detailPanel.innerHTML = `<p class="muted">请选择显卡</p>`;
    elements.mobileDrawer.hidden = true;
    return;
  }

  const html = `
    <div class="detail-heading" style="--brand:${BRANDS[gpu.brand].color}">
      <span class="brand-dot"></span>
      <div>
        <h2>${gpu.name}</h2>
        <p>${BRANDS[gpu.brand].label} · ${SEGMENTS[gpu.segment]} · ${gpu.architecture}</p>
      </div>
    </div>
    ${gpu.segment === "mobile" ? `<p class="warning">移动版性能受 TGP、散热和厂商调校影响，不能直接等同桌面版。</p>` : ""}
    ${detailSection("概览", [
      ["综合性能指数", gpu.performanceIndex],
      ["发布时间", gpu.releaseDate],
      ["推荐分辨率", gpu.gaming.recommendedResolution],
      ["可信度", gpu.confidence]
    ])}
    ${detailSection("核心规格", [
      [gpu.specs.coresLabel, formatNumber(gpu.specs.cores)],
      ["基础频率", formatClock(gpu.specs.baseClockMHz)],
      ["加速频率", formatClock(gpu.specs.boostClockMHz)]
    ])}
    ${detailSection("显存与功耗", [
      ["显存", formatMemory(gpu)],
      ["位宽", gpu.specs.memoryBusBit ? `${gpu.specs.memoryBusBit}-bit` : "待补充"],
      ["带宽", gpu.specs.bandwidthGBs ? `${gpu.specs.bandwidthGBs} GB/s` : "待补充"],
      [gpu.segment === "mobile" ? "TGP 范围" : "功耗", formatPower(gpu)]
    ])}
    ${detailSection("跑分参考", [
      ["Time Spy Graphics", formatBenchmark(gpu.benchmarks.timeSpyGraphics)],
      ["Steel Nomad Graphics", formatBenchmark(gpu.benchmarks.steelNomadGraphics)],
      ["PassMark G3D", formatBenchmark(gpu.benchmarks.passMarkG3D)]
    ])}
    <div class="note-list">${gpu.notes.map((note) => `<span>${note}</span>`).join("")}</div>
  `;

  elements.detailPanel.innerHTML = html;
  elements.mobileDrawer.innerHTML = `${html}<button class="ghost-button drawer-close" type="button">关闭</button>`;
  elements.mobileDrawer.hidden = false;
  elements.mobileDrawer.querySelector(".drawer-close").addEventListener("click", () => {
    elements.mobileDrawer.hidden = true;
  });
}

function detailSection(title, rows) {
  return `
    <section class="detail-section">
      <h3>${title}</h3>
      ${rows.map(([label, value]) => `<div class="detail-row"><span>${label}</span><strong>${value}</strong></div>`).join("")}
    </section>
  `;
}

init();
```

- [x] **Step 3: Add component styles**

Append to `src/styles.css`:

```css
.filter-chip {
  min-height: 32px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #fff;
  color: #334155;
  cursor: pointer;
  padding: 0 10px;
}

.filter-chip.is-active {
  border-color: #17202a;
  background: #17202a;
  color: #fff;
}

.tier-group + .tier-group {
  margin-top: 18px;
}

.tier-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 2px 8px;
  border-bottom: 1px solid #e2e8f0;
}

.tier-header h2 {
  margin: 0;
  font-size: 18px;
}

.tier-header span,
.muted,
.empty-state {
  color: #64748b;
}

.gpu-rows {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.gpu-row {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) 74px minmax(120px, 180px) 76px 96px;
  gap: 10px;
  align-items: center;
  min-height: 58px;
  border: 1px solid #e2e8f0;
  border-left: 4px solid var(--brand);
  border-radius: 7px;
  background: #fff;
  padding: 10px;
  cursor: pointer;
}

.gpu-row:hover,
.gpu-row.is-selected {
  border-color: var(--brand);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.gpu-main {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.gpu-main strong,
.gpu-main span {
  overflow-wrap: anywhere;
}

.gpu-meta {
  color: #64748b;
  font-size: 13px;
}

.segment-badge {
  justify-self: start;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  padding: 4px 8px;
  font-size: 12px;
}

.segment-badge.mobile {
  border-style: dashed;
  background: #f8fafc;
}

.perf-cell {
  display: grid;
  gap: 5px;
  font-weight: 700;
}

.perf-track {
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.perf-track div {
  height: 100%;
  min-width: 8%;
  border-radius: inherit;
  background: var(--brand);
}

.power-cell,
.resolution-cell {
  color: #334155;
  font-size: 13px;
}

.detail-heading {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 10px;
  align-items: start;
}

.brand-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--brand);
  margin-top: 8px;
}

.detail-heading h2 {
  margin: 0;
  font-size: 20px;
}

.detail-heading p {
  margin: 4px 0 0;
  color: #64748b;
}

.warning {
  border: 1px dashed #f59e0b;
  border-radius: 6px;
  background: #fffbeb;
  padding: 10px;
  color: #7c2d12;
  font-size: 13px;
}

.detail-section {
  margin-top: 16px;
}

.detail-section h3 {
  margin: 0 0 8px;
  font-size: 14px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px solid #edf2f7;
  font-size: 13px;
}

.detail-row span {
  color: #64748b;
}

.detail-row strong {
  text-align: right;
}

.note-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}

.note-list span {
  border-radius: 999px;
  background: #eef2f7;
  padding: 5px 8px;
  font-size: 12px;
}

.drawer-close {
  width: 100%;
  margin-top: 14px;
}

@media (max-width: 760px) {
  .app-shell {
    width: min(100vw - 20px, 720px);
    padding-top: 10px;
  }

  .gpu-row {
    grid-template-columns: 1fr auto;
  }

  .perf-cell,
  .power-cell,
  .resolution-cell {
    grid-column: 1 / -1;
  }
}
```

- [x] **Step 4: Verify app modules load in browser**

Run:

```bash
npm run verify
```

Expected: Data validation passes and all tests pass.

Then run:

```bash
npm run serve
```

Expected: Server prints `GPU ladder server running at http://localhost:4173`.

Open `http://localhost:4173` in the in-app browser and verify:

- GPU rows render.
- Clicking a row updates the detail panel.
- Filter chips toggle.
- Search narrows results.
- Mobile drawer appears below 1040px.

- [x] **Step 5: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 6 completion, verification result, browser URL, and next step Task 7.

Update this task checkbox to checked.

Run:

```bash
git add src/app.js src/styles.css tests/app-render.test.mjs PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "feat: render interactive gpu ladder"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 7: Initial Modern NVIDIA Data Expansion

**Files:**

- Modify: `src/data/gpus.js`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [ ] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 7.

- [ ] **Step 2: Add NVIDIA records**

Add these desktop records to `src/data/gpus.js`, keeping ids unique and using the existing object shape:

- `rtx-5090-desktop`
- `rtx-5080-desktop`
- `rtx-5070-ti-desktop`
- `rtx-5070-desktop`
- `rtx-4080-super-desktop`
- `rtx-4070-super-desktop`
- `rtx-3090-desktop`
- `rtx-3080-desktop`
- `rtx-2080-ti-desktop`
- `rtx-2060-desktop`
- `gtx-1060-6gb-desktop`

Use `confidence: "estimated"` for RTX 50 values until calibrated, and include source links to NVIDIA GeForce pages.

- [ ] **Step 3: Verify data**

Run:

```bash
npm run verify
```

Expected: Data validation passes and all tests pass.

- [ ] **Step 4: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 7 completion, verification result, and next step Task 8.

Update this task checkbox to checked.

Run:

```bash
git add src/data/gpus.js PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "data: expand nvidia desktop gpu records"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 8: Initial AMD and Intel Data Expansion

**Files:**

- Modify: `src/data/gpus.js`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [ ] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 8.

- [ ] **Step 2: Add AMD and Intel records**

Add these records to `src/data/gpus.js`, keeping ids unique and using the existing object shape:

- `rx-9070-xt-desktop`
- `rx-9070-desktop`
- `rx-9060-xt-desktop`
- `rx-6950-xt-desktop`
- `rx-6800-xt-desktop`
- `rx-5700-xt-desktop`
- `rx-480-desktop`
- `arc-b570-desktop`
- `arc-a750-desktop`
- `arc-a580-desktop`
- `arc-a380-desktop`

Use AMD official links for Radeon records and Intel Arc links for Arc records. Use `confidence: "estimated"` for newer RX 9000 values until calibrated.

- [ ] **Step 3: Verify data**

Run:

```bash
npm run verify
```

Expected: Data validation passes and all tests pass.

- [ ] **Step 4: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 8 completion, verification result, and next step Task 9.

Update this task checkbox to checked.

Run:

```bash
git add src/data/gpus.js PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "data: expand amd and intel desktop gpu records"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 9: Initial Mobile GPU Data Expansion

**Files:**

- Modify: `src/data/gpus.js`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [ ] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 9.

- [ ] **Step 2: Add mobile records**

Add these records to `src/data/gpus.js`, keeping ids unique and using `segment: "mobile"` and `tgpRangeW`:

- `rtx-5090-laptop`
- `rtx-5080-laptop`
- `rtx-4090-laptop`
- `rtx-4080-laptop`
- `rtx-4060-laptop`
- `rtx-3060-laptop`
- `rx-7900m-mobile`
- `rx-6850m-xt-mobile`
- `rx-7600m-mobile`
- `arc-a770m-mobile`
- `arc-a730m-mobile`
- `arc-a370m-mobile`

Every mobile record must include a note explaining that actual performance varies by TGP and cooling.

- [ ] **Step 3: Verify mobile data**

Run:

```bash
npm run verify
```

Expected: Data validation passes and all tests pass.

- [ ] **Step 4: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 9 completion, verification result, and next step Task 10.

Update this task checkbox to checked.

Run:

```bash
git add src/data/gpus.js PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "data: add initial mobile gpu records"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 10: Browser Verification and Visual Polish

**Files:**

- Modify: `src/styles.css`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [ ] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 10.

- [ ] **Step 2: Run app locally**

Run:

```bash
npm run serve
```

Expected: Server prints `GPU ladder server running at http://localhost:4173`.

- [ ] **Step 3: Verify responsive behavior**

Open `http://localhost:4173` in the in-app browser and check:

- Desktop width: toolbar, ladder list, and detail panel are visible.
- Search for `4070`: both desktop and laptop records remain discoverable.
- Toggle `Mobile`: only mobile records remain.
- Click a mobile GPU: detail warning is visible.
- Narrow viewport below 760px: rows wrap without text overlap.
- Detail drawer can be closed.

- [ ] **Step 4: Polish CSS if needed**

If any overlap appears, adjust only `src/styles.css` using these allowed changes:

- Increase grid min widths.
- Add `overflow-wrap: anywhere`.
- Reduce compact panel font sizes no lower than 12px.
- Move row fields to full-width lines on mobile.

Do not change data or app logic in this task.

- [ ] **Step 5: Final verification**

Run:

```bash
npm run verify
```

Expected: Data validation passes and all tests pass.

- [ ] **Step 6: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 10 completion, verification result, browser findings, and next step Task 11.

Update this task checkbox to checked.

Run:

```bash
git add src/styles.css PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "style: polish responsive gpu ladder layout"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 11: Documentation and Usage Notes

**Files:**

- Create: `README.md`
- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [ ] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 11.

- [ ] **Step 2: Add README**

Create `README.md`:

```markdown
# 游戏显卡天梯图

一个静态 HTML 版交互式游戏显卡天梯图，覆盖 NVIDIA、AMD、Intel 的桌面版和移动版显卡。

## 功能

- 按综合性能指数展示天梯排序。
- 支持搜索、品牌筛选、桌面/移动筛选、世代筛选。
- 点击显卡查看架构、核心、显存、带宽、功耗、TGP、跑分参考和备注。
- 移动版显卡独立标注，避免与桌面同名卡混淆。
- 响应式布局，桌面端详情侧栏，移动端详情抽屉。

## 本地运行

```bash
npm run serve
```

打开：

```txt
http://localhost:4173
```

## 验证

```bash
npm run verify
```

## 数据说明

综合性能指数以 `GeForce RTX 4060 desktop = 100` 为基准。指数用于玩家快速比较，不等同于单一 3DMark 分数。移动版显卡性能受 TGP、散热和厂商调校影响，页面会单独标注。
```

- [ ] **Step 3: Verify docs and app**

Run:

```bash
npm run verify
```

Expected: Data validation passes and all tests pass.

- [ ] **Step 4: Update docs, commit, push**

Update `PROJECT_STATE.md` with Task 11 completion, verification result, and next step Task 12.

Update this task checkbox to checked.

Run:

```bash
git add README.md PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "docs: add project usage notes"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Task 12: First Release Verification

**Files:**

- Modify: `PROJECT_STATE.md`
- Modify: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

- [ ] **Step 1: Read project state**

Run:

```bash
Get-Content PROJECT_STATE.md
```

Expected: Next step is Task 12.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm run verify
git status --short
```

Expected:

- Data validation passes.
- Tests pass.
- `git status --short` only shows planned documentation updates before commit.

- [ ] **Step 3: Browser smoke test**

Run:

```bash
npm run serve
```

Open `http://localhost:4173` in the in-app browser and verify:

- Search works.
- Brand chips work.
- Desktop/Mobile chips work.
- Generation chips work.
- Sorting works.
- Click details work.
- URL hash opens a GPU.
- Mobile drawer works.

- [ ] **Step 4: Update final state, commit, push**

Update `PROJECT_STATE.md` with:

- Current task: First release verification complete.
- Completed work: Tasks 1 through 12.
- Verification: commands and browser checks passed.
- Next step: optional data expansion or deploy.

Update this task checkbox to checked.

Run:

```bash
git add PROJECT_STATE.md docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md
git commit -m "chore: mark first release verification complete"
git push origin main
```

Expected: Commit succeeds and push updates `origin/main`.

## Self-Review

Spec coverage:

- Static HTML tool interface: Tasks 5 and 6.
- Independent desktop/mobile records: Tasks 3 and 9.
- Search, filters, sorting: Tasks 4 and 6.
- Detail panel and mobile drawer: Tasks 5, 6, and 10.
- Data validation: Tasks 3 and 4.
- Representative GPU seed data: Tasks 3, 7, 8, and 9.
- Documentation and state tracking: Tasks 1 through 12, especially Task 11 and `PROJECT_STATE.md`.
- Per-task commit and push workflow: Execution Contract and every task's final step.

Placeholder scan:

- No unfinished-work markers are present in the executable task sections.
- Later data expansion tasks list exact ids and validation requirements.

Type consistency:

- `brand`, `segment`, `tier`, `performanceIndex`, `specs`, `benchmarks`, and `gaming` match the design spec.
- Utility names used by tests match the modules they are defined in.
