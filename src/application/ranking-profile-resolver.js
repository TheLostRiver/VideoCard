export function createRankingProfileResolver({ category, suiteRegistry } = {}) {
  if (!category) throw new Error("ranking profile resolver requires category");

  const profiles = category.rankingProfiles?.profiles || [];
  const defaultId = category.rankingProfiles?.default || profiles[0]?.id || null;
  const scoreFieldId = category.listView?.scoreField || null;
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  function listProfiles() {
    return profiles.map((profile) => describeProfile(profile));
  }

  function getDefaultProfileId() {
    return defaultId;
  }

  function describeProfile(profile) {
    const ref = profile.suiteRef ? suiteRegistry?.resolveSuiteRef?.(profile.suiteRef) : null;
    const label = profile.label || ref?.label || humanizeId(profile.id);
    const biggerIsBetter = profile.biggerIsBetter !== undefined
      ? Boolean(profile.biggerIsBetter)
      : (ref ? ref.biggerIsBetter : true);
    return {
      id: profile.id,
      label,
      kind: profile.kind,
      biggerIsBetter,
      isDefault: profile.id === defaultId
    };
  }

  function compute(profileId, detail) {
    const profile = profileMap.get(profileId);
    if (!profile || !detail) return null;
    if (profile.kind === "metric") return computeMetric(profile, detail);
    if (profile.kind === "composite") return computeComposite(profile, detail);
    if (profile.kind === "derived") return computeDerived(profile, detail);
    return null;
  }

  function computeMetric(profile, detail) {
    return resolveMetricNumber(detail, profile.metricId);
  }

  function computeComposite(profile, detail) {
    const components = profile.components || [];
    let weightedSum = 0;
    let totalWeight = 0;
    for (const component of components) {
      const value = resolveMetricNumber(detail, component.metricId);
      if (value == null) continue;
      const weight = Number.isFinite(component.weight) ? component.weight : (1 / components.length);
      const reference = Number.isFinite(component.reference) && component.reference !== 0
        ? component.reference
        : 1;
      weightedSum += (value / reference) * 100 * weight;
      totalWeight += weight;
    }
    if (totalWeight === 0) return null;
    return Math.round(weightedSum / totalWeight);
  }

  function computeDerived(profile, detail) {
    if (profile.formula === "ratio") {
      const numerator = resolveSelector(detail, profile.numerator);
      const denominator = resolveSelector(detail, profile.denominator);
      if (numerator == null || denominator == null || denominator === 0) return null;
      return numerator / denominator;
    }
    return null;
  }

  function resolveSelector(detail, selector) {
    if (!selector) return null;
    const ids = Array.isArray(selector.metricIds) && selector.metricIds.length
      ? selector.metricIds
      : selector.metricId
        ? [selector.metricId]
        : [];
    for (const metricId of ids) {
      const value = resolveMetricNumber(detail, metricId, selector.rangeAggregation);
      if (value != null) return value;
    }
    return null;
  }

  function resolveMetricNumber(detail, metricId, rangeAggregation = "max") {
    if (!metricId || !detail) return null;
    if (scoreFieldId && metricId === scoreFieldId && detail.rankingScore && detail.rankingScore.score != null) {
      return detail.rankingScore.score;
    }
    const metricValue = (detail.metricValues || []).find((mv) => mv.metricId === metricId);
    if (!metricValue) return null;
    if (typeof metricValue.valueNumber === "number") return metricValue.valueNumber;
    if (metricValue.valueMin != null || metricValue.valueMax != null) {
      const min = typeof metricValue.valueMin === "number" ? metricValue.valueMin : metricValue.valueMax;
      const max = typeof metricValue.valueMax === "number" ? metricValue.valueMax : metricValue.valueMin;
      if (rangeAggregation === "min") return min;
      if (rangeAggregation === "avg" && typeof min === "number" && typeof max === "number") return (min + max) / 2;
      return max;
    }
    return null;
  }

  return { listProfiles, getDefaultProfileId, compute };
}

function humanizeId(id) {
  return String(id || "profile");
}
