import { BRANDS, SEGMENTS, TIERS } from "./data/constants.js";
import { renderSchemaForm } from "./features/schema-form/render-schema-form.js";
import { mapLegacyGpuToMetricValues } from "../scripts/import-legacy-gpus.mjs";

const numberFields = new Set([
  "performanceIndex",
  "specs.cores",
  "specs.baseClockMHz",
  "specs.boostClockMHz",
  "specs.memorySizeGB",
  "specs.memoryBusBit",
  "specs.bandwidthGBs",
  "specs.powerW",
  "benchmarks.timeSpyGraphics",
  "benchmarks.steelNomadGraphics",
  "benchmarks.passMarkG3D"
]);

const requiredNumberFields = new Set(["performanceIndex"]);
const schemaMetricFieldPaths = new Map([
  ["gpu.release.date", "releaseDate"],
  ["gpu.performance.index", "performanceIndex"],
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

const allFacetValue = "all";
const adminManufacturerLabels = {
  amd: "AMD",
  apple: "Apple",
  intel: "Intel",
  mediatek: "MediaTek",
  nvidia: "NVIDIA",
  qualcomm: "Qualcomm",
  samsung: "Samsung"
};
const manufacturerSortOrder = ["nvidia", "amd", "intel", "qualcomm", "mediatek", "samsung", "apple"];
const gpuSeriesSortOrder = [
  "RTX 50",
  "RTX 40",
  "RTX 30",
  "RTX 20",
  "GTX 16",
  "GTX 10",
  "RX 9000",
  "RX 8000",
  "RX 7000",
  "RX 6000",
  "RX 5000",
  "RX 500",
  "Arc B",
  "Arc A"
];
const naturalCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const adminFacetConfigs = [
  {
    id: "manufacturer",
    label: "品牌",
    getValue: (item) => getAdminItemManufacturer(item),
    getLabel: (value) => formatManufacturerLabel(value)
  },
  {
    id: "series",
    label: "系列 / 代际",
    getValue: (item, categoryId) => getAdminItemSeries(item, categoryId),
    getLabel: (value) => value
  }
];

export function filterAdminGpus(items, query, facets = {}) {
  return filterAdminCollection(items, query, facets, "gpu");
}

export function filterAdminItems(items, query, facets = {}, categoryId = "hardware") {
  return filterAdminCollection(items, query, facets, categoryId);
}

export function createAdminFacetGroups(items, categoryId = "gpu", selectedFacets = {}, query = "") {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const textFilteredItems = items.filter((item) => matchesAdminQuery(item, terms, categoryId));

  return adminFacetConfigs.map((config) => {
    const otherFacetValues = { ...selectedFacets, [config.id]: allFacetValue };
    const sourceItems = applyAdminFacetFilters(textFilteredItems, otherFacetValues, categoryId);
    const counts = new Map();

    for (const item of sourceItems) {
      const value = normalizeFacetValue(config.getValue(item, categoryId));
      if (!value) continue;
      counts.set(value, (counts.get(value) || 0) + 1);
    }

    const options = sortAdminFacetOptions(
      [...counts.entries()].map(([value, count]) => ({
        value,
        label: config.getLabel(value),
        count
      })),
      config.id,
      categoryId
    );

    return {
      id: config.id,
      label: config.label,
      options: [
        { value: allFacetValue, label: "全部", count: sourceItems.length },
        ...options
      ]
    };
  }).filter((group) => group.options.length > 1);
}

export function renderAdminFacets(groups, selectedFacets = {}) {
  if (!groups.length) return "";

  return groups.map((group) => `
    <section class="admin-facet-group" aria-label="${escapeHtml(group.label)}">
      <div class="admin-facet-label">${escapeHtml(group.label)}</div>
      <div class="admin-facet-chips">
        ${group.options.map((option) => renderAdminFacetChip(group.id, option, selectedFacets[group.id])).join("")}
      </div>
    </section>
  `).join("");
}

function renderAdminFacetChip(groupId, option, selectedValue) {
  const isActive = normalizeSelectedFacet(selectedValue) === normalizeSelectedFacet(option.value);

  return `
    <button
      class="admin-facet-chip${isActive ? " is-active" : ""}"
      type="button"
      data-admin-facet="${escapeHtml(groupId)}"
      data-admin-facet-value="${escapeHtml(option.value)}"
      aria-pressed="${isActive ? "true" : "false"}"
    >
      ${escapeHtml(option.label)}
      <span>${escapeHtml(option.count)}</span>
    </button>
  `;
}

function filterAdminCollection(items, query, facets, categoryId) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const textFilteredItems = items.filter((item) => matchesAdminQuery(item, terms, categoryId));
  return applyAdminFacetFilters(textFilteredItems, facets, categoryId);
}

function matchesAdminQuery(item, terms, categoryId) {
  if (!terms.length) return true;

  const manufacturer = getAdminItemManufacturer(item);
  const haystack = [
    item.id,
    getAdminItemTitle(item),
    item.name,
    item.title,
    manufacturer,
    formatManufacturerLabel(manufacturer),
    item.brand,
    BRANDS[item.brand]?.label,
    item.manufacturerId,
    item.segment,
    SEGMENTS[item.segment],
    item.generation,
    item.architecture,
    item.subtitle,
    getAdminItemSeries(item, categoryId),
    ...(item.facts || []).flatMap((fact) => [fact.label, fact.displayValue]),
    ...(item.badges || []).map((badge) => badge.label)
  ].join(" ").toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

function applyAdminFacetFilters(items, facets = {}, categoryId = "hardware") {
  const selectedManufacturer = normalizeSelectedFacet(facets.manufacturer);
  const selectedSeries = normalizeSelectedFacet(facets.series);

  return items.filter((item) => {
    if (selectedManufacturer !== allFacetValue) {
      const manufacturer = normalizeSelectedFacet(getAdminItemManufacturer(item));
      if (manufacturer !== selectedManufacturer) return false;
    }

    if (selectedSeries !== allFacetValue) {
      const series = normalizeSelectedFacet(getAdminItemSeries(item, categoryId));
      if (series !== selectedSeries) return false;
    }

    return true;
  });
}

function sortAdminFacetOptions(options, facetId, categoryId) {
  return [...options].sort((a, b) => {
    if (facetId === "manufacturer") {
      return getManufacturerSortIndex(a.value) - getManufacturerSortIndex(b.value)
        || naturalCollator.compare(a.label, b.label);
    }

    if (facetId === "series") {
      return getAdminSeriesSortIndex(a.value, categoryId) - getAdminSeriesSortIndex(b.value, categoryId)
        || b.count - a.count
        || naturalCollator.compare(a.label, b.label);
    }

    return naturalCollator.compare(a.label, b.label);
  });
}

function getManufacturerSortIndex(value) {
  const index = manufacturerSortOrder.indexOf(String(value).toLowerCase());
  return index === -1 ? manufacturerSortOrder.length : index;
}

function getGpuSeriesSortIndex(value) {
  const index = gpuSeriesSortOrder.findIndex((series) => series.toLowerCase() === String(value).toLowerCase());
  return index === -1 ? gpuSeriesSortOrder.length : index;
}

function getAdminSeriesSortIndex(value, categoryId) {
  if (categoryId === "gpu") return getGpuSeriesSortIndex(value);

  const text = String(value || "").trim();
  const intelGeneration = text.match(/^(\d+)(?:st|nd|rd|th)\s+Gen$/i);
  if (intelGeneration) return 100 - Number(intelGeneration[1]);

  const ryzenGeneration = text.match(/^Ryzen\s+(\d{4})$/i);
  if (ryzenGeneration) return 200 - Number(ryzenGeneration[1]) / 100;

  const appleMGeneration = text.match(/^M(\d+)/i);
  if (appleMGeneration) return 300 - Number(appleMGeneration[1]);

  const snapdragonGeneration = text.match(/^Snapdragon\s+(\d+)/i);
  if (snapdragonGeneration) return 400 - Number(snapdragonGeneration[1]);

  const dimensityGeneration = text.match(/^Dimensity\s+(\d+)/i);
  if (dimensityGeneration) return 500 - Number(dimensityGeneration[1]) / 100;

  return 1000;
}

function getAdminItemTitle(item) {
  return String(item.name || item.title || item.id || "");
}

function getAdminItemManufacturer(item) {
  return normalizeFacetValue(item.brand || item.manufacturerId || getFactDisplayValue(item, "brand") || getSubtitlePart(item, 0));
}

function getAdminItemSeries(item, categoryId) {
  if (categoryId === "gpu") return deriveGpuSeries(item);
  return normalizeFacetValue(item.generation || getFactDisplayValue(item, "generation") || getSubtitlePart(item, 1));
}

function deriveGpuSeries(item) {
  const rawGeneration = normalizeFacetValue(item.generation || getFactDisplayValue(item, "generation"));
  const directSeries = normalizeKnownGpuSeries(rawGeneration);
  if (directSeries) return directSeries;

  const inferredSeries = normalizeKnownGpuSeries([
    item.name,
    item.title,
    item.id,
    rawGeneration
  ].filter(Boolean).join(" "));

  return inferredSeries || rawGeneration;
}

function normalizeKnownGpuSeries(value) {
  const text = String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const upper = text.toUpperCase();
  if (!upper) return "";

  const rtx = upper.match(/\bRTX\s*(50|40|30|20)(?:\d{2})?\b/);
  if (rtx) return `RTX ${rtx[1]}`;

  const gtx = upper.match(/\bGTX\s*(16|10)(?:\d{2})?\b/);
  if (gtx) return `GTX ${gtx[1]}`;

  const rxFourDigit = upper.match(/\bRX\s*([5-9])\d{3}\b/);
  if (rxFourDigit) return `RX ${rxFourDigit[1]}000`;

  const rxThreeDigit = upper.match(/\bRX\s*([4-9])\d{2}\b/);
  if (rxThreeDigit) return `RX ${rxThreeDigit[1]}00`;

  const arc = upper.match(/\bARC\s*([AB])(?:\d{3})?\b/);
  if (arc) return `Arc ${arc[1]}`;

  return "";
}

function getFactDisplayValue(item, id) {
  const fact = (item.facts || []).find((entry) => entry.id === id || entry.metricId === id);
  return normalizeFacetValue(fact?.displayValue);
}

function getSubtitlePart(item, index) {
  return normalizeFacetValue(String(item.subtitle || "").split("·")[index]);
}

function normalizeFacetValue(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized || normalized === "待补全") return "";
  return normalized;
}

function normalizeSelectedFacet(value) {
  return String(value || allFacetValue).trim().toLowerCase() || allFacetValue;
}

function formatManufacturerLabel(value) {
  const key = String(value || "").toLowerCase();
  return adminManufacturerLabels[key] || BRANDS[key]?.label || toTitleCase(value);
}

function toTitleCase(value) {
  return String(value || "").replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function getAdminItemMeta(item, categoryId) {
  const manufacturer = formatManufacturerLabel(getAdminItemManufacturer(item));
  const series = getAdminItemSeries(item, categoryId);
  const extraFacts = (item.facts || [])
    .filter((fact) => fact.id !== "brand" && fact.id !== "generation")
    .map((fact) => normalizeFacetValue(fact.displayValue))
    .filter(Boolean);

  if (categoryId === "gpu") {
    return [
      manufacturer,
      SEGMENTS[item.segment] || item.segment,
      series
    ].filter(Boolean);
  }

  return [
    manufacturer,
    series,
    ...extraFacts.slice(0, 1)
  ].filter(Boolean);
}

function createDefaultAdminFacets() {
  return {
    manufacturer: allFacetValue,
    series: allFacetValue
  };
}

function reconcileAdminFacets(facets, groups) {
  const nextFacets = { ...createDefaultAdminFacets(), ...facets };

  for (const group of groups) {
    const selectedValue = normalizeSelectedFacet(nextFacets[group.id]);
    const hasSelectedValue = group.options.some((option) => normalizeSelectedFacet(option.value) === selectedValue);
    if (!hasSelectedValue) nextFacets[group.id] = allFacetValue;
  }

  return nextFacets;
}

function haveAdminFacetsChanged(current, next) {
  return adminFacetConfigs.some((config) => current[config.id] !== next[config.id]);
}

function createAdminStatusText(filteredCount, totalCount) {
  if (filteredCount === totalCount) return `已加载 ${totalCount} 条数据`;
  return `已显示 ${filteredCount} / ${totalCount} 条数据`;
}

export function renderAdminList(items, selectedId, categoryId = "gpu") {
  if (!items.length) return `<p class="empty-state">没有匹配的硬件</p>`;

  return items.map((item) => {
    const meta = getAdminItemMeta(item, categoryId).join(" · ");
    return `
    <button class="admin-list-item${item.id === selectedId ? " is-selected" : ""}" type="button" data-gpu-id="${escapeHtml(item.id)}">
      <strong>${escapeHtml(getAdminItemTitle(item))}</strong>
      ${meta ? `<span>${escapeHtml(meta)}</span>` : ""}
    </button>
  `;
  }).join("");
}

export function renderAdminEditor(gpu, schema) {
  if (!gpu) return `<p class="empty-state">请选择一张显卡。</p>`;
  if (schema) return renderSchemaAdminEditor(gpu, schema);

  return renderLegacyAdminEditor(gpu);
}

function renderSchemaAdminEditor(gpu, schema) {
  const mobileHint = gpu.segment === "mobile"
    ? `<p class="warning">移动版必须填写 TGP 范围；保存时会校验该字段。</p>`
    : "";
  const schemaBody = renderSchemaForm({ schema, detail: createSchemaAdminDetail(gpu) })
    .replace(/^\s*<form[^>]*>/, "")
    .replace(/<\/form>\s*$/, "");

  return `
    <form id="gpuForm" class="admin-form schema-form" data-category-id="${escapeHtml(schema.id)}">
      ${renderAdminHeading(gpu)}
      ${mobileHint}
      <div class="admin-form-sections">
        ${schemaBody}
      </div>
      <div id="adminFormMessage" class="admin-form-message" role="status"></div>
    </form>
  `;
}

function renderLegacyAdminEditor(gpu) {
  const value = stringifyGpuForForm(gpu);
  const mobileHint = gpu.segment === "mobile"
    ? `<p class="warning">移动版必须填写 TGP 范围；保存时会校验该字段。</p>`
    : "";

  return `
    <form id="gpuForm" class="admin-form">
      ${renderAdminHeading(gpu)}
      ${mobileHint}
      <div class="admin-form-sections">
        ${fieldset("基础信息", [
          input("id", "ID", value.id, "text"),
          input("name", "名称", value.name, "text"),
          select("brand", "品牌", value.brand, labelOptions(BRANDS)),
          select("segment", "版本", value.segment, labelOptions(SEGMENTS)),
          input("generation", "世代", value.generation, "text"),
          input("architecture", "架构", value.architecture, "text"),
          input("releaseDate", "发布时间", value.releaseDate, "text"),
          input("performanceIndex", "性能指数", value.performanceIndex, "number"),
          select("tier", "层级", value.tier, labelOptions(TIERS)),
          select("confidence", "可信度", value.confidence, {
            aggregate: "aggregate",
            estimated: "estimated"
          })
        ])}
        ${fieldset("核心规格", [
          input("specs.coresLabel", "核心标签", value["specs.coresLabel"], "text"),
          input("specs.cores", "核心数量", value["specs.cores"], "number"),
          input("specs.baseClockMHz", "基础频率 MHz", value["specs.baseClockMHz"], "number"),
          input("specs.boostClockMHz", "加速频率 MHz", value["specs.boostClockMHz"], "number")
        ])}
        ${fieldset("显存与功耗", [
          input("specs.memorySizeGB", "显存 GB", value["specs.memorySizeGB"], "number"),
          input("specs.memoryType", "显存类型", value["specs.memoryType"], "text"),
          input("specs.memoryBusBit", "位宽 bit", value["specs.memoryBusBit"], "number"),
          input("specs.bandwidthGBs", "带宽 GB/s", value["specs.bandwidthGBs"], "number"),
          input("specs.powerW", "桌面功耗 W", value["specs.powerW"], "number"),
          input("specs.tgpRangeW", "移动版 TGP 范围", value["specs.tgpRangeW"], "text")
        ])}
        ${fieldset("跑分与游戏建议", [
          input("benchmarks.timeSpyGraphics", "Time Spy Graphics", value["benchmarks.timeSpyGraphics"], "number"),
          input("benchmarks.steelNomadGraphics", "Steel Nomad Graphics", value["benchmarks.steelNomadGraphics"], "number"),
          input("benchmarks.passMarkG3D", "PassMark G3D", value["benchmarks.passMarkG3D"], "number"),
          input("benchmarks.sourceNote", "跑分说明", value["benchmarks.sourceNote"], "text"),
          input("gaming.recommendedResolution", "推荐分辨率", value["gaming.recommendedResolution"], "text"),
          input("gaming.rayTracingLevel", "光追等级", value["gaming.rayTracingLevel"], "text"),
          input("gaming.efficiencyNote", "能效说明", value["gaming.efficiencyNote"], "text")
        ])}
        ${fieldset("备注与来源", [
          textarea("notesText", "备注，每行一条", value.notesText),
          textarea("sourcesText", "来源，每行格式：label|url", value.sourcesText)
        ])}
      </div>
      <div id="adminFormMessage" class="admin-form-message" role="status"></div>
    </form>
  `;
}

function renderAdminHeading(gpu) {
  return `
    <div class="admin-editor-heading">
      <div class="admin-editor-title">
        <h2>${escapeHtml(gpu.name)}</h2>
        <p>${escapeHtml(gpu.id)}</p>
      </div>
      <div class="admin-editor-actions">
        <button class="ghost-button save-button" type="submit">保存</button>
      </div>
    </div>
  `;
}

function createSchemaAdminDetail(gpu) {
  return {
    item: gpu,
    metricValues: [
      ...mapLegacyGpuToMetricValues(gpu),
      {
        id: `${gpu.id}:metric:gpu.performance.index`,
        itemId: gpu.id,
        metricId: "gpu.performance.index",
        valueNumber: gpu.performanceIndex
      }
    ]
  };
}

export function stringifyGpuForForm(gpu) {
  return {
    id: gpu.id,
    name: gpu.name,
    brand: gpu.brand,
    segment: gpu.segment,
    generation: gpu.generation,
    architecture: gpu.architecture,
    releaseDate: gpu.releaseDate,
    performanceIndex: stringifyValue(gpu.performanceIndex),
    tier: gpu.tier,
    confidence: gpu.confidence,
    "specs.coresLabel": gpu.specs?.coresLabel,
    "specs.cores": stringifyValue(gpu.specs?.cores),
    "specs.baseClockMHz": stringifyValue(gpu.specs?.baseClockMHz),
    "specs.boostClockMHz": stringifyValue(gpu.specs?.boostClockMHz),
    "specs.memorySizeGB": stringifyValue(gpu.specs?.memorySizeGB),
    "specs.memoryType": gpu.specs?.memoryType,
    "specs.memoryBusBit": stringifyValue(gpu.specs?.memoryBusBit),
    "specs.bandwidthGBs": stringifyValue(gpu.specs?.bandwidthGBs),
    "specs.powerW": stringifyValue(gpu.specs?.powerW),
    "specs.tgpRangeW": gpu.specs?.tgpRangeW || "",
    "benchmarks.timeSpyGraphics": stringifyValue(gpu.benchmarks?.timeSpyGraphics),
    "benchmarks.steelNomadGraphics": stringifyValue(gpu.benchmarks?.steelNomadGraphics),
    "benchmarks.passMarkG3D": stringifyValue(gpu.benchmarks?.passMarkG3D),
    "benchmarks.sourceNote": gpu.benchmarks?.sourceNote,
    "gaming.recommendedResolution": gpu.gaming?.recommendedResolution,
    "gaming.rayTracingLevel": gpu.gaming?.rayTracingLevel,
    "gaming.efficiencyNote": gpu.gaming?.efficiencyNote,
    notesText: (gpu.notes || []).join("\n"),
    sourcesText: (gpu.sources || []).map((source) => `${source.label}|${source.url}`).join("\n")
  };
}

export function buildGpuFromForm(original, fields) {
  const gpu = structuredClone(original);
  let notesText = fields.notesText;
  let sourcesText = fields.sourcesText;

  for (const [name, rawValue] of Object.entries(fields)) {
    const schemaField = parseSchemaFieldName(name);
    if (schemaField?.kind === "property") {
      if (schemaField.key === "notes") {
        notesText = rawValue;
        continue;
      }
      if (schemaField.key === "sources") {
        sourcesText = rawValue;
        continue;
      }
      setPath(gpu, schemaField.key, parseFieldValue(schemaField.key, rawValue));
      continue;
    }

    if (schemaField?.kind === "metric") {
      const legacyPath = schemaMetricFieldPaths.get(schemaField.key);
      if (legacyPath) setPath(gpu, legacyPath, parseFieldValue(legacyPath, rawValue));
      continue;
    }

    if (name === "notesText" || name === "sourcesText") continue;
    setPath(gpu, name, parseFieldValue(name, rawValue));
  }

  gpu.notes = parseLines(notesText);
  gpu.sources = parseLines(sourcesText).map((line) => {
    const [label, ...urlParts] = line.split("|");
    return { label: label.trim(), url: urlParts.join("|").trim() };
  }).filter((source) => source.label && source.url);

  return gpu;
}

export function getFormFields(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function renderNewEditor(categoryId, schema) {
  if (categoryId === "gpu") {
    const blankGpu = createBlankGpu();
    return renderLegacyAdminEditor(blankGpu).replace(
      '<button class="ghost-button save-button" type="submit">保存</button>',
      '<button class="ghost-button save-button" type="submit">创建</button>'
    );
  }

  if (!schema) return '<p class="empty-state">无法加载品类 schema。</p>';
  const blankDetail = createBlankDetail(categoryId, schema);
  return renderSchemaAdminEditorForNew(blankDetail, schema);
}

function createBlankGpu() {
  return {
    id: "",
    name: "",
    brand: "nvidia",
    segment: "desktop",
    generation: "",
    architecture: "",
    releaseDate: "",
    performanceIndex: 0,
    tier: "mainstream",
    confidence: "estimated",
    specs: { coresLabel: "" },
    benchmarks: {},
    gaming: {},
    notes: [],
    sources: []
  };
}

function createBlankDetail(categoryId, schema) {
  const item = {
    id: "",
    categoryId,
    name: "",
    manufacturerId: "",
    status: "draft"
  };

  const metricValues = (schema.metrics || []).map((metric) => {
    const mv = { metricId: metric.id };
    if (metric.valueType === "number") mv.valueNumber = null;
    else mv.valueText = "";
    return mv;
  });

  return { item, metricValues, rankingScore: { score: null }, sources: [] };
}

function renderSchemaAdminEditorForNew(detail, schema) {
  const schemaBody = renderSchemaForm({ schema, detail })
    .replace(/^\s*<form[^>]*>/, "")
    .replace(/<\/form>\s*$/, "");

  return `
    <form id="gpuForm" class="admin-form schema-form" data-category-id="${escapeHtml(schema.id)}">
      <div class="admin-editor-heading">
        <div class="admin-editor-title">
          <h2>新增 ${escapeHtml(schema.label || schema.id)}</h2>
          <p>填写新硬件信息</p>
        </div>
        <div class="admin-editor-actions">
          <button class="ghost-button save-button" type="submit">创建</button>
        </div>
      </div>
      <div class="admin-form-sections">
        ${schemaBody}
      </div>
      <div id="adminFormMessage" class="admin-form-message" role="status"></div>
    </form>
  `;
}

function renderSchemaAdminEditorForCategory(item, schema) {
  if (!item) return `<p class="empty-state">请选择一项。</p>`;
  if (!schema) return `<p class="empty-state">无法加载品类 schema。</p>`;

  const detail = buildDetailFromItem(item, schema);
  const schemaBody = renderSchemaForm({ schema, detail })
    .replace(/^\s*<form[^>]*>/, "")
    .replace(/<\/form>\s*$/, "");

  return `
    <form id="gpuForm" class="admin-form schema-form" data-category-id="${escapeHtml(schema.id)}">
      <div class="admin-editor-heading">
        <div class="admin-editor-title">
          <h2>${escapeHtml(item.name)}</h2>
          <p>${escapeHtml(item.id)}</p>
        </div>
        <div class="admin-editor-actions">
          <button class="ghost-button save-button" type="submit">保存</button>
        </div>
      </div>
      <div class="admin-form-sections">
        ${schemaBody}
      </div>
      <div id="adminFormMessage" class="admin-form-message" role="status"></div>
    </form>
  `;
}

function buildDetailFromItem(item, schema) {
  const metricValues = (schema.metrics || []).map((metric) => {
    const mv = { metricId: metric.id };
    if (metric.valueType === "number") mv.valueNumber = item.metrics?.[metric.id] ?? null;
    else mv.valueText = item.metrics?.[metric.id] ?? "";
    return mv;
  });
  return { item, metricValues, rankingScore: { score: item.performanceIndex }, sources: item.sources || [] };
}

function buildDetailForCategory(categoryId, original, fields, schema) {
  const item = original ? structuredClone(original) : { id: "", categoryId, name: "", manufacturerId: "", status: "draft" };
  const metricValues = [];
  let notesText = "";
  let sourcesText = "";

  for (const [name, rawValue] of Object.entries(fields)) {
    const schemaField = parseSchemaFieldName(name);
    if (schemaField?.kind === "property") {
      if (schemaField.key === "notes") { notesText = rawValue; continue; }
      if (schemaField.key === "sources") { sourcesText = rawValue; continue; }
      setPath(item, schemaField.key, rawValue);
      continue;
    }
    if (schemaField?.kind === "metric") {
      const metric = (schema?.metrics || []).find((m) => m.id === schemaField.key);
      const mv = { metricId: schemaField.key };
      if (metric?.valueType === "number") mv.valueNumber = rawValue === "" ? null : Number(rawValue);
      else mv.valueText = rawValue;
      metricValues.push(mv);
      continue;
    }
  }

  item.notes = parseLines(notesText);
  item.sources = parseLines(sourcesText).map((line) => {
    const [label, ...urlParts] = line.split("|");
    return { label: label.trim(), url: urlParts.join("|").trim() };
  }).filter((s) => s.label && s.url);

  const rankingScore = { score: item.performanceIndex ? Number(item.performanceIndex) : null };
  return { item, metricValues, rankingScore, sources: item.sources };
}

async function initAdmin() {
  const elements = {
    search: document.querySelector("#adminSearch"),
    categorySelect: document.querySelector("#adminCategorySelect"),
    newButton: document.querySelector("#adminNewButton"),
    facets: document.querySelector("#adminFacets"),
    list: document.querySelector("#adminList"),
    editor: document.querySelector("#adminEditor"),
    status: document.querySelector("#adminStatus")
  };

  const state = {
    categories: [],
    categoryId: "gpu",
    items: [],
    gpus: [],
    query: "",
    facets: createDefaultAdminFacets(),
    selectedId: "",
    creatingNew: false,
    schema: null
  };

  async function loadCategories() {
    const response = await fetch("/api/hardware/categories");
    const body = await response.json();
    state.categories = body.categories || [];
    elements.categorySelect.innerHTML = state.categories
      .map((cat) => `<option value="${escapeHtml(cat.id)}"${cat.id === state.categoryId ? " selected" : ""}>${escapeHtml(cat.label || cat.id)}</option>`)
      .join("");
  }

  async function loadItems() {
    try {
      if (state.categoryId === "gpu") {
        const response = await fetch("/api/gpus");
        const body = await response.json();
        state.gpus = body.gpus;
        state.items = state.gpus;
      } else {
        const response = await fetch(`/api/hardware/${encodeURIComponent(state.categoryId)}/items`);
        const body = await response.json();
        state.items = (body.items || []).map((item) => ({ ...item, categoryId: state.categoryId }));
      }
      state.selectedId = state.items[0]?.id || "";
      state.creatingNew = false;
      elements.status.textContent = `已加载 ${state.items.length} 条数据`;
      render();
    } catch (error) {
      elements.status.textContent = `加载失败：${error.message}`;
    }
  }

  async function loadSchema() {
    const category = state.categories.find((cat) => cat.id === state.categoryId);
    state.schema = category || null;
  }

  function render() {
    let facetGroups = createAdminFacetGroups(state.items, state.categoryId, state.facets, state.query);
    const reconciledFacets = reconcileAdminFacets(state.facets, facetGroups);
    if (haveAdminFacetsChanged(state.facets, reconciledFacets)) {
      state.facets = reconciledFacets;
      facetGroups = createAdminFacetGroups(state.items, state.categoryId, state.facets, state.query);
    }

    const filtered = state.categoryId === "gpu"
      ? filterAdminGpus(state.items, state.query, state.facets)
      : filterAdminItems(state.items, state.query, state.facets, state.categoryId);
    if (!state.creatingNew && !filtered.some((item) => item.id === state.selectedId)) {
      state.selectedId = filtered[0]?.id || state.items[0]?.id || "";
    }
    elements.facets.innerHTML = renderAdminFacets(facetGroups, state.facets);
    elements.status.textContent = createAdminStatusText(filtered.length, state.items.length);
    elements.list.innerHTML = renderAdminList(filtered, state.selectedId, state.categoryId);

    if (state.creatingNew) {
      elements.editor.innerHTML = renderNewEditor(state.categoryId, state.schema);
    } else {
      const selectedItem = state.items.find((item) => item.id === state.selectedId);
      if (state.categoryId === "gpu") {
        elements.editor.innerHTML = renderAdminEditor(selectedItem, state.schema);
      } else {
        elements.editor.innerHTML = renderSchemaAdminEditorForCategory(selectedItem, state.schema);
      }
    }
  }

  elements.categorySelect.addEventListener("change", async (event) => {
    state.categoryId = event.target.value;
    state.query = "";
    state.facets = createDefaultAdminFacets();
    elements.search.value = "";
    await loadSchema();
    await loadItems();
  });

  elements.newButton.addEventListener("click", () => {
    state.creatingNew = true;
    state.selectedId = "";
    render();
  });

  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  elements.facets.addEventListener("click", (event) => {
    const button = event.target.closest("[data-admin-facet]");
    if (!button) return;
    state.facets = {
      ...state.facets,
      [button.dataset.adminFacet]: button.dataset.adminFacetValue || allFacetValue
    };
    render();
  });

  elements.list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gpu-id]");
    if (!button) return;
    state.selectedId = button.dataset.gpuId;
    state.creatingNew = false;
    render();
  });

  elements.editor.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const message = form.querySelector("#adminFormMessage");
    const categoryId = state.categoryId;

    message.textContent = "正在保存...";
    message.className = "admin-form-message";

    try {
      let response;
      if (state.creatingNew) {
        const detail = buildDetailForCategory(categoryId, null, getFormFields(form), state.schema);
        response = await fetch(`/api/admin/hardware/${encodeURIComponent(categoryId)}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(detail)
        });
      } else if (categoryId === "gpu") {
        const original = state.items.find((item) => item.id === state.selectedId);
        const nextGpu = buildGpuFromForm(original, getFormFields(form));
        response = await fetch(`/api/gpus/${encodeURIComponent(state.selectedId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextGpu)
        });
      } else {
        const original = state.items.find((item) => item.id === state.selectedId);
        const detail = buildDetailForCategory(categoryId, original, getFormFields(form), state.schema);
        response = await fetch(`/api/admin/hardware/${encodeURIComponent(categoryId)}/items/${encodeURIComponent(state.selectedId)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(detail)
        });
      }

      const body = await response.json();
      if (!response.ok) throw new Error((body.errors || ["保存失败"]).join("；"));

      if (state.creatingNew) {
        state.creatingNew = false;
        await loadItems();
        const savedId = body.detail?.item?.id || body.gpu?.id;
        if (savedId) state.selectedId = savedId;
        message.textContent = "新增成功。";
      } else if (categoryId === "gpu") {
        const index = state.items.findIndex((item) => item.id === state.selectedId);
        state.items[index] = body.gpu;
        state.gpus = state.items;
        message.textContent = "已保存。刷新前台页面即可看到最新参数。";
      } else {
        const index = state.items.findIndex((item) => item.id === state.selectedId);
        if (index !== -1) state.items[index] = { ...body.detail.item, categoryId };
        message.textContent = "已保存。刷新前台页面即可看到最新参数。";
      }

      message.classList.add("is-success");
      render();
      elements.status.textContent = `已保存`;
    } catch (error) {
      message.textContent = error.message;
      message.classList.add("is-error");
    }
  });

  await loadCategories();
  await loadSchema();
  await loadItems();
}

function fieldset(title, fields) {
  return `
    <fieldset class="admin-fieldset">
      <legend>${escapeHtml(title)}</legend>
      <div class="admin-field-grid">${fields.join("")}</div>
    </fieldset>
  `;
}

function input(name, label, value, type) {
  return `
    <label class="admin-field">
      <span>${escapeHtml(label)}</span>
      <input name="${escapeHtml(name)}" type="${type}" value="${escapeHtml(value ?? "")}">
    </label>
  `;
}

function select(name, label, value, options) {
  return `
    <label class="admin-field">
      <span>${escapeHtml(label)}</span>
      <select name="${escapeHtml(name)}">
        ${Object.entries(options).map(([optionValue, optionLabel]) => `
          <option value="${escapeHtml(optionValue)}"${optionValue === value ? " selected" : ""}>${escapeHtml(optionLabel.label || optionLabel)}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function textarea(name, label, value) {
  return `
    <label class="admin-field admin-field-wide">
      <span>${escapeHtml(label)}</span>
      <textarea name="${escapeHtml(name)}" rows="4">${escapeHtml(value ?? "")}</textarea>
    </label>
  `;
}

function labelOptions(source) {
  return Object.fromEntries(Object.entries(source).map(([value, meta]) => [value, meta.label || meta]));
}

function parseFieldValue(name, rawValue) {
  if (!numberFields.has(name)) return rawValue;
  if (rawValue === "" && !requiredNumberFields.has(name)) return null;
  return Number(rawValue);
}

function parseSchemaFieldName(name) {
  const separatorIndex = name.indexOf(":");
  if (separatorIndex === -1) return null;

  const kind = name.slice(0, separatorIndex);
  const key = name.slice(separatorIndex + 1);
  if (kind !== "property" && kind !== "metric") return null;
  return { kind, key };
}

function parseLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function setPath(target, path, value) {
  const parts = path.split(".");
  let current = target;
  while (parts.length > 1) {
    const part = parts.shift();
    current[part] ||= {};
    current = current[part];
  }
  current[parts[0]] = value;
}

function stringifyValue(value) {
  return value === null || value === undefined ? "" : String(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

if (typeof document !== "undefined") {
  initAdmin();
}
