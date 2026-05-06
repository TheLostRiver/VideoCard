import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createBenchmarkSuiteRegistry } from "../src/application/benchmark-suite-registry.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "..", "src", "data", "benchmark-suites.json");

async function loadRegistryData() {
  return JSON.parse(await readFile(dataPath, "utf8"));
}

test("benchmark-suites.json defines required suites with scores", async () => {
  const data = await loadRegistryData();
  assert.ok(Array.isArray(data.suites) && data.suites.length > 0, "suites array must be non-empty");

  const ids = new Set(data.suites.map((s) => s.id));
  for (const required of [
    "geekbench6",
    "cinebench-r23",
    "antutu",
    "3dmark-wild-life",
    "metal",
    "3dmark-time-spy"
  ]) {
    assert.ok(ids.has(required), `missing required suite: ${required}`);
  }

  for (const suite of data.suites) {
    assert.ok(suite.id, "suite must have id");
    assert.ok(suite.label, `suite ${suite.id} missing label`);
    assert.ok(Array.isArray(suite.scores) && suite.scores.length > 0, `suite ${suite.id} must have scores`);
    for (const score of suite.scores) {
      assert.ok(score.id, `suite ${suite.id} score missing id`);
      assert.ok(score.label, `suite ${suite.id}.${score.id} missing label`);
    }
  }
});

test("createBenchmarkSuiteRegistry exposes getSuite / resolveSuiteRef / listSuites", async () => {
  const data = await loadRegistryData();
  const registry = createBenchmarkSuiteRegistry(data);

  assert.equal(typeof registry.getSuite, "function");
  assert.equal(typeof registry.resolveSuiteRef, "function");
  assert.equal(typeof registry.listSuites, "function");

  assert.equal(registry.listSuites().length, data.suites.length);
  assert.equal(registry.getSuite("geekbench6").id, "geekbench6");
  assert.equal(registry.getSuite("nope"), null);
});

test("resolveSuiteRef returns label + biggerIsBetter from suite registry", async () => {
  const data = await loadRegistryData();
  const registry = createBenchmarkSuiteRegistry(data);

  const ref = registry.resolveSuiteRef("geekbench6.single");
  assert.ok(ref, "ref must exist");
  assert.equal(ref.suiteId, "geekbench6");
  assert.equal(ref.scoreId, "single");
  assert.equal(ref.label, "GB6 单核");
  assert.equal(ref.biggerIsBetter, true);
});

test("resolveSuiteRef returns null for unknown ref", async () => {
  const data = await loadRegistryData();
  const registry = createBenchmarkSuiteRegistry(data);

  assert.equal(registry.resolveSuiteRef("nope.score"), null);
  assert.equal(registry.resolveSuiteRef("geekbench6.unknown"), null);
  assert.equal(registry.resolveSuiteRef(""), null);
  assert.equal(registry.resolveSuiteRef(null), null);
});
