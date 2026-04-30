import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import {
  mapLegacyGpuToHardwareItem,
  mapLegacyGpuToMetricValues,
  mapLegacyGpuToRankingScore,
  mapLegacyGpuToSources
} from "../scripts/import-legacy-gpus.mjs";

const laptop4070 = gpus.find((gpu) => gpu.id === "rtx-4070-laptop");

function metricById(metricValues, metricId) {
  return metricValues.find((metricValue) => metricValue.metricId === metricId);
}

test("mapLegacyGpuToHardwareItem maps a current GPU record", () => {
  const item = mapLegacyGpuToHardwareItem(laptop4070);

  assert.deepEqual(item, {
    id: "rtx-4070-laptop",
    categoryId: "gpu",
    name: "GeForce RTX 4070 Laptop GPU",
    manufacturerId: "nvidia",
    generation: "RTX 40",
    architecture: "Ada Lovelace",
    releaseDate: "2023-02",
    marketSegmentIds: ["mobile"],
    status: "published",
    notes: [
      "移动版不可直接等同桌面 RTX 4070",
      "同一 GPU 在不同笔记本中性能差异可能明显"
    ],
    createdAt: "legacy-import",
    updatedAt: "legacy-import"
  });
});

test("mapLegacyGpuToMetricValues maps specs, benchmarks, gaming, and mobile TGP", () => {
  const metricValues = mapLegacyGpuToMetricValues(laptop4070);
  const sourceIds = ["rtx-4070-laptop:source:1"];

  assert.equal(metricById(metricValues, "gpu.core.count").valueNumber, 4608);
  assert.equal(metricById(metricValues, "gpu.clock.boost").valueNumber, 2175);
  assert.equal(metricById(metricValues, "gpu.memory.size").valueNumber, 8);
  assert.equal(metricById(metricValues, "gpu.memory.type").valueText, "GDDR6");
  assert.equal(metricById(metricValues, "gpu.memory.bus").valueNumber, 128);
  assert.equal(metricById(metricValues, "gpu.memory.bandwidth").valueNumber, 256);
  assert.equal(metricById(metricValues, "gpu.power.tgpRange").valueMin, 45);
  assert.equal(metricById(metricValues, "gpu.power.tgpRange").valueMax, 115);
  assert.equal(metricById(metricValues, "gpu.benchmark.timeSpyGraphics").valueNumber, 12345);
  assert.equal(metricById(metricValues, "gpu.gaming.recommendedResolution").valueText, "1080p/1440p");
  assert.equal(metricById(metricValues, "gpu.gaming.rayTracingLevel").valueText, "medium");

  for (const metricValue of metricValues) {
    assert.equal(metricValue.itemId, "rtx-4070-laptop");
    assert.equal(metricValue.confidence, "estimated");
    assert.deepEqual(metricValue.sourceIds, sourceIds);
    assert.equal(metricValue.updatedAt, "legacy-import");
  }
});

test("mapLegacyGpuToRankingScore maps performance index to the GPU ranking profile", () => {
  assert.deepEqual(mapLegacyGpuToRankingScore(laptop4070), {
    id: "rtx-4070-laptop:ranking:gpu-gaming-performance",
    itemId: "rtx-4070-laptop",
    rankingProfileId: "gpu-gaming-performance",
    score: 135,
    tierId: "mainstream",
    confidence: "estimated",
    formulaVersion: "legacy-performance-index-v1",
    updatedAt: "legacy-import"
  });
});

test("mapLegacyGpuToSources maps source documents with stable ids", () => {
  assert.deepEqual(mapLegacyGpuToSources(laptop4070), [
    {
      id: "rtx-4070-laptop:source:1",
      itemId: "rtx-4070-laptop",
      label: "NVIDIA GeForce Laptop",
      url: "https://www.nvidia.com/en-us/geforce/laptops/",
      sourceType: "official",
      retrievedAt: "legacy-import"
    }
  ]);
});
