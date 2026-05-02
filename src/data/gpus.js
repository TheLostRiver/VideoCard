export const gpus = [
  {
    "id": "rtx-4090-desktop",
    "name": "GeForce RTX 4090",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2022-10",
    "performanceIndex": 245,
    "tier": "flagship",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 16384,
      "baseClockMHz": 2235,
      "boostClockMHz": 2520,
      "memorySizeGB": 24,
      "memoryType": "GDDR6X",
      "memoryBusBit": 384,
      "bandwidthGBs": 1008,
      "powerW": 450,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 36000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "excellent",
      "efficiencyNote": "旗舰性能，功耗较高"
    },
    "notes": [
      "支持 DLSS 3",
      "适合高端 4K 游戏"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce",
        "url": "https://www.nvidia.com/en-us/geforce/"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4070-desktop",
    "name": "GeForce RTX 4070",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2023-04",
    "performanceIndex": 170,
    "tier": "high",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 5888,
      "baseClockMHz": 1920,
      "boostClockMHz": 2475,
      "memorySizeGB": 12,
      "memoryType": "GDDR6X",
      "memoryBusBit": 192,
      "bandwidthGBs": 504,
      "powerW": 200,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 17800,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1440p",
      "rayTracingLevel": "good",
      "efficiencyNote": "能效较好"
    },
    "notes": [
      "支持 DLSS 3"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce",
        "url": "https://www.nvidia.com/en-us/geforce/"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4060-desktop",
    "name": "GeForce RTX 4060",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2023-06",
    "performanceIndex": 100,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 3072,
      "baseClockMHz": 1830,
      "boostClockMHz": 2460,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": 272,
      "powerW": 115,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 10600,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "基准卡"
    },
    "gaming": {
      "recommendedResolution": "1080p",
      "rayTracingLevel": "medium",
      "efficiencyNote": "首版性能指数基准"
    },
    "notes": [
      "performanceIndex 基准值为 100"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce",
        "url": "https://www.nvidia.com/en-us/geforce/"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4070-laptop",
    "name": "GeForce RTX 4070 Laptop GPU",
    "brand": "nvidia",
    "segment": "mobile",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2023-02",
    "performanceIndex": 135,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 4608,
      "baseClockMHz": null,
      "boostClockMHz": 2175,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": 256,
      "powerW": null,
      "tgpRangeW": "45-115W"
    },
    "benchmarks": {
      "timeSpyGraphics": 12345,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "移动版参考典型高 TGP 机型"
    },
    "gaming": {
      "recommendedResolution": "1080p/1440p",
      "rayTracingLevel": "medium",
      "efficiencyNote": "实际表现受 TGP 和散热影响明显"
    },
    "notes": [
      "移动版不可直接等同桌面 RTX 4070",
      "同一 GPU 在不同笔记本中性能差异可能明显"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce Laptop",
        "url": "https://www.nvidia.com/en-us/geforce/laptops/"
      }
    ],
    "confidence": "estimated"
  },
  {
    "id": "rx-7900-xtx-desktop",
    "name": "Radeon RX 7900 XTX",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "RDNA 3",
    "releaseDate": "2022-12",
    "performanceIndex": 210,
    "tier": "enthusiast",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 6144,
      "baseClockMHz": null,
      "boostClockMHz": 2500,
      "memorySizeGB": 24,
      "memoryType": "GDDR6",
      "memoryBusBit": 384,
      "bandwidthGBs": 960,
      "powerW": 355,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 30000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "good",
      "efficiencyNote": "传统光栅性能强"
    },
    "notes": [
      "支持 FSR"
    ],
    "sources": [
      {
        "label": "AMD Radeon",
        "url": "https://www.amd.com/en/products/graphics/desktops.html"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rx-7800-xt-desktop",
    "name": "Radeon RX 7800 XT",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "RDNA 3",
    "releaseDate": "2023-09",
    "performanceIndex": 155,
    "tier": "high",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 3840,
      "baseClockMHz": null,
      "boostClockMHz": 2430,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": 624,
      "powerW": 263,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 20000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1440p",
      "rayTracingLevel": "medium",
      "efficiencyNote": "大显存甜点级"
    },
    "notes": [
      "16GB 显存适合 1440p 高画质"
    ],
    "sources": [
      {
        "label": "AMD Radeon",
        "url": "https://www.amd.com/en/products/graphics/desktops.html"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rx-7600-desktop",
    "name": "Radeon RX 7600",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "RDNA 3",
    "releaseDate": "2023-05",
    "performanceIndex": 92,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 2048,
      "baseClockMHz": null,
      "boostClockMHz": 2655,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": 288,
      "powerW": 165,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 10500,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1080p",
      "rayTracingLevel": "entry",
      "efficiencyNote": "1080p 主流选择"
    },
    "notes": [
      "支持 FSR"
    ],
    "sources": [
      {
        "label": "AMD Radeon",
        "url": "https://www.amd.com/en/products/graphics/desktops.html"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rx-7700s-mobile",
    "name": "Radeon RX 7700S",
    "brand": "amd",
    "segment": "mobile",
    "generation": "RX 7000",
    "architecture": "RDNA 3",
    "releaseDate": "2023-01",
    "performanceIndex": 105,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 2048,
      "baseClockMHz": null,
      "boostClockMHz": null,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": 288,
      "powerW": null,
      "tgpRangeW": "75-100W"
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "移动版参考典型高 TGP 机型"
    },
    "gaming": {
      "recommendedResolution": "1080p/1440p",
      "rayTracingLevel": "entry",
      "efficiencyNote": "轻薄性能本取向"
    },
    "notes": [
      "移动版性能受整机功耗和散热影响"
    ],
    "sources": [
      {
        "label": "AMD Radeon",
        "url": "https://www.amd.com/en/products/graphics/laptops.html"
      }
    ],
    "confidence": "estimated"
  },
  {
    "id": "arc-a770-desktop",
    "name": "Intel Arc A770",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arc A",
    "architecture": "Alchemist",
    "releaseDate": "2022-10",
    "performanceIndex": 110,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "Xe Cores",
      "cores": 32,
      "baseClockMHz": null,
      "boostClockMHz": 2100,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": 560,
      "powerW": 225,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 14000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1080p/1440p",
      "rayTracingLevel": "medium",
      "efficiencyNote": "驱动成熟度会影响不同游戏表现"
    },
    "notes": [
      "支持 XeSS",
      "老游戏表现可能波动"
    ],
    "sources": [
      {
        "label": "Intel Arc",
        "url": "https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "arc-b580-desktop",
    "name": "Intel Arc B580",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arc B",
    "architecture": "Battlemage",
    "releaseDate": "2024-12",
    "performanceIndex": 125,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "Xe Cores",
      "cores": 20,
      "baseClockMHz": null,
      "boostClockMHz": 2670,
      "memorySizeGB": 12,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": 456,
      "powerW": 190,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1080p/1440p",
      "rayTracingLevel": "medium",
      "efficiencyNote": "新一代 Arc 主流卡"
    },
    "notes": [
      "支持 XeSS"
    ],
    "sources": [
      {
        "label": "Intel Arc",
        "url": "https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html"
      }
    ],
    "confidence": "estimated"
  },
  {
    "id": "gtx-1080-ti-desktop",
    "name": "GeForce GTX 1080 Ti",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GTX 10",
    "architecture": "Pascal",
    "releaseDate": "2017-03",
    "performanceIndex": 95,
    "tier": "legacy",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 3584,
      "baseClockMHz": 1480,
      "boostClockMHz": 1582,
      "memorySizeGB": 11,
      "memoryType": "GDDR5X",
      "memoryBusBit": 352,
      "bandwidthGBs": 484,
      "powerW": 250,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 10000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "旧卡公开评测参考"
    },
    "gaming": {
      "recommendedResolution": "1080p/1440p",
      "rayTracingLevel": "none",
      "efficiencyNote": "旧旗舰，缺少现代特性"
    },
    "notes": [
      "不支持硬件光追",
      "适合作为升级对比基准"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce",
        "url": "https://www.nvidia.com/en-us/geforce/"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4080-desktop",
    "name": "GeForce RTX 4080",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2022-11",
    "performanceIndex": 220,
    "tier": "enthusiast",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 9728,
      "baseClockMHz": 2205,
      "boostClockMHz": 2505,
      "memorySizeGB": 16,
      "memoryType": "GDDR6X",
      "memoryBusBit": 256,
      "bandwidthGBs": 717,
      "powerW": 320,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 28000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "excellent",
      "efficiencyNote": "高端 4K 游戏首选"
    },
    "notes": [
      "支持 DLSS 3",
      "性能接近上代 4090"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce",
        "url": "https://www.nvidia.com/en-us/geforce/"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4070-ti-desktop",
    "name": "GeForce RTX 4070 Ti",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2023-01",
    "performanceIndex": 190,
    "tier": "high",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 7680,
      "baseClockMHz": 2310,
      "boostClockMHz": 2610,
      "memorySizeGB": 12,
      "memoryType": "GDDR6X",
      "memoryBusBit": 192,
      "bandwidthGBs": 504,
      "powerW": 285,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 22500,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1440p/4K",
      "rayTracingLevel": "excellent",
      "efficiencyNote": "1440p 高帧率甜点"
    },
    "notes": [
      "支持 DLSS 3"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce",
        "url": "https://www.nvidia.com/en-us/geforce/"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4060-laptop",
    "name": "GeForce RTX 4060 Laptop GPU",
    "brand": "nvidia",
    "segment": "mobile",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2023-02",
    "performanceIndex": 110,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 3072,
      "baseClockMHz": null,
      "boostClockMHz": 2370,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": 256,
      "powerW": null,
      "tgpRangeW": "35-115W"
    },
    "benchmarks": {
      "timeSpyGraphics": 10500,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "移动版参考典型高 TGP 机型"
    },
    "gaming": {
      "recommendedResolution": "1080p",
      "rayTracingLevel": "medium",
      "efficiencyNote": "主流游戏本常见配置"
    },
    "notes": [
      "移动版不可直接等同桌面 RTX 4060",
      "实际表现受 TGP 和散热影响"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce Laptop",
        "url": "https://www.nvidia.com/en-us/geforce/laptops/"
      }
    ],
    "confidence": "estimated"
  },
  {
    "id": "rx-7900-xt-desktop",
    "name": "Radeon RX 7900 XT",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "RDNA 3",
    "releaseDate": "2022-12",
    "performanceIndex": 195,
    "tier": "enthusiast",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 5376,
      "baseClockMHz": null,
      "boostClockMHz": 2400,
      "memorySizeGB": 20,
      "memoryType": "GDDR6",
      "memoryBusBit": 320,
      "bandwidthGBs": 800,
      "powerW": 315,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 25000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "good",
      "efficiencyNote": "大显存高性价比旗舰"
    },
    "notes": [
      "支持 FSR",
      "20GB 显存适合高分辨率"
    ],
    "sources": [
      {
        "label": "AMD Radeon",
        "url": "https://www.amd.com/en/products/graphics/desktops.html"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-3060-desktop",
    "name": "GeForce RTX 3060",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 30",
    "architecture": "Ampere",
    "releaseDate": "2021-02",
    "performanceIndex": 80,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 3584,
      "baseClockMHz": 1320,
      "boostClockMHz": 1777,
      "memorySizeGB": 12,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": 360,
      "powerW": 170,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 8700,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1080p",
      "rayTracingLevel": "medium",
      "efficiencyNote": "上代主流甜点卡"
    },
    "notes": [
      "支持 DLSS 2",
      "12GB 显存同代较大"
    ],
    "sources": [
      {
        "label": "NVIDIA GeForce",
        "url": "https://www.nvidia.com/en-us/geforce/"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rx-580-desktop",
    "name": "Radeon RX 580",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 500",
    "architecture": "Polaris",
    "releaseDate": "2017-04",
    "performanceIndex": 48,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 2304,
      "baseClockMHz": 1257,
      "boostClockMHz": 1340,
      "memorySizeGB": 8,
      "memoryType": "GDDR5",
      "memoryBusBit": 256,
      "bandwidthGBs": 256,
      "powerW": 185,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 4300,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "旧卡公开评测参考"
    },
    "gaming": {
      "recommendedResolution": "1080p",
      "rayTracingLevel": "none",
      "efficiencyNote": "旧主流卡，功耗偏高"
    },
    "notes": [
      "适合作为老平台升级参考"
    ],
    "sources": [
      {
        "label": "AMD Radeon",
        "url": "https://www.amd.com/en/products/graphics/desktops.html"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4080-super-desktop",
    "name": "GeForce RTX 4080 SUPER",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2024-01",
    "performanceIndex": 230,
    "tier": "flagship",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 10240,
      "baseClockMHz": 2295,
      "boostClockMHz": 2550,
      "memorySizeGB": 16,
      "memoryType": "GDDR6X",
      "memoryBusBit": 256,
      "bandwidthGBs": 736,
      "powerW": 320,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 28500,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "excellent",
      "efficiencyNote": "高性能 4K 游戏卡"
    },
    "notes": [
      "RTX 4080 小幅升级版"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4070-ti-super-desktop",
    "name": "GeForce RTX 4070 Ti SUPER",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2024-01",
    "performanceIndex": 210,
    "tier": "enthusiast",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 8448,
      "baseClockMHz": 2340,
      "boostClockMHz": 2610,
      "memorySizeGB": 16,
      "memoryType": "GDDR6X",
      "memoryBusBit": 256,
      "bandwidthGBs": 672,
      "powerW": 285,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 24000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "excellent",
      "efficiencyNote": "高性价比 4K 方案"
    },
    "notes": [
      "16GB 显存版本"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4060-ti-desktop",
    "name": "GeForce RTX 4060 Ti",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2023-05",
    "performanceIndex": 155,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 4352,
      "baseClockMHz": 2310,
      "boostClockMHz": 2535,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": 288,
      "powerW": 160,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 13500,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1440p",
      "rayTracingLevel": "good",
      "efficiencyNote": "主流 1080p/1440p 选择"
    },
    "notes": [
      "8GB 显存略显不足"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-3070-desktop",
    "name": "GeForce RTX 3070",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 30",
    "architecture": "Ampere",
    "releaseDate": "2020-10",
    "performanceIndex": 145,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 5888,
      "baseClockMHz": 1500,
      "boostClockMHz": 1725,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": 448,
      "powerW": 220,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 13000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1440p",
      "rayTracingLevel": "good",
      "efficiencyNote": "经典 1440p 游戏卡"
    },
    "notes": [
      "上代主力型号"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-3080-desktop",
    "name": "GeForce RTX 3080",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 30",
    "architecture": "Ampere",
    "releaseDate": "2020-09",
    "performanceIndex": 175,
    "tier": "high",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 8704,
      "baseClockMHz": 1440,
      "boostClockMHz": 1710,
      "memorySizeGB": 10,
      "memoryType": "GDDR6X",
      "memoryBusBit": 320,
      "bandwidthGBs": 760,
      "powerW": 320,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 17500,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "good",
      "efficiencyNote": "上代高端 4K 游戏卡"
    },
    "notes": [
      "Ampere 架构经典型号"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "gtx-1660-super-desktop",
    "name": "GeForce GTX 1660 SUPER",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GTX 16",
    "architecture": "Turing",
    "releaseDate": "2019-10",
    "performanceIndex": 70,
    "tier": "entry",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 1408,
      "baseClockMHz": 1530,
      "boostClockMHz": 1785,
      "memorySizeGB": 6,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": 336,
      "powerW": 125,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 6000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1080p",
      "rayTracingLevel": "none",
      "efficiencyNote": "入门级 1080p 游戏卡"
    },
    "notes": [
      "无光线追踪"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rx-6800-xt-desktop",
    "name": "Radeon RX 6800 XT",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 6000",
    "architecture": "RDNA 2",
    "releaseDate": "2020-11",
    "performanceIndex": 175,
    "tier": "high",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 4608,
      "baseClockMHz": 1825,
      "boostClockMHz": 2250,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": 512,
      "powerW": 300,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 17000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "moderate",
      "efficiencyNote": "16GB 大显存，高分辨率友好"
    },
    "notes": [
      "RDNA 2 高端型号"
    ],
    "sources": [
      {
        "label": "AMD",
        "url": "https://www.amd.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rx-6700-xt-desktop",
    "name": "Radeon RX 6700 XT",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 6000",
    "architecture": "RDNA 2",
    "releaseDate": "2021-03",
    "performanceIndex": 135,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 2560,
      "baseClockMHz": 2321,
      "boostClockMHz": 2581,
      "memorySizeGB": 12,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": 384,
      "powerW": 230,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 12000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1440p",
      "rayTracingLevel": "moderate",
      "efficiencyNote": "12GB 显存性价比不错"
    },
    "notes": [
      "RDNA 2 中高端"
    ],
    "sources": [
      {
        "label": "AMD",
        "url": "https://www.amd.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rx-7600-xt-desktop",
    "name": "Radeon RX 7600 XT",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "RDNA 3",
    "releaseDate": "2024-01",
    "performanceIndex": 125,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 2048,
      "baseClockMHz": 1720,
      "boostClockMHz": 2755,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": 288,
      "powerW": 150,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 10500,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1080p",
      "rayTracingLevel": "moderate",
      "efficiencyNote": "16GB 大显存入门卡"
    },
    "notes": [
      "RDNA 3 入门级"
    ],
    "sources": [
      {
        "label": "AMD",
        "url": "https://www.amd.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "arc-a750-desktop",
    "name": "Intel Arc A750",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arc A",
    "architecture": "Xe-HPG",
    "releaseDate": "2022-10",
    "performanceIndex": 100,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "Xe Cores",
      "cores": 28,
      "baseClockMHz": 2050,
      "boostClockMHz": 2400,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": 512,
      "powerW": 225,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": 10000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1080p",
      "rayTracingLevel": "moderate",
      "efficiencyNote": "Intel 独显入门选择"
    },
    "notes": [
      "Xe 架构独显"
    ],
    "sources": [
      {
        "label": "Intel",
        "url": "https://www.intel.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4090-laptop",
    "name": "GeForce RTX 4090 Laptop GPU",
    "brand": "nvidia",
    "segment": "mobile",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2023-02",
    "performanceIndex": 200,
    "tier": "enthusiast",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 9728,
      "baseClockMHz": 1455,
      "boostClockMHz": 2040,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": 576,
      "powerW": null,
      "tgpRangeW": [
        80,
        150
      ]
    },
    "benchmarks": {
      "timeSpyGraphics": 21000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "excellent",
      "efficiencyNote": "移动版旗舰，性能受 TGP 影响大"
    },
    "notes": [
      "移动版性能受 TGP 影响"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-4080-laptop",
    "name": "GeForce RTX 4080 Laptop GPU",
    "brand": "nvidia",
    "segment": "mobile",
    "generation": "RTX 40",
    "architecture": "Ada Lovelace",
    "releaseDate": "2023-02",
    "performanceIndex": 175,
    "tier": "high",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 7424,
      "baseClockMHz": 1455,
      "boostClockMHz": 2280,
      "memorySizeGB": 12,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": 432,
      "powerW": null,
      "tgpRangeW": [
        60,
        150
      ]
    },
    "benchmarks": {
      "timeSpyGraphics": 17000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "4K",
      "rayTracingLevel": "excellent",
      "efficiencyNote": "移动版高端选择"
    },
    "notes": [
      "移动版性能受 TGP 影响"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rtx-3070-laptop",
    "name": "GeForce RTX 3070 Laptop GPU",
    "brand": "nvidia",
    "segment": "mobile",
    "generation": "RTX 30",
    "architecture": "Ampere",
    "releaseDate": "2021-01",
    "performanceIndex": 120,
    "tier": "mainstream",
    "specs": {
      "coresLabel": "CUDA Cores",
      "cores": 5120,
      "baseClockMHz": 1110,
      "boostClockMHz": 1560,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": 384,
      "powerW": null,
      "tgpRangeW": [
        80,
        125
      ]
    },
    "benchmarks": {
      "timeSpyGraphics": 10000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1440p",
      "rayTracingLevel": "good",
      "efficiencyNote": "上代移动版中高端"
    },
    "notes": [
      "移动版性能受 TGP 影响"
    ],
    "sources": [
      {
        "label": "NVIDIA",
        "url": "https://www.nvidia.com"
      }
    ],
    "confidence": "aggregate"
  },
  {
    "id": "rx-7900m-mobile",
    "name": "Radeon RX 7900M",
    "brand": "amd",
    "segment": "mobile",
    "generation": "RX 7000",
    "architecture": "RDNA 3",
    "releaseDate": "2023-06",
    "performanceIndex": 160,
    "tier": "high",
    "specs": {
      "coresLabel": "Stream Processors",
      "cores": 4608,
      "baseClockMHz": 1825,
      "boostClockMHz": 2400,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": 512,
      "powerW": null,
      "tgpRangeW": [
        100,
        180
      ]
    },
    "benchmarks": {
      "timeSpyGraphics": 15000,
      "steelNomadGraphics": null,
      "passMarkG3D": null,
      "sourceNote": "公开评测均值参考"
    },
    "gaming": {
      "recommendedResolution": "1440p",
      "rayTracingLevel": "moderate",
      "efficiencyNote": "AMD 移动版高端选择"
    },
    "notes": [
      "移动版性能受 TGP 影响"
    ],
    "sources": [
      {
        "label": "AMD",
        "url": "https://www.amd.com"
      }
    ],
    "confidence": "aggregate"
  }
];
