import test from "node:test";
import assert from "node:assert/strict";
import { createJsonHardwareRepository } from "../src/infrastructure/json/json-hardware-repository.js";

function metricById(metricValues, metricId) {
  return metricValues.find((metricValue) => metricValue.metricId === metricId);
}

test("json hardware repository lists desktop-cpu category", async () => {
  const repository = createJsonHardwareRepository();
  const categories = await repository.listCategories();
  const category = categories.find((c) => c.id === "desktop-cpu");

  assert.ok(category, "desktop-cpu category should exist");
  assert.equal(category.label, "Desktop CPU");
  assert.equal((await repository.getCategory("desktop-cpu")).id, "desktop-cpu");
});

test("json hardware repository lists at least three desktop cpu items", async () => {
  const repository = createJsonHardwareRepository();
  const items = await repository.listItems({ categoryId: "desktop-cpu" });

  assert.ok(items.length >= 3, `expected at least 3 items, got ${items.length}`);

  const amd = items.find((item) => item.manufacturerId === "amd");
  const intel = items.find((item) => item.manufacturerId === "intel");
  assert.ok(amd, "should include an AMD Ryzen item");
  assert.ok(intel, "should include an Intel Core item");
});

test("json hardware repository returns desktop cpu item detail with metrics and ranking score", async () => {
  const repository = createJsonHardwareRepository();
  const items = await repository.listItems({ categoryId: "desktop-cpu" });
  const firstItem = items[0];
  const detail = await repository.getItemDetail(firstItem.id);

  assert.equal(detail.item.id, firstItem.id);
  assert.equal(detail.item.categoryId, "desktop-cpu");
  assert.ok(detail.metricValues.length > 0, "should have metric values");
  assert.ok(detail.rankingScore, "should have ranking score");
  assert.ok(detail.rankingScore.score > 0, "ranking score should be positive");
  assert.equal(detail.rankingScore.rankingProfileId, "desktop-cpu-performance");

  const coreCount = metricById(detail.metricValues, "cpu.core.count");
  assert.ok(coreCount, "should have cpu.core.count metric");
  assert.ok(coreCount.valueNumber > 0, "core count should be positive");
});
