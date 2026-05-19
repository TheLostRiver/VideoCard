import {
  convertFromCpusJson,
  convertToProjectCpuItem,
  convertToProjectGpu
} from "../../scripts/import-external-data.mjs";
import {
  mapLegacyGpuToHardwareItem,
  mapLegacyGpuToMetricValues,
  mapLegacyGpuToRankingScore,
  mapLegacyGpuToSources
} from "../../scripts/import-legacy-gpus.mjs";

const supportedImportCategories = new Set(["gpu", "desktop-cpu"]);
const supportedGpuBrands = new Set(["nvidia", "amd", "intel"]);
const supportedDesktopCpuBrands = new Set(["amd", "intel"]);

export function createHardwareImportService(repository) {
  if (!repository || typeof repository.listItemDetails !== "function" || typeof repository.saveItem !== "function") {
    throw new Error("hardware import service requires a repository with listItemDetails and saveItem");
  }

  async function previewImport(payload) {
    const plan = await createImportPlan(repository, payload);
    return toPublicImportPlan(plan);
  }

  async function commitImport(payload) {
    const plan = await createImportPlan(repository, payload);
    const selectedIds = normalizeSelectedIds(payload?.selectedIds, plan.rows);
    const imported = [];
    const skipped = [];

    for (const row of plan.rows) {
      if (row.status !== "new" || !selectedIds.has(row.id)) {
        skipped.push(toPublicImportRow(row));
        continue;
      }

      const saved = await repository.saveItem(row.detail, { upsert: true });
      imported.push({
        ...toPublicImportRow(row),
        savedId: saved?.item?.id || row.id
      });
    }

    return {
      plan: toPublicImportPlan(plan),
      imported,
      skipped
    };
  }

  return { previewImport, commitImport };
}

export async function createImportPlan(repository, payload) {
  const categoryId = normalizeCategoryId(payload?.categoryId);
  const records = normalizeRecords(payload?.records);
  const existingDetails = await repository.listItemDetails({ categoryId });

  return buildHardwareImportPlan({
    categoryId,
    records,
    existingDetails
  });
}

export function buildHardwareImportPlan({ categoryId, records, existingDetails = [] }) {
  const existingIds = new Set(existingDetails.map((detail) => detail?.item?.id).filter(Boolean));
  const existingNames = new Set(existingDetails.map((detail) => normalizeName(detail?.item?.name)).filter(Boolean));
  const importedIds = new Set();
  const importedNames = new Set();

  const rows = records.map((record, index) => {
    const row = convertImportRecord(categoryId, record, index);
    if (row.status === "invalid") return row;

    const nameKey = normalizeName(row.name);
    if (existingIds.has(row.id) || existingNames.has(nameKey)) {
      return { ...row, status: "duplicate", selectable: false, reason: "Already exists in the current dataset." };
    }

    if (importedIds.has(row.id) || importedNames.has(nameKey)) {
      return { ...row, status: "duplicate", selectable: false, reason: "Duplicate row inside this import file." };
    }

    importedIds.add(row.id);
    importedNames.add(nameKey);
    return { ...row, status: "new", selectable: true, reason: "Ready to import." };
  });

  return {
    categoryId,
    summary: summarizeImportRows(rows),
    rows
  };
}

export function toPublicImportPlan(plan) {
  return {
    categoryId: plan.categoryId,
    summary: { ...plan.summary },
    rows: plan.rows.map(toPublicImportRow)
  };
}

function convertImportRecord(categoryId, record, index) {
  try {
    const detail = categoryId === "gpu"
      ? convertGpuImportRecord(record)
      : convertDesktopCpuImportRecord(record);
    const validationErrors = validateImportDetail(categoryId, detail);
    const item = detail.item || {};

    if (validationErrors.length) {
      return createInvalidImportRow({
        categoryId,
        index,
        id: item.id,
        name: item.name,
        manufacturerId: item.manufacturerId,
        generation: item.generation,
        releaseDate: item.releaseDate,
        reason: validationErrors.join(" ")
      });
    }

    return {
      rowIndex: index,
      categoryId,
      id: item.id,
      name: item.name,
      manufacturerId: item.manufacturerId,
      generation: item.generation,
      releaseDate: item.releaseDate,
      status: "new",
      reason: "",
      selectable: true,
      detail
    };
  } catch (error) {
    return createInvalidImportRow({
      categoryId,
      index,
      id: "",
      name: getRecordName(record),
      reason: error.message || "Unable to convert this row."
    });
  }
}

function convertGpuImportRecord(record) {
  if (record?.item?.categoryId === "gpu") return structuredClone(record);

  const gpu = normalizeImportedGpu(convertToProjectGpu(record || {}));
  const item = mapLegacyGpuToHardwareItem(gpu);
  item.specs = { ...gpu.specs };
  item.tierId = gpu.tier;
  item.confidence = gpu.confidence;

  return {
    item,
    metricValues: [
      ...mapLegacyGpuToMetricValues(gpu),
      {
        id: `${gpu.id}:metric:gpu.performance.index`,
        itemId: gpu.id,
        metricId: "gpu.performance.index",
        valueNumber: gpu.performanceIndex
      }
    ],
    rankingScore: mapLegacyGpuToRankingScore(gpu),
    sources: mapLegacyGpuToSources(gpu)
  };
}

function normalizeImportedGpu(gpu) {
  const nextGpu = structuredClone(gpu);
  nextGpu.segment = "desktop";
  nextGpu.performanceIndex = Number.isFinite(nextGpu.performanceIndex) && nextGpu.performanceIndex > 0
    ? nextGpu.performanceIndex
    : 1;
  nextGpu.tier = nextGpu.tier && nextGpu.tier !== "unranked" ? nextGpu.tier : "legacy";
  nextGpu.confidence ||= "low";
  nextGpu.generation ||= deriveGpuGeneration(nextGpu.name) || nextGpu._chip || "Imported";
  nextGpu.architecture ||= "";
  nextGpu.specs = {
    coresLabel: "Shaders",
    ...(nextGpu.specs || {})
  };
  nextGpu.benchmarks = {
    timeSpyGraphics: null,
    steelNomadGraphics: null,
    passMarkG3D: null,
    sourceNote: "Imported external data",
    ...(nextGpu.benchmarks || {})
  };
  nextGpu.gaming = {
    recommendedResolution: "TBD",
    rayTracingLevel: "unknown",
    efficiencyNote: "",
    ...(nextGpu.gaming || {})
  };
  nextGpu.sources = [{ label: "External GPU Database", url: "" }];
  return nextGpu;
}

function convertDesktopCpuImportRecord(record) {
  if (record?.item?.categoryId === "desktop-cpu") return structuredClone(record);

  const cpuRecord = convertFromCpusJson(record || {});
  const detail = convertToProjectCpuItem(cpuRecord);
  detail.item.generation = deriveDesktopCpuGeneration(cpuRecord.name) || detail.item.generation || "";
  detail.item.architecture = cpuRecord.codename || detail.item.architecture || "";
  detail.item.marketSegmentIds = ["desktop"];
  detail.rankingScore = {
    profileId: "composite",
    score: detail.rankingScore?.score ?? 0,
    components: []
  };
  return detail;
}

function validateImportDetail(categoryId, detail) {
  const item = detail?.item || {};
  const errors = [];

  if (!item.id) errors.push("Missing generated id.");
  if (!item.name || /^unknown\b/i.test(item.name)) errors.push("Missing hardware name.");

  if (categoryId === "gpu") {
    if (!supportedGpuBrands.has(item.manufacturerId)) {
      errors.push(`Unsupported GPU brand: ${item.manufacturerId || "unknown"}.`);
    }
    if (!item.generation) errors.push("Unable to infer GPU series.");
    if (!item.architecture) errors.push("Missing GPU chip or architecture.");
  }

  if (categoryId === "desktop-cpu") {
    if (!supportedDesktopCpuBrands.has(item.manufacturerId)) {
      errors.push(`Unsupported desktop CPU brand: ${item.manufacturerId || "unknown"}.`);
    }
  }

  return errors;
}

function createInvalidImportRow({ categoryId, index, id, name, manufacturerId, generation, releaseDate, reason }) {
  return {
    rowIndex: index,
    categoryId,
    id: id || `invalid-row-${index + 1}`,
    name: name || `Row ${index + 1}`,
    manufacturerId: manufacturerId || "",
    generation: generation || "",
    releaseDate: releaseDate || "",
    status: "invalid",
    reason,
    selectable: false,
    detail: null
  };
}

function summarizeImportRows(rows) {
  return {
    total: rows.length,
    new: rows.filter((row) => row.status === "new").length,
    duplicate: rows.filter((row) => row.status === "duplicate").length,
    invalid: rows.filter((row) => row.status === "invalid").length,
    selectable: rows.filter((row) => row.selectable).length
  };
}

function toPublicImportRow(row) {
  const { detail: _detail, ...publicRow } = row;
  return publicRow;
}

function normalizeSelectedIds(selectedIds, rows) {
  if (Array.isArray(selectedIds)) return new Set(selectedIds.map(String));
  return new Set(rows.filter((row) => row.status === "new").map((row) => row.id));
}

function normalizeRecords(records) {
  if (!Array.isArray(records)) {
    const error = new Error("records must be an array");
    error.statusCode = 400;
    throw error;
  }
  return records;
}

function normalizeCategoryId(categoryId) {
  const normalized = String(categoryId || "").trim();
  if (!supportedImportCategories.has(normalized)) {
    const error = new Error(`Unsupported import category: ${normalized || "unknown"}`);
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[®™]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getRecordName(record) {
  return record?.Product_Name || record?.Name || record?.item?.name || record?.name || "";
}

function deriveDesktopCpuGeneration(name) {
  const text = String(name || "");
  const ryzen = text.match(/\bRyzen\s+\d\s+([1-9])\d{3}/i);
  if (ryzen) return `Ryzen ${ryzen[1]}000`;

  const intelCore = text.match(/\b(?:Core\s+)?i[3579]-?(\d{2})\d{3}[A-Z]*\b/i);
  if (intelCore) return `${Number(intelCore[1])}th Gen`;

  return "";
}

function deriveGpuGeneration(name) {
  const text = String(name || "").toUpperCase();
  const rtx = text.match(/\bRTX\s*(50|40|30|20)\d{2}\b/);
  if (rtx) return `RTX ${rtx[1]}`;

  const gtx = text.match(/\bGTX\s*(16|10)\d{2}\b/);
  if (gtx) return `GTX ${gtx[1]}`;

  const rx = text.match(/\bRX\s*([5-9])\d{3}\b/);
  if (rx) return `RX ${rx[1]}000`;

  const arc = text.match(/\bARC\s*([AB])\d{3}\b/);
  if (arc) return `Arc ${arc[1]}`;

  return "";
}
