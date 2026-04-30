import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHardwareQueryService } from "../src/application/hardware-query-service.js";
import { createJsonHardwareRepository } from "../src/infrastructure/json/json-hardware-repository.js";

function createService() {
  return createHardwareQueryService(createJsonHardwareRepository());
}

function rowByMetricId(group, metricId) {
  return group.rows.find((row) => row.metricId === metricId);
}

test("hardware query service builds a GPU list view model from the repository", async () => {
  const service = createService();
  const listViewModel = await service.getListViewModel("gpu");
  const laptop4070 = listViewModel.items.find((item) => item.id === "rtx-4070-laptop");

  assert.equal(listViewModel.category.id, "gpu");
  assert.equal(laptop4070.title, "GeForce RTX 4070 Laptop GPU");
  assert.deepEqual(laptop4070.badges, [{ id: "mobile", label: "mobile" }]);
  assert.equal(laptop4070.primaryScore.displayValue, "135");
  assert.equal(laptop4070.power.displayValue, "45-115W");
  assert.equal(laptop4070.recommendation.displayValue, "1080p/1440p");
  assert.ok(laptop4070.subtitle.includes("RTX 40"));
  assert.ok(laptop4070.facts.some((fact) => fact.metricId === "gpu.memory.size" && fact.displayValue === "8 GB"));
});

test("hardware query service builds grouped GPU detail metric display values", async () => {
  const service = createService();
  const detailViewModel = await service.getDetailViewModel("rtx-4070-laptop");
  const coreGroup = detailViewModel.groups.find((group) => group.id === "core");
  const memoryPowerGroup = detailViewModel.groups.find((group) => group.id === "memoryPower");
  const benchmarkGroup = detailViewModel.groups.find((group) => group.id === "benchmarks");

  assert.equal(detailViewModel.item.id, "rtx-4070-laptop");
  assert.equal(coreGroup.title, "Core Specs");
  assert.equal(rowByMetricId(coreGroup, "gpu.clock.boost").displayValue, "2,175 MHz");
  assert.equal(rowByMetricId(memoryPowerGroup, "gpu.power.tgpRange").displayValue, "45-115W");
  assert.equal(rowByMetricId(benchmarkGroup, "gpu.benchmark.timeSpyGraphics").displayValue, "12,345");
});

test("hardware query service applies schema-driven mobile warnings", async () => {
  const service = createService();
  const mobileDetail = await service.getDetailViewModel("rtx-4070-laptop");
  const desktopDetail = await service.getDetailViewModel("rtx-4070-desktop");

  assert.deepEqual(mobileDetail.warnings, [
    {
      id: "gpu-mobile-performance-variance",
      severity: "warning",
      message: "移动版性能受 TGP、散热和厂商调校影响，不能直接等同桌面版。"
    }
  ]);
  assert.deepEqual(desktopDetail.warnings, []);
});

test("hardware query service does not import legacy GPU data directly", async () => {
  const source = await readFile(new URL("../src/application/hardware-query-service.js", import.meta.url), "utf8");

  assert.doesNotMatch(source, /data\/gpus|gpus\.js/);
});
