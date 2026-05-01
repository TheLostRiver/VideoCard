import { formatNumber } from "../utils/format.js";

export function createHardwareQueryService(repository) {
  if (!repository) throw new Error("hardware query service requires a repository");

  async function getListViewModel(categoryId) {
    const category = await getRequiredCategory(repository, categoryId);
    const items = await repository.listItems({ categoryId });
    const details = await Promise.all(items.map((item) => repository.getItemDetail(item.id)));

    return {
      category: summarizeCategory(category),
      items: details.filter(Boolean).map((detail) => createListItemViewModel(category, detail))
    };
  }

  async function getDetailViewModel(itemId) {
    const detail = await repository.getItemDetail(itemId);
    if (!detail) return null;

    const category = await getRequiredCategory(repository, detail.item.categoryId);
    return {
      category: summarizeCategory(category),
      item: detail.item,
      metricValues: detail.metricValues,
      rankingScore: detail.rankingScore,
      sources: detail.sources,
      warnings: createWarnings(category, detail),
      groups: (category.detailView?.groups || []).map((group) => ({
        id: group.id,
        title: group.title,
        rows: (group.metricIds || []).map((metricId) => createDisplayField(category, detail, metricId))
      }))
    };
  }

  return {
    getListViewModel,
    getDetailViewModel
  };
}

async function getRequiredCategory(repository, categoryId) {
  const category = await repository.getCategory(categoryId);
  if (!category) throw new Error(`hardware category not found: ${categoryId}`);
  return category;
}

function createListItemViewModel(category, detail) {
  const listView = category.listView || {};
  const facts = (listView.subtitleFields || []).map((fieldId) => createDisplayField(category, detail, fieldId));
  const badge = createBadge(detail, listView.badgeField);

  return {
    id: detail.item.id,
    title: String(resolveRawField(detail, listView.titleField) ?? detail.item.name),
    subtitle: facts.map((fact) => fact.displayValue).filter(Boolean).join(" · "),
    badges: badge ? [badge] : [],
    facts,
    primaryScore: createDisplayField(category, detail, listView.scoreField),
    power: createDisplayField(category, detail, listView.powerField),
    recommendation: createDisplayField(category, detail, listView.recommendationField)
  };
}

function createBadge(detail, fieldId) {
  const value = resolveRawField(detail, fieldId);
  if (!value) return null;
  return { id: String(value), label: String(value) };
}

function createDisplayField(category, detail, fieldId) {
  const metric = getMetricDefinition(category, fieldId);
  const value = resolveValue(detail, fieldId);

  return {
    id: fieldId,
    metricId: metric?.id,
    label: metric?.label || humanizeFieldId(fieldId),
    value: getPrimitiveValue(value),
    displayValue: formatDisplayValue(metric?.formatterId, value)
  };
}

function resolveValue(detail, fieldId) {
  if (!fieldId) return null;

  if (fieldId === "gpu.performance.index") {
    return { valueNumber: detail.rankingScore?.score };
  }

  const metricValue = detail.metricValues?.find((value) => value.metricId === fieldId);
  if (metricValue) return metricValue;

  const rawValue = resolveRawField(detail, fieldId);
  if (typeof rawValue === "number") return { valueNumber: rawValue };
  if (rawValue !== null && rawValue !== undefined && rawValue !== "") return { valueText: String(rawValue) };
  return null;
}

function resolveRawField(detail, fieldId) {
  if (!fieldId) return null;
  if (fieldId === "brand") return detail.item.manufacturerId;
  if (fieldId === "segment") return detail.item.marketSegmentIds?.[0];
  return getPath(detail.item, fieldId);
}

function getMetricDefinition(category, metricId) {
  return (category.metrics || []).find((metric) => metric.id === metricId);
}

function formatDisplayValue(formatterId, value) {
  if (!value || isEmptyValue(value)) return "待补充";

  if (formatterId === "clock-mhz") return formatNumberWithUnit(value.valueNumber, "MHz");
  if (formatterId === "capacity-gb") return formatNumberWithUnit(value.valueNumber, "GB");
  if (formatterId === "bus-bit") return formatNumberWithUnit(value.valueNumber, "-bit", "");
  if (formatterId === "bandwidth-gbs") return formatNumberWithUnit(value.valueNumber, "GB/s");
  if (formatterId === "watts") return formatNumberWithUnit(value.valueNumber, "W", "");
  if (formatterId === "tgp-range") return formatRange(value, "W");
  if (formatterId === "index" || formatterId === "number" || formatterId === "benchmark-score") {
    return value.valueNumber === null || value.valueNumber === undefined ? "待补充" : formatNumber(value.valueNumber);
  }

  return getTextValue(value);
}

function formatNumberWithUnit(value, unit, separator = " ") {
  if (value === null || value === undefined) return "待补充";
  return `${formatNumber(value)}${separator}${unit}`;
}

function formatRange(value, unit) {
  if (value.valueMin !== null && value.valueMin !== undefined && value.valueMax !== null && value.valueMax !== undefined) {
    return `${formatNumber(value.valueMin)}-${formatNumber(value.valueMax)}${unit}`;
  }
  return getTextValue(value);
}

function getTextValue(value) {
  if (value.valueText !== null && value.valueText !== undefined && value.valueText !== "") return value.valueText;
  if (value.valueNumber !== null && value.valueNumber !== undefined) return formatNumber(value.valueNumber);
  return "待补充";
}

function getPrimitiveValue(value) {
  if (!value) return null;
  if (value.valueNumber !== undefined) return value.valueNumber;
  if (value.valueText !== undefined) return value.valueText;
  if (value.valueMin !== undefined || value.valueMax !== undefined) {
    return { min: value.valueMin, max: value.valueMax, unit: value.unit };
  }
  return null;
}

function isEmptyValue(value) {
  return value.valueNumber === undefined
    && value.valueText === undefined
    && value.valueMin === undefined
    && value.valueMax === undefined;
}

function createWarnings(category, detail) {
  return (category.detailView?.warnings || [])
    .filter((rule) => matchesWarningRule(rule, detail))
    .map((rule) => ({
      id: rule.id,
      severity: rule.severity || "warning",
      message: rule.message
    }));
}

function matchesWarningRule(rule, detail) {
  const when = rule.when || {};
  if (when.marketSegmentId && !detail.item.marketSegmentIds?.includes(when.marketSegmentId)) return false;
  if (when.categoryId && detail.item.categoryId !== when.categoryId) return false;
  return true;
}

function summarizeCategory(category) {
  return {
    id: category.id,
    label: category.label,
    description: category.description,
    itemName: category.itemName
  };
}

function humanizeFieldId(fieldId) {
  return String(fieldId || "field").split(".").at(-1);
}

function getPath(value, path) {
  return String(path || "").split(".").reduce((current, segment) => current?.[segment], value);
}
