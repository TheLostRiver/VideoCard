export function validateCategorySchema(schema) {
  const errors = [];
  const schemaId = schema?.id || "category";

  if (!schema?.id) errors.push("category schema missing id");
  if (!schema?.label) errors.push(`${schemaId} missing label`);
  if (!schema?.listView) errors.push(`${schemaId} missing listView`);
  if (!schema?.detailView?.groups?.length) errors.push(`${schemaId} missing detailView groups`);
  if (!schema?.adminForm?.groups?.length) errors.push(`${schemaId} missing adminForm groups`);

  const metricIds = new Set();
  for (const metric of schema?.metrics || []) {
    if (!metric.id) errors.push(`${schemaId} metric missing id`);
    if (metric.id && metricIds.has(metric.id)) errors.push(`${schemaId} duplicate metric id: ${metric.id}`);
    if (metric.id) metricIds.add(metric.id);
    if (!metric.label) errors.push(`${metric.id || "metric"} missing label`);
    if (!metric.valueType) errors.push(`${metric.id || "metric"} missing valueType`);
    if (!metric.formatterId) errors.push(`${metric.id || "metric"} missing formatterId`);
  }

  for (const group of schema?.adminForm?.groups || []) {
    for (const field of group.fields || []) {
      if (field.kind === "metric" && !field.metricId) {
        errors.push(`${schemaId} admin field missing metricId`);
      }
    }
  }

  return errors;
}

export function assertValidCategorySchema(schema) {
  const errors = validateCategorySchema(schema);
  if (errors.length) {
    const error = new Error(errors.join("\n"));
    error.errors = errors;
    throw error;
  }
}
