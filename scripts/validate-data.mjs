import { gpus } from "../src/data/gpus.js";
import { BRANDS, SEGMENTS, TIERS } from "../src/data/constants.js";

const errors = [];
const ids = new Set();

for (const gpu of gpus) {
  if (!gpu.id) errors.push("GPU missing id");
  if (ids.has(gpu.id)) errors.push(`Duplicate id: ${gpu.id}`);
  ids.add(gpu.id);

  if (!gpu.name) errors.push(`${gpu.id} missing name`);
  if (!BRANDS[gpu.brand]) errors.push(`${gpu.id} has invalid brand: ${gpu.brand}`);
  if (!SEGMENTS[gpu.segment]) errors.push(`${gpu.id} has invalid segment: ${gpu.segment}`);
  if (!TIERS[gpu.tier]) errors.push(`${gpu.id} has invalid tier: ${gpu.tier}`);
  if (typeof gpu.performanceIndex !== "number" || gpu.performanceIndex <= 0) {
    errors.push(`${gpu.id} has invalid performanceIndex`);
  }
  if (!gpu.specs?.coresLabel) errors.push(`${gpu.id} missing specs.coresLabel`);
  if (gpu.segment === "mobile" && !gpu.specs?.tgpRangeW) {
    errors.push(`${gpu.id} mobile GPU missing specs.tgpRangeW`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${gpus.length} GPU records.`);
