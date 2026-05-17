import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { renderHardwareList, renderHardwareListItem } from "../src/features/hardware-list/render-list.js";

const laptop4070ViewModel = {
  id: "rtx-4070-laptop",
  title: "GeForce RTX 4070 Laptop GPU",
  badges: [{ id: "mobile", label: "mobile" }],
  primaryScore: {
    label: "Performance Index",
    displayValue: "135"
  },
  facts: [
    { id: "maker", label: "Maker", displayValue: "NVIDIA" },
    { metricId: "gpu.memory.size", label: "Memory Size", displayValue: "8 GB" }
  ]
};

test("renderHardwareListItem renders title, badges, primary score, and facts", () => {
  const html = renderHardwareListItem(laptop4070ViewModel);

  assert.match(html, /GeForce RTX 4070 Laptop GPU/);
  assert.match(html, /hardware-list-badge/);
  assert.match(html, /mobile/);
  assert.match(html, /Performance Index/);
  assert.match(html, /135/);
  assert.match(html, /Memory Size/);
  assert.match(html, /8 GB/);
});

test("renderHardwareListItem renders selected state", () => {
  const html = renderHardwareListItem(laptop4070ViewModel, { selectedId: "rtx-4070-laptop" });

  assert.match(html, /is-selected/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /data-hardware-id="rtx-4070-laptop"/);
});

test("renderHardwareList renders an empty state and multiple rows", () => {
  assert.match(renderHardwareList([]), /没有匹配的硬件/);

  const html = renderHardwareList([
    laptop4070ViewModel,
    { ...laptop4070ViewModel, id: "rtx-4070-desktop", title: "GeForce RTX 4070" }
  ], { selectedId: "rtx-4070-desktop" });

  assert.equal((html.match(/hardware-list-item/g) || []).length, 2);
  assert.match(html, /GeForce RTX 4070/);
  assert.match(html, /is-selected/);
});

test("renderHardwareListItem applies manufacturer accent to AMD and Intel rows", () => {
  const amdHtml = renderHardwareListItem({
    ...laptop4070ViewModel,
    id: "amd-ryzen-9-7950x",
    title: "AMD Ryzen 9 7950X",
    manufacturerId: "amd"
  });
  const intelHtml = renderHardwareListItem({
    ...laptop4070ViewModel,
    id: "intel-core-i9-13900k",
    title: "Intel Core i9-13900K",
    manufacturerId: "intel"
  });

  assert.match(amdHtml, /style="--hardware-accent:var\(--accent-amd\)"/);
  assert.match(intelHtml, /style="--hardware-accent:var\(--accent-intel\)"/);
});

test("renderHardwareListItem applies distinct manufacturer accents to mobile SoC rows", () => {
  const qualcommHtml = renderHardwareListItem({
    ...laptop4070ViewModel,
    id: "snapdragon-8-gen-3",
    title: "Qualcomm Snapdragon 8 Gen 3",
    manufacturerId: "qualcomm"
  });
  const mediatekHtml = renderHardwareListItem({
    ...laptop4070ViewModel,
    id: "dimensity-9300",
    title: "MediaTek Dimensity 9300",
    manufacturerId: "mediatek"
  });
  const samsungHtml = renderHardwareListItem({
    ...laptop4070ViewModel,
    id: "exynos-2400",
    title: "Samsung Exynos 2400",
    manufacturerId: "samsung"
  });

  assert.match(qualcommHtml, /style="--hardware-accent:var\(--accent-qualcomm\)"/);
  assert.match(mediatekHtml, /style="--hardware-accent:var\(--accent-mediatek\)"/);
  assert.match(samsungHtml, /style="--hardware-accent:var\(--accent-samsung\)"/);
});

test("hardware list renderer contains no GPU-specific field assumptions", async () => {
  const source = await readFile(new URL("../src/features/hardware-list/render-list.js", import.meta.url), "utf8");

  assert.doesNotMatch(source, /performanceIndex|specs|memorySize|tgp|gpu\.|gpus\.js|brand|segment/);
});
