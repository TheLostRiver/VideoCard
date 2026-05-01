import { formatNumber } from "../utils/format.js";

export function createComparisonService(repository) {
  if (!repository) throw new Error("comparison service requires a repository");

  async function compare(categoryId, itemIds) {
    if (!itemIds || itemIds.length < 2) {
      const error = new Error("comparison requires at least 2 items");
      error.errors = [error.message];
      throw error;
    }

    const category = await repository.getCategory(categoryId);
    if (!category) {
      const error = new Error(`category not found: ${categoryId}`);
      error.statusCode = 404;
      error.errors = [error.message];
      throw error;
    }

    const details = await Promise.all(
      itemIds.map((id) => repository.getItemDetail(id))
    );

    for (let i = 0; i < details.length; i++) {
      if (!details[i]) {
        const error = new Error(`item not found: ${itemIds[i]}`);
        error.statusCode = 404;
        error.errors = [error.message];
        throw error;
      }
      if (details[i].item.categoryId !== categoryId) {
        const error = new Error(
          `item ${itemIds[i]} belongs to category ${details[i].item.categoryId}, not ${categoryId}`
        );
        error.statusCode = 400;
        error.errors = [error.message];
        throw error;
      }
    }

    const presets = category.comparePresets || [];
    const metrics = category.metrics || [];
    const metricMap = new Map(metrics.map((m) => [m.id, m]));

    const groups = presets.map((preset) => ({
      id: preset.id,
      title: preset.label,
      rows: (preset.metricIds || []).map((metricId) =>
        buildCompareRow(metricId, metricMap.get(metricId), details)
      )
    }));

    return {
      categoryId,
      itemIds,
      groups
    };
  }

  return { compare };
}

function buildCompareRow(metricId, metricDef, details) {
  const values = details.map((detail) => {
    const raw = resolveMetricRawValue(detail, metricId);
    const displayValue = formatCompareValue(metricDef, raw);
    return {
      itemId: detail.item.id,
      displayValue,
      rawComparableValue: raw?.valueNumber ?? null
    };
  });

  markBestValues(values, metricDef);

  return {
    metricId,
    label: metricDef?.label || metricId,
    values
  };
}

function resolveMetricRawValue(detail, metricId) {
  if (metricId === "gpu.performance.index") {
    return { valueNumber: detail.rankingScore?.score };
  }
  return (detail.metricValues || []).find((mv) => mv.metricId === metricId) || null;
}

function formatCompareValue(metricDef, raw) {
  if (!raw || isEmptyValue(raw)) return "待补充";

  const formatterId = metricDef?.formatterId || "number";
  if (formatterId === "clock-mhz") return formatWithUnit(raw.valueNumber, "MHz");
  if (formatterId === "capacity-gb") return formatWithUnit(raw.valueNumber, "GB");
  if (formatterId === "bus-bit") return formatWithUnit(raw.valueNumber, "-bit", "");
  if (formatterId === "bandwidth-gbs") return formatWithUnit(raw.valueNumber, "GB/s");
  if (formatterId === "watts") return formatWithUnit(raw.valueNumber, "W", "");
  if (formatterId === "tgp-range") return formatRange(raw, "W");
  if (raw.valueNumber !== null && raw.valueNumber !== undefined) return formatNumber(raw.valueNumber);
  if (raw.valueText) return raw.valueText;
  return "待补充";
}

function formatWithUnit(value, unit, separator = " ") {
  if (value === null || value === undefined) return "待补充";
  return `${formatNumber(value)}${separator}${unit}`;
}

function formatRange(raw, unit) {
  if (raw.valueMin !== null && raw.valueMin !== undefined &&
      raw.valueMax !== null && raw.valueMax !== undefined) {
    return `${formatNumber(raw.valueMin)}-${formatNumber(raw.valueMax)}${unit}`;
  }
  if (raw.valueText) return raw.valueText;
  return "待补充";
}

function isEmptyValue(raw) {
  return raw.valueNumber === undefined
    && raw.valueText === undefined
    && raw.valueMin === undefined
    && raw.valueMax === undefined;
}

function markBestValues(values, metricDef) {
  const numericValues = values.filter((v) => v.rawComparableValue !== null && v.rawComparableValue !== undefined);
  if (numericValues.length < 2) return;

  const higherIsBetter = metricDef?.higherIsBetter !== false;
  let bestValue = numericValues[0].rawComparableValue;
  for (const v of numericValues) {
    if (higherIsBetter ? v.rawComparableValue > bestValue : v.rawComparableValue < bestValue) {
      bestValue = v.rawComparableValue;
    }
  }

  for (const v of numericValues) {
    if (v.rawComparableValue === bestValue) {
      v.isBest = true;
    }
  }
}
