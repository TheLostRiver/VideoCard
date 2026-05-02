import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("hardware data validation script", () => {
  it("validates all category schemas and item data without error", async () => {
    const { validateHardwareData } = await import("../scripts/validate-hardware-data.mjs");
    const result = await validateHardwareData();
    assert.ok(result.categoryCount >= 2, "should validate at least 2 categories");
    assert.ok(result.itemCount >= 12, "should validate at least 12 items");
    assert.deepEqual(result.errors, [], "should have no validation errors");
  });

  it("reports invalid category schema", async () => {
    const { validateCategorySchema } = await import("../src/domain/hardware/category-schema.js");
    const badSchema = { id: "bad", label: "Bad" };
    const errors = validateCategorySchema(badSchema);
    assert.ok(errors.length > 0, "should report errors for missing required fields");
  });

  it("rejects when category schema file is malformed", async () => {
    const { validateHardwareData } = await import("../scripts/validate-hardware-data.mjs");
    const result = await validateHardwareData({
      categoriesDir: "tests/fixtures/bad-schemas",
    });
    assert.ok(result.errors.length > 0, "should report validation errors");
  });
});
