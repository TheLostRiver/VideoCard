import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import { filterGpus, sortGpus } from "../src/utils/filters.js";

test("filterGpus searches model names", () => {
  const result = filterGpus(gpus, {
    query: "4070",
    brands: new Set(),
    segments: new Set(),
    generations: new Set()
  });
  assert.ok(result.some((gpu) => gpu.id === "rtx-4070-desktop"));
  assert.ok(result.some((gpu) => gpu.id === "rtx-4070-laptop"));
});

test("filterGpus filters mobile GPUs", () => {
  const result = filterGpus(gpus, {
    query: "",
    brands: new Set(),
    segments: new Set(["mobile"]),
    generations: new Set()
  });
  assert.ok(result.length > 0);
  assert.ok(result.every((gpu) => gpu.segment === "mobile"));
});

test("sortGpus sorts by performance descending", () => {
  const result = sortGpus(gpus, "performance");
  assert.equal(result[0].id, "rtx-4090-desktop");
});
