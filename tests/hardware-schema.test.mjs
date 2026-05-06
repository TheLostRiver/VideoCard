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

test("validateCategorySchema accepts rankingProfiles with metric/composite/derived kinds", () => {
  const schema = createValidGpuSchema({
    rankingProfiles: {
      default: "performance",
      profiles: [
        { id: "performance", kind: "metric", metricId: "gpu.core.count", label: "Performance" },
        {
          id: "composite",
          kind: "composite",
          label: "Composite",
          components: [
            { metricId: "gpu.core.count", weight: 0.5, reference: 1000 },
            { metricId: "gpu.memory.size", weight: 0.5, reference: 16 }
          ]
        },
        {
          id: "ratio",
          kind: "derived",
          label: "Ratio",
          formula: "ratio",
          numerator: { metricId: "gpu.core.count" },
          denominator: { metricId: "gpu.memory.size" }
        }
      ]
    }
  });

  assert.deepEqual(validateCategorySchema(schema), []);
});

test("validateCategorySchema reports rankingProfile missing id or kind", () => {
  const schema = createValidGpuSchema({
    rankingProfiles: { default: "performance", profiles: [{ label: "Broken" }] }
  });

  const errors = validateCategorySchema(schema);
  assert.ok(errors.some((e) => e.includes("rankingProfile missing id")), errors.join("\n"));
  assert.ok(errors.some((e) => e.includes("rankingProfile missing kind")), errors.join("\n"));
});

test("validateCategorySchema reports rankingProfile metric kind missing metricId", () => {
  const schema = createValidGpuSchema({
    rankingProfiles: { default: "performance", profiles: [{ id: "performance", kind: "metric" }] }
  });

  const errors = validateCategorySchema(schema);
  assert.ok(errors.some((e) => e.includes("rankingProfile performance missing metricId")), errors.join("\n"));
});

test("validateCategorySchema reports rankingProfile metric kind referencing unknown metric", () => {
  const schema = createValidGpuSchema({
    rankingProfiles: {
      default: "performance",
      profiles: [{ id: "performance", kind: "metric", metricId: "gpu.unknown" }]
    }
  });

  const errors = validateCategorySchema(schema);
  assert.ok(errors.some((e) => e.includes("rankingProfile performance references unknown metricId: gpu.unknown")), errors.join("\n"));
});

test("validateCategorySchema reports rankingProfile composite without components", () => {
  const schema = createValidGpuSchema({
    rankingProfiles: { default: "composite", profiles: [{ id: "composite", kind: "composite" }] }
  });

  const errors = validateCategorySchema(schema);
  assert.ok(errors.some((e) => e.includes("rankingProfile composite missing components")), errors.join("\n"));
});

test("validateCategorySchema reports rankingProfile derived ratio missing numerator/denominator", () => {
  const schema = createValidGpuSchema({
    rankingProfiles: {
      default: "x",
      profiles: [{ id: "x", kind: "derived", formula: "ratio" }]
    }
  });

  const errors = validateCategorySchema(schema);
  assert.ok(errors.some((e) => e.includes("rankingProfile x missing numerator")), errors.join("\n"));
  assert.ok(errors.some((e) => e.includes("rankingProfile x missing denominator")), errors.join("\n"));
});

test("validateCategorySchema reports rankingProfiles default referencing unknown profile", () => {
  const schema = createValidGpuSchema({
    rankingProfiles: { default: "missing", profiles: [{ id: "performance", kind: "metric", metricId: "gpu.core.count" }] }
  });

  const errors = validateCategorySchema(schema);
  assert.ok(errors.some((e) => e.includes("rankingProfiles default references unknown profile: missing")), errors.join("\n"));
});
