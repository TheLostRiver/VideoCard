import { BRANDS, SEGMENTS, SORT_OPTIONS, TIERS } from "./data/constants.js";
import { gpus } from "./data/gpus.js";
import { createHardwareQueryService } from "./application/hardware-query-service.js";
import { createComparisonService } from "./application/comparison-service.js";
import { renderCompareTable } from "./features/compare/render-compare.js";
import { renderHardwareList } from "./features/hardware-list/render-list.js";
import { renderHardwareDetail } from "./features/hardware-detail/render-detail.js";
import { filterGpus, sortGpus } from "./utils/filters.js";
import { extractYear, getAvailableYears, filterByYears } from "./utils/year-filter.js";
import { formatBenchmark, formatClock, formatMemory, formatNumber, formatPower } from "./utils/format.js";
import { getMaxPerformanceIndex, getPerformanceWidth, groupByTier } from "./utils/performance.js";

export function createInitialState(hash = "", fallbackId = gpus[0]?.id || "") {
  const compareParams = parseCompareHash(hash);
  const hashId = hash.replace(/^#/, "");
  return {
    query: "",
    brands: new Set(),
    segments: new Set(),
    generations: new Set(),
    sortBy: "performance",
    selectedId: hashId || fallbackId,
    drawerOpen: Boolean(hashId),
    compareMode: Boolean(compareParams),
    compareParams
  };
}

export function shouldShowMobileDrawer(gpu, state) {
  return Boolean(gpu && state.drawerOpen);
}

export function getUniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort();
}

export async function fetchCategories() {
  const res = await fetch("/api/hardware/categories");
  const data = await res.json();
  return data.categories || [];
}

export async function fetchCategoryListViewModel(categoryId) {
  const res = await fetch(`/api/hardware/${categoryId}/items`);
  return res.json();
}

export async function fetchCategoryItemDetail(categoryId, itemId) {
  const res = await fetch(`/api/hardware/${categoryId}/items/${itemId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.detail || null;
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

export function parseCompareHash(hash) {
  const match = String(hash || "").match(/^#compare\/([^?]+)\?ids=(.+)$/);
  if (!match) return null;
  const categoryId = match[1];
  const itemIds = match[2].split(",").map((s) => s.trim()).filter(Boolean);
  if (itemIds.length < 2) return null;
  return { categoryId, itemIds };
}

export async function renderComparePage({ categoryId, itemIds, repository } = {}) {
  const repo = repository || await createDefaultHardwareRepository();
  const service = createComparisonService(repo);
  const viewModel = await service.compare(categoryId, itemIds);
  return renderCompareTable(viewModel);
}

export function renderFilterChips(items = gpus) {
  const brandChips = Object.entries(BRANDS).map(([value, meta]) => renderChip("brands", value, meta.label)).join("");
  const segmentChips = Object.entries(SEGMENTS).map(([value, label]) => renderChip("segments", value, label)).join("");
  const generations = getUniqueValues(items, "generation");
  const genChips = generations.map((value) => renderChip("generations", value, value)).join("");

  return `<div class="filter-group"><span class="filter-group-label">品牌</span><div class="filter-group-chips">${brandChips}</div></div>`
    + `<div class="filter-group"><span class="filter-group-label">类型</span><div class="filter-group-chips">${segmentChips}</div></div>`
    + `<div class="filter-group filter-group--gen"><span class="filter-group-label">架构<button class="gen-toggle" type="button" data-gen-toggle>▾</button></span><div class="filter-group-chips filter-gen-chips">${genChips}</div></div>`;
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

export function initApp({ doc = document, win = window, data = gpus, categories = [] } = {}) {
  const elements = getElements(doc);
  const state = createInitialState(win.location.hash, data[0]?.id || "");
  state.categoryId = "gpu";
  state.genericItems = [];
  state.genericDetail = null;
  state.selectedYears = new Set();
  state.showUnknownYears = false;

  function renderControls() {
    if (state.categoryId === "gpu") {
      elements.sortSelect.innerHTML = renderSortOptions();
      elements.sortSelect.value = state.sortBy;
      elements.filterBar.innerHTML = renderFilterChips(data);
      elements.sortSelect.parentElement.hidden = false;
      elements.filterBar.hidden = false;
    } else {
      elements.sortSelect.innerHTML = `<option value="score">按分数排序</option>`;
      elements.filterBar.innerHTML = "";
      elements.sortSelect.parentElement.hidden = true;
      elements.filterBar.hidden = true;
    }
  }

  function renderCategoryTabs() {
    if (!categories.length) return;
    elements.categoryTabs.innerHTML = categories.map((cat) =>
      `<button class="category-tab${cat.id === state.categoryId ? " is-active" : ""}" data-category-id="${escapeHtml(cat.id)}">${escapeHtml(cat.label)}</button>`
    ).join("");
    elements.categoryTabs.querySelectorAll("[data-category-id]").forEach((tab) => {
      tab.addEventListener("click", () => switchCategory(tab.dataset.categoryId));
    });
  }

  function getYearSourceItems() {
    if (state.categoryId === "gpu") return data;
    return state.genericItems;
  }

  function getReleaseDate(item) {
    if (state.categoryId === "gpu") return item.releaseDate;
    return item.releaseYear != null ? String(item.releaseYear) : null;
  }

  function renderYearFilter() {
    const items = getYearSourceItems();
    const years = getAvailableYears(items, getReleaseDate);
    if (!years.length && !state.showUnknownYears) {
      elements.yearFilter.hidden = true;
      return;
    }

    const chips = years.map((year) =>
      `<button class="year-chip${state.selectedYears.has(year) ? " is-active" : ""}" type="button" data-year="${year}">${year}</button>`
    ).join("");

    const toggle = `<span class="year-divider"></span><label class="year-toggle"><input type="checkbox" data-year-toggle${state.showUnknownYears ? " checked" : ""}>显示未知年份</label>`;

    elements.yearFilter.innerHTML = `<span class="year-label">年份:</span><button class="year-chip${state.selectedYears.size === 0 ? " is-active" : ""}" type="button" data-year="all">全部</button>${chips}${toggle}`;
    elements.yearFilter.hidden = false;
  }

  async function switchCategory(categoryId) {
    if (categoryId === state.categoryId) return;
    state.categoryId = categoryId;
    state.query = "";
    state.drawerOpen = false;
    state.genericDetail = null;
    state.selectedYears.clear();
    state.showUnknownYears = false;
    elements.searchInput.value = "";

    renderCategoryTabs();
    renderControls();

    if (categoryId === "gpu") {
      state.selectedId = data[0]?.id || "";
      renderYearFilter();
      renderGpuMode();
    } else {
      const listVm = await fetchCategoryListViewModel(categoryId);
      state.genericItems = listVm?.items || [];
      state.selectedId = state.genericItems[0]?.id || "";
      renderYearFilter();
      renderGenericList();
      if (state.selectedId) {
        const detail = await fetchCategoryItemDetail(categoryId, state.selectedId);
        state.genericDetail = detail;
        renderGenericDetail(detail);
      }
    }
  }

  function bindEvents() {
    elements.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      state.drawerOpen = false;
      if (state.categoryId === "gpu") renderGpuMode();
      else renderGenericList();
    });

    elements.sortSelect.addEventListener("change", (event) => {
      state.sortBy = event.target.value;
      state.drawerOpen = false;
      if (state.categoryId === "gpu") renderGpuMode();
    });

    elements.filterBar.addEventListener("click", (event) => {
      const genToggle = event.target.closest("[data-gen-toggle]");
      if (genToggle) {
        const group = genToggle.closest(".filter-group--gen");
        if (group) group.classList.toggle("is-expanded");
        return;
      }

      const button = event.target.closest("[data-filter-type]");
      if (!button) return;

      const set = state[button.dataset.filterType];
      const value = button.dataset.filterValue;
      if (set.has(value)) set.delete(value);
      else set.add(value);
      state.drawerOpen = false;
      if (state.categoryId === "gpu") renderGpuMode();
    });

    elements.resetButton.addEventListener("click", () => {
      state.query = "";
      state.brands.clear();
      state.segments.clear();
      state.generations.clear();
      state.selectedYears.clear();
      state.showUnknownYears = false;
      state.drawerOpen = false;
      elements.searchInput.value = "";
      renderYearFilter();
      if (state.categoryId === "gpu") renderGpuMode();
      else renderGenericList();
    });

    elements.yearFilter.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-year]");
      if (!chip) return;
      const value = chip.dataset.year;
      if (value === "all") {
        state.selectedYears.clear();
      } else {
        const year = Number(value);
        if (state.selectedYears.has(year)) state.selectedYears.delete(year);
        else state.selectedYears.add(year);
      }
      state.drawerOpen = false;
      renderYearFilter();
      if (state.categoryId === "gpu") renderGpuMode();
      else renderGenericList();
    });

    elements.yearFilter.addEventListener("change", (event) => {
      if (event.target.dataset.yearToggle === undefined) return;
      state.showUnknownYears = event.target.checked;
      state.drawerOpen = false;
      renderYearFilter();
      if (state.categoryId === "gpu") renderGpuMode();
      else renderGenericList();
    });

    win.addEventListener("hashchange", () => {
      const hash = win.location.hash;
      const compareParams = parseCompareHash(hash);
      if (compareParams) {
        state.compareMode = true;
        state.compareParams = compareParams;
        render().catch(console.error);
        return;
      }

      state.compareMode = false;
      state.compareParams = null;
      const id = hash.replace(/^#/, "");
      if (state.categoryId === "gpu" && data.some((gpu) => gpu.id === id)) {
        state.selectedId = id;
        state.drawerOpen = true;
        render().catch(console.error);
      }
    });
  }

  function updateControlState() {
    doc.querySelectorAll("[data-filter-type]").forEach((button) => {
      const active = state[button.dataset.filterType].has(button.dataset.filterValue);
      button.classList.toggle("is-active", active);
    });

    const hasFilters = state.query || state.brands.size || state.segments.size || state.generations.size || state.selectedYears.size || state.showUnknownYears;
    elements.resetButton.hidden = !hasFilters;
  }

  function selectGpu(id) {
    state.selectedId = id;
    state.drawerOpen = true;
    if (win.location.hash !== `#${id}`) win.history.replaceState(null, "", `#${id}`);
    if (state.categoryId === "gpu") renderGpuMode();
  }

  async function selectGenericItem(id) {
    state.selectedId = id;
    state.drawerOpen = true;
    if (win.location.hash !== `#${id}`) win.history.replaceState(null, "", `#${id}`);
    const detail = await fetchCategoryItemDetail(state.categoryId, id);
    state.genericDetail = detail;
    renderGenericDetail(detail);
  }

  function renderGpuList(items, maxIndex) {
    elements.ladderList.innerHTML = renderLadderMarkup(items, maxIndex, state.selectedId);
    elements.ladderList.querySelectorAll("[data-gpu-id]").forEach((row) => {
      row.addEventListener("click", () => selectGpu(row.dataset.gpuId));
    });
  }

  function renderGenericList() {
    let items = state.genericItems;
    const query = state.query.trim().toLowerCase();
    if (query) {
      items = items.filter((item) => searchHardwareListItems([item], state.query).length > 0);
    }
    items = filterByYears(items, state.selectedYears, state.showUnknownYears, (item) => item.releaseYear != null ? String(item.releaseYear) : null);
    elements.ladderList.innerHTML = renderHardwareList(items, { selectedId: state.selectedId });
    elements.ladderList.querySelectorAll("[data-hardware-id]").forEach((row) => {
      row.addEventListener("click", () => selectGenericItem(row.dataset.hardwareId));
    });
  }

  function renderGenericDetail(detail) {
    const html = renderHardwareDetail(detail);
    elements.detailPanel.innerHTML = html;
    elements.mobileDrawer.innerHTML = `${html}<button class="ghost-button drawer-close" type="button">关闭</button>`;
    elements.mobileDrawer.hidden = !state.drawerOpen;
    elements.mobileDrawer.querySelector(".drawer-close")?.addEventListener("click", () => {
      state.drawerOpen = false;
      elements.mobileDrawer.hidden = true;
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

  function renderGpuMode() {
    updateControlState();
    let filtered = filterGpus(data, state);
    filtered = filterByYears(filtered, state.selectedYears, state.showUnknownYears, (gpu) => gpu.releaseDate);
    filtered = sortGpus(filtered, state.sortBy);
    const maxIndex = getMaxPerformanceIndex(data);
    const selectedGpu = data.find((gpu) => gpu.id === state.selectedId) || filtered[0];
    renderGpuList(filtered, maxIndex);
    renderDetails(selectedGpu);
  }

  async function render() {
    const contentGrid = doc.querySelector(".content-grid");
    if (state.compareMode) {
      if (contentGrid) contentGrid.hidden = true;
      elements.comparePanel.hidden = false;
      elements.comparePanel.innerHTML = await renderComparePage(state.compareParams);
      elements.mobileDrawer.hidden = true;
      return;
    }

    if (contentGrid) contentGrid.hidden = false;
    elements.comparePanel.hidden = true;

    if (state.categoryId === "gpu") {
      renderGpuMode();
    } else {
      renderGenericList();
      if (!state.genericDetail && state.selectedId) {
        const detail = await fetchCategoryItemDetail(state.categoryId, state.selectedId);
        state.genericDetail = detail;
      }
      renderGenericDetail(state.genericDetail);
    }
  }

  renderCategoryTabs();
  renderControls();
  renderYearFilter();
  bindEvents();
  render().catch(console.error);

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
    mobileDrawer: doc.querySelector("#mobileDrawer"),
    comparePanel: doc.querySelector("#comparePanel"),
    categoryTabs: doc.querySelector("#categoryTabs"),
    yearFilter: doc.querySelector("#yearFilter")
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
  fetchCategories().then((categories) => {
    initApp({ categories });
  }).catch(console.error);
}
