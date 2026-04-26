import test from "node:test";
import assert from "node:assert/strict";
import { formatBenchmark, formatClock, formatMemory, formatNumber, formatPower } from "../src/utils/format.js";

test("formatNumber renders missing values as pending", () => {
  assert.equal(formatNumber(null), "待补充");
  assert.equal(formatNumber(undefined), "待补充");
});

test("formatClock renders MHz", () => {
  assert.equal(formatClock(2475), "2,475 MHz");
});

test("formatMemory combines capacity and type", () => {
  assert.equal(formatMemory({ specs: { memorySizeGB: 12, memoryType: "GDDR6X" } }), "12GB GDDR6X");
});

test("formatPower uses TGP range for mobile GPUs", () => {
  const gpu = { segment: "mobile", specs: { tgpRangeW: "35-115W", powerW: null } };
  assert.equal(formatPower(gpu), "35-115W");
});

test("formatPower uses powerW for desktop GPUs", () => {
  const gpu = { segment: "desktop", specs: { powerW: 200 } };
  assert.equal(formatPower(gpu), "200W");
});

test("formatBenchmark renders score with separators", () => {
  assert.equal(formatBenchmark(17800), "17,800");
});
