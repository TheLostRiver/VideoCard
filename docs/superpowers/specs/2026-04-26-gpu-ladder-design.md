# HTML 版游戏显卡天梯图设计规格

日期：2026-04-26

## 目标

制作一个静态 HTML 版交互式游戏显卡天梯图。首版覆盖 NVIDIA GTX 10 到 RTX 50、AMD RX 400 到 RX 9000、Intel Arc A/B，包含桌面版显卡和笔记本移动版显卡。移动版显卡必须作为独立条目展示，并用明显标签和说明与桌面版区分。

项目定位是“玩家升级和选购用的交互式显卡性能库”，不是单纯参数百科。用户打开页面后应能快速判断：

- 某张显卡大概排在什么位置。
- 它和哪些显卡性能接近。
- 它的核心参数、显存、功耗和参考跑分如何。
- 它适合 1080p、1440p、4K，还是更偏入门/旧卡参考。

## 范围

首版范围选择 A+C：

- A：先覆盖近现代游戏显卡，后续再扩展到全历史显卡。
- C：先做完整交互原型和真实代表数据，后续逐步补全全量数据。

首版建议录入 60 到 100 张代表性显卡：

- NVIDIA 桌面：GTX 1060 / 1070 / 1080 / 1080 Ti，RTX 2060 到 2080 Ti，RTX 3050 到 3090 Ti，RTX 4060 到 4090，RTX 5060 到 5090。
- NVIDIA 移动：RTX 3060/3070/3080 Laptop，RTX 4050 到 4090 Laptop，RTX 5050 到 5090 Laptop。
- AMD 桌面：RX 480/580/590，RX 5500 XT 到 5700 XT，RX 6400 到 6950 XT，RX 7600 到 7900 XTX，RX 9060 XT / RX 9070 / RX 9070 XT。
- AMD 移动：RX 6600M / 6700M / 6800M / 6850M XT，RX 7600M / 7700S / 7900M。
- Intel 桌面：Arc A380 / A580 / A750 / A770，Arc B570 / B580。
- Intel 移动：Arc A350M / A370M / A550M / A730M / A770M。

不在首版范围内：

- 全历史显卡完整收录。
- 所有 OEM、低功耗、Max-Q、矿卡、专业卡、工作站卡。
- 自动爬虫采集和自动更新。
- 复杂多卡对比表。首版只预留“加入对比”的结构，不强制实现。

## 主方案

采用“综合天梯 + 档位分组”的主界面。

页面第一屏直接展示工具，不做营销页或大型 Hero：

1. 顶部工具栏：搜索、品牌筛选、桌面/移动筛选、世代筛选、排序方式、重置筛选。
2. 中间天梯列表：按综合性能指数从高到低排列，按档位分组。
3. 右侧详情面板：桌面端固定展示当前选中显卡的完整参数。
4. 手机端详情抽屉：点击显卡后从底部打开详情。

档位建议：

- `flagship`：旗舰，4K 高画质或高刷新。
- `enthusiast`：次旗舰/高端，1440p 高刷或部分 4K。
- `high`：高性能主流，1440p 体验较好。
- `mainstream`：甜点级，1080p/1440p。
- `entry`：入门级，1080p 或轻量游戏。
- `legacy`：旧卡参考，主要用于升级对比。

## 数据结构

显卡数据应独立于 UI，放在 `src/data/gpus.js` 或等价 JSON/JS 文件中。每张显卡使用统一结构：

```js
{
  id: "rtx-4070-desktop",
  name: "GeForce RTX 4070",
  brand: "nvidia",
  segment: "desktop",
  generation: "RTX 40",
  architecture: "Ada Lovelace",
  releaseDate: "2023-04",
  performanceIndex: 170,
  tier: "high",
  specs: {
    coresLabel: "CUDA Cores",
    cores: 5888,
    baseClockMHz: 1920,
    boostClockMHz: 2475,
    memorySizeGB: 12,
    memoryType: "GDDR6X",
    memoryBusBit: 192,
    bandwidthGBs: 504,
    powerW: 200,
    tgpRangeW: null
  },
  benchmarks: {
    timeSpyGraphics: 17800,
    steelNomadGraphics: null,
    passMarkG3D: null,
    sourceNote: "参考公开评测均值，后续校准"
  },
  gaming: {
    recommendedResolution: "1440p",
    rayTracingLevel: "good",
    efficiencyNote: "能效较好"
  },
  notes: [
    "DLSS 3 支持",
    "不同非公版频率略有差异"
  ],
  sources: [
    {
      label: "NVIDIA 官方规格",
      url: "https://www.nvidia.com/en-us/geforce/"
    }
  ],
  confidence: "aggregate"
}
```

移动版显卡必须独立建模：

```js
{
  id: "rtx-4070-laptop",
  name: "GeForce RTX 4070 Laptop GPU",
  brand: "nvidia",
  segment: "mobile",
  generation: "RTX 40",
  architecture: "Ada Lovelace",
  performanceIndex: 135,
  tier: "mainstream",
  specs: {
    coresLabel: "CUDA Cores",
    cores: 4608,
    baseClockMHz: null,
    boostClockMHz: null,
    memorySizeGB: 8,
    memoryType: "GDDR6",
    memoryBusBit: 128,
    bandwidthGBs: 256,
    powerW: null,
    tgpRangeW: "35-115W"
  },
  benchmarks: {
    timeSpyGraphics: null,
    steelNomadGraphics: null,
    passMarkG3D: null,
    sourceNote: "移动版参考典型高 TGP 机型"
  },
  gaming: {
    recommendedResolution: "1080p/1440p",
    rayTracingLevel: "medium",
    efficiencyNote: "实际表现受 TGP 和散热影响明显"
  },
  notes: [
    "移动版不可直接等同桌面 RTX 4070",
    "同一 GPU 在不同笔记本中性能差异可能明显"
  ],
  confidence: "estimated"
}
```

字段规则：

- `id` 必须唯一，建议使用小写短横线命名。
- `brand` 只能是 `nvidia`、`amd`、`intel`。
- `segment` 只能是 `desktop` 或 `mobile`。
- `performanceIndex` 是排序主字段，首版允许人工校准。
- `coresLabel` 用于展示不同厂商的核心名称，例如 CUDA Cores、Stream Processors、Xe Cores。
- 缺失值用 `null`，UI 显示为“待补充”。
- `confidence` 可选 `verified`、`aggregate`、`estimated`、`placeholder`。

## 性能指数

采用自定义综合性能指数，以 `RTX 4060 desktop = 100` 为基准。

建议计算口径：

- 70%：游戏平均相对性能。
- 20%：3DMark / PassMark 等跑分参考。
- 10%：现代游戏、光追表现、驱动成熟度和架构特性修正。

注意事项：

- 3DMark Time Spy、Steel Nomad、Fire Strike 不能混为一个分数。
- 不同测试项目只在同项目内比较。
- 移动版以典型高 TGP 机型估算，详情中必须提醒实际性能受 TGP 和散热影响。
- 指数是玩家参考，不是绝对科学排名。数据来源和可信度要可追踪。

## 交互设计

### 搜索

- 输入型号、品牌、世代、移动版关键词时实时过滤。
- 支持常见片段，例如 `4070`、`rx 7800`、`laptop`、`arc`。

### 筛选

- 品牌：NVIDIA / AMD / Intel。
- 类型：桌面版 / 移动版 / 全部。
- 世代：GTX 10、RTX 20/30/40/50、RX 400/500/5000/6000/7000/9000、Arc A/B。
- 排序：综合性能指数、3DMark、显存容量、功耗效率。

### 天梯条目

每个条目展示：

- 显卡型号。
- 品牌色。
- `Desktop` 或 `Mobile` 标签。
- 性能指数。
- 显存容量和类型。
- 功耗或 TGP 范围。
- 推荐分辨率。

条目交互：

- Hover 高亮。
- 点击选中并打开详情。
- 选中态需要明显。
- URL hash 更新为显卡 id，例如 `#rtx-4070-desktop`。

### 详情面板

详情分组：

- 概览：型号、品牌、桌面/移动、架构、发布时间、综合性能指数、推荐分辨率。
- 核心规格：核心名称、核心数量、基础频率、加速频率。
- 显存规格：容量、类型、位宽、带宽。
- 功耗与形态：桌面 TDP/TBP，移动版 TGP 范围。
- 跑分参考：Time Spy Graphics、Steel Nomad Graphics、PassMark G3D。
- 备注：DLSS/FSR/XeSS、光追水平、移动版限制、同名不同规格提醒。
- 来源：官方规格和第三方参考链接。

## 响应式布局

桌面端：

- 顶部工具栏固定在内容上方。
- 主体使用双栏布局：天梯列表 + 详情面板。
- 详情面板可 sticky，方便连续查看多张显卡。
- 列表保持高信息密度，但避免文字拥挤。

平板端：

- 详情面板可以缩窄或移动到列表下方。
- 筛选控件允许换行。

手机端：

- 单列列表。
- 搜索框优先展示。
- 筛选项变成横向 chips 或折叠面板。
- 详情以底部抽屉展示。
- 显卡名称、标签和指数不得重叠或溢出。

## 视觉方向

整体风格应像硬件工具站：

- 信息密度高。
- 层级清晰。
- 品牌色只用于识别，不让页面被单一颜色主导。
- 不使用营销式 Hero。
- 不使用大面积渐变装饰。
- 不使用嵌套卡片堆叠。

建议颜色：

- NVIDIA：绿色点缀。
- AMD：红色点缀。
- Intel：蓝色点缀。
- 背景和面板使用中性色，保证可读性。

## 文件结构

首版建议使用纯前端静态项目：

```txt
index.html
src/
  app.js
  data/
    gpus.js
  styles.css
  utils/
    filters.js
    performance.js
docs/
  superpowers/
    specs/
      2026-04-26-gpu-ladder-design.md
```

不引入框架。理由：

- 数据量在首版规模下不需要复杂状态管理。
- 静态 HTML 易部署、易分享。
- 后续如果数据量或交互复杂度增加，可以平滑迁移到 Vite/React。

## 数据来源

优先级：

1. 官方规格：NVIDIA、AMD、Intel 官方产品页和发布资料。
2. 第三方规格库：TechPowerUp GPU Database 等。
3. 性能参考：公开评测均值、3DMark、PassMark。

参考链接：

- NVIDIA GeForce：https://www.nvidia.com/en-us/geforce/
- AMD Radeon：https://www.amd.com/en/products/graphics/desktops.html
- Intel Arc：https://www.intel.com/content/www/us/en/products/details/discrete-gpus/arc.html
- PassMark GPU Chart：https://www.videocardbenchmark.net/high_end_gpus.html
- UL 3DMark 比较说明：https://support.benchmarks.ul.com/support/solutions/articles/44001788120-can-i-compare-scores-from-different-benchmarks-

## 测试计划

功能测试：

- 搜索能按型号、品牌、世代、移动版关键词过滤。
- 品牌、类型、世代筛选可组合使用。
- 筛选后空档位自动隐藏。
- 点击显卡后详情正确更新。
- URL hash 能打开指定显卡。
- 缺失数据展示为“待补充”。

数据测试：

- `id` 不重复。
- `brand`、`segment`、`tier` 值合法。
- 移动版必须有 `Mobile` 标签和移动版说明。
- 规格缺失用 `null`，不要用空字符串。
- 性能指数为数字，且大于 0。

响应式测试：

- 桌面宽度：天梯列表和详情面板同时可见。
- 平板宽度：筛选控件不挤压内容。
- 手机宽度：条目不溢出，详情抽屉可读。
- 长型号名称不会覆盖指数、标签或按钮。

视觉测试：

- 品牌色可区分但不喧宾夺主。
- 性能条有最小宽度，低端卡仍可读。
- 选中态、hover 态和移动版标签清晰。

## 后续路线

第一阶段：

- 建立静态项目结构。
- 实现数据模型、筛选、搜索、点击详情和响应式布局。
- 录入代表性显卡样本。

第二阶段：

- 扩充到 60 到 100 张显卡。
- 校准性能指数。
- 增加来源链接和可信度标记。

第三阶段：

- 增加对比功能。
- 增加品牌矩阵视图。
- 扩展到更老的全历史显卡。

## 已确认决策

- 首版范围：近现代游戏显卡，后续扩展全历史。
- 数据方式：人工整理 JSON 数据库 + 少量真实示例先跑通界面。
- 排序方式：综合性能指数为主，3DMark/PassMark 为参考字段。
- UI 形态：综合天梯 + 档位分组。
- 技术路线：首版纯前端静态项目。

