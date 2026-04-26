import { readFile } from "node:fs/promises";
import {
  assertGeneratedModuleFresh,
  formatGpuModule,
  getDataPaths,
  readGpuData,
  validateGpuRecords
} from "./gpu-data.mjs";

const gpus = await readGpuData();
const errors = validateGpuRecords(gpus);

if (!await assertGeneratedModuleFresh()) {
  const { jsPath } = getDataPaths();
  const actual = await readFile(jsPath, "utf8");
  const expected = formatGpuModule(gpus);
  errors.push(`src/data/gpus.js is out of sync with src/data/gpus.json. Run npm.cmd run sync:data.`);
  errors.push(`Expected generated size ${expected.length}, actual ${actual.length}.`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${gpus.length} GPU records.`);
