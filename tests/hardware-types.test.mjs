import test from "node:test";
import assert from "node:assert/strict";
import { HARDWARE_CATEGORY_IDS, ITEM_STATUSES, METRIC_VALUE_TYPES } from "../src/domain/hardware/types.js";

test("hardware category ids include planned platform categories", () => {
  assert.ok(HARDWARE_CATEGORY_IDS.includes("gpu"));
  assert.ok(HARDWARE_CATEGORY_IDS.includes("desktop-cpu"));
  assert.ok(HARDWARE_CATEGORY_IDS.includes("mobile-soc"));
  assert.ok(HARDWARE_CATEGORY_IDS.includes("apple-silicon"));
});

test("metric value types include editable data shapes", () => {
  assert.ok(METRIC_VALUE_TYPES.includes("number"));
  assert.ok(METRIC_VALUE_TYPES.includes("text"));
  assert.ok(METRIC_VALUE_TYPES.includes("boolean"));
  assert.ok(METRIC_VALUE_TYPES.includes("enum"));
  assert.ok(METRIC_VALUE_TYPES.includes("range"));
  assert.ok(METRIC_VALUE_TYPES.includes("date"));
});

test("item statuses include draft lifecycle states", () => {
  assert.ok(ITEM_STATUSES.includes("draft"));
  assert.ok(ITEM_STATUSES.includes("published"));
  assert.ok(ITEM_STATUSES.includes("archived"));
});
