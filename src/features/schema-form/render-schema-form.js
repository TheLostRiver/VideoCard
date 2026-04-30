export function renderSchemaForm({ schema, detail } = {}) {
  if (!schema) {
    return `<p class="schema-form-empty">请选择硬件类型</p>`;
  }

  const context = createRenderContext(schema, detail);

  return `
    <form class="schema-form" data-category-id="${escapeHtml(schema.id)}">
      ${(schema.adminForm?.groups || []).map((group) => renderSchemaFormGroup(group, context)).join("")}
    </form>
  `;
}

export function renderSchemaFormGroup(group, context) {
  return `
    <fieldset class="schema-form-fieldset" data-group-id="${escapeHtml(group.id)}">
      <legend>${escapeHtml(group.title)}</legend>
      <div class="schema-form-grid">
        ${(group.fields || []).map((field) => renderSchemaFormField(field, context)).join("")}
      </div>
    </fieldset>
  `;
}

export function renderSchemaFormField(field, context) {
  const descriptor = createFieldDescriptor(field, context);
  const wideClass = descriptor.inputType === "textarea" ? " schema-form-field-wide" : "";

  return `
    <label class="schema-form-field${wideClass}" data-field-key="${escapeHtml(descriptor.name)}">
      <span>${escapeHtml(descriptor.label)}${renderRequiredMarker(descriptor.required)}</span>
      ${renderControl(descriptor)}
    </label>
  `;
}

function createRenderContext(schema, detail) {
  return {
    detail,
    metricsById: new Map((schema.metrics || []).map((metric) => [metric.id, metric]))
  };
}

function createFieldDescriptor(field, context) {
  const metric = field.metricId ? context.metricsById.get(field.metricId) : null;
  const name = getStableFieldName(field);
  const label = field.label || metric?.label || field.key || field.metricId || "";
  const inputType = getInputType(field, metric);

  return {
    field,
    metric,
    name,
    label,
    inputType,
    value: getFieldValue(field, context.detail),
    options: normalizeOptions(field.options || metric?.options),
    required: Boolean(field.required || metric?.required)
  };
}

function getStableFieldName(field) {
  if (field.kind === "metric") return `metric:${field.metricId}`;
  return `property:${field.key}`;
}

function getInputType(field, metric) {
  if (field.inputType) return field.inputType;
  if (field.kind === "property" && (field.key === "notes" || field.key === "sources")) return "textarea";
  if (metric?.valueType === "number") return "number";
  if (metric?.valueType === "enum") return "select";
  return "text";
}

function getFieldValue(field, detail) {
  if (!detail) return "";
  if (field.kind === "metric") return getMetricValue(detail.metricValues || [], field.metricId);
  return stringifyFieldValue(getPath(detail.item || {}, field.key));
}

function getMetricValue(metricValues, metricId) {
  const metricValue = metricValues.find((value) => value.metricId === metricId);
  if (!metricValue) return "";
  if (metricValue.valueNumber !== undefined) return metricValue.valueNumber;
  if (metricValue.valueText !== undefined) return metricValue.valueText;
  if (metricValue.valueBoolean !== undefined) return metricValue.valueBoolean ? "true" : "false";
  if (metricValue.valueMin !== undefined && metricValue.valueMax !== undefined) {
    return `${metricValue.valueMin}-${metricValue.valueMax}${metricValue.unit || ""}`;
  }
  return "";
}

function renderControl(descriptor) {
  if (descriptor.inputType === "textarea") {
    return `<textarea name="${escapeHtml(descriptor.name)}" rows="4"${renderRequiredAttribute(descriptor.required)}>${escapeHtml(descriptor.value)}</textarea>`;
  }

  if (descriptor.inputType === "select") {
    return `
      <select name="${escapeHtml(descriptor.name)}"${renderRequiredAttribute(descriptor.required)}>
        ${descriptor.options.map((option) => renderOption(option, descriptor.value)).join("")}
      </select>
    `;
  }

  return `<input name="${escapeHtml(descriptor.name)}" type="${escapeHtml(descriptor.inputType)}" value="${escapeHtml(descriptor.value)}"${renderRangeAttributes(descriptor.field)}${renderRequiredAttribute(descriptor.required)}>`;
}

function renderOption(option, value) {
  const isSelected = String(option.value) === String(value);
  return `<option value="${escapeHtml(option.value)}"${isSelected ? " selected" : ""}>${escapeHtml(option.label)}</option>`;
}

function renderRangeAttributes(field) {
  return ["min", "max", "step"]
    .filter((key) => field[key] !== undefined)
    .map((key) => ` ${key}="${escapeHtml(field[key])}"`)
    .join("");
}

function renderRequiredMarker(required) {
  return required ? ` <span class="schema-form-required" aria-label="required">*</span>` : "";
}

function renderRequiredAttribute(required) {
  return required ? " required" : "";
}

function normalizeOptions(options) {
  if (!options) return [];
  if (Array.isArray(options)) {
    return options.map((option) => ({
      value: option.value ?? option.id ?? option.label,
      label: option.label ?? option.value ?? option.id
    }));
  }

  return Object.entries(options).map(([value, label]) => ({
    value,
    label: label?.label || label
  }));
}

function getPath(source, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((current, part) => current?.[part], source);
}

function stringifyFieldValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => {
      if (typeof entry === "string") return entry;
      if (entry?.label && entry?.url) return `${entry.label}|${entry.url}`;
      return JSON.stringify(entry);
    }).join("\n");
  }
  return value ?? "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
