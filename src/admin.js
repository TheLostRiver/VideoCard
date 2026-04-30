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

export function filterAdminGpus(items, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return items;

  return items.filter((gpu) => {
    const haystack = [
      gpu.id,
      gpu.name,
      gpu.brand,
      BRANDS[gpu.brand]?.label,
      gpu.segment,
      SEGMENTS[gpu.segment],
      gpu.generation,
      gpu.architecture
    ].join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function renderAdminList(items, selectedId) {
  if (!items.length) return `<p class="empty-state">没有匹配的显卡</p>`;

  return items.map((gpu) => `
    <button class="admin-list-item${gpu.id === selectedId ? " is-selected" : ""}" type="button" data-gpu-id="${escapeHtml(gpu.id)}">
      <strong>${escapeHtml(gpu.name)}</strong>
      <span>${escapeHtml(BRANDS[gpu.brand]?.label || gpu.brand)} · ${escapeHtml(SEGMENTS[gpu.segment] || gpu.segment)} · ${escapeHtml(gpu.generation)}</span>
    </button>
  `).join("");
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
      ${schemaBody}
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
      <div class="admin-editor-heading">
        <div>
          <h2>${escapeHtml(gpu.name)}</h2>
          <p>${escapeHtml(gpu.id)}</p>
        </div>
        <button class="ghost-button save-button" type="submit">保存</button>
      </div>
      ${mobileHint}
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
      <div id="adminFormMessage" class="admin-form-message" role="status"></div>
    </form>
  `;
}

function renderAdminHeading(gpu) {
  return `
    <div class="admin-editor-heading">
      <div>
        <h2>${escapeHtml(gpu.name)}</h2>
        <p>${escapeHtml(gpu.id)}</p>
      </div>
      <button class="ghost-button save-button" type="submit">保存</button>
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

async function initAdmin() {
  const elements = {
    search: document.querySelector("#adminSearch"),
    list: document.querySelector("#adminList"),
    editor: document.querySelector("#adminEditor"),
    status: document.querySelector("#adminStatus")
  };

  const state = {
    gpus: [],
    query: "",
    selectedId: "",
    schema: null
  };

  async function load() {
    try {
      const [response, schemaResponse] = await Promise.all([
        fetch("/api/gpus"),
        fetch("/src/data/categories/gpu.schema.json")
      ]);
      const body = await response.json();
      state.gpus = body.gpus;
      state.schema = await schemaResponse.json();
      state.selectedId = state.gpus.find((gpu) => gpu.id === "rtx-4070-laptop")?.id || state.gpus[0]?.id || "";
      elements.status.textContent = `已加载 ${state.gpus.length} 张显卡`;
      render();
    } catch (error) {
      elements.status.textContent = `加载失败：${error.message}`;
    }
  }

  function render() {
    const filtered = filterAdminGpus(state.gpus, state.query);
    if (!filtered.some((gpu) => gpu.id === state.selectedId)) {
      state.selectedId = filtered[0]?.id || state.gpus[0]?.id || "";
    }
    elements.list.innerHTML = renderAdminList(filtered, state.selectedId);
    elements.editor.innerHTML = renderAdminEditor(state.gpus.find((gpu) => gpu.id === state.selectedId), state.schema);
  }

  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  elements.list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gpu-id]");
    if (!button) return;
    state.selectedId = button.dataset.gpuId;
    render();
  });

  elements.editor.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const message = form.querySelector("#adminFormMessage");
    const original = state.gpus.find((gpu) => gpu.id === state.selectedId);
    const nextGpu = buildGpuFromForm(original, getFormFields(form));

    message.textContent = "正在保存...";
    message.className = "admin-form-message";
    try {
      const response = await fetch(`/api/gpus/${encodeURIComponent(state.selectedId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextGpu)
      });
      const body = await response.json();
      if (!response.ok) throw new Error((body.errors || ["保存失败"]).join("；"));

      const index = state.gpus.findIndex((gpu) => gpu.id === state.selectedId);
      state.gpus[index] = body.gpu;
      state.selectedId = body.gpu.id;
      message.textContent = "已保存。刷新前台页面即可看到最新参数。";
      message.classList.add("is-success");
      render();
      elements.editor.querySelector("#adminFormMessage").textContent = "已保存。刷新前台页面即可看到最新参数。";
      elements.editor.querySelector("#adminFormMessage").classList.add("is-success");
      elements.status.textContent = `已保存 ${body.gpu.name}`;
    } catch (error) {
      message.textContent = error.message;
      message.classList.add("is-error");
    }
  });

  await load();
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
