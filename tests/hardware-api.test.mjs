import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gpus } from "../src/data/gpus.js";
import { createRequestHandler } from "../scripts/serve.mjs";
import { writeGpuJson, writeGpuModule } from "../scripts/gpu-data.mjs";

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

test("GET /api/hardware/categories returns category list", async () => {
  await withApi(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/hardware/categories`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.categories));
    assert.ok(body.categories.length >= 1);
    assert.equal(body.categories[0].id, "gpu");
  });
});

test("GET /api/hardware/gpu/items returns list view models", async () => {
  await withApi(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/hardware/gpu/items`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.items));
    assert.equal(body.items.length, gpus.length);
    assert.ok(body.items[0].id);
    assert.ok(body.items[0].title);
  });
});

test("GET /api/hardware/gpu/items/:id returns detail view model", async () => {
  await withApi(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/hardware/gpu/items/rtx-4070-laptop`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.detail);
    assert.equal(body.detail.item.id, "rtx-4070-laptop");
    assert.ok(Array.isArray(body.detail.groups));
  });
});

test("GET /api/hardware/gpu/items/:id returns 404 for missing item", async () => {
  await withApi(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/hardware/gpu/items/nonexistent-gpu`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.ok(body.errors);
  });
});

test("GET /api/hardware/unknown-category/items returns 404", async () => {
  await withApi(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/hardware/unknown-category/items`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.ok(body.errors);
  });
});

test("PUT /api/admin/hardware/gpu/items/:id saves and returns detail", async () => {
  await withApi(async ({ baseUrl }) => {
    const getResponse = await fetch(`${baseUrl}/api/hardware/gpu/items/rtx-4070-laptop`);
    const { detail } = await getResponse.json();
    const timeSpy = detail.groups
      .flatMap((g) => g.rows)
      .find((r) => r.id === "gpu.benchmark.timeSpyGraphics");
    if (timeSpy) timeSpy.value = 99999;

    const response = await fetch(`${baseUrl}/api/admin/hardware/gpu/items/rtx-4070-laptop`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detail)
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.detail);
    assert.equal(body.detail.item.id, "rtx-4070-laptop");
  });
});

test("PUT /api/admin/hardware/gpu/items/:id rejects mobile GPU without TGP", async () => {
  await withApi(async ({ baseUrl }) => {
    const getResponse = await fetch(`${baseUrl}/api/hardware/gpu/items/rtx-4070-laptop`);
    const { detail } = await getResponse.json();
    const tgpMetric = (detail.metricValues || []).find((mv) => mv.metricId === "gpu.power.tgpRange");
    if (tgpMetric) {
      delete tgpMetric.valueMin;
      delete tgpMetric.valueMax;
      tgpMetric.valueText = "";
    }

    const response = await fetch(`${baseUrl}/api/admin/hardware/gpu/items/rtx-4070-laptop`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detail)
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.errors.some((e) => e.includes("tgpRangeW")));
  });
});

test("PUT /api/admin/hardware/gpu/items/:id returns 404 for missing item", async () => {
  await withApi(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/admin/hardware/gpu/items/nonexistent-gpu`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: { id: "nonexistent-gpu" } })
    });
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.ok(body.errors);
  });
});

test("POST /api/admin/hardware/desktop-cpu/items creates new item", async () => {
  await withApi(async ({ baseUrl }) => {
    const newCpu = {
      item: { id: "test-new-cpu", categoryId: "desktop-cpu", name: "Test CPU", manufacturerId: "intel", status: "draft" },
      metricValues: [],
      rankingScore: { score: 100 }
    };
    const response = await fetch(`${baseUrl}/api/admin/hardware/desktop-cpu/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCpu)
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.detail.item.id, "test-new-cpu");

    const getResponse = await fetch(`${baseUrl}/api/hardware/desktop-cpu/items/test-new-cpu`);
    assert.equal(getResponse.status, 200);
  });
});

test("POST /api/admin/hardware/gpu/items creates new GPU", async () => {
  await withApi(async ({ baseUrl }) => {
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
        notes: [],
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
      sources: []
    };
    const response = await fetch(`${baseUrl}/api/admin/hardware/gpu/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGpu)
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.detail.item.id, "test-new-gpu");
  });
});

test("POST /api/admin/hardware/:category/items rejects missing item.id", async () => {
  await withApi(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/admin/hardware/desktop-cpu/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: {} })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.errors);
  });
});

async function withApi(callback) {
  const root = await mkdtemp(join(tmpdir(), "hardware-api-"));
  await mkdir(join(root, "src", "data", "categories"), { recursive: true });
  await mkdir(join(root, "src", "data", "hardware"), { recursive: true });
  await writeGpuJson(gpus, root);
  await writeGpuModule(gpus, root);
  await writeFile(
    join(root, "src", "data", "categories", "gpu.schema.json"),
    JSON.stringify(gpuSchema, null, 2)
  );
  await writeFile(
    join(root, "src", "data", "categories", "desktop-cpu.schema.json"),
    JSON.stringify(desktopCpuSchema, null, 2)
  );
  await writeFile(
    join(root, "src", "data", "hardware", "desktop-cpu.items.json"),
    JSON.stringify(desktopCpuItems, null, 2)
  );
  await writeFile(
    join(root, "src", "data", "categories", "mobile-soc.schema.json"),
    JSON.stringify(mobileSocSchema, null, 2)
  );
  await writeFile(
    join(root, "src", "data", "hardware", "mobile-soc.items.json"),
    JSON.stringify(mobileSocItems, null, 2)
  );
  await writeFile(
    join(root, "src", "data", "categories", "apple-silicon.schema.json"),
    JSON.stringify(appleSiliconSchema, null, 2)
  );
  await writeFile(
    join(root, "src", "data", "hardware", "apple-silicon.items.json"),
    JSON.stringify(appleSiliconItems, null, 2)
  );

  const server = createServer(createRequestHandler({ root }));
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await callback({ baseUrl, root });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await rm(root, { recursive: true, force: true });
  }
}
