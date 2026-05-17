import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gpus } from "../src/data/gpus.js";
import {
  buildGpuFromForm,
  createAdminFacetGroups,
  filterAdminGpus,
  filterAdminItems,
  renderAdminEditor,
  renderAdminFacets,
  renderAdminList,
  stringifyGpuForForm
} from "../src/admin.js";

const gpuSchema = JSON.parse(readFileSync(new URL("../src/data/categories/gpu.schema.json", import.meta.url), "utf8"));

test("filterAdminGpus searches names, ids, brands, and segment labels", () => {
  const result = filterAdminGpus(gpus, "4070 laptop");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "rtx-4070-laptop");
});

test("createAdminFacetGroups groups GPU items by manufacturer and product series", () => {
  const items = [
    { id: "rtx-5090", name: "GeForce RTX 5090", brand: "nvidia", segment: "desktop", generation: "GB202" },
    { id: "rtx-4070", name: "GeForce RTX 4070", brand: "nvidia", segment: "desktop", generation: "RTX 40" },
    { id: "rx-9070", name: "Radeon RX 9070 XT", brand: "amd", segment: "desktop", generation: "Navi 48" },
    { id: "arc-b580", name: "Intel Arc B580", brand: "intel", segment: "desktop", generation: "BMG-G21" }
  ];

  const groups = createAdminFacetGroups(items, "gpu");
  const manufacturerLabels = groups.find((group) => group.id === "manufacturer").options.map((option) => option.label);
  const seriesLabels = groups.find((group) => group.id === "series").options.map((option) => option.label);

  assert.deepEqual(manufacturerLabels, ["全部", "NVIDIA", "AMD", "Intel"]);
  assert.ok(seriesLabels.includes("RTX 50"));
  assert.ok(seriesLabels.includes("RTX 40"));
  assert.ok(seriesLabels.includes("RX 9000"));
  assert.ok(seriesLabels.includes("Arc B"));
});

test("filterAdminGpus narrows results by selected manufacturer and series facets", () => {
  const items = [
    { id: "rtx-5090", name: "GeForce RTX 5090", brand: "nvidia", segment: "desktop", generation: "GB202" },
    { id: "rtx-4070", name: "GeForce RTX 4070", brand: "nvidia", segment: "desktop", generation: "RTX 40" },
    { id: "rx-9070", name: "Radeon RX 9070 XT", brand: "amd", segment: "desktop", generation: "Navi 48" }
  ];

  const nvidia40 = filterAdminGpus(items, "", { manufacturer: "nvidia", series: "RTX 40" });
  const amd9000 = filterAdminGpus(items, "", { manufacturer: "amd", series: "RX 9000" });

  assert.deepEqual(nvidia40.map((item) => item.id), ["rtx-4070"]);
  assert.deepEqual(amd9000.map((item) => item.id), ["rx-9070"]);
});

test("filterAdminItems supports manufacturer and generation facets for schema categories", () => {
  const items = [
    {
      id: "ryzen-9-7950x",
      title: "AMD Ryzen 9 7950X",
      manufacturerId: "amd",
      subtitle: "amd · Ryzen 7000 · AM5",
      facts: [
        { id: "brand", displayValue: "amd" },
        { id: "generation", displayValue: "Ryzen 7000" },
        { id: "cpu.socket", displayValue: "AM5" }
      ]
    },
    {
      id: "core-i9-13900k",
      title: "Intel Core i9-13900K",
      manufacturerId: "intel",
      subtitle: "intel · 13th Gen · LGA 1700",
      facts: [
        { id: "brand", displayValue: "intel" },
        { id: "generation", displayValue: "13th Gen" },
        { id: "cpu.socket", displayValue: "LGA 1700" }
      ]
    }
  ];

  const result = filterAdminItems(items, "", { manufacturer: "intel", series: "13th Gen" }, "desktop-cpu");

  assert.deepEqual(result.map((item) => item.id), ["core-i9-13900k"]);
});

test("createAdminFacetGroups keeps consumer CPU generations ahead of imported codenames", () => {
  const items = [
    {
      id: "gorgon-a",
      title: "Imported Gorgon A",
      manufacturerId: "amd",
      facts: [
        { id: "brand", displayValue: "amd" },
        { id: "generation", displayValue: "Gorgon Point" }
      ]
    },
    {
      id: "gorgon-b",
      title: "Imported Gorgon B",
      manufacturerId: "amd",
      facts: [
        { id: "brand", displayValue: "amd" },
        { id: "generation", displayValue: "Gorgon Point" }
      ]
    },
    {
      id: "core-i9-14900k",
      title: "Intel Core i9-14900K",
      manufacturerId: "intel",
      facts: [
        { id: "brand", displayValue: "intel" },
        { id: "generation", displayValue: "14th Gen" }
      ]
    },
    {
      id: "ryzen-9-7950x",
      title: "AMD Ryzen 9 7950X",
      manufacturerId: "amd",
      facts: [
        { id: "brand", displayValue: "amd" },
        { id: "generation", displayValue: "Ryzen 7000" }
      ]
    }
  ];

  const groups = createAdminFacetGroups(items, "desktop-cpu");
  const seriesLabels = groups.find((group) => group.id === "series").options.map((option) => option.label);

  assert.deepEqual(seriesLabels.slice(0, 4), ["全部", "14th Gen", "Ryzen 7000", "Gorgon Point"]);
});

test("renderAdminFacets renders active filter chips with counts", () => {
  const groups = [
    {
      id: "manufacturer",
      label: "品牌",
      options: [
        { value: "all", label: "全部", count: 2 },
        { value: "amd", label: "AMD", count: 1 }
      ]
    }
  ];

  const html = renderAdminFacets(groups, { manufacturer: "amd" });

  assert.match(html, /data-admin-facet="manufacturer"/);
  assert.match(html, /data-admin-facet-value="amd"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /<span>1<\/span>/);
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
  assert.match(html, /class="admin-editor-title"/);
  assert.match(html, /class="admin-editor-actions"/);
  assert.match(html, /class="admin-form-sections"/);
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
