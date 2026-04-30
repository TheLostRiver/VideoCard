import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gpus } from "../src/data/gpus.js";
import { createHardwareMutationService } from "../src/application/hardware-mutation-service.js";
import { createJsonHardwareRepository } from "../src/infrastructure/json/json-hardware-repository.js";
import { writeGpuJson, writeGpuModule } from "../scripts/gpu-data.mjs";

test("hardware mutation service saves GPU metric values through legacy gpus.json", async () => {
  await withMutationService(async ({ root, repository, service }) => {
    const detail = await repository.getItemDetail("rtx-4070-laptop");
    const nextDetail = replaceMetric(detail, "gpu.benchmark.timeSpyGraphics", { valueNumber: 13001 });

    const saved = await service.saveItemDetail(nextDetail);
    const json = JSON.parse(await readFile(join(root, "src", "data", "gpus.json"), "utf8"));
    const moduleText = await readFile(join(root, "src", "data", "gpus.js"), "utf8");

    assert.equal(metricById(saved.metricValues, "gpu.benchmark.timeSpyGraphics").valueNumber, 13001);
    assert.equal(json.find((gpu) => gpu.id === "rtx-4070-laptop").benchmarks.timeSpyGraphics, 13001);
    assert.match(moduleText, /"timeSpyGraphics": 13001/);
  });
});

test("hardware mutation service rejects mobile GPU saves without TGP range", async () => {
  await withMutationService(async ({ repository, service }) => {
    const detail = await repository.getItemDetail("rtx-4070-laptop");
    const nextDetail = replaceMetric(detail, "gpu.power.tgpRange", {
      valueText: "",
      valueMin: undefined,
      valueMax: undefined
    });

    await assert.rejects(
      () => service.saveItemDetail(nextDetail),
      /mobile GPU missing specs\.tgpRangeW/
    );
  });
});

test("hardware mutation service rejects invalid ranking scores", async () => {
  await withMutationService(async ({ repository, service }) => {
    const detail = await repository.getItemDetail("rtx-4070-laptop");
    const nextDetail = structuredClone(detail);
    nextDetail.rankingScore.score = 0;

    await assert.rejects(
      () => service.saveItemDetail(nextDetail),
      /invalid performanceIndex/
    );
  });
});

async function withMutationService(callback) {
  const root = await mkdtemp(join(tmpdir(), "gpu-mutation-service-"));
  await mkdir(join(root, "src", "data"), { recursive: true });
  await writeGpuJson(gpus, root);
  await writeGpuModule(gpus, root);

  const repository = createJsonHardwareRepository({ root });
  const service = createHardwareMutationService(repository);

  try {
    await callback({ root, repository, service });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function replaceMetric(detail, metricId, patch) {
  const nextDetail = structuredClone(detail);
  nextDetail.metricValues = nextDetail.metricValues.map((metricValue) => (
    metricValue.metricId === metricId
      ? { ...metricValue, ...patch }
      : metricValue
  ));
  return nextDetail;
}

function metricById(metricValues, metricId) {
  return metricValues.find((metricValue) => metricValue.metricId === metricId);
}
