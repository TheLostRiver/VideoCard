import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gpus } from "../src/data/gpus.js";
import { createJsonHardwareRepository } from "../src/infrastructure/json/json-hardware-repository.js";

const gpuSchema = JSON.parse(
  await readFile(new URL("../src/data/categories/gpu.schema.json", import.meta.url), "utf8")
);
const desktopCpuSchema = JSON.parse(
  await readFile(new URL("../src/data/categories/desktop-cpu.schema.json", import.meta.url), "utf8")
);
const desktopCpuItems = JSON.parse(
  await readFile(new URL("../src/data/hardware/desktop-cpu.items.json", import.meta.url), "utf8")
);
const mobileSocSchema = JSON.parse(
  await readFile(new URL("../src/data/categories/mobile-soc.schema.json", import.meta.url), "utf8")
);
const mobileSocItems = JSON.parse(
  await readFile(new URL("../src/data/hardware/mobile-soc.items.json", import.meta.url), "utf8")
);
const appleSiliconSchema = JSON.parse(
  await readFile(new URL("../src/data/categories/apple-silicon.schema.json", import.meta.url), "utf8")
);
const appleSiliconItems = JSON.parse(
  await readFile(new URL("../src/data/hardware/apple-silicon.items.json", import.meta.url), "utf8")
);

function metricById(metricValues, metricId) {
  return metricValues.find((metricValue) => metricValue.metricId === metricId);
}

async function withTempRepo(callback) {
  const root = await mkdtemp(join(tmpdir(), "json-hw-repo-"));
  await mkdir(join(root, "src", "data", "categories"), { recursive: true });
  await mkdir(join(root, "src", "data", "hardware"), { recursive: true });
  await writeFile(join(root, "src", "data", "categories", "gpu.schema.json"), JSON.stringify(gpuSchema, null, 2));
  await writeFile(join(root, "src", "data", "categories", "desktop-cpu.schema.json"), JSON.stringify(desktopCpuSchema, null, 2));
  await writeFile(join(root, "src", "data", "hardware", "desktop-cpu.items.json"), JSON.stringify(desktopCpuItems, null, 2));
  await writeFile(join(root, "src", "data", "categories", "mobile-soc.schema.json"), JSON.stringify(mobileSocSchema, null, 2));
  await writeFile(join(root, "src", "data", "hardware", "mobile-soc.items.json"), JSON.stringify(mobileSocItems, null, 2));
  await writeFile(join(root, "src", "data", "categories", "apple-silicon.schema.json"), JSON.stringify(appleSiliconSchema, null, 2));
  await writeFile(join(root, "src", "data", "hardware", "apple-silicon.items.json"), JSON.stringify(appleSiliconItems, null, 2));
  await writeFile(join(root, "src", "data", "gpus.json"), JSON.stringify(gpus, null, 2));

  const repository = createJsonHardwareRepository({ root });
  try {
    await callback({ repository, root });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("json hardware repository lists GPU categories", async () => {
  const repository = createJsonHardwareRepository();
  const categories = await repository.listCategories();
  const gpuCategory = categories.find((category) => category.id === "gpu");

  assert.equal(gpuCategory?.label, "GPU");
  assert.equal((await repository.getCategory("gpu")).id, "gpu");
  assert.equal(await repository.getCategory("missing"), null);
});

test("json hardware repository lists current GPU items", async () => {
  const repository = createJsonHardwareRepository();
  const items = await repository.listItems({ categoryId: "gpu" });

  assert.equal(items.length, gpus.length);
  assert.equal((await repository.listItems({ categoryId: "cpu" })).length, 0);
  assert.equal(items.find((item) => item.id === "rtx-4070-laptop")?.manufacturerId, "nvidia");
});

test("json hardware repository returns item detail with mapped metrics and ranking score", async () => {
  const repository = createJsonHardwareRepository();
  const detail = await repository.getItemDetail("rtx-4070-laptop");

  assert.equal(detail.item.id, "rtx-4070-laptop");
  assert.equal(detail.item.categoryId, "gpu");
  assert.equal(metricById(detail.metricValues, "gpu.benchmark.timeSpyGraphics").valueNumber, 12345);
  assert.equal(metricById(detail.metricValues, "gpu.power.tgpRange").valueMin, 45);
  assert.equal(metricById(detail.metricValues, "gpu.power.tgpRange").valueMax, 115);
  assert.equal(detail.rankingScore.score, 135);
  assert.equal(detail.rankingScore.rankingProfileId, "gpu-gaming-performance");
  assert.equal(detail.sources[0].id, "rtx-4070-laptop:source:1");
  assert.equal(await repository.getItemDetail("missing"), null);
});

test("json hardware repository saves new desktop-cpu item", async () => {
  await withTempRepo(async ({ repository }) => {
    const newCpu = {
      item: { id: "test-new-cpu", categoryId: "desktop-cpu", name: "Test CPU", manufacturerId: "intel", status: "draft" },
      metricValues: [],
      rankingScore: { score: 100 }
    };
    const saved = await repository.saveItem(newCpu);
    assert.equal(saved.item.id, "test-new-cpu");

    const detail = await repository.getItemDetail("test-new-cpu");
    assert.equal(detail.item.name, "Test CPU");
  });
});

test("json hardware repository updates existing desktop-cpu item", async () => {
  await withTempRepo(async ({ repository }) => {
    const existing = desktopCpuItems[0];
    const updated = structuredClone(existing);
    updated.item.name = "Updated CPU Name";

    const saved = await repository.saveItem(updated);
    assert.equal(saved.item.name, "Updated CPU Name");

    const detail = await repository.getItemDetail(existing.item.id);
    assert.equal(detail.item.name, "Updated CPU Name");
  });
});

test("json hardware repository saves new mobile-soc item", async () => {
  await withTempRepo(async ({ repository }) => {
    const newSoc = {
      item: { id: "test-new-soc", categoryId: "mobile-soc", name: "Test SoC", manufacturerId: "qualcomm", status: "draft" },
      metricValues: [],
      rankingScore: { score: 100 }
    };
    const saved = await repository.saveItem(newSoc);
    assert.equal(saved.item.id, "test-new-soc");

    const detail = await repository.getItemDetail("test-new-soc");
    assert.equal(detail.item.name, "Test SoC");
  });
});

test("json hardware repository saves new apple-silicon item", async () => {
  await withTempRepo(async ({ repository }) => {
    const newApple = {
      item: { id: "test-new-apple", categoryId: "apple-silicon", name: "Test Apple", manufacturerId: "apple", status: "draft" },
      metricValues: [],
      rankingScore: { score: 100 }
    };
    const saved = await repository.saveItem(newApple);
    assert.equal(saved.item.id, "test-new-apple");

    const detail = await repository.getItemDetail("test-new-apple");
    assert.equal(detail.item.name, "Test Apple");
  });
});

test("json hardware repository saves new GPU item", async () => {
  await withTempRepo(async ({ repository }) => {
    const newGpu = {
      item: {
        id: "test-new-gpu",
        categoryId: "gpu",
        name: "Test GPU",
        manufacturerId: "nvidia",
        generation: "RTX 50",
        architecture: "Blackwell",
        releaseDate: "2025",
        marketSegmentIds: ["desktop"],
        tierId: "high",
        specs: { coresLabel: "5000 CUDA" },
        notes: ["test note"],
        status: "draft"
      },
      metricValues: [
        { metricId: "gpu.performance.index", valueNumber: 150 },
        { metricId: "gpu.core.count", valueNumber: 5000 },
        { metricId: "gpu.clock.base", valueNumber: 2000 },
        { metricId: "gpu.clock.boost", valueNumber: 2500 },
        { metricId: "gpu.memory.size", valueNumber: 16 },
        { metricId: "gpu.memory.type", valueText: "GDDR7" },
        { metricId: "gpu.memory.bus", valueNumber: 256 },
        { metricId: "gpu.memory.bandwidth", valueNumber: 800 },
        { metricId: "gpu.power.board", valueNumber: 200 },
        { metricId: "gpu.benchmark.timeSpyGraphics", valueNumber: 20000 },
        { metricId: "gpu.gaming.recommendedResolution", valueText: "1440p" }
      ],
      rankingScore: { score: 150, tierId: "high" },
      sources: [{ label: "test", url: "https://example.com" }]
    };
    const saved = await repository.saveItem(newGpu, { upsert: true });
    assert.equal(saved.item.id, "test-new-gpu");
    assert.equal(saved.item.name, "Test GPU");

    const detail = await repository.getItemDetail("test-new-gpu");
    assert.equal(detail.item.name, "Test GPU");
  });
});
