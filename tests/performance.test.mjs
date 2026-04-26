import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import { getMaxPerformanceIndex, getPerformanceWidth, groupByTier } from "../src/utils/performance.js";

test("groupByTier omits empty groups", () => {
  const groups = groupByTier(gpus);
  assert.ok(groups.length > 0);
  assert.ok(groups.every(([, items]) => items.length > 0));
});

test("getPerformanceWidth keeps a readable minimum", () => {
  assert.equal(getPerformanceWidth(1, 1000), 8);
});

test("getMaxPerformanceIndex returns strongest index", () => {
  assert.equal(getMaxPerformanceIndex(gpus), 245);
});
