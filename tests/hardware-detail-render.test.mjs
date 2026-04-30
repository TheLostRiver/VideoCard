import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { renderHardwareDetail } from "../src/features/hardware-detail/render-detail.js";

const laptop4070DetailViewModel = {
  item: {
    id: "rtx-4070-laptop",
    name: "GeForce RTX 4070 Laptop GPU"
  },
  warnings: [
    {
      id: "mobile-performance",
      severity: "warning",
      message: "移动版性能受 TGP、散热和厂商调校影响"
    }
  ],
  groups: [
    {
      id: "overview",
      title: "Overview",
      rows: [
        { metricId: "gpu.benchmark.timeSpyGraphics", label: "Time Spy Graphics", displayValue: "12,345" },
        { metricId: "gpu.benchmark.steelNomadGraphics", label: "Steel Nomad Graphics", displayValue: "待补充" }
      ]
    },
    {
      id: "memoryPower",
      title: "Memory And Power",
      rows: [
        { metricId: "gpu.power.tgpRange", label: "Mobile TGP Range", displayValue: "45-115W" }
      ]
    }
  ]
};

test("renderHardwareDetail renders grouped detail sections", () => {
  const html = renderHardwareDetail(laptop4070DetailViewModel);

  assert.match(html, /GeForce RTX 4070 Laptop GPU/);
  assert.match(html, /Overview/);
  assert.match(html, /Memory And Power/);
  assert.match(html, /Time Spy Graphics/);
  assert.match(html, /12,345/);
  assert.match(html, /Mobile TGP Range/);
  assert.match(html, /45-115W/);
});

test("renderHardwareDetail renders warnings when provided", () => {
  const html = renderHardwareDetail(laptop4070DetailViewModel);

  assert.match(html, /hardware-detail-warning/);
  assert.match(html, /data-warning-id="mobile-performance"/);
  assert.match(html, /移动版性能受 TGP/);
});

test("renderHardwareDetail displays missing metric text from the view model", () => {
  const html = renderHardwareDetail(laptop4070DetailViewModel);

  assert.match(html, /Steel Nomad Graphics/);
  assert.match(html, /待补充/);
});

test("renderHardwareDetail renders an empty state", () => {
  assert.match(renderHardwareDetail(null), /请选择硬件/);
});

test("hardware detail renderer contains no GPU-specific field assumptions", async () => {
  const source = await readFile(new URL("../src/features/hardware-detail/render-detail.js", import.meta.url), "utf8");

  assert.doesNotMatch(source, /performanceIndex|specs|memorySize|tgp|gpu\.|gpus\.js|brand|segment/);
});
