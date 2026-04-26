export function filterGpus(gpus, filters) {
  const query = filters.query.trim().toLowerCase();
  return gpus.filter((gpu) => {
    const matchesQuery = !query || [
      gpu.name,
      gpu.brand,
      gpu.segment,
      gpu.generation,
      gpu.architecture
    ].join(" ").toLowerCase().includes(query);

    const matchesBrand = filters.brands.size === 0 || filters.brands.has(gpu.brand);
    const matchesSegment = filters.segments.size === 0 || filters.segments.has(gpu.segment);
    const matchesGeneration = filters.generations.size === 0 || filters.generations.has(gpu.generation);

    return matchesQuery && matchesBrand && matchesSegment && matchesGeneration;
  });
}

export function sortGpus(gpus, sortBy) {
  return [...gpus].sort((a, b) => getSortValue(b, sortBy) - getSortValue(a, sortBy));
}

function getSortValue(gpu, sortBy) {
  if (sortBy === "timeSpy") return gpu.benchmarks?.timeSpyGraphics || 0;
  if (sortBy === "memory") return gpu.specs?.memorySizeGB || 0;
  if (sortBy === "efficiency") {
    const power = gpu.specs?.powerW || parseMobileTgp(gpu.specs?.tgpRangeW);
    return power ? gpu.performanceIndex / power : 0;
  }
  return gpu.performanceIndex;
}

function parseMobileTgp(value) {
  if (!value) return null;
  const matches = value.match(/\d+/g);
  if (!matches?.length) return null;
  return Number(matches[matches.length - 1]);
}
