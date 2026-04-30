import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gpus } from "../src/data/gpus.js";
import { createRequestHandler } from "../scripts/serve.mjs";
import { writeGpuJson, writeGpuModule } from "../scripts/gpu-data.mjs";

test("admin API returns GPU data", async () => {
  await withApi(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/gpus`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.gpus.length, gpus.length);
    assert.equal(body.gpus[0].id, gpus[0].id);
  });
});

test("admin API saves a full GPU record and regenerates files", async () => {
  await withApi(async ({ baseUrl, root }) => {
    const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
    const updated = {
      ...gpu,
      specs: { ...gpu.specs, boostClockMHz: 2175, tgpRangeW: "45-115W" },
      benchmarks: { ...gpu.benchmarks, timeSpyGraphics: 12345 }
    };

    const response = await putGpu(baseUrl, "rtx-4070-laptop", updated);
    const body = await response.json();
    const json = JSON.parse(await readFile(join(root, "src", "data", "gpus.json"), "utf8"));
    const moduleText = await readFile(join(root, "src", "data", "gpus.js"), "utf8");

    assert.equal(response.status, 200);
    assert.equal(body.gpu.specs.tgpRangeW, "45-115W");
    assert.equal(body.gpu.specs.boostClockMHz, 2175);
    assert.equal(body.gpu.benchmarks.timeSpyGraphics, 12345);
    assert.equal(json.find((item) => item.id === "rtx-4070-laptop").benchmarks.timeSpyGraphics, 12345);
    assert.match(moduleText, /"timeSpyGraphics": 12345/);
  });
});

test("admin API rejects mobile records without TGP", async () => {
  await withApi(async ({ baseUrl }) => {
    const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
    const updated = { ...gpu, specs: { ...gpu.specs, tgpRangeW: "" } };

    const response = await putGpu(baseUrl, "rtx-4070-laptop", updated);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.errors.some((error) => error.includes("mobile GPU missing specs.tgpRangeW")));
  });
});

test("admin API rejects invalid performanceIndex", async () => {
  await withApi(async ({ baseUrl }) => {
    const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
    const updated = { ...gpu, performanceIndex: 0 };

    const response = await putGpu(baseUrl, "rtx-4070-laptop", updated);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.errors.some((error) => error.includes("invalid performanceIndex")));
  });
});

test("admin API rejects duplicate ids", async () => {
  await withApi(async ({ baseUrl }) => {
    const gpu = gpus.find((item) => item.id === "rtx-4070-laptop");
    const updated = { ...gpu, id: "rtx-4090-desktop" };

    const response = await putGpu(baseUrl, "rtx-4070-laptop", updated);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.ok(body.errors.some((error) => error.includes("Duplicate id")));
  });
});

test("static server sends JavaScript MIME for mjs modules", async () => {
  await withApi(async ({ baseUrl, root }) => {
    await mkdir(join(root, "scripts"), { recursive: true });
    await writeFile(join(root, "scripts", "probe.mjs"), "export const ok = true;\n");

    const response = await fetch(`${baseUrl}/scripts/probe.mjs`);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/javascript; charset=utf-8");
  });
});

async function withApi(callback) {
  const root = await mkdtemp(join(tmpdir(), "gpu-admin-api-"));
  await mkdir(join(root, "src", "data"), { recursive: true });
  await writeGpuJson(gpus, root);
  await writeGpuModule(gpus, root);

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

function putGpu(baseUrl, id, gpu) {
  return fetch(`${baseUrl}/api/gpus/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gpu)
  });
}
