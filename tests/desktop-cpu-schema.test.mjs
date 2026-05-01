import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertValidCategorySchema } from "../src/domain/hardware/category-schema.js";

const schemaUrl = new URL("../src/data/categories/desktop-cpu.schema.json", import.meta.url);

async function readSchema() {
  return JSON.parse(await readFile(schemaUrl, "utf8"));
}

test("desktop cpu category schema passes validation and includes required metrics", async () => {
  const schema = await readSchema();
  const metricIds = new Set(schema.metrics.map((metric) => metric.id));
  const requiredMetricIds = [
    "cpu.core.count",
    "cpu.core.threads",
    "cpu.clock.base",
    "cpu.clock.boost",
    "cpu.cache.l3",
    "cpu.power.tdp",
    "cpu.socket",
    "cpu.benchmark.cinebenchSingle",
    "cpu.benchmark.cinebenchMulti",
    "cpu.benchmark.geekbenchSingle",
    "cpu.benchmark.geekbenchMulti"
  ];

  assert.doesNotThrow(() => assertValidCategorySchema(schema));
  assert.equal(schema.id, "desktop-cpu");
  assert.equal(schema.listView.titleField, "name");

  for (const metricId of requiredMetricIds) {
    assert.ok(metricIds.has(metricId), `${metricId} should be defined`);
  }

  assert.ok(schema.detailView.groups.length > 0, "detailView should have groups");
  assert.ok(schema.adminForm.groups.length > 0, "adminForm should have groups");
  assert.ok(schema.comparePresets.length > 0, "comparePresets should have presets");
});
