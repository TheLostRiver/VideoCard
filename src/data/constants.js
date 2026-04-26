export const BRANDS = {
  nvidia: { label: "NVIDIA", color: "#76b900" },
  amd: { label: "AMD", color: "#ed1c24" },
  intel: { label: "Intel", color: "#0071c5" }
};

export const SEGMENTS = {
  desktop: "Desktop",
  mobile: "Mobile"
};

export const TIERS = {
  flagship: { label: "旗舰", hint: "4K 高画质或高刷新" },
  enthusiast: { label: "次旗舰", hint: "1440p 高刷或部分 4K" },
  high: { label: "高端", hint: "1440p 体验较好" },
  mainstream: { label: "主流甜点", hint: "1080p/1440p" },
  entry: { label: "入门", hint: "1080p 或轻量游戏" },
  legacy: { label: "旧卡参考", hint: "升级对比" }
};

export const TIER_ORDER = ["flagship", "enthusiast", "high", "mainstream", "entry", "legacy"];

export const SORT_OPTIONS = {
  performance: "综合性能",
  timeSpy: "Time Spy",
  memory: "显存容量",
  efficiency: "能效"
};
