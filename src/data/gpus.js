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
  },
  {
    "id": "radeon-pro-v710",
    "name": "Radeon PRO V710",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 32",
    "architecture": "Navi 32",
    "releaseDate": "2024-10",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3456,
      "baseClockMHz": 2000,
      "boostClockMHz": 2000,
      "memorySizeGB": 28,
      "memoryType": "GDDR6",
      "memoryBusBit": 224,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-instinct-mi325x",
    "name": "Radeon Instinct MI325X",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Aqua Vanjaram",
    "architecture": "Aqua Vanjaram",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 19456,
      "baseClockMHz": 2100,
      "boostClockMHz": 2100,
      "memorySizeGB": 288,
      "memoryType": "HBM3e",
      "memoryBusBit": 8192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-7800m",
    "name": "Radeon RX 7800M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "Navi 32",
    "releaseDate": "2024-09",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3840,
      "baseClockMHz": 2335,
      "boostClockMHz": 2335,
      "memorySizeGB": 12,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-740m",
    "name": "Radeon 740M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Phoenix2",
    "architecture": "Phoenix2",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 256,
      "baseClockMHz": 2800,
      "boostClockMHz": 2800,
      "memorySizeGB": null,
      "memoryType": "DDR5",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-760m",
    "name": "Radeon 760M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Phoenix",
    "architecture": "Phoenix",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 512,
      "baseClockMHz": 2599,
      "boostClockMHz": 2599,
      "memorySizeGB": null,
      "memoryType": "DDR5",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-780m",
    "name": "Radeon 780M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Phoenix",
    "architecture": "Phoenix",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 768,
      "baseClockMHz": 2900,
      "boostClockMHz": 2900,
      "memorySizeGB": null,
      "memoryType": "DDR5",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-880m",
    "name": "Radeon 880M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Strix Point",
    "architecture": "Strix Point",
    "releaseDate": "2024-07",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 768,
      "baseClockMHz": 2900,
      "boostClockMHz": 2900,
      "memorySizeGB": null,
      "memoryType": "DDR5",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-890m",
    "name": "Radeon 890M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Strix Point",
    "architecture": "Strix Point",
    "releaseDate": "2024-07",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1024,
      "baseClockMHz": 2900,
      "boostClockMHz": 2900,
      "memorySizeGB": null,
      "memoryType": "DDR5",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-a310e",
    "name": "Arc A310E",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arc",
    "architecture": "DG2-128",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 768,
      "baseClockMHz": 2000,
      "boostClockMHz": 2000,
      "memorySizeGB": 4,
      "memoryType": "GDDR6",
      "memoryBusBit": 64,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-a380e-x2",
    "name": "Arc A380E x2",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arc",
    "architecture": "DG2-128",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1024,
      "baseClockMHz": 2000,
      "boostClockMHz": 2000,
      "memorySizeGB": 6,
      "memoryType": "GDDR6",
      "memoryBusBit": 96,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-a380e",
    "name": "Arc A380E",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arc",
    "architecture": "DG2-128",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1024,
      "baseClockMHz": 2000,
      "boostClockMHz": 2000,
      "memorySizeGB": 6,
      "memoryType": "GDDR6",
      "memoryBusBit": 96,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-b580",
    "name": "Arc B580",
    "brand": "intel",
    "segment": "desktop",
    "generation": "BMG-G21",
    "architecture": "BMG-G21",
    "releaseDate": "2024-12",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2670,
      "boostClockMHz": 2670,
      "memorySizeGB": 12,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-graphics-24eu",
    "name": "Arc Graphics 24EU",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arrow Lake-S",
    "architecture": "Arrow Lake-S",
    "releaseDate": "2024-10",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 192,
      "baseClockMHz": 2000,
      "boostClockMHz": 2000,
      "memorySizeGB": null,
      "memoryType": "DDR4",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-graphics-64eu",
    "name": "Arc Graphics 64EU",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arrow Lake-S",
    "architecture": "Arrow Lake-S",
    "releaseDate": "2024-10",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 512,
      "baseClockMHz": 1900,
      "boostClockMHz": 1900,
      "memorySizeGB": null,
      "memoryType": "DDR4",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-130v-mobile",
    "name": "Arc 130V Mobile",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Lunar Lake",
    "architecture": "Lunar Lake",
    "releaseDate": "2024-09",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 896,
      "baseClockMHz": 1850,
      "boostClockMHz": 1850,
      "memorySizeGB": null,
      "memoryType": "GDDR6",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-140v-mobile",
    "name": "Arc 140V Mobile",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Lunar Lake",
    "architecture": "Lunar Lake",
    "releaseDate": "2024-09",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1024,
      "baseClockMHz": 1950,
      "boostClockMHz": 1950,
      "memorySizeGB": null,
      "memoryType": "GDDR6",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-graphics-32eu",
    "name": "Arc Graphics 32EU",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arrow Lake-S",
    "architecture": "Arrow Lake-S",
    "releaseDate": "2024-10",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 256,
      "baseClockMHz": 1950,
      "boostClockMHz": 1950,
      "memorySizeGB": null,
      "memoryType": "DDR4",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-3050-6-gb",
    "name": "GeForce RTX 3050 6 GB",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 30",
    "architecture": "GA107",
    "releaseDate": "2024-02",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2304,
      "baseClockMHz": 1470,
      "boostClockMHz": 1470,
      "memorySizeGB": 6,
      "memoryType": "GDDR6",
      "memoryBusBit": 96,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-4010",
    "name": "GeForce RTX 4010",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "GA107",
    "releaseDate": "2024-04",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 768,
      "baseClockMHz": 1762,
      "boostClockMHz": 1762,
      "memorySizeGB": 4,
      "memoryType": "GDDR6",
      "memoryBusBit": 64,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-4060-ad106",
    "name": "GeForce RTX 4060 AD106",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "AD106",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3072,
      "baseClockMHz": 2460,
      "boostClockMHz": 2460,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-4060-ti-ad104",
    "name": "GeForce RTX 4060 Ti AD104",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "AD104",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4352,
      "baseClockMHz": 2535,
      "boostClockMHz": 2535,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-4070-gddr6",
    "name": "GeForce RTX 4070 GDDR6",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "AD104",
    "releaseDate": "2024-08",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 5888,
      "baseClockMHz": 2475,
      "boostClockMHz": 2475,
      "memorySizeGB": 12,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-4070-ad103",
    "name": "GeForce RTX 4070 AD103",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "AD103",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 5888,
      "baseClockMHz": 2475,
      "boostClockMHz": 2475,
      "memorySizeGB": 12,
      "memoryType": "GDDR6X",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-4070-super",
    "name": "GeForce RTX 4070 SUPER",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "AD104",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 7168,
      "baseClockMHz": 2475,
      "boostClockMHz": 2475,
      "memorySizeGB": 12,
      "memoryType": "GDDR6X",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-4070-ti-super-ad102",
    "name": "GeForce RTX 4070 Ti SUPER AD102",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 40",
    "architecture": "AD102",
    "releaseDate": "2024-06",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 8448,
      "baseClockMHz": 2610,
      "boostClockMHz": 2610,
      "memorySizeGB": 16,
      "memoryType": "GDDR6X",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-a400",
    "name": "RTX A400",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GA107",
    "architecture": "GA107",
    "releaseDate": "2024-04",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 768,
      "baseClockMHz": 1762,
      "boostClockMHz": 1762,
      "memorySizeGB": 4,
      "memoryType": "GDDR6",
      "memoryBusBit": 64,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-a1000",
    "name": "RTX A1000",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GA107",
    "architecture": "GA107",
    "releaseDate": "2024-04",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2304,
      "baseClockMHz": 1462,
      "boostClockMHz": 1462,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-2000-ada-generation",
    "name": "RTX 2000 Ada Generation",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 20",
    "architecture": "AD107",
    "releaseDate": "2024-02",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2816,
      "baseClockMHz": 2130,
      "boostClockMHz": 2130,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-5880-ada-generation",
    "name": "RTX 5880 Ada Generation",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "AD102",
    "architecture": "AD102",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 14080,
      "baseClockMHz": 2460,
      "boostClockMHz": 2460,
      "memorySizeGB": 48,
      "memoryType": "GDDR6",
      "memoryBusBit": 384,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-3050-a-mobile",
    "name": "GeForce RTX 3050 A Mobile",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "RTX 30",
    "architecture": "GA106",
    "releaseDate": "2024-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1792,
      "baseClockMHz": 1343,
      "boostClockMHz": 1343,
      "memorySizeGB": 4,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-500-mobile-ada-generation",
    "name": "RTX 500 Mobile Ada Generation",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "AD107",
    "architecture": "AD107",
    "releaseDate": "2024-02",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2048,
      "baseClockMHz": 2025,
      "boostClockMHz": 2025,
      "memorySizeGB": 4,
      "memoryType": "GDDR6",
      "memoryBusBit": 64,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-1000-mobile-ada-generation",
    "name": "RTX 1000 Mobile Ada Generation",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "AD107",
    "architecture": "AD107",
    "releaseDate": "2024-02",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2025,
      "boostClockMHz": 2025,
      "memorySizeGB": 6,
      "memoryType": "GDDR6",
      "memoryBusBit": 96,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-7400",
    "name": "Radeon RX 7400",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "Navi 33",
    "releaseDate": "2025-08",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1792,
      "baseClockMHz": 2300,
      "boostClockMHz": 2300,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-7650-gre",
    "name": "Radeon RX 7650 GRE",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "Navi 33",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2048,
      "baseClockMHz": 2695,
      "boostClockMHz": 2695,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-7700",
    "name": "Radeon RX 7700",
    "brand": "amd",
    "segment": "desktop",
    "generation": "RX 7000",
    "architecture": "Navi 32",
    "releaseDate": "2025-09",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2600,
      "boostClockMHz": 2600,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-9060",
    "name": "Radeon RX 9060",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 44",
    "architecture": "Navi 44",
    "releaseDate": "2025-08",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1792,
      "baseClockMHz": 2990,
      "boostClockMHz": 2990,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-9060-xt-lp",
    "name": "Radeon RX 9060 XT LP",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 44",
    "architecture": "Navi 44",
    "releaseDate": "2025-12",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2048,
      "baseClockMHz": 3050,
      "boostClockMHz": 3050,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-9060-xt-8-gb",
    "name": "Radeon RX 9060 XT 8 GB",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 44",
    "architecture": "Navi 44",
    "releaseDate": "2025-06",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2048,
      "baseClockMHz": 3130,
      "boostClockMHz": 3130,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-9060-xt-16-gb",
    "name": "Radeon RX 9060 XT 16 GB",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 44",
    "architecture": "Navi 44",
    "releaseDate": "2025-06",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2048,
      "baseClockMHz": 3130,
      "boostClockMHz": 3130,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-9070-gre",
    "name": "Radeon RX 9070 GRE",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 48",
    "architecture": "Navi 48",
    "releaseDate": "2025-05",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3072,
      "baseClockMHz": 2790,
      "boostClockMHz": 2790,
      "memorySizeGB": 12,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-9070-gre-16-gb",
    "name": "Radeon RX 9070 GRE 16 GB",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 48",
    "architecture": "Navi 48",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3072,
      "baseClockMHz": 2790,
      "boostClockMHz": 2790,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-9070",
    "name": "Radeon RX 9070",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 48",
    "architecture": "Navi 48",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3584,
      "baseClockMHz": 2520,
      "boostClockMHz": 2520,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-rx-9070-xt",
    "name": "Radeon RX 9070 XT",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 48",
    "architecture": "Navi 48",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4096,
      "baseClockMHz": 2970,
      "boostClockMHz": 2970,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-pro-w7900d",
    "name": "Radeon PRO W7900D",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 31",
    "architecture": "Navi 31",
    "releaseDate": "2025-09",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 6144,
      "baseClockMHz": 2156,
      "boostClockMHz": 2156,
      "memorySizeGB": 48,
      "memoryType": "GDDR6",
      "memoryBusBit": 384,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-ai-pro-9600d",
    "name": "Radeon AI PRO 9600D",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Navi 48",
    "architecture": "Navi 48",
    "releaseDate": "2025-12",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3072,
      "baseClockMHz": 2020,
      "boostClockMHz": 2020,
      "memorySizeGB": 32,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-ai-pro-r9700s",
    "name": "Radeon AI PRO R9700S",
    "brand": "amd",
    "segment": "desktop",
    "generation": "R9",
    "architecture": "Navi 48",
    "releaseDate": "2025-12",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4096,
      "baseClockMHz": 2920,
      "boostClockMHz": 2920,
      "memorySizeGB": 32,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-ai-pro-r9700",
    "name": "Radeon AI PRO R9700",
    "brand": "amd",
    "segment": "desktop",
    "generation": "R9",
    "architecture": "Navi 48",
    "releaseDate": "2025-07",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4096,
      "baseClockMHz": 2920,
      "boostClockMHz": 2920,
      "memorySizeGB": 32,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-instinct-mi350x",
    "name": "Radeon Instinct MI350X",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Galaxy",
    "architecture": "Galaxy",
    "releaseDate": "2025-06",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 16384,
      "baseClockMHz": 2200,
      "boostClockMHz": 2200,
      "memorySizeGB": 288,
      "memoryType": "HBM3e",
      "memoryBusBit": 8192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-instinct-mi355x",
    "name": "Radeon Instinct MI355X",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Galaxy",
    "architecture": "Galaxy",
    "releaseDate": "2025-06",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 16384,
      "baseClockMHz": 2400,
      "boostClockMHz": 2400,
      "memorySizeGB": 288,
      "memoryType": "HBM3e",
      "memoryBusBit": 8192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-8040s",
    "name": "Radeon 8040S",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Strix Halo",
    "architecture": "Strix Halo",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1024,
      "baseClockMHz": 2800,
      "boostClockMHz": 2800,
      "memorySizeGB": null,
      "memoryType": "GDDR6",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-8050s",
    "name": "Radeon 8050S",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Strix Halo",
    "architecture": "Strix Halo",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2048,
      "baseClockMHz": 2800,
      "boostClockMHz": 2800,
      "memorySizeGB": null,
      "memoryType": "GDDR6",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-8060s",
    "name": "Radeon 8060S",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Strix Halo",
    "architecture": "Strix Halo",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2900,
      "boostClockMHz": 2900,
      "memorySizeGB": null,
      "memoryType": "GDDR6",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-820m",
    "name": "Radeon 820M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Krackan Point",
    "architecture": "Krackan Point",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 128,
      "baseClockMHz": 2800,
      "boostClockMHz": 2800,
      "memorySizeGB": null,
      "memoryType": "DDR5",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-840m",
    "name": "Radeon 840M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Krackan Point",
    "architecture": "Krackan Point",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 256,
      "baseClockMHz": 2900,
      "boostClockMHz": 2900,
      "memorySizeGB": null,
      "memoryType": "DDR5",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-860m",
    "name": "Radeon 860M",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Krackan Point",
    "architecture": "Krackan Point",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 512,
      "baseClockMHz": 3000,
      "boostClockMHz": 3000,
      "memorySizeGB": null,
      "memoryType": "DDR5",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "ryzen-z2-a-gpu",
    "name": "Ryzen Z2 A GPU",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Van Gogh",
    "architecture": "Van Gogh",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 512,
      "baseClockMHz": 1600,
      "boostClockMHz": 1600,
      "memorySizeGB": 16,
      "memoryType": "LPDDR5",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "ryzen-z2-go-gpu",
    "name": "Ryzen Z2 Go GPU",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Rembrandt+",
    "architecture": "Rembrandt+",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 768,
      "baseClockMHz": 2700,
      "boostClockMHz": 2700,
      "memorySizeGB": 16,
      "memoryType": "LPDDR5",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "ryzen-z2-gpu",
    "name": "Ryzen Z2 GPU",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Hawk Point",
    "architecture": "Hawk Point",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 768,
      "baseClockMHz": 2700,
      "boostClockMHz": 2700,
      "memorySizeGB": 16,
      "memoryType": "LPDDR5X",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "ryzen-z2-extreme-gpu",
    "name": "Ryzen Z2 Extreme GPU",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Strix Point",
    "architecture": "Strix Point",
    "releaseDate": "2025-07",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1024,
      "baseClockMHz": 2700,
      "boostClockMHz": 2700,
      "memorySizeGB": 16,
      "memoryType": "LPDDR5X",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "ryzen-ai-z2-extreme-gpu",
    "name": "Ryzen AI Z2 Extreme GPU",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Strix Point",
    "architecture": "Strix Point",
    "releaseDate": "2025-10",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1024,
      "baseClockMHz": 2700,
      "boostClockMHz": 2700,
      "memorySizeGB": 16,
      "memoryType": "LPDDR5X",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-b570",
    "name": "Arc B570",
    "brand": "intel",
    "segment": "desktop",
    "generation": "BMG-G21",
    "architecture": "BMG-G21",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2304,
      "baseClockMHz": 2500,
      "boostClockMHz": 2500,
      "memorySizeGB": 10,
      "memoryType": "GDDR6",
      "memoryBusBit": 160,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-pro-b50",
    "name": "Arc Pro B50",
    "brand": "intel",
    "segment": "desktop",
    "generation": "BMG-G21",
    "architecture": "BMG-G21",
    "releaseDate": "2025-09",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2048,
      "baseClockMHz": 2600,
      "boostClockMHz": 2600,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-pro-b60",
    "name": "Arc Pro B60",
    "brand": "intel",
    "segment": "desktop",
    "generation": "BMG-G21",
    "architecture": "BMG-G21",
    "releaseDate": "2025-09",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2400,
      "boostClockMHz": 2400,
      "memorySizeGB": 24,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-pro-b60-dual",
    "name": "Arc Pro B60 Dual",
    "brand": "intel",
    "segment": "desktop",
    "generation": "BMG-G21",
    "architecture": "BMG-G21",
    "releaseDate": "2025-09",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2400,
      "boostClockMHz": 2400,
      "memorySizeGB": 24,
      "memoryType": "GDDR6",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-130t-mobile",
    "name": "Arc 130T Mobile",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arrow Lake-H",
    "architecture": "Arrow Lake-H",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 896,
      "baseClockMHz": 2200,
      "boostClockMHz": 2200,
      "memorySizeGB": null,
      "memoryType": "GDDR6",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-140t-mobile",
    "name": "Arc 140T Mobile",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Arrow Lake-H",
    "architecture": "Arrow Lake-H",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1024,
      "baseClockMHz": 2350,
      "boostClockMHz": 2350,
      "memorySizeGB": null,
      "memoryType": "GDDR6",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5050",
    "name": "GeForce RTX 5050",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB207",
    "architecture": "GB207",
    "releaseDate": "2025-07",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2572,
      "boostClockMHz": 2572,
      "memorySizeGB": 8,
      "memoryType": "GDDR6",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5060",
    "name": "GeForce RTX 5060",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB206",
    "architecture": "GB206",
    "releaseDate": "2025-05",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3840,
      "baseClockMHz": 2497,
      "boostClockMHz": 2497,
      "memorySizeGB": 8,
      "memoryType": "GDDR7",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5060-ti-8-gb",
    "name": "GeForce RTX 5060 Ti 8 GB",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB206",
    "architecture": "GB206",
    "releaseDate": "2025-04",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4608,
      "baseClockMHz": 2572,
      "boostClockMHz": 2572,
      "memorySizeGB": 8,
      "memoryType": "GDDR7",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5060-ti-16-gb",
    "name": "GeForce RTX 5060 Ti 16 GB",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB206",
    "architecture": "GB206",
    "releaseDate": "2025-04",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4608,
      "baseClockMHz": 2572,
      "boostClockMHz": 2572,
      "memorySizeGB": 16,
      "memoryType": "GDDR7",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5070",
    "name": "GeForce RTX 5070",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB205",
    "architecture": "GB205",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 6144,
      "baseClockMHz": 2512,
      "boostClockMHz": 2512,
      "memorySizeGB": 12,
      "memoryType": "GDDR7",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5070-ti",
    "name": "GeForce RTX 5070 Ti",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2025-02",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 8960,
      "baseClockMHz": 2452,
      "boostClockMHz": 2452,
      "memorySizeGB": 16,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5080",
    "name": "GeForce RTX 5080",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 10752,
      "baseClockMHz": 2617,
      "boostClockMHz": 2617,
      "memorySizeGB": 16,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5090-d-v2",
    "name": "GeForce RTX 5090 D V2",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-08",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 21760,
      "baseClockMHz": 2407,
      "boostClockMHz": 2407,
      "memorySizeGB": 24,
      "memoryType": "GDDR7",
      "memoryBusBit": 384,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5090-d",
    "name": "GeForce RTX 5090 D",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 21760,
      "baseClockMHz": 2407,
      "boostClockMHz": 2407,
      "memorySizeGB": 32,
      "memoryType": "GDDR7",
      "memoryBusBit": 512,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5090",
    "name": "GeForce RTX 5090",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 21760,
      "baseClockMHz": 2407,
      "boostClockMHz": 2407,
      "memorySizeGB": 32,
      "memoryType": "GDDR7",
      "memoryBusBit": 512,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-2000-blackwell",
    "name": "RTX PRO 2000 Blackwell",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB206",
    "architecture": "GB206",
    "releaseDate": "2025-08",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4352,
      "baseClockMHz": 1957,
      "boostClockMHz": 1957,
      "memorySizeGB": 16,
      "memoryType": "GDDR7",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-4000-blackwell-sff",
    "name": "RTX PRO 4000 Blackwell SFF",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2025-08",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 8960,
      "baseClockMHz": 1342,
      "boostClockMHz": 1342,
      "memorySizeGB": 24,
      "memoryType": "GDDR7",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-4000-blackwell",
    "name": "RTX PRO 4000 Blackwell",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 8960,
      "baseClockMHz": 2055,
      "boostClockMHz": 2055,
      "memorySizeGB": 24,
      "memoryType": "GDDR7",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-4500-blackwell-workstation",
    "name": "RTX PRO 4500 Blackwell Workstation",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 10496,
      "baseClockMHz": 2407,
      "boostClockMHz": 2407,
      "memorySizeGB": 32,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-5000-blackwell",
    "name": "RTX PRO 5000 Blackwell",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 14080,
      "baseClockMHz": 2377,
      "boostClockMHz": 2377,
      "memorySizeGB": 48,
      "memoryType": "GDDR7",
      "memoryBusBit": 384,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-5000-72-gb-blackwell",
    "name": "RTX PRO 5000 72 GB Blackwell",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-10",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 14080,
      "baseClockMHz": 2377,
      "boostClockMHz": 2377,
      "memorySizeGB": 72,
      "memoryType": "GDDR7",
      "memoryBusBit": 384,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-6000d-blackwell-max-q",
    "name": "RTX PRO 6000D Blackwell Max-Q",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 24064,
      "baseClockMHz": 2288,
      "boostClockMHz": 2288,
      "memorySizeGB": 96,
      "memoryType": "GDDR7",
      "memoryBusBit": 512,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-6000-blackwell-max-q",
    "name": "RTX PRO 6000 Blackwell Max-Q",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 24064,
      "baseClockMHz": 2280,
      "boostClockMHz": 2280,
      "memorySizeGB": 96,
      "memoryType": "GDDR7",
      "memoryBusBit": 512,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-6000d",
    "name": "RTX 6000D",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 19968,
      "baseClockMHz": 2430,
      "boostClockMHz": 2430,
      "memorySizeGB": 84,
      "memoryType": "GDDR7",
      "memoryBusBit": 448,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-6000-blackwell",
    "name": "RTX PRO 6000 Blackwell",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 24064,
      "baseClockMHz": 2617,
      "boostClockMHz": 2617,
      "memorySizeGB": 96,
      "memoryType": "GDDR7",
      "memoryBusBit": 512,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-6000-blackwell-server",
    "name": "RTX PRO 6000 Blackwell Server",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB202",
    "architecture": "GB202",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 24064,
      "baseClockMHz": 2617,
      "boostClockMHz": 2617,
      "memorySizeGB": 96,
      "memoryType": "GDDR7",
      "memoryBusBit": 512,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5050-mobile",
    "name": "GeForce RTX 5050 Mobile",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB207",
    "architecture": "GB207",
    "releaseDate": "2025-06",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 1500,
      "boostClockMHz": 1500,
      "memorySizeGB": 8,
      "memoryType": "GDDR7",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5060-mobile",
    "name": "GeForce RTX 5060 Mobile",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB206",
    "architecture": "GB206",
    "releaseDate": "2025-05",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 3328,
      "baseClockMHz": 1455,
      "boostClockMHz": 1455,
      "memorySizeGB": 8,
      "memoryType": "GDDR7",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5070-mobile",
    "name": "GeForce RTX 5070 Mobile",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB206",
    "architecture": "GB206",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4608,
      "baseClockMHz": 1425,
      "boostClockMHz": 1425,
      "memorySizeGB": 8,
      "memoryType": "GDDR7",
      "memoryBusBit": 128,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5070-ti-mobile",
    "name": "GeForce RTX 5070 Ti Mobile",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB205",
    "architecture": "GB205",
    "releaseDate": "2025-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 5888,
      "baseClockMHz": 1447,
      "boostClockMHz": 1447,
      "memorySizeGB": 12,
      "memoryType": "GDDR7",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5080-mobile",
    "name": "GeForce RTX 5080 Mobile",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2025-04",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 7680,
      "baseClockMHz": 1500,
      "boostClockMHz": 1500,
      "memorySizeGB": 16,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5090-mobile",
    "name": "GeForce RTX 5090 Mobile",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2025-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 10496,
      "baseClockMHz": 1515,
      "boostClockMHz": 1515,
      "memorySizeGB": 24,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "radeon-8065s",
    "name": "Radeon 8065S",
    "brand": "amd",
    "segment": "desktop",
    "generation": "Strix Halo",
    "architecture": "Strix Halo",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2900,
      "boostClockMHz": 2900,
      "memorySizeGB": null,
      "memoryType": "GDDR6",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-b770",
    "name": "Arc B770",
    "brand": "intel",
    "segment": "desktop",
    "generation": "BMG-G31",
    "architecture": "BMG-G31",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4096,
      "baseClockMHz": 2400,
      "boostClockMHz": 2400,
      "memorySizeGB": 16,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-pro-b65",
    "name": "Arc Pro B65",
    "brand": "intel",
    "segment": "desktop",
    "generation": "BMG-G21",
    "architecture": "BMG-G21",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 2560,
      "baseClockMHz": 2400,
      "boostClockMHz": 2400,
      "memorySizeGB": 32,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-pro-b70",
    "name": "Arc Pro B70",
    "brand": "intel",
    "segment": "desktop",
    "generation": "BMG-G31",
    "architecture": "BMG-G31",
    "releaseDate": "2026-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 4096,
      "baseClockMHz": 2800,
      "boostClockMHz": 2800,
      "memorySizeGB": 32,
      "memoryType": "GDDR6",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-graphics-2-xe-mobile",
    "name": "Arc Graphics 2 Xe Mobile",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Panther Lake",
    "architecture": "Panther Lake",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 256,
      "baseClockMHz": 2300,
      "boostClockMHz": 2300,
      "memorySizeGB": null,
      "memoryType": "LPDDR5X",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-graphics-4-xe-mobile",
    "name": "Arc Graphics 4 Xe Mobile",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Panther Lake",
    "architecture": "Panther Lake",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 512,
      "baseClockMHz": 2300,
      "boostClockMHz": 2300,
      "memorySizeGB": null,
      "memoryType": "LPDDR5X",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-b370",
    "name": "Arc B370",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Panther Lake",
    "architecture": "Panther Lake",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1280,
      "baseClockMHz": 2400,
      "boostClockMHz": 2400,
      "memorySizeGB": null,
      "memoryType": "LPDDR5X",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-b390",
    "name": "Arc B390",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Panther Lake",
    "architecture": "Panther Lake",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1536,
      "baseClockMHz": 2500,
      "boostClockMHz": 2500,
      "memorySizeGB": null,
      "memoryType": "LPDDR5X",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-pro-b370",
    "name": "Arc Pro B370",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Panther Lake",
    "architecture": "Panther Lake",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1280,
      "baseClockMHz": 2400,
      "boostClockMHz": 2400,
      "memorySizeGB": null,
      "memoryType": "LPDDR5X",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "arc-pro-b390",
    "name": "Arc Pro B390",
    "brand": "intel",
    "segment": "desktop",
    "generation": "Panther Lake",
    "architecture": "Panther Lake",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 1536,
      "baseClockMHz": 2500,
      "boostClockMHz": 2500,
      "memorySizeGB": null,
      "memoryType": "LPDDR5X",
      "memoryBusBit": null,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5070-super",
    "name": "GeForce RTX 5070 SUPER",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB205",
    "architecture": "GB205",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 6400,
      "baseClockMHz": 2497,
      "boostClockMHz": 2497,
      "memorySizeGB": 18,
      "memoryType": "GDDR7",
      "memoryBusBit": 192,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5070-ti-super",
    "name": "GeForce RTX 5070 Ti SUPER",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 8960,
      "baseClockMHz": 2452,
      "boostClockMHz": 2452,
      "memorySizeGB": 16,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "geforce-rtx-5080-super",
    "name": "GeForce RTX 5080 SUPER",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2026-01",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 10752,
      "baseClockMHz": 2617,
      "boostClockMHz": 2617,
      "memorySizeGB": 24,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "rtx-pro-4500-blackwell-server",
    "name": "RTX PRO 4500 Blackwell Server",
    "brand": "nvidia",
    "segment": "desktop",
    "generation": "GB203",
    "architecture": "GB203",
    "releaseDate": "2026-03",
    "performanceIndex": 1,
    "tier": "legacy",
    "specs": {
      "coresLabel": "Shaders",
      "cores": 10496,
      "baseClockMHz": 2415,
      "boostClockMHz": 2415,
      "memorySizeGB": 32,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": null,
      "powerW": null,
      "tgpRangeW": null
    },
    "benchmarks": {
      "timeSpyGraphics": null,
      "steelNomadGraphics": null,
      "passMarkG3D": null
    },
    "gaming": {
      "recommendedResolution": "待补充",
      "rayTracingLevel": "unknown",
      "efficiencyNote": ""
    },
    "notes": [],
    "sources": [
      {
        "title": "External GPU Database",
        "url": ""
      }
    ],
    "confidence": "low"
  },
  {
    "id": "test-new-gpu",
    "name": "Test GPU",
    "brand": "nvidia",
    "generation": "RTX 50",
    "architecture": "Blackwell",
    "releaseDate": "2025",
    "segment": "desktop",
    "tier": "high",
    "specs": {
      "coresLabel": "5000 CUDA",
      "cores": 5000,
      "baseClockMHz": 2000,
      "boostClockMHz": 2500,
      "memorySizeGB": 16,
      "memoryType": "GDDR7",
      "memoryBusBit": 256,
      "bandwidthGBs": 800,
      "powerW": 200
    },
    "notes": [],
    "benchmarks": {
      "timeSpyGraphics": 20000
    },
    "gaming": {
      "recommendedResolution": "1440p"
    },
    "performanceIndex": 150,
    "sources": []
  }
];
