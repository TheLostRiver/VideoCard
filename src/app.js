import { BRANDS, SEGMENTS, SORT_OPTIONS, TIERS } from "./data/constants.js";
import { gpus } from "./data/gpus.js";
import { createHardwareQueryService } from "./application/hardware-query-service.js";
import { filterGpus, sortGpus } from "./utils/filters.js";
import { formatBenchmark, formatClock, formatMemory, formatNumber, formatPower } from "./utils/format.js";
import { getMaxPerformanceIndex, getPerformanceWidth, groupByTier } from "./utils/performance.js";

export function createInitialState(hash = "", fallbackId = gpus[0]?.id || "") {
  const hashId = hash.replace(/^#/, "");
  return {
    query: "",
    brands: new Set(),
    segments: new Set(),
    generations: new Set(),
    sortBy: "performance",
    selectedId: hashId || fallbackId,
    drawerOpen: Boolean(hashId)
  };
}

export function shouldShowMobileDrawer(gpu, state) {
  return Boolean(gpu && state.drawerOpen);
}

export function getUniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort();
}

export async function createGpuPageHardwareModel(options = {}) {
  const repository = options.repository || await createDefaultHardwareRepository();
  const service = options.service || createHardwareQueryService(repository);
  const listViewModel = await service.getListViewModel("gpu");
  const detailViewModels = new Map();

  await Promise.all(listViewModel.items.map(async (item) => {
    detailViewModels.set(item.id, await service.getDetailViewModel(item.id));
  }));

  return {
    listViewModel,
    getDetailViewModel(id) {
      return detailViewModels.get(id) || null;
    }
  };
}

export function searchHardwareListItems(items = [], query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((item) => getHardwareListSearchText(item).includes(normalizedQuery));
}

async function createDefaultHardwareRepository() {
  const { createJsonHardwareRepository } = await import("./infrastructure/json/json-hardware-repository.js");
  return createJsonHardwareRepository();
}

function getHardwareListSearchText(item) {
  return [
    item.title,
    item.subtitle,
    item.primaryScore?.displayValue,
    item.power?.displayValue,
    item.recommendation?.displayValue,
    ...(item.badges || []).flatMap((badge) => [badge.id, badge.label]),
    ...(item.facts || []).flatMap((fact) => [fact.label, fact.displayValue])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function renderFilterChips(items = gpus) {
  return [
    ...Object.entries(BRANDS).map(([value, meta]) => renderChip("brands", value, meta.label)),
    ...Object.entries(SEGMENTS).map(([value, label]) => renderChip("segments", value, label)),
    ...getUniqueValues(items, "generation").map((value) => renderChip("generations", value, value))
  ].join("");
}

export function renderSortOptions() {
  return Object.entries(SORT_OPTIONS)
    .map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
    .join("");
}

export function renderChip(type, value, label) {
  return `<button class="filter-chip" type="button" data-filter-type="${escapeHtml(type)}" data-filter-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
}

export function renderLadderMarkup(items, maxIndex, selectedId) {
  if (!items.length) return `<div class="empty-state">没有匹配的显卡</div>`;

  return groupByTier(items).map(([tier, tierItems]) => {
    const tierMeta = TIERS[tier];
    return `
      <section class="tier-group">
        <header class="tier-header">
          <h2>${escapeHtml(tierMeta?.label || tier)}</h2>
          <span>${escapeHtml(tierMeta?.hint || "")}</span>
        </header>
        <div class="gpu-rows">
          ${tierItems.map((gpu) => renderGpuRow(gpu, maxIndex, selectedId)).join("")}
        </div>
      </section>
    `;
  }).join("");
}

export function renderGpuRow(gpu, maxIndex, selectedId = "") {
  const brand = BRANDS[gpu.brand];
  const width = getPerformanceWidth(gpu.performanceIndex, maxIndex);
  const selectedClass = selectedId === gpu.id ? " is-selected" : "";

  return `
    <article class="gpu-row${selectedClass}" data-gpu-id="${escapeHtml(gpu.id)}" style="--brand:${brand.color}">
      <div class="gpu-main">
        <strong>${escapeHtml(gpu.name)}</strong>
        <span class="gpu-meta">${escapeHtml(brand.label)} · ${escapeHtml(gpu.generation)} · ${escapeHtml(formatMemory(gpu))}</span>
      </div>
      <span class="segment-badge ${escapeHtml(gpu.segment)}">${escapeHtml(SEGMENTS[gpu.segment])}</span>
      <div class="perf-cell">
        <span>${escapeHtml(gpu.performanceIndex)}</span>
        <div class="perf-track"><div style="width:${width}%"></div></div>
      </div>
      <span class="power-cell">${escapeHtml(formatPower(gpu))}</span>
      <span class="resolution-cell">${escapeHtml(gpu.gaming.recommendedResolution)}</span>
    </article>
  `;
}

export function renderDetailMarkup(gpu) {
  if (!gpu) return `<p class="muted">请选择显卡</p>`;

  const mobileWarning = gpu.segment === "mobile"
    ? `<p class="warning">移动版性能受 TGP、散热和厂商调校影响，不能直接等同桌面版。</p>`
    : "";

  return `
    <div class="detail-heading" style="--brand:${BRANDS[gpu.brand].color}">
      <span class="brand-dot"></span>
      <div>
        <h2>${escapeHtml(gpu.name)}</h2>
        <p>${escapeHtml(BRANDS[gpu.brand].label)} · ${escapeHtml(SEGMENTS[gpu.segment])} · ${escapeHtml(gpu.architecture)}</p>
      </div>
    </div>
    ${mobileWarning}
    ${detailSection("概览", [
      ["综合性能指数", gpu.performanceIndex],
      ["发布时间", gpu.releaseDate],
      ["推荐分辨率", gpu.gaming.recommendedResolution],
      ["可信度", gpu.confidence]
    ])}
    ${detailSection("核心规格", [
      [gpu.specs.coresLabel, formatNumber(gpu.specs.cores)],
      ["基础频率", formatClock(gpu.specs.baseClockMHz)],
      ["加速频率", formatClock(gpu.specs.boostClockMHz)]
    ])}
    ${detailSection("显存与功耗", [
      ["显存", formatMemory(gpu)],
      ["位宽", gpu.specs.memoryBusBit ? `${gpu.specs.memoryBusBit}-bit` : "待补充"],
      ["带宽", gpu.specs.bandwidthGBs ? `${gpu.specs.bandwidthGBs} GB/s` : "待补充"],
      [gpu.segment === "mobile" ? "TGP 范围" : "功耗", formatPower(gpu)]
    ])}
    ${detailSection("跑分参考", [
      ["Time Spy Graphics", formatBenchmark(gpu.benchmarks.timeSpyGraphics)],
      ["Steel Nomad Graphics", formatBenchmark(gpu.benchmarks.steelNomadGraphics)],
      ["PassMark G3D", formatBenchmark(gpu.benchmarks.passMarkG3D)]
    ])}
    <div class="note-list">${(gpu.notes || []).map((note) => `<span>${escapeHtml(note)}</span>`).join("")}</div>
  `;
}

export function detailSection(title, rows) {
  return `
    <section class="detail-section">
      <h3>${escapeHtml(title)}</h3>
      ${rows.map(([label, value]) => `<div class="detail-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
    </section>
  `;
}

export function initApp({ doc = document, win = window, data = gpus } = {}) {
  const elements = getElements(doc);
  const state = createInitialState(win.location.hash, data[0]?.id || "");

  function renderControls() {
    elements.sortSelect.innerHTML = renderSortOptions();
    elements.sortSelect.value = state.sortBy;
    elements.filterBar.innerHTML = renderFilterChips(data);
  }

  function bindEvents() {
    elements.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      state.drawerOpen = false;
      render();
    });

    elements.sortSelect.addEventListener("change", (event) => {
      state.sortBy = event.target.value;
      state.drawerOpen = false;
      render();
    });

    elements.filterBar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter-type]");
      if (!button) return;

      const set = state[button.dataset.filterType];
      const value = button.dataset.filterValue;
      if (set.has(value)) set.delete(value);
      else set.add(value);
      state.drawerOpen = false;
      render();
    });

    elements.resetButton.addEventListener("click", () => {
      state.query = "";
      state.brands.clear();
      state.segments.clear();
      state.generations.clear();
      state.drawerOpen = false;
      elements.searchInput.value = "";
      render();
    });

    win.addEventListener("hashchange", () => {
      const id = win.location.hash.replace(/^#/, "");
      if (data.some((gpu) => gpu.id === id)) {
        state.selectedId = id;
        state.drawerOpen = true;
        render();
      }
    });
  }

  function updateControlState() {
    doc.querySelectorAll("[data-filter-type]").forEach((button) => {
      const active = state[button.dataset.filterType].has(button.dataset.filterValue);
      button.classList.toggle("is-active", active);
    });

    const hasFilters = state.query || state.brands.size || state.segments.size || state.generations.size;
    elements.resetButton.hidden = !hasFilters;
  }

  function selectGpu(id) {
    state.selectedId = id;
    state.drawerOpen = true;
    if (win.location.hash !== `#${id}`) win.history.replaceState(null, "", `#${id}`);
    render();
  }

  function renderLadder(items, maxIndex) {
    elements.ladderList.innerHTML = renderLadderMarkup(items, maxIndex, state.selectedId);
    elements.ladderList.querySelectorAll("[data-gpu-id]").forEach((row) => {
      row.addEventListener("click", () => selectGpu(row.dataset.gpuId));
    });
  }

  function renderDetails(gpu) {
    const html = renderDetailMarkup(gpu);
    elements.detailPanel.innerHTML = html;

    if (!gpu) {
      elements.mobileDrawer.hidden = true;
      elements.mobileDrawer.innerHTML = "";
      return;
    }

    elements.mobileDrawer.innerHTML = `${html}<button class="ghost-button drawer-close" type="button">关闭</button>`;
    elements.mobileDrawer.hidden = !shouldShowMobileDrawer(gpu, state);
    elements.mobileDrawer.querySelector(".drawer-close").addEventListener("click", () => {
      state.drawerOpen = false;
      elements.mobileDrawer.hidden = true;
    });
  }

  function render() {
    updateControlState();
    const filtered = sortGpus(filterGpus(data, state), state.sortBy);
    const maxIndex = getMaxPerformanceIndex(data);
    const selectedGpu = data.find((gpu) => gpu.id === state.selectedId) || filtered[0];
    renderLadder(filtered, maxIndex);
    renderDetails(selectedGpu);
  }

  renderControls();
  bindEvents();
  render();

  return { elements, render, state };
}

function getElements(doc) {
  return {
    searchInput: doc.querySelector("#searchInput"),
    filterBar: doc.querySelector("#filterBar"),
    sortSelect: doc.querySelector("#sortSelect"),
    resetButton: doc.querySelector("#resetButton"),
    ladderList: doc.querySelector("#ladderList"),
    detailPanel: doc.querySelector("#detailPanel"),
    mobileDrawer: doc.querySelector("#mobileDrawer")
  };
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
  initApp();
}
