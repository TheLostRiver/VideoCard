import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { gpus } from "../src/data/gpus.js";
import {
  formatGpuModule,
  getDataPaths,
  readGpuData,
  validateGpuRecords
} from "../scripts/gpu-data.mjs";

test("readGpuData loads the JSON source of truth", async () => {
  const records = await readGpuData();
  assert.equal(records.length, gpus.length);
  assert.equal(records[0].id, gpus[0].id);
});

test("validateGpuRecords reports duplicate ids and invalid mobile TGP", () => {
  const duplicate = { ...gpus[0] };
  const invalidMobile = {
    ...gpus.find((gpu) => gpu.segment === "mobile"),
    id: "invalid-mobile",
    specs: { ...gpus.find((gpu) => gpu.segment === "mobile").specs, tgpRangeW: "" }
  };

  const errors = validateGpuRecords([gpus[0], duplicate, invalidMobile]);
  assert.ok(errors.some((error) => error.includes("Duplicate id")));
  assert.ok(errors.some((error) => error.includes("mobile GPU missing specs.tgpRangeW")));
});

test("generated JS module is in sync with JSON data", async () => {
  const paths = getDataPaths();
  const records = await readGpuData();
  const expected = formatGpuModule(records);
  const actual = await readFile(paths.jsPath, "utf8");
  assert.equal(actual, expected);
});
