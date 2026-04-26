export function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "待补充";
  return new Intl.NumberFormat("zh-CN").format(value);
}

export function formatClock(value) {
  if (value === null || value === undefined) return "待补充";
  return `${formatNumber(value)} MHz`;
}

export function formatMemory(gpu) {
  const size = gpu.specs?.memorySizeGB;
  const type = gpu.specs?.memoryType;
  if (!size && !type) return "待补充";
  if (!size) return type;
  if (!type) return `${size}GB`;
  return `${size}GB ${type}`;
}

export function formatPower(gpu) {
  if (gpu.segment === "mobile") return gpu.specs?.tgpRangeW || "待补充";
  const power = gpu.specs?.powerW;
  return power ? `${power}W` : "待补充";
}

export function formatBenchmark(value) {
  if (value === null || value === undefined) return "待补充";
  return formatNumber(value);
}
