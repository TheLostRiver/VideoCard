import { readFile } from "node:fs/promises";
import { createBenchmarkSuiteRegistry } from "../../application/benchmark-suite-registry.js";

const defaultBenchmarkSuitesUrl = new URL("../../data/benchmark-suites.json", import.meta.url);

export async function loadBenchmarkSuiteData(url = defaultBenchmarkSuitesUrl) {
  return JSON.parse(await readFile(url, "utf8"));
}

export async function loadDefaultBenchmarkSuiteRegistry(url = defaultBenchmarkSuitesUrl) {
  return createBenchmarkSuiteRegistry(await loadBenchmarkSuiteData(url));
}
