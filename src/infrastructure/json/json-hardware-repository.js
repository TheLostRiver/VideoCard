import { readFile } from "node:fs/promises";
import {
  mapLegacyGpuToHardwareItem,
  mapLegacyGpuToMetricValues,
  mapLegacyGpuToRankingScore,
  mapLegacyGpuToSources
} from "../../../scripts/import-legacy-gpus.mjs";

const defaultGpuDataUrl = new URL("../../data/gpus.json", import.meta.url);
const defaultGpuCategorySchemaUrl = new URL("../../data/categories/gpu.schema.json", import.meta.url);

export function createJsonHardwareRepository(options = {}) {
  const gpuDataUrl = options.gpuDataUrl || defaultGpuDataUrl;
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

  async function saveItem() {
    throw new Error("JSON hardware repository is read-only");
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
