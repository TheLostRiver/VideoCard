import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertValidCategorySchema } from "../src/domain/hardware/category-schema.js";

const schemaUrl = new URL("../src/data/categories/apple-silicon.schema.json", import.meta.url);

async function readSchema() {
  return JSON.parse(await readFile(schemaUrl, "utf8"));
}

test("apple silicon category schema passes validation and includes required metrics", async () => {
  const schema = await readSchema();
  const metricIds = new Set(schema.metrics.map((metric) => metric.id));
  const requiredMetricIds = [
    "apple.cpu.performanceCores",
    "apple.cpu.efficiencyCores",
    "apple.gpu.cores",
    "apple.neuralEngine.cores",
    "apple.memory.unified",
    "apple.memory.bandwidth",
    "apple.benchmark.geekbenchSingle",
    "apple.benchmark.geekbenchMulti",
    "apple.benchmark.metal"
  ];

  assert.doesNotThrow(() => assertValidCategorySchema(schema));
  assert.equal(schema.id, "apple-silicon");
  assert.equal(schema.listView.titleField, "name");

  for (const metricId of requiredMetricIds) {
    assert.ok(metricIds.has(metricId), `${metricId} should be defined`);
  }

  assert.ok(schema.detailView.groups.length > 0, "detailView should have groups");
  assert.ok(schema.adminForm.groups.length > 0, "adminForm should have groups");
  assert.ok(schema.comparePresets.length > 0, "comparePresets should have presets");
});
