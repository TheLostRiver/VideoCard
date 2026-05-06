export function createBenchmarkSuiteRegistry(data) {
  const suites = Array.isArray(data?.suites) ? data.suites : [];
  const suiteMap = new Map(suites.map((suite) => [suite.id, suite]));

  function getSuite(id) {
    if (!id) return null;
    return suiteMap.get(id) || null;
  }

  function listSuites() {
    return [...suites];
  }

  function resolveSuiteRef(ref) {
    if (typeof ref !== "string" || !ref.includes(".")) return null;
    const [suiteId, scoreId] = ref.split(".", 2);
    const suite = suiteMap.get(suiteId);
    if (!suite) return null;
    const score = (suite.scores || []).find((s) => s.id === scoreId);
    if (!score) return null;
    return {
      suiteId,
      scoreId,
      label: score.label,
      shortLabel: suite.shortLabel,
      suiteLabel: suite.label,
      biggerIsBetter: score.biggerIsBetter !== false
    };
  }

  return { getSuite, listSuites, resolveSuiteRef };
}
