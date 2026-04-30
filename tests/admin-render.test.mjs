import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gpus } from "../src/data/gpus.js";
import {
  buildGpuFromForm,
  filterAdminGpus,
  renderAdminEditor,
  renderAdminList,
  stringifyGpuForForm
} from "../src/admin.js";

const gpuSchema = JSON.parse(readFileSync(new URL("../src/data/categories/gpu.schema.json", import.meta.url), "utf8"));

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
  const html = renderAdminEditor(gpu, gpuSchema);
  assert.match(html, /class="admin-form schema-form"/);
  assert.match(html, /name="metric:gpu.power.tgpRange"/);
  assert.match(html, /value="45-115W"/);
  assert.match(html, /移动版必须填写 TGP 范围/);
  assert.match(html, /name="metric:gpu.benchmark.timeSpyGraphics"/);
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
    "property:id": "rtx-4070-laptop",
    "property:name": "GeForce RTX 4070 Laptop GPU",
    "property:brand": "nvidia",
    "property:segment": "mobile",
    "property:generation": "RTX 40",
    "property:architecture": "Ada Lovelace",
    "metric:gpu.release.date": "2023-02",
    "metric:gpu.performance.index": "136",
    "property:tier": "mainstream",
    "metric:gpu.confidence": "estimated",
    "property:specs.coresLabel": "CUDA Cores",
    "metric:gpu.core.count": "4608",
    "metric:gpu.clock.base": "",
    "metric:gpu.clock.boost": "2175",
    "metric:gpu.memory.size": "8",
    "metric:gpu.memory.type": "GDDR6",
    "metric:gpu.memory.bus": "128",
    "metric:gpu.memory.bandwidth": "256",
    "metric:gpu.power.board": "",
    "metric:gpu.power.tgpRange": "45-115W",
    "metric:gpu.benchmark.timeSpyGraphics": "12345",
    "metric:gpu.benchmark.steelNomadGraphics": "",
    "metric:gpu.benchmark.passMarkG3D": "",
    "metric:gpu.benchmark.sourceNote": "移动版参考典型高 TGP 机型",
    "metric:gpu.gaming.recommendedResolution": "1080p/1440p",
    "metric:gpu.gaming.rayTracingLevel": "medium",
    "metric:gpu.gaming.efficiencyNote": "实际表现受 TGP 和散热影响明显",
    "property:notes": "移动版不可直接等同桌面 RTX 4070\n同一 GPU 在不同笔记本中性能差异可能明显",
    "property:sources": "NVIDIA GeForce Laptop|https://www.nvidia.com/en-us/geforce/laptops/"
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
