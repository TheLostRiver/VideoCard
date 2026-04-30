import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { saveGpuRecord } from "../../../scripts/gpu-data.mjs";
import {
  mapLegacyGpuToHardwareItem,
  mapLegacyGpuToMetricValues,
  mapLegacyGpuToRankingScore,
  mapLegacyGpuToSources
} from "../../../scripts/import-legacy-gpus.mjs";

const defaultGpuDataUrl = new URL("../../data/gpus.json", import.meta.url);
const defaultGpuCategorySchemaUrl = new URL("../../data/categories/gpu.schema.json", import.meta.url);
const legacyMetricPaths = new Map([
  ["gpu.release.date", "releaseDate"],
  ["gpu.confidence", "confidence"],
  ["gpu.core.count", "specs.cores"],
  ["gpu.clock.base", "specs.baseClockMHz"],
  ["gpu.clock.boost", "specs.boostClockMHz"],
  ["gpu.memory.size", "specs.memorySizeGB"],
  ["gpu.memory.type", "specs.memoryType"],
  ["gpu.memory.bus", "specs.memoryBusBit"],
  ["gpu.memory.bandwidth", "specs.bandwidthGBs"],
  ["gpu.power.board", "specs.powerW"],
  ["gpu.power.tgpRange", "specs.tgpRangeW"],
  ["gpu.benchmark.timeSpyGraphics", "benchmarks.timeSpyGraphics"],
  ["gpu.benchmark.steelNomadGraphics", "benchmarks.steelNomadGraphics"],
  ["gpu.benchmark.passMarkG3D", "benchmarks.passMarkG3D"],
  ["gpu.benchmark.sourceNote", "benchmarks.sourceNote"],
  ["gpu.gaming.recommendedResolution", "gaming.recommendedResolution"],
  ["gpu.gaming.rayTracingLevel", "gaming.rayTracingLevel"],
  ["gpu.gaming.efficiencyNote", "gaming.efficiencyNote"]
]);

export function createJsonHardwareRepository(options = {}) {
  const root = options.root || process.cwd();
  const gpuDataUrl = options.gpuDataUrl || (options.root
    ? pathToFileURL(join(options.root, "src", "data", "gpus.json"))
    : defaultGpuDataUrl);
  const gpuCategorySchemaUrl = options.gpuCategorySchemaUrl || defaultGpuCategorySchemaUrl;

  async function listCategories() {
    return [await readJson(gpuCategorySchemaUrl)];
  }

  async function getCategory(categoryId) {
    const categories = await listCategories();
    return categories.find((category) => category.id === categoryId) || null;
  }

  async function listItems(query = {}) {
    if (query.categoryId && query.categoryId !== "gpu") return [];

    const gpuRecords = await readGpuRecords(gpuDataUrl);
    return gpuRecords.map(mapLegacyGpuToHardwareItem);
  }

  async function getItemDetail(itemId) {
    const gpuRecords = await readGpuRecords(gpuDataUrl);
    const gpu = gpuRecords.find((record) => record.id === itemId);
    if (!gpu) return null;

    return {
      item: mapLegacyGpuToHardwareItem(gpu),
      metricValues: mapLegacyGpuToMetricValues(gpu),
      rankingScore: mapLegacyGpuToRankingScore(gpu),
      sources: mapLegacyGpuToSources(gpu)
    };
  }

  async function saveItem(detail) {
    const gpuRecords = await readGpuRecords(gpuDataUrl);
    const currentGpu = gpuRecords.find((record) => record.id === detail?.item?.id);
    if (!currentGpu) {
      const error = new Error(`GPU not found: ${detail?.item?.id}`);
      error.statusCode = 404;
      error.errors = [`GPU not found: ${detail?.item?.id}`];
      throw error;
    }

    const nextGpu = mapHardwareDetailToLegacyGpu(detail, currentGpu);
    const savedGpu = await saveGpuRecord(currentGpu.id, nextGpu, root);
    return {
      item: mapLegacyGpuToHardwareItem(savedGpu),
      metricValues: mapLegacyGpuToMetricValues(savedGpu),
      rankingScore: mapLegacyGpuToRankingScore(savedGpu),
      sources: mapLegacyGpuToSources(savedGpu)
    };
  }

  return {
    listCategories,
    getCategory,
    listItems,
    getItemDetail,
    saveItem
  };
}

async function readGpuRecords(gpuDataUrl) {
  return readJson(gpuDataUrl);
}

async function readJson(fileUrl) {
  return JSON.parse(await readFile(fileUrl, "utf8"));
}

function mapHardwareDetailToLegacyGpu(detail, currentGpu) {
  const nextGpu = structuredClone(currentGpu);

  applyHardwareItem(nextGpu, detail.item);
  applyMetricValues(nextGpu, detail.metricValues || []);
  applyRankingScore(nextGpu, detail.rankingScore);
  applySources(nextGpu, detail.sources);

  return nextGpu;
}

function applyHardwareItem(gpu, item) {
  if (!item) return;
  if (item.name !== undefined) gpu.name = item.name;
  if (item.manufacturerId !== undefined) gpu.brand = item.manufacturerId;
  if (item.generation !== undefined) gpu.generation = item.generation;
  if (item.architecture !== undefined) gpu.architecture = item.architecture;
  if (item.releaseDate !== undefined) gpu.releaseDate = item.releaseDate;
  if (item.marketSegmentIds?.[0]) gpu.segment = item.marketSegmentIds[0];
  if (Array.isArray(item.notes)) gpu.notes = [...item.notes];
}

function applyMetricValues(gpu, metricValues) {
  for (const metricValue of metricValues) {
    const path = legacyMetricPaths.get(metricValue.metricId);
    if (!path) continue;
    setPath(gpu, path, getLegacyMetricValue(metricValue));
  }
}

function applyRankingScore(gpu, rankingScore) {
  if (!rankingScore) return;
  if (rankingScore.score !== undefined) gpu.performanceIndex = rankingScore.score;
  if (rankingScore.tierId !== undefined) gpu.tier = rankingScore.tierId;
}

function applySources(gpu, sources) {
  if (!Array.isArray(sources)) return;
  gpu.sources = sources
    .map((source) => ({
      label: source.label,
      url: source.url
    }))
    .filter((source) => source.label && source.url);
}

function getLegacyMetricValue(metricValue) {
  if (Object.hasOwn(metricValue, "valueText")) return metricValue.valueText;
  if (Object.hasOwn(metricValue, "valueNumber")) return metricValue.valueNumber;
  if (Object.hasOwn(metricValue, "valueBoolean")) return metricValue.valueBoolean;
  if (metricValue.valueMin !== undefined && metricValue.valueMax !== undefined) {
    return `${metricValue.valueMin}-${metricValue.valueMax}${metricValue.unit || ""}`;
  }
  return "";
}

function setPath(target, path, value) {
  const segments = path.split(".");
  const last = segments.pop();
  const parent = segments.reduce((current, segment) => {
    current[segment] ||= {};
    return current[segment];
  }, target);
  parent[last] = value;
}
