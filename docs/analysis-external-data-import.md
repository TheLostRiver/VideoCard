# 外部 CPU/GPU 数据导入分析

分析日期：2026-05-02
数据来源：`Q:\SoftwareData\CPU_GPU_Data`

## 1. 数据源概览

| 文件 | 类型 | 条数 | 字段数 | 年份范围 |
|------|------|------|--------|---------|
| `cpus.json` | CPU 规格 | 5,833 | 9 | 1998-2023 |
| `CPU_benchmark_v4.csv` | CPU 跑分 | 3,825 | 12 | 2007-2022 |
| `tpu_cpus.csv` | CPU 规格 | 2,614 | 10 | ~1998-2023 |
| `gpus.json` | GPU 规格 | 3,543 | 8 | 1986-2023 |

**总计：约 15,815 条外部数据 vs 项目现有 67 条。**

## 2. 字段映射分析

### 2.1 已有字段（可直接映射）

| 外部字段 | 项目字段 | 来源文件 |
|----------|----------|----------|
| `Product_Name` / `Name` / `cpuName` | `item.name` | 全部 |
| `Released` / `testDate` | `item.releaseDate` | 全部（格式不同，需转换） |
| `TDP` | `cpu.power.tdp` / `gpu.power.board` | 全部（格式："140 W" 需解析） |
| `Cores` | `cpu.core.count` | CPU 文件（格式："6 / 12" 需解析） |
| `Socket` | `cpu.socket` | CPU 文件 |
| `Memory` | `gpu.memory.*` | GPU JSON（格式："2 GB, GDDR5, 128 bit" 需解析） |
| `GPU_clock` | `gpu.clock.base/boost` | GPU JSON（格式："1150 MHz" 需解析） |

### 2.2 新增字段（项目目前不支持）

#### GPU 新增字段

| 字段 | 含义 | 示例 | 影响范围 |
|------|------|------|----------|
| `GPU_Chip` | GPU 芯片代号 | "RV380", "GM107", "AD102" | 需新增 metric |
| `Bus` | 总线接口 | "PCIe 4.0 x16", "MXM-A (3.0)" | 需新增 metric |
| `Memory_clock` | 显存频率 | "1253 MHz", "21 Gbps" | 需新增 metric |
| `Shaders_TMUs_ROPs` | 着色器/TMU/ROP 数量 | "640 / 40 / 16" | 需新增 metric 或拆分为多个 |

#### CPU 新增字段

| 字段 | 含义 | 示例 | 来源 | 影响范围 |
|------|------|------|------|----------|
| `Codename` | 架构代号 | "Vermeer", "Skylake-X", "Alder Lake" | JSON + CSV | 需新增 metric |
| `Process` | 制程工艺 | "7 nm", "14 nm", "5 nm" | JSON + CSV | 需新增 metric |
| `price` | 价格 (USD) | "7299.99", "329" | Benchmark CSV | 需新增 metric |
| `cpuMark` | PassMark 总分 | "108822", "35000" | Benchmark CSV | 需新增 metric |
| `threadMark` | 单线程分数 | "3330", "3500" | Benchmark CSV | 需新增 metric |
| `cpuValue` | 性价比指数 | "12.1", "106.09" | Benchmark CSV | 需新增 metric |
| `threadValue` | 单线程性价比 | "0.36", "10.63" | Benchmark CSV | 需新增 metric |
| `powerPerf` | 能效指数 | "388.65", "194.44" | Benchmark CSV | 需新增 metric |
| `category` | 使用场景 | "Desktop", "Server", "Laptop" | Benchmark CSV | 可映射到 `marketSegmentIds` |

## 3. 改造影响分析

### 3.1 数据层改动

| 文件 | 改动内容 | 工作量 |
|------|----------|--------|
| `src/data/categories/gpu.schema.json` | 新增 4 个 metric（GPU_Chip, Bus, Memory_clock, Shaders_TMUs_ROPs） | 小 |
| `src/data/categories/desktop-cpu.schema.json` | 新增 7 个 metric（Codename, Process, price, cpuMark, threadMark, cpuValue, powerPerf） | 小 |
| `src/data/categories/*.schema.json` | 所有品类 schema 的 listView / detailView 更新 | 小 |

### 3.2 UI 层改动

| 文件 | 改动内容 | 工作量 |
|------|----------|--------|
| `index.html` | 新增年份筛选器 UI | 中 |
| `src/app.js` | 年份筛选逻辑、"显示未知年份"开关 | 中 |
| `src/styles.css` | 年份筛选器样式 | 小 |
| `admin.html` / `admin.js` | 新字段自动由 schema form 驱动，无额外改动 | 无 |

### 3.3 导入工具改动

| 文件 | 改动内容 | 工作量 |
|------|----------|--------|
| 新增 `scripts/import-external-data.mjs` | CSV/JSON 解析、字段映射、格式转换、去重合并 | 大 |
| 新增 `tests/import-external-data.test.mjs` | 导入逻辑测试 | 中 |

### 3.4 年份筛选功能

**数据层：**
- `releaseDate` 字段已有（格式 "2023-10" 或 "2023"），可提取年份
- 部分外部数据年份格式不一致（"Sep 1st, 2004"、"2022"、"Aug 17th, 2011"），需统一解析

**UI 层：**
- 前台天梯图 toolbar 新增年份范围筛选器（slider 或 chip 列表）
- 新增"显示未知年份"toggle 开关
- 品类切换时年份筛选器动态更新（不同品类年份范围不同）
- GPU 保持 tier 分组 + 年份筛选叠加
- 非 GPU 品类平铺列表 + 并不是年份筛选

**逻辑层：**
- `filterByYear(items, yearRange, showUnknown)` 筛选函数
- 年份提取：从 `releaseDate` / `Released` / `testDate` 解析 4 位年份
- 未知年份处理：`releaseDate` 为空或无法解析时归入"未知"

## 4. 风险与注意事项

1. **数据质量**：外部数据有缺失值（price、TDP 等可能为空），导入时需容忍空值
2. **数据去重**：外部数据与项目现有 67 条可能重叠（如 Ryzen 7 7800X3D），需按名称/ID 去重
3. **格式差异**：外部数据格式不统一（日期、频率、内存），需编写健壮的解析器
4. **数据量级**：导入后从 67 条增长到数千条，JSON 文件读写性能需关注
5. **GPU Shaders_TMUs_ROPs**：复合格式 "640 / 40 / 16"，需拆分为 3 个独立 metric 或保留原始文本

## 5. 建议的实施顺序

| 阶段 | 内容 | 优先级 |
|------|------|--------|
| 1 | 年份筛选功能（前台 UI + 筛选逻辑） | 高 |
| 2 | 新增 metric 定义（schema 更新） | 高 |
| 3 | 编写导入脚本（CSV/JSON → 项目格式） | 高 |
| 4 | 导入数据 + 去重 + 验证 | 高 |
| 5 | 更新测试 | 中 |

## 6. 年份筛选 UI 设计草案

```
┌─────────────────────────────────────────────────┐
│ [GPU] [Desktop CPU] [Mobile SoC] [Apple Silicon] │  ← 品类标签栏
├─────────────────────────────────────────────────┤
│ 年份: [全部] [2024] [2023] [2022] [2021] [2020] │  ← 年份 chip 栏
│       [2019] [2018] [2017] ... [☐ 显示未知年份]  │
├─────────────────────────────────────────────────┤
│ 搜索: [________]  排序: [性能▼]  [重置筛选]      │  ← 现有 toolbar
├─────────────────────────────────────────────────┤
│ (天梯图列表)                                      │
└─────────────────────────────────────────────────┘
```

- 年份 chip 从数据中动态提取（不硬编码）
- 选中多个年份 = OR 逻辑（显示所选年份的所有硬件）
- "显示未知年份" 默认关闭，开启后显示无法解析年份的数据
- 切换品类时年份 chip 列表自动更新
