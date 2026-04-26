import { TIER_ORDER } from "../data/constants.js";

export function groupByTier(gpus) {
  const groups = new Map(TIER_ORDER.map((tier) => [tier, []]));
  for (const gpu of gpus) {
    if (!groups.has(gpu.tier)) groups.set(gpu.tier, []);
    groups.get(gpu.tier).push(gpu);
  }
  return [...groups.entries()].filter(([, items]) => items.length > 0);
}

export function getPerformanceWidth(index, maxIndex) {
  if (!index || !maxIndex) return 8;
  return Math.max(8, Math.round((index / maxIndex) * 100));
}

export function getMaxPerformanceIndex(gpus) {
  return Math.max(...gpus.map((gpu) => gpu.performanceIndex), 1);
}
