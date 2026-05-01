import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertValidCategorySchema } from "../src/domain/hardware/category-schema.js";

const schemaUrl = new URL("../src/data/categories/mobile-soc.schema.json", import.meta.url);

async function readSchema() {
  return JSON.parse(await readFile(schemaUrl, "utf8"));
}

test("mobile soc category schema passes validation and includes required metrics", async () => {
  const schema = await readSchema();
  const metricIds = new Set(schema.metrics.map((metric) => metric.id));
  const requiredMetricIds = [
    "soc.process.node",
    "soc.cpu.cluster",
    "soc.gpu.name",
    "soc.npu.ai",
    "soc.modem",
    "soc.benchmark.geekbenchSingle",
    "soc.benchmark.geekbenchMulti",
    "soc.benchmark.antutuTotal",
    "soc.benchmark.wildLife"
  ];

  assert.doesNotThrow(() => assertValidCategorySchema(schema));
  assert.equal(schema.id, "mobile-soc");
  assert.equal(schema.listView.titleField, "name");

  for (const metricId of requiredMetricIds) {
    assert.ok(metricIds.has(metricId), `${metricId} should be defined`);
  }

  assert.ok(schema.detailView.groups.length > 0, "detailView should have groups");
  assert.ok(schema.adminForm.groups.length > 0, "adminForm should have groups");
  assert.ok(schema.comparePresets.length > 0, "comparePresets should have presets");
});
