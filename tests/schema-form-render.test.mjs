import test from "node:test";
import assert from "node:assert/strict";
import { renderSchemaForm } from "../src/features/schema-form/render-schema-form.js";

const schema = {
  id: "demo-hardware",
  adminForm: {
    groups: [
      {
        id: "basic",
        title: "Basic",
        fields: [
          { kind: "property", key: "name", label: "Name", inputType: "text", required: true },
          {
            kind: "property",
            key: "status",
            label: "Status",
            inputType: "select",
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" }
            ]
          },
          { kind: "property", key: "notes", label: "Notes", inputType: "textarea" }
        ]
      },
      {
        id: "metrics",
        title: "Metrics",
        fields: [
          { kind: "metric", metricId: "demo.score", required: true },
          { kind: "metric", metricId: "demo.tuning", inputType: "range", min: 0, max: 100, step: 5 }
        ]
      }
    ]
  },
  metrics: [
    { id: "demo.score", label: "Score", valueType: "number" },
    { id: "demo.tuning", label: "Tuning", valueType: "number" }
  ]
};

const detail = {
  item: {
    id: "demo-card",
    name: "Demo <GPU>",
    status: "published",
    notes: "Line one\nLine two"
  },
  metricValues: [
    { metricId: "demo.score", valueNumber: 123 },
    { metricId: "demo.tuning", valueNumber: 75 }
  ]
};

test("renderSchemaForm renders text, number, select, textarea, and range fields from schema", () => {
  const html = renderSchemaForm({ schema, detail });

  assert.match(html, /<form class="schema-form" data-category-id="demo-hardware">/);
  assert.match(html, /<fieldset class="schema-form-fieldset" data-group-id="basic">/);
  assert.match(html, /name="property:name" type="text" value="Demo &lt;GPU&gt;"/);
  assert.match(html, /<select name="property:status"/);
  assert.match(html, /<option value="published" selected>Published<\/option>/);
  assert.match(html, /<textarea name="property:notes" rows="4">Line one\nLine two<\/textarea>/);
  assert.match(html, /name="metric:demo.score" type="number" value="123"/);
  assert.match(html, /name="metric:demo.tuning" type="range" value="75" min="0" max="100" step="5"/);
});

test("renderSchemaForm renders required markers and required attributes", () => {
  const html = renderSchemaForm({ schema, detail });

  assert.match(html, /<span class="schema-form-required" aria-label="required">\*<\/span>/);
  assert.match(html, /name="property:name" type="text" value="Demo &lt;GPU&gt;" required/);
  assert.match(html, /name="metric:demo.score" type="number" value="123" required/);
});

test("renderSchemaForm field names use stable kind-prefixed keys", () => {
  const html = renderSchemaForm({ schema, detail });

  assert.match(html, /data-field-key="property:name"/);
  assert.match(html, /data-field-key="property:status"/);
  assert.match(html, /data-field-key="property:notes"/);
  assert.match(html, /data-field-key="metric:demo.score"/);
  assert.match(html, /data-field-key="metric:demo.tuning"/);
});
