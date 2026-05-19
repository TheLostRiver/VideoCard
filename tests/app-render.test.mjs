import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import {
  createGpuPageHardwareModel,
  createInitialState,
  filterHardwareListItemsByFacets,
  getUniqueValues,
  parseCompareHash,
  renderComparePage,
  renderDetailMarkup,
  renderFilterChips,
  renderHardwareFilterChips,
  renderGpuRow,
  searchHardwareListItems,
  shouldShowMobileDrawer
} from "../src/app.js";
import { renderHardwareDetail } from "../src/features/hardware-detail/render-detail.js";
import { renderHardwareListItem } from "../src/features/hardware-list/render-list.js";

test("createInitialState selects GPU id from hash", () => {
  const state = createInitialState("#rtx-4070-desktop", "rtx-4090-desktop");
  assert.equal(state.selectedId, "rtx-4070-desktop");
  assert.equal(state.sortBy, "performance");
  assert.equal(state.query, "");
  assert.equal(state.brands.size, 0);
  assert.equal(state.drawerOpen, true);
});

test("createInitialState keeps mobile drawer closed without hash selection", () => {
  const state = createInitialState("", "rtx-4090-desktop");
  assert.equal(state.selectedId, "rtx-4090-desktop");
  assert.equal(state.drawerOpen, false);
  assert.equal(shouldShowMobileDrawer(gpus[0], state), false);
});

test("getUniqueValues returns sorted unique generations", () => {
  const generations = getUniqueValues(gpus, "generation");
  assert.deepEqual(generations, [...new Set(generations)]);
  assert.ok(generations.includes("RTX 40"));
  assert.ok(generations.includes("RX 7000"));
});

test("renderGpuRow marks the selected GPU and labels mobile records", () => {
  const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
  const html = renderGpuRow(gpu, 245, "rtx-4070-laptop");
  assert.match(html, /is-selected/);
  assert.match(html, /segment-badge mobile/);
  assert.match(html, new RegExp(gpu.specs.tgpRangeW));
});

test("renderDetailMarkup includes mobile warning and benchmark placeholders", () => {
  const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
  const html = renderDetailMarkup(gpu);
  assert.match(html, /移动版性能受 TGP、散热和厂商调校影响/);
  assert.match(html, /Time Spy Graphics/);
  assert.match(html, /待补充/);
});

test("renderFilterChips renders brands, segments, and generations", () => {
  const html = renderFilterChips(gpus);
  assert.match(html, /data-filter-value="nvidia"/);
  assert.match(html, /data-filter-value="mobile"/);
  assert.match(html, /data-filter-value="RTX 40"/);
});

test("renderHardwareFilterChips renders desktop CPU brand and generation filters", () => {
  const items = [
    createListItem("ryzen-7-7800x3d", "AMD Ryzen 7 7800X3D", "amd", "Ryzen 7000"),
    createListItem("core-i9-14900k", "Intel Core i9-14900K", "intel", "14th Gen"),
    createListItem("core-i9-10900k", "Intel Core i9-10900K", "intel", "10th Gen")
  ];

  const html = renderHardwareFilterChips(items, { categoryId: "desktop-cpu" });

  assert.match(html, /data-filter-type="brands" data-filter-value="amd"/);
  assert.match(html, /data-filter-type="brands" data-filter-value="intel"/);
  assert.match(html, /data-filter-type="generations" data-filter-value="14th Gen"/);
  assert.match(html, /data-filter-type="generations" data-filter-value="Ryzen 7000"/);
  assert.doesNotMatch(html, /data-filter-type="segments"/);
});

test("filterHardwareListItemsByFacets filters generic hardware by brand and generation", () => {
  const items = [
    createListItem("ryzen-7-7800x3d", "AMD Ryzen 7 7800X3D", "amd", "Ryzen 7000"),
    createListItem("ryzen-7-9700x", "AMD Ryzen 7 9700X", "amd", "Ryzen 9000"),
    createListItem("core-i9-14900k", "Intel Core i9-14900K", "intel", "14th Gen")
  ];

  const result = filterHardwareListItemsByFacets(items, {
    brands: new Set(["amd"]),
    generations: new Set(["Ryzen 9000"])
  });

  assert.deepEqual(result.map((item) => item.id), ["ryzen-7-9700x"]);
});

test("service-backed GPU page model preserves search, mobile badge, warning, and benchmark rendering", async () => {
  const pageModel = await createGpuPageHardwareModel();
  const matches = searchHardwareListItems(pageModel.listViewModel.items, "4070");
  const laptop4070 = matches.find((item) => item.id === "rtx-4070-laptop");
  const desktop4070 = matches.find((item) => item.id === "rtx-4070-desktop");

  assert.ok(matches.length >= 2, `expected at least desktop and laptop 4070 in matches, got ${matches.length}`);
  assert.ok(matches.every((item) => /4070/i.test(`${item.title} ${item.id}`)), "every match should contain 4070");
  assert.ok(laptop4070);
  assert.ok(desktop4070);

  const rowHtml = renderHardwareListItem(laptop4070, { selectedId: laptop4070.id });
  assert.match(rowHtml, /GeForce RTX 4070 Laptop GPU/);
  assert.match(rowHtml, /hardware-list-badge/);
  assert.match(rowHtml, /mobile/);

  const detailHtml = renderHardwareDetail(pageModel.getDetailViewModel(laptop4070.id));
  assert.match(detailHtml, /移动版性能受 TGP、散热和厂商调校影响/);
  assert.match(detailHtml, /Time Spy Graphics/);
  assert.match(detailHtml, /12,345/);
});

test("parseCompareHash extracts category and ids from compare hash", () => {
  const result = parseCompareHash("#compare/gpu?ids=rtx-4070-desktop,rtx-4070-laptop");
  assert.equal(result.categoryId, "gpu");
  assert.deepEqual(result.itemIds, ["rtx-4070-desktop", "rtx-4070-laptop"]);
});

test("parseCompareHash returns null for non-compare hash", () => {
  assert.equal(parseCompareHash("#rtx-4070-laptop"), null);
  assert.equal(parseCompareHash(""), null);
});

test("parseCompareHash rejects compare hash with fewer than 2 ids", () => {
  assert.equal(parseCompareHash("#compare/gpu?ids=rtx-4070-desktop"), null);
});

test("renderComparePage renders a compare table for two GPUs", async () => {
  const html = await renderComparePage({
    categoryId: "gpu",
    itemIds: ["rtx-4070-laptop", "rtx-4090-desktop"]
  });

  assert.match(html, /compare-table/);
  assert.match(html, /rtx-4070-laptop/);
  assert.match(html, /rtx-4090-desktop/);
  assert.match(html, /Core Count/);
});

function createListItem(id, title, manufacturerId, generation) {
  return {
    id,
    title,
    manufacturerId,
    facts: [
      { id: "brand", label: "Brand", displayValue: manufacturerId },
      { id: "generation", label: "Generation", displayValue: generation }
    ]
  };
}
