import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import { createJsonHardwareRepository } from "../src/infrastructure/json/json-hardware-repository.js";

function metricById(metricValues, metricId) {
  return metricValues.find((metricValue) => metricValue.metricId === metricId);
}

test("json hardware repository lists GPU categories", async () => {
  const repository = createJsonHardwareRepository();
  const categories = await repository.listCategories();
  const gpuCategory = categories.find((category) => category.id === "gpu");

  assert.equal(gpuCategory?.label, "GPU");
  assert.equal((await repository.getCategory("gpu")).id, "gpu");
  assert.equal(await repository.getCategory("missing"), null);
});

test("json hardware repository lists current GPU items", async () => {
  const repository = createJsonHardwareRepository();
  const items = await repository.listItems({ categoryId: "gpu" });

  assert.equal(items.length, gpus.length);
  assert.equal((await repository.listItems({ categoryId: "cpu" })).length, 0);
  assert.equal(items.find((item) => item.id === "rtx-4070-laptop")?.manufacturerId, "nvidia");
});

test("json hardware repository returns item detail with mapped metrics and ranking score", async () => {
  const repository = createJsonHardwareRepository();
  const detail = await repository.getItemDetail("rtx-4070-laptop");

  assert.equal(detail.item.id, "rtx-4070-laptop");
  assert.equal(detail.item.categoryId, "gpu");
  assert.equal(metricById(detail.metricValues, "gpu.benchmark.timeSpyGraphics").valueNumber, 12345);
  assert.equal(metricById(detail.metricValues, "gpu.power.tgpRange").valueMin, 45);
  assert.equal(metricById(detail.metricValues, "gpu.power.tgpRange").valueMax, 115);
  assert.equal(detail.rankingScore.score, 135);
  assert.equal(detail.rankingScore.rankingProfileId, "gpu-gaming-performance");
  assert.equal(detail.sources[0].id, "rtx-4070-laptop:source:1");
  assert.equal(await repository.getItemDetail("missing"), null);
});
