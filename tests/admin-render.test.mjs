import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import {
  buildGpuFromForm,
  filterAdminGpus,
  renderAdminEditor,
  renderAdminList,
  stringifyGpuForForm
} from "../src/admin.js";

test("filterAdminGpus searches names, ids, brands, and segment labels", () => {
  const result = filterAdminGpus(gpus, "4070 laptop");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "rtx-4070-laptop");
});

test("renderAdminList marks selected GPU", () => {
  const html = renderAdminList(gpus.slice(0, 2), "rtx-4070-desktop");
  assert.match(html, /data-gpu-id="rtx-4070-desktop"/);
  assert.match(html, /is-selected/);
});

test("renderAdminEditor exposes grouped fields and mobile guidance", () => {
  const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
  const html = renderAdminEditor(gpu);
  assert.match(html, /name="specs.tgpRangeW"/);
  assert.match(html, /移动版必须填写 TGP 范围/);
  assert.match(html, /name="benchmarks.timeSpyGraphics"/);
});

test("stringifyGpuForForm formats notes and sources for textareas", () => {
  const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
  const value = stringifyGpuForForm(gpu);
  assert.match(value.notesText, /移动版不可直接等同桌面 RTX 4070/);
  assert.match(value.sourcesText, /NVIDIA GeForce Laptop\|https:\/\/www\.nvidia\.com/);
});

test("buildGpuFromForm converts field values into a full GPU record", () => {
  const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
  const result = buildGpuFromForm(gpu, {
    id: "rtx-4070-laptop",
    name: "GeForce RTX 4070 Laptop GPU",
    brand: "nvidia",
    segment: "mobile",
    generation: "RTX 40",
    architecture: "Ada Lovelace",
    releaseDate: "2023-02",
    performanceIndex: "136",
    tier: "mainstream",
    confidence: "estimated",
    "specs.coresLabel": "CUDA Cores",
    "specs.cores": "4608",
    "specs.baseClockMHz": "",
    "specs.boostClockMHz": "2175",
    "specs.memorySizeGB": "8",
    "specs.memoryType": "GDDR6",
    "specs.memoryBusBit": "128",
    "specs.bandwidthGBs": "256",
    "specs.powerW": "",
    "specs.tgpRangeW": "45-115W",
    "benchmarks.timeSpyGraphics": "12345",
    "benchmarks.steelNomadGraphics": "",
    "benchmarks.passMarkG3D": "",
    "benchmarks.sourceNote": "移动版参考典型高 TGP 机型",
    "gaming.recommendedResolution": "1080p/1440p",
    "gaming.rayTracingLevel": "medium",
    "gaming.efficiencyNote": "实际表现受 TGP 和散热影响明显",
    notesText: "移动版不可直接等同桌面 RTX 4070\n同一 GPU 在不同笔记本中性能差异可能明显",
    sourcesText: "NVIDIA GeForce Laptop|https://www.nvidia.com/en-us/geforce/laptops/"
  });

  assert.equal(result.performanceIndex, 136);
  assert.equal(result.specs.boostClockMHz, 2175);
  assert.equal(result.specs.baseClockMHz, null);
  assert.equal(result.specs.tgpRangeW, "45-115W");
  assert.equal(result.benchmarks.timeSpyGraphics, 12345);
  assert.equal(result.notes.length, 2);
  assert.deepEqual(result.sources[0], {
    label: "NVIDIA GeForce Laptop",
    url: "https://www.nvidia.com/en-us/geforce/laptops/"
  });
});
