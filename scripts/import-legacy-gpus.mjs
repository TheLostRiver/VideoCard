export const LEGACY_IMPORT_TIMESTAMP = "legacy-import";
export const GPU_RANKING_PROFILE_ID = "gpu-gaming-performance";
export const LEGACY_GPU_FORMULA_VERSION = "legacy-performance-index-v1";

const metricMappings = Object.freeze([
  ["gpu.release.date", "releaseDate", "text"],
  ["gpu.confidence", "confidence", "text"],
  ["gpu.core.count", "specs.cores", "number"],
  ["gpu.clock.base", "specs.baseClockMHz", "number"],
  ["gpu.clock.boost", "specs.boostClockMHz", "number"],
  ["gpu.memory.size", "specs.memorySizeGB", "number"],
  ["gpu.memory.type", "specs.memoryType", "text"],
  ["gpu.memory.bus", "specs.memoryBusBit", "number"],
  ["gpu.memory.bandwidth", "specs.bandwidthGBs", "number"],
  ["gpu.power.board", "specs.powerW", "number"],
  ["gpu.power.tgpRange", "specs.tgpRangeW", "range"],
  ["gpu.power.display", "specs.tgpRangeW", "power-display"],
  ["gpu.benchmark.timeSpyGraphics", "benchmarks.timeSpyGraphics", "number"],
  ["gpu.benchmark.steelNomadGraphics", "benchmarks.steelNomadGraphics", "number"],
  ["gpu.benchmark.passMarkG3D", "benchmarks.passMarkG3D", "number"],
  ["gpu.benchmark.sourceNote", "benchmarks.sourceNote", "text"],
  ["gpu.gaming.recommendedResolution", "gaming.recommendedResolution", "text"],
  ["gpu.gaming.rayTracingLevel", "gaming.rayTracingLevel", "text"],
  ["gpu.gaming.efficiencyNote", "gaming.efficiencyNote", "text"]
]);

export function mapLegacyGpuToHardwareItem(gpu) {
  assertLegacyGpu(gpu);

  return {
    id: gpu.id,
    categoryId: "gpu",
    name: gpu.name,
    manufacturerId: gpu.brand,
    generation: gpu.generation,
    architecture: gpu.architecture,
    releaseDate: gpu.releaseDate,
    marketSegmentIds: [gpu.segment],
    status: "published",
    notes: [...(gpu.notes || [])],
    createdAt: LEGACY_IMPORT_TIMESTAMP,
    updatedAt: LEGACY_IMPORT_TIMESTAMP
  };
}

export function mapLegacyGpuToMetricValues(gpu) {
  assertLegacyGpu(gpu);

  const sourceIds = mapLegacyGpuToSources(gpu).map((source) => source.id);
  return metricMappings
    .map(([metricId, path, valueType]) => createMetricValue(gpu, metricId, getPath(gpu, path), valueType, sourceIds))
    .filter(Boolean);
}

export function mapLegacyGpuToRankingScore(gpu) {
  assertLegacyGpu(gpu);

  return {
    id: `${gpu.id}:ranking:${GPU_RANKING_PROFILE_ID}`,
    itemId: gpu.id,
    rankingProfileId: GPU_RANKING_PROFILE_ID,
    score: gpu.performanceIndex,
    tierId: gpu.tier,
    confidence: mapRankingConfidence(gpu.confidence),
    formulaVersion: LEGACY_GPU_FORMULA_VERSION,
    updatedAt: LEGACY_IMPORT_TIMESTAMP
  };
}

export function mapLegacyGpuToSources(gpu) {
  assertLegacyGpu(gpu);

  return (gpu.sources || []).map((source, index) => ({
    id: `${gpu.id}:source:${index + 1}`,
    itemId: gpu.id,
    label: source.label,
    url: source.url,
    sourceType: inferSourceType(source),
    retrievedAt: LEGACY_IMPORT_TIMESTAMP
  }));
}

function createMetricValue(gpu, metricId, value, valueType, sourceIds) {
  if (value === null || value === undefined || value === "") return null;

  const metricValue = {
    id: `${gpu.id}:metric:${metricId}`,
    itemId: gpu.id,
    metricId,
    confidence: mapMetricConfidence(gpu.confidence),
    sourceIds,
    updatedAt: LEGACY_IMPORT_TIMESTAMP
  };

  if (valueType === "number") {
    metricValue.valueNumber = value;
    return metricValue;
  }

  if (valueType === "range") {
    const range = parseWattRange(value);
    if (!range) {
      metricValue.valueText = String(value);
      return metricValue;
    }
    metricValue.valueMin = range.min;
    metricValue.valueMax = range.max;
    metricValue.unit = "W";
    return metricValue;
  }

  if (valueType === "power-display") {
    metricValue.valueText = gpu.segment === "mobile" ? gpu.specs?.tgpRangeW : `${gpu.specs?.powerW}W`;
    return metricValue.valueText ? metricValue : null;
  }

  metricValue.valueText = String(value);
  return metricValue;
}

function parseWattRange(value) {
  const match = String(value).match(/^\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*W?\s*$/i);
  if (!match) return null;

  return {
    min: Number(match[1]),
    max: Number(match[2])
  };
}

function inferSourceType(source) {
  const label = source?.label?.toLowerCase() || "";
  if (label.includes("nvidia") || label.includes("amd") || label.includes("intel")) return "official";
  return "manual";
}

function mapMetricConfidence(confidence) {
  if (confidence === "aggregate" || confidence === "estimated" || confidence === "official") return confidence;
  return "unknown";
}

function mapRankingConfidence(confidence) {
  if (confidence === "aggregate" || confidence === "estimated") return confidence;
  return "manual";
}

function getPath(value, path) {
  return path.split(".").reduce((current, segment) => current?.[segment], value);
}

function assertLegacyGpu(gpu) {
  if (!gpu?.id) {
    throw new Error("legacy GPU record missing id");
  }
}
