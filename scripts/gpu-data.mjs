import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { BRANDS, SEGMENTS, TIERS } from "../src/data/constants.js";

export function getDataPaths(root = process.cwd()) {
  return {
    jsonPath: join(root, "src", "data", "gpus.json"),
    jsPath: join(root, "src", "data", "gpus.js")
  };
}

export async function readGpuData(root = process.cwd()) {
  const { jsonPath } = getDataPaths(root);
  return JSON.parse(await readFile(jsonPath, "utf8"));
}

export function formatGpuModule(records) {
  return `export const gpus = ${JSON.stringify(records, null, 2)};\n`;
}

export async function writeGpuModule(records, root = process.cwd()) {
  const { jsPath } = getDataPaths(root);
  await writeFile(jsPath, formatGpuModule(records), "utf8");
}

export async function writeGpuJson(records, root = process.cwd()) {
  const { jsonPath } = getDataPaths(root);
  await writeFile(jsonPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

export async function writeGpuJsonAtomic(records, root = process.cwd()) {
  const { jsonPath } = getDataPaths(root);
  await mkdir(dirname(jsonPath), { recursive: true });
  const tempPath = `${jsonPath}.${Date.now()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  await rename(tempPath, jsonPath);
}

export function replaceGpuRecord(records, id, nextRecord) {
  const index = records.findIndex((gpu) => gpu.id === id);
  if (index === -1) {
    const error = new Error(`GPU not found: ${id}`);
    error.statusCode = 404;
    error.errors = [`GPU not found: ${id}`];
    throw error;
  }

  const nextRecords = records.map((gpu, recordIndex) => recordIndex === index ? nextRecord : gpu);
  assertValidGpuRecords(nextRecords);
  return nextRecords;
}

export async function saveGpuRecord(id, nextRecord, root = process.cwd()) {
  const records = await readGpuData(root);
  const nextRecords = replaceGpuRecord(records, id, nextRecord);
  await writeGpuJsonAtomic(nextRecords, root);
  await writeGpuModule(nextRecords, root);
  return nextRecords.find((gpu) => gpu.id === nextRecord.id);
}

export async function assertGeneratedModuleFresh(root = process.cwd()) {
  const { jsPath } = getDataPaths(root);
  const records = await readGpuData(root);
  const expected = formatGpuModule(records);
  const actual = await readFile(jsPath, "utf8");
  return actual === expected;
}

export function validateGpuRecords(records) {
  const errors = [];
  const ids = new Set();

  if (!Array.isArray(records)) {
    return ["GPU data must be an array"];
  }

  for (const gpu of records) {
    const label = gpu?.id || "GPU";
    if (!gpu?.id) errors.push("GPU missing id");
    if (gpu?.id && ids.has(gpu.id)) errors.push(`Duplicate id: ${gpu.id}`);
    if (gpu?.id) ids.add(gpu.id);

    if (!gpu?.name) errors.push(`${label} missing name`);
    if (!BRANDS[gpu?.brand]) errors.push(`${label} has invalid brand: ${gpu?.brand}`);
    if (!SEGMENTS[gpu?.segment]) errors.push(`${label} has invalid segment: ${gpu?.segment}`);
    if (!TIERS[gpu?.tier]) errors.push(`${label} has invalid tier: ${gpu?.tier}`);
    if (typeof gpu?.performanceIndex !== "number" || gpu.performanceIndex <= 0) {
      errors.push(`${label} has invalid performanceIndex`);
    }
    if (!gpu?.architecture) errors.push(`${label} missing architecture`);
    if (!gpu?.generation) errors.push(`${label} missing generation`);
    if (!gpu?.specs?.coresLabel) errors.push(`${label} missing specs.coresLabel`);
    if (gpu?.segment === "mobile" && !gpu?.specs?.tgpRangeW) {
      errors.push(`${label} mobile GPU missing specs.tgpRangeW`);
    }
    if (!gpu?.benchmarks) errors.push(`${label} missing benchmarks`);
    if (!gpu?.gaming?.recommendedResolution) errors.push(`${label} missing gaming.recommendedResolution`);
    if (!Array.isArray(gpu?.notes)) errors.push(`${label} missing notes array`);
    if (!Array.isArray(gpu?.sources)) errors.push(`${label} missing sources array`);
  }

  return errors;
}

export function assertValidGpuRecords(records) {
  const errors = validateGpuRecords(records);
  if (errors.length) {
    const error = new Error(errors.join("\n"));
    error.errors = errors;
    throw error;
  }
}
