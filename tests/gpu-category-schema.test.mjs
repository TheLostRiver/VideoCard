import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertValidCategorySchema } from "../src/domain/hardware/category-schema.js";

const gpuSchemaUrl = new URL("../src/data/categories/gpu.schema.json", import.meta.url);

async function readGpuSchema() {
  return JSON.parse(await readFile(gpuSchemaUrl, "utf8"));
}

test("gpu category schema matches current GPU ladder surfaces", async () => {
  const schema = await readGpuSchema();
  const metricIds = new Set(schema.metrics.map((metric) => metric.id));
  const requiredMetricIds = [
    "gpu.core.count",
    "gpu.clock.base",
    "gpu.clock.boost",
    "gpu.memory.size",
    "gpu.memory.type",
    "gpu.memory.bus",
    "gpu.memory.bandwidth",
    "gpu.power.board",
    "gpu.power.tgpRange",
    "gpu.benchmark.timeSpyGraphics",
    "gpu.benchmark.steelNomadGraphics",
    "gpu.benchmark.passMarkG3D",
    "gpu.gaming.recommendedResolution",
    "gpu.gaming.rayTracingLevel"
  ];

  assert.doesNotThrow(() => assertValidCategorySchema(schema));
  assert.equal(schema.id, "gpu");
  assert.equal(schema.listView.titleField, "name");

  for (const metricId of requiredMetricIds) {
    assert.ok(metricIds.has(metricId), `${metricId} should be defined`);
  }

  assert.deepEqual(
    schema.detailView.groups.map((group) => group.id),
    ["overview", "core", "memoryPower", "benchmarks", "notes"]
  );
  assert.deepEqual(
    schema.adminForm.groups.map((group) => group.id),
    ["basic", "core", "memoryPower", "benchmarksGaming", "notesSources"]
  );
  assert.deepEqual(
    schema.comparePresets.map((preset) => preset.id),
    ["specs", "memory", "power", "benchmarks"]
  );
});
