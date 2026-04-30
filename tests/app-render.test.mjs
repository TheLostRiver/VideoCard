import test from "node:test";
import assert from "node:assert/strict";
import { gpus } from "../src/data/gpus.js";
import {
  createGpuPageHardwareModel,
  createInitialState,
  getUniqueValues,
  renderDetailMarkup,
  renderFilterChips,
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

test("service-backed GPU page model preserves search, mobile badge, warning, and benchmark rendering", async () => {
  const pageModel = await createGpuPageHardwareModel();
  const matches = searchHardwareListItems(pageModel.listViewModel.items, "4070");
  const laptop4070 = matches.find((item) => item.id === "rtx-4070-laptop");

  assert.equal(matches.length, 2);
  assert.ok(laptop4070);

  const rowHtml = renderHardwareListItem(laptop4070, { selectedId: laptop4070.id });
  assert.match(rowHtml, /GeForce RTX 4070 Laptop GPU/);
  assert.match(rowHtml, /hardware-list-badge/);
  assert.match(rowHtml, /mobile/);

  const detailHtml = renderHardwareDetail(pageModel.getDetailViewModel(laptop4070.id));
  assert.match(detailHtml, /移动版性能受 TGP、散热和厂商调校影响/);
  assert.match(detailHtml, /Time Spy Graphics/);
  assert.match(detailHtml, /12,345/);
});
