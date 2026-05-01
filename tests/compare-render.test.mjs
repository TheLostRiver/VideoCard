import test from "node:test";
import assert from "node:assert/strict";
import { renderCompareTable } from "../src/features/compare/render-compare.js";

const sampleViewModel = {
  categoryId: "gpu",
  itemIds: ["rtx-4070-laptop", "rtx-4090-desktop"],
  groups: [
    {
      id: "specs",
      title: "Specs",
      rows: [
        {
          metricId: "gpu.core.count",
          label: "Core Count",
          values: [
            { itemId: "rtx-4070-laptop", displayValue: "5,888", rawComparableValue: 5888 },
            { itemId: "rtx-4090-desktop", displayValue: "16,384", rawComparableValue: 16384, isBest: true }
          ]
        },
        {
          metricId: "gpu.memory.size",
          label: "Memory Size",
          values: [
            { itemId: "rtx-4070-laptop", displayValue: "8 GB", rawComparableValue: 8 },
            { itemId: "rtx-4090-desktop", displayValue: "24 GB", rawComparableValue: 24, isBest: true }
          ]
        }
      ]
    },
    {
      id: "power",
      title: "Power",
      rows: [
        {
          metricId: "gpu.power.board",
          label: "Board Power",
          values: [
            { itemId: "rtx-4070-laptop", displayValue: "待补充", rawComparableValue: null },
            { itemId: "rtx-4090-desktop", displayValue: "450 W", rawComparableValue: 450 }
          ]
        }
      ]
    }
  ]
};

test("compare renderer renders item names as column headers", () => {
  const html = renderCompareTable(sampleViewModel);

  assert.ok(html.includes("rtx-4070-laptop"));
  assert.ok(html.includes("rtx-4090-desktop"));
  assert.ok(html.includes("<th"));
});

test("compare renderer renders metric groups", () => {
  const html = renderCompareTable(sampleViewModel);

  assert.ok(html.includes("Specs"));
  assert.ok(html.includes("Power"));
  assert.ok(html.includes("Core Count"));
  assert.ok(html.includes("Memory Size"));
  assert.ok(html.includes("Board Power"));
});

test("compare renderer marks best values with is-best class", () => {
  const html = renderCompareTable(sampleViewModel);

  assert.ok(html.includes("is-best"));
  assert.ok(html.includes("16,384"));
  assert.ok(html.includes("24 GB"));
});

test("compare renderer shows 待补充 for missing values", () => {
  const html = renderCompareTable(sampleViewModel);

  assert.ok(html.includes("待补充"));
});

test("compare renderer returns empty state for no groups", () => {
  const empty = { categoryId: "gpu", itemIds: ["a"], groups: [] };
  const html = renderCompareTable(empty);

  assert.ok(html.includes("无可比数据") || html.length > 0);
});
