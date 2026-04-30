import test from "node:test";
import assert from "node:assert/strict";
import { assertValidCategorySchema, validateCategorySchema } from "../src/domain/hardware/category-schema.js";

function createValidGpuSchema(overrides = {}) {
  return {
    id: "gpu",
    label: "GPU",
    listView: {
      titleField: "name",
      subtitleField: "vendor"
    },
    detailView: {
      groups: [
        {
          id: "overview",
          title: "Overview",
          metricIds: ["gpu.core.count", "gpu.memory.size"]
        }
      ]
    },
    adminForm: {
      groups: [
        {
          id: "basic",
          title: "Basic",
          fields: [{ kind: "metric", metricId: "gpu.core.count" }]
        }
      ]
    },
    metrics: [
      {
        id: "gpu.core.count",
        label: "Core Count",
        valueType: "number",
        formatterId: "number"
      },
      {
        id: "gpu.memory.size",
        label: "Memory",
        valueType: "number",
        formatterId: "capacity-gb"
      }
    ],
    ...overrides
  };
}

test("validateCategorySchema accepts a complete GPU schema", () => {
  assert.deepEqual(validateCategorySchema(createValidGpuSchema()), []);
  assert.doesNotThrow(() => assertValidCategorySchema(createValidGpuSchema()));
});

test("validateCategorySchema reports missing category id", () => {
  const schema = createValidGpuSchema({ id: "" });

  assert.ok(validateCategorySchema(schema).includes("category schema missing id"));
});

test("validateCategorySchema reports missing listView", () => {
  const { listView, ...schema } = createValidGpuSchema();

  assert.ok(validateCategorySchema(schema).includes("gpu missing listView"));
});

test("validateCategorySchema reports metric field missing metricId", () => {
  const schema = createValidGpuSchema({
    adminForm: {
      groups: [
        {
          id: "basic",
          title: "Basic",
          fields: [{ kind: "metric" }]
        }
      ]
    }
  });

  assert.ok(validateCategorySchema(schema).includes("gpu admin field missing metricId"));
});

test("validateCategorySchema reports metric missing id", () => {
  const schema = createValidGpuSchema({
    metrics: [{ label: "Broken Metric", valueType: "number", formatterId: "number" }]
  });

  assert.ok(validateCategorySchema(schema).includes("gpu metric missing id"));
});

test("validateCategorySchema reports duplicate metric ids", () => {
  const schema = createValidGpuSchema({
    metrics: [
      {
        id: "gpu.core.count",
        label: "Core Count",
        valueType: "number",
        formatterId: "number"
      },
      {
        id: "gpu.core.count",
        label: "Core Count Copy",
        valueType: "number",
        formatterId: "number"
      }
    ]
  });

  assert.ok(validateCategorySchema(schema).includes("gpu duplicate metric id: gpu.core.count"));
});

test("assertValidCategorySchema throws with validation errors", () => {
  assert.throws(() => assertValidCategorySchema(createValidGpuSchema({ label: "" })), /gpu missing label/);
});
