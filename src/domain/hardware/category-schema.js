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

  validateRankingProfiles(schema, schemaId, metricIds, errors);

  return errors;
}

function validateRankingProfiles(schema, schemaId, metricIds, errors) {
  const rankingProfiles = schema?.rankingProfiles;
  if (!rankingProfiles) return;
  if (!Array.isArray(rankingProfiles.profiles)) {
    errors.push(`${schemaId} rankingProfiles.profiles must be an array`);
    return;
  }

  const profileIds = new Set();
  for (const profile of rankingProfiles.profiles) {
    if (!profile?.id) errors.push(`${schemaId} rankingProfile missing id`);
    if (profile?.id && profileIds.has(profile.id)) {
      errors.push(`${schemaId} duplicate rankingProfile id: ${profile.id}`);
    }
    if (profile?.id) profileIds.add(profile.id);
    if (!profile?.kind) errors.push(`${schemaId} rankingProfile missing kind`);

    const profileLabel = profile?.id || "<anonymous>";
    if (profile?.kind === "metric") {
      if (!profile.metricId) {
        errors.push(`${schemaId} rankingProfile ${profileLabel} missing metricId`);
      } else if (!metricIds.has(profile.metricId)) {
        errors.push(`${schemaId} rankingProfile ${profileLabel} references unknown metricId: ${profile.metricId}`);
      }
    } else if (profile?.kind === "composite") {
      if (!Array.isArray(profile.components) || profile.components.length === 0) {
        errors.push(`${schemaId} rankingProfile ${profileLabel} missing components`);
      } else {
        for (const component of profile.components) {
          if (!component?.metricId) {
            errors.push(`${schemaId} rankingProfile ${profileLabel} component missing metricId`);
          } else if (!metricIds.has(component.metricId)) {
            errors.push(`${schemaId} rankingProfile ${profileLabel} references unknown metricId: ${component.metricId}`);
          }
        }
      }
    } else if (profile?.kind === "derived") {
      if (profile.formula !== "ratio") {
        errors.push(`${schemaId} rankingProfile ${profileLabel} unsupported formula: ${profile.formula || "<missing>"}`);
      }
      if (!profile.numerator) errors.push(`${schemaId} rankingProfile ${profileLabel} missing numerator`);
      if (!profile.denominator) errors.push(`${schemaId} rankingProfile ${profileLabel} missing denominator`);
      validateDerivedSelector(`${schemaId} rankingProfile ${profileLabel} numerator`, profile.numerator, metricIds, errors);
      validateDerivedSelector(`${schemaId} rankingProfile ${profileLabel} denominator`, profile.denominator, metricIds, errors);
    } else if (profile?.kind) {
      errors.push(`${schemaId} rankingProfile ${profileLabel} unsupported kind: ${profile.kind}`);
    }
  }

  if (rankingProfiles.default && !profileIds.has(rankingProfiles.default)) {
    errors.push(`${schemaId} rankingProfiles default references unknown profile: ${rankingProfiles.default}`);
  }
}

function validateDerivedSelector(scope, selector, metricIds, errors) {
  if (!selector) return;
  const ids = Array.isArray(selector.metricIds) ? selector.metricIds.filter(Boolean) : [];
  if (selector.metricId) ids.push(selector.metricId);
  if (ids.length === 0) {
    errors.push(`${scope} missing metricId`);
    return;
  }
  for (const metricId of ids) {
    if (!metricIds.has(metricId)) {
      errors.push(`${scope} references unknown metricId: ${metricId}`);
    }
  }
}

export function assertValidCategorySchema(schema) {
  const errors = validateCategorySchema(schema);
  if (errors.length) {
    const error = new Error(errors.join("\n"));
    error.errors = errors;
    throw error;
  }
}
