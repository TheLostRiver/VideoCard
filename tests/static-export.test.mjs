import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

let tempDir;

before(async () => {
  tempDir = await mkdtemp(path.join(tmpdir(), "export-test-"));
});

after(async () => {
  if (tempDir) await rm(tempDir, { recursive: true, force: true });
});

describe("static export script", () => {
  it("exports category and item JSON files", async () => {
    const { exportStaticData } = await import("../scripts/export-static-data.mjs");
    await exportStaticData({ outputDir: tempDir });

    const files = await readdir(tempDir);
    assert.ok(files.includes("categories.json"), "should write categories.json");

    const categoriesRaw = await readFile(path.join(tempDir, "categories.json"), "utf8");
    const categories = JSON.parse(categoriesRaw);
    assert.ok(Array.isArray(categories), "categories.json should be an array");
    assert.ok(categories.length > 0, "should export at least one category");
    assert.ok(categories[0].id, "category should have an id");

    const gpuDir = path.join(tempDir, "gpu");
    const gpuFiles = await readdir(gpuDir);
    assert.ok(gpuFiles.length > 0, "gpu directory should contain item files");

    const firstItemRaw = await readFile(path.join(gpuDir, gpuFiles[0]), "utf8");
    const firstItem = JSON.parse(firstItemRaw);
    assert.ok(firstItem.item?.id || firstItem.id, "item file should contain an item with id");
  });

  it("exports all categories from repository", async () => {
    const subDir = await mkdtemp(path.join(tempDir, "all-"));
    const { exportStaticData } = await import("../scripts/export-static-data.mjs");
    await exportStaticData({ outputDir: subDir });

    const categoriesRaw = await readFile(path.join(subDir, "categories.json"), "utf8");
    const categories = JSON.parse(categoriesRaw);
    const categoryIds = categories.map((c) => c.id);
    assert.ok(categoryIds.includes("gpu"), "should include gpu category");
    assert.ok(categoryIds.includes("desktop-cpu"), "should include desktop-cpu category");
  });

  it("rejects when outputDir is missing", async () => {
    const { exportStaticData } = await import("../scripts/export-static-data.mjs");
    await assert.rejects(() => exportStaticData({}), /outputDir/);
  });
});
