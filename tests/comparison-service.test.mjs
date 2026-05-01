import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createComparisonService } from "../src/application/comparison-service.js";
import { createJsonHardwareRepository } from "../src/infrastructure/json/json-hardware-repository.js";

const gpuSchema = JSON.parse(
  await readFile(new URL("../src/data/categories/gpu.schema.json", import.meta.url), "utf8")
);

function createTestRepository() {
  return createJsonHardwareRepository({
    gpuDataUrl: new URL("../src/data/gpus.json", import.meta.url),
    gpuCategorySchemaUrl: new URL("../src/data/categories/gpu.schema.json", import.meta.url)
  });
}

test("comparison service returns grouped rows for two GPUs", async () => {
  const repo = createTestRepository();
  const service = createComparisonService(repo);
  const result = await service.compare("gpu", ["rtx-4070-laptop", "rtx-4090-desktop"]);

  assert.equal(result.categoryId, "gpu");
  assert.ok(result.itemIds.length === 2);
  assert.ok(Array.isArray(result.groups));
  assert.ok(result.groups.length > 0);
  assert.ok(result.groups[0].rows.length > 0);
});

test("comparison service marks best numeric value", async () => {
  const repo = createTestRepository();
  const service = createComparisonService(repo);
  const result = await service.compare("gpu", ["rtx-4070-laptop", "rtx-4090-desktop"]);

  const coreRow = result.groups
    .flatMap((g) => g.rows)
    .find((r) => r.metricId === "gpu.core.count");
  assert.ok(coreRow, "should have core count row");

  const values = coreRow.values;
  const best = values.find((v) => v.isBest);
  assert.ok(best, "should mark a best value");
  assert.ok(best.rawComparableValue > 0);
});

test("comparison service shows 待补充 for missing values", async () => {
  const repo = createTestRepository();
  const service = createComparisonService(repo);
  const result = await service.compare("gpu", ["rtx-4070-laptop", "rtx-4090-desktop"]);

  const allDisplayValues = result.groups
    .flatMap((g) => g.rows)
    .flatMap((r) => r.values);
  const hasPlaceholder = allDisplayValues.some((v) => v.displayValue === "待补充");
  assert.ok(hasPlaceholder, "at least one metric should show 待补充");
});

test("comparison service rejects cross-category comparison", async () => {
  const repo = createTestRepository();
  const service = createComparisonService(repo);

  await assert.rejects(
    () => service.compare("gpu", ["rtx-4070-laptop", "nonexistent-category-item"]),
    (error) => {
      assert.ok(error.message.includes("category") || error.errors);
      return true;
    }
  );
});
