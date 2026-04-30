# 架构扩展性审计与演进建议（GPT-5-Codex）

日期：2026-04-30

## 背景

当前项目已经完成 GPU 天梯图首版和本地后台编辑器：

- 前台：`index.html` + `src/app.js` + `src/styles.css`。
- 后台：`admin.html` + `src/admin.js` + `scripts/serve.mjs` 中的本地 API。
- 数据：`src/data/gpus.json` 作为主数据源，`src/data/gpus.js` 作为静态前台导入文件。
- 校验与同步：`scripts/gpu-data.mjs`、`scripts/sync-gpus.mjs`、`scripts/validate-data.mjs`。
- 测试：Node built-in test runner，覆盖格式化、过滤、性能分组、前台渲染、后台渲染、后台 API 和数据同步。

这套架构非常适合首版快速落地：依赖少、运行简单、数据可提交到 Git、前台可静态部署、本地后台能解决参数维护痛点。但如果目标扩展到 CPU 天梯、手机 CPU / SoC、同类型硬件对比、复杂后台管理、多人维护和数据库，当前架构需要从“GPU 单功能静态工具”演进为“多硬件品类数据平台”。

## 当前架构优点

1. **实现路径短**
   - 前台直接导入 `src/data/gpus.js`，没有运行时后端依赖。
   - 本地后台通过 `PUT /api/gpus/:id` 保存 JSON 并重新生成 JS，维护成本低。

2. **测试起点不错**
   - 已经把过滤、排序、格式化、渲染、后台保存和数据同步拆成可测函数。
   - 这让后续迁移时可以保留行为基线。

3. **数据源有明确主从关系**
   - `gpus.json` 是主数据，`gpus.js` 是生成物。
   - 这比手写 JS 数据更适合未来迁移数据库。

4. **移动版差异已经被显式建模**
   - `segment: "mobile"` 和 `specs.tgpRangeW` 已经进入校验逻辑。
   - 这说明项目开始意识到“同名硬件不同形态不能混排为一个实体”。

## 核心不足

### 1. 当前是 GPU 垂直切片，不是硬件平台

现有文件、变量、API 和 UI 文案都围绕 GPU：

- 数据文件：`src/data/gpus.json`、`src/data/gpus.js`。
- 数据脚本：`readGpuData`、`saveGpuRecord`、`validateGpuRecords`。
- API：`GET /api/gpus`、`PUT /api/gpus/:id`。
- 前台函数：`filterGpus`、`renderGpuRow`、`renderDetailMarkup`。
- 后台页面：固定显示“显卡数据后台编辑”。

这会导致新增 CPU 时自然出现复制粘贴：

- `cpus.json`
- `cpu-data.mjs`
- `filterCpus`
- `renderCpuRow`
- `/api/cpus`
- `admin-cpu.js`

短期能跑，长期会形成多套相似实现，维护成本迅速上升。

### 2. 数据模型过度绑定 GPU 字段

当前记录结构把 GPU 特有概念写死在通用位置：

- `specs.memorySizeGB`
- `specs.memoryBusBit`
- `specs.bandwidthGBs`
- `specs.tgpRangeW`
- `benchmarks.timeSpyGraphics`
- `gaming.recommendedResolution`
- `gaming.rayTracingLevel`

这些字段不适合 CPU 或手机 SoC：

- 桌面 CPU 需要核心/线程、P-core/E-core、制程、插槽、缓存、TDP/PBP/MTP、核显、内存支持。
- 手机 SoC 需要 CPU 集群、GPU、NPU/AI TOPS、ISP、基带、制程、Geekbench、AnTuTu、能效、机型散热差异。
- GPU 的 Time Spy、显存位宽、光追等级不能成为硬件平台的通用字段。

如果继续在同一个对象里加可选字段，最后会变成“巨型稀疏 JSON”：每个品类只用其中一部分字段，校验、表单和对比都会越来越脆。

### 3. UI 不是 schema-driven

前台详情由 `renderDetailMarkup(gpu)` 手写字段分组；后台表单由 `renderAdminEditor(gpu)` 手写 fieldset；字段类型由 `numberFields` 手工维护。

问题：

- 新增 CPU 字段必须同时改数据、校验、格式化、前台详情、后台表单、测试。
- 新增一个 benchmark 也要改多处硬编码。
- 后台无法根据品类自动生成表单。
- 对比页无法复用同一套字段定义。

理想方向是把“字段如何显示、如何编辑、如何校验、如何对比”变成数据配置，而不是散落在渲染函数里。

### 4. 过滤、排序、分层规则与 GPU 绑定

当前排序项是：

- 综合性能
- Time Spy
- 显存容量
- 能效

这些对 GPU 合理，但不适合 CPU / SoC。CPU 可能需要：

- 单核性能
- 多核性能
- 游戏性能
- 生产力性能
- 能效
- 价格性能比

手机 SoC 可能需要：

- CPU 单核
- CPU 多核
- GPU
- AI/NPU
- 功耗稳定性
- 机型平均表现

因此排序和 tier 也应该由 `hardwareCategory` 或 `rankingProfile` 驱动，而不是由一组全局常量驱动。

### 5. 后台 API 没有抽象 repository / service 层

当前 `scripts/serve.mjs` 直接调用 GPU 数据函数：

- `readGpuData`
- `saveGpuRecord`

这意味着 API 层知道数据来源、数据类型和保存方式。未来迁移 PostgreSQL 时，如果没有先引入接口层，很容易出现一次性大改：

- 路由要改。
- 测试要改。
- 保存逻辑要改。
- 校验逻辑要改。
- 前后台数据返回 shape 可能也要改。

更稳的方向是先定义接口，再让 JSON 和 PostgreSQL 都成为接口实现。

### 6. 数据治理能力不足

现在只有整条记录的来源和可信度：

- `sources`
- `confidence`
- `benchmarks.sourceNote`

但真实硬件数据库需要更细粒度的数据治理：

- 每个参数的来源可能不同。
- 同一跑分可能有多条样本。
- 移动 GPU / 手机 SoC 强依赖具体整机型号、功耗、散热模式。
- 需要记录谁改了什么、什么时候改、为什么改。
- 需要草稿、审核、发布和回滚。

没有字段级来源、审计日志、版本记录时，数据规模一上来会很难追溯。

### 7. 前台状态和路由仍是单页面局部状态

当前只有 hash 打开某张 GPU：

- `/#rtx-4070-laptop`

未来会需要：

- `/gpu`
- `/cpu`
- `/mobile-soc`
- `/compare?category=gpu&ids=...`
- `/item/:id`
- `/admin/:category/:id`

如果继续只靠一个 `app.js` 和 hash，会让路由、列表、详情、对比、筛选混在一起。

### 8. CSS 是单文件全局样式

`src/styles.css` 同时承载前台、后台、列表、详情、表单和响应式规则。首版没问题，但后台复杂化后会遇到：

- 类名越来越多。
- 前台和后台样式互相影响。
- 难以沉淀设计 token 和可复用组件。
- 对比页、批量编辑页、审核页加入后样式文件会变成高风险修改点。

### 9. 测试目前验证的是 GPU 行为，不是硬件平台契约

现有测试对首版非常有价值，但它们大多围绕 GPU seed data 和具体字段：

- `rtx-4070-laptop`
- `specs.tgpRangeW`
- `Time Spy`
- `memorySizeGB`

未来需要新增“品类契约测试”：

- 每个硬件品类必须有 schema。
- 每个 schema 必须能生成列表、详情、对比和后台表单。
- 每个 ranking profile 必须能排序。
- 每个 metric definition 必须有单位、格式化器和可比性定义。

## 目标架构方向

建议把项目演进成下面的分层结构：

```txt
UI Layer
  pages/
    ladder-page
    detail-page
    compare-page
    admin-editor-page
  components/
    filter-bar
    ladder-list
    item-detail
    compare-table
    schema-form

Feature Layer
  features/hardware-ladder
  features/hardware-compare
  features/admin-editor
  features/data-import

Application Layer
  services/
    HardwareQueryService
    HardwareMutationService
    RankingService
    ComparisonService
    ValidationService

Domain Layer
  interfaces/
    HardwareRepository
    CategoryRegistry
    MetricRegistry
    RankingProfileRepository
    SourceRepository
  models/
    HardwareCategory
    HardwareItem
    HardwareVariant
    MetricDefinition
    MetricValue
    BenchmarkScore
    RankingProfile

Infrastructure Layer
  repositories/json
  repositories/postgres
  static-export
  importers
```

关键思想：

- UI 不直接知道 GPU、CPU 的具体字段。
- UI 只消费 category schema、metric definitions 和 item view model。
- 业务服务依赖接口，不依赖 JSON 或 PostgreSQL 实现。
- JSON 是当前 adapter，PostgreSQL 是未来 adapter。
- 天梯、详情、对比、后台表单都由同一份 schema 驱动。

## 推荐领域模型

### HardwareCategory

表示硬件品类，例如：

- `gpu`
- `desktop-cpu`
- `mobile-soc`
- `laptop-cpu`

建议字段：

```ts
type HardwareCategory = {
  id: string;
  label: string;
  itemLabel: string;
  defaultRankingProfileId: string;
  fieldGroups: FieldGroup[];
  filterDefinitions: FilterDefinition[];
  sortDefinitions: SortDefinition[];
  comparePresetIds: string[];
};
```

### HardwareItem

表示一个可展示/可对比的硬件条目。

```ts
type HardwareItem = {
  id: string;
  categoryId: string;
  name: string;
  manufacturerId: string;
  familyId?: string;
  generation?: string;
  releaseDate?: string;
  segmentIds: string[];
  status: "draft" | "published" | "archived";
  summary?: string;
  notes: string[];
};
```

### MetricDefinition

所有参数、规格、跑分都应先定义 metric，再记录 value。

```ts
type MetricDefinition = {
  id: string;
  categoryId: string;
  label: string;
  group: "spec" | "benchmark" | "power" | "gaming" | "metadata";
  valueType: "number" | "string" | "boolean" | "enum" | "range";
  unit?: string;
  higherIsBetter?: boolean;
  comparable: boolean;
  displayOrder: number;
  formatterId?: string;
  validation?: MetricValidationRule[];
};
```

这样 GPU 的 `memorySizeGB`、CPU 的 `threads`、手机 SoC 的 `npuTops` 都是 metric，而不是硬编码对象字段。

### MetricValue

```ts
type MetricValue = {
  itemId: string;
  metricId: string;
  valueNumber?: number;
  valueText?: string;
  valueMin?: number;
  valueMax?: number;
  confidence: "official" | "aggregate" | "estimated" | "unknown";
  sourceIds: string[];
};
```

好处：

- 字段级来源。
- 字段级可信度。
- 支持范围值，例如移动 GPU TGP `45-115W`。
- 支持同一字段多来源校对。

### RankingProfile

不要把所有品类都塞进一个 `performanceIndex`。建议把性能指数抽象为 ranking profile。

```ts
type RankingProfile = {
  id: string;
  categoryId: string;
  label: string;
  baselineItemId?: string;
  baselineValue?: number;
  formulaVersion: string;
  metricWeights: Array<{
    metricId: string;
    weight: number;
  }>;
};
```

例子：

- `gpu-gaming-overall`
- `gpu-raytracing`
- `desktop-cpu-gaming`
- `desktop-cpu-productivity`
- `mobile-soc-overall`

## PostgreSQL 方向

如果进入多人维护、历史版本、审核流和复杂查询，PostgreSQL 是合理选择。建议不要直接把当前 JSON 整体塞进一张表，而是采用“核心关系表 + metric value 扩展表 + JSONB 辅助”的混合结构。

建议初版表：

```txt
hardware_categories
manufacturers
product_families
hardware_items
hardware_variants
metric_definitions
metric_values
benchmark_definitions
benchmark_scores
ranking_profiles
ranking_scores
source_documents
item_sources
change_sets
audit_log
admin_users
```

### 关键表职责

- `hardware_categories`：GPU、CPU、手机 SoC 等品类。
- `hardware_items`：硬件主条目，例如 RTX 4070 Laptop GPU、Ryzen 7 7800X3D、Apple A18 Pro。
- `hardware_variants`：同一硬件的形态差异，例如桌面版、移动版、不同 TGP、不同整机配置。
- `metric_definitions`：定义字段是什么、单位是什么、是否可比较。
- `metric_values`：记录每个硬件的字段值。
- `benchmark_scores`：记录不同 benchmark 的分数，可支持多样本和聚合。
- `ranking_profiles` / `ranking_scores`：保存不同天梯口径。
- `source_documents`：官方页面、评测、数据库页面等来源。
- `change_sets` / `audit_log`：后台编辑历史、审核、回滚。

### 为什么不是纯 JSONB

纯 JSONB 写起来快，但会把校验、查询、对比和后台表单复杂度推到应用层。硬件参数天然适合“定义和值分离”：

- metric 定义变化少。
- metric value 数据量大。
- 对比和筛选需要按 metric 查询。
- 后台表单需要根据 metric definition 自动生成。

JSONB 可以保留在 `hardware_items.extra` 或 `metric_values.raw_value` 中，用于收纳暂未结构化的字段。

## 接口优先设计

建议先在代码中引入接口概念，即使暂时仍然用 JSON。

### HardwareRepository

```ts
interface HardwareRepository {
  listItems(query: HardwareQuery): Promise<HardwareItem[]>;
  getItemById(id: string): Promise<HardwareItemDetail | null>;
  saveItem(input: SaveHardwareItemInput): Promise<HardwareItemDetail>;
  listCategories(): Promise<HardwareCategory[]>;
}
```

JSON adapter：

```txt
JsonHardwareRepository -> 读取 src/data/*.json
```

PostgreSQL adapter：

```txt
PostgresHardwareRepository -> 查询数据库
```

UI 和服务层只依赖 `HardwareRepository`，不依赖具体数据来源。

### CategoryRegistry

```ts
interface CategoryRegistry {
  getCategory(categoryId: string): HardwareCategory;
  getFieldGroups(categoryId: string): FieldGroup[];
  getFilters(categoryId: string): FilterDefinition[];
  getSorts(categoryId: string): SortDefinition[];
}
```

它负责告诉前台和后台：

- 这个品类有哪些字段。
- 哪些字段用于列表。
- 哪些字段用于详情。
- 哪些字段可编辑。
- 哪些字段可比较。
- 哪些字段可过滤和排序。

### FormatterRegistry

```ts
interface FormatterRegistry {
  format(metricId: string, value: unknown, context: FormatContext): string;
}
```

避免 `formatMemory(gpu)`、`formatPower(gpu)` 这种 GPU-only 函数继续扩散。

## 数据驱动 UI 方案

建议把 UI 拆成通用组件和 schema 配置。

### 列表行配置

```ts
type ListViewSchema = {
  titleField: string;
  subtitleFields: string[];
  badgeFields: string[];
  primaryMetricId: string;
  secondaryMetricIds: string[];
};
```

GPU 可以显示：

- 名称
- 品牌 / 世代 / 显存
- Desktop / Mobile
- 综合性能指数
- 功耗或 TGP

CPU 可以显示：

- 名称
- 品牌 / 架构 / 插槽
- Desktop / Mobile
- 单核/多核指数
- TDP

手机 SoC 可以显示：

- 名称
- 厂商 / 制程 / 年份
- CPU / GPU / NPU 综合指数
- 代表机型

### 详情页配置

```ts
type DetailSchema = {
  groups: Array<{
    title: string;
    fields: Array<{
      metricId: string;
      label?: string;
      formatterId?: string;
    }>;
  }>;
};
```

这样新增 CPU 不需要写新的 `renderCpuDetailMarkup`，只需要增加 category schema。

### 后台表单配置

```ts
type AdminFormSchema = {
  groups: Array<{
    title: string;
    fields: Array<{
      metricId: string;
      inputType: "text" | "number" | "select" | "textarea" | "range";
      required?: boolean;
      helpText?: string;
    }>;
  }>;
};
```

后台编辑器应该从 `AdminFormSchema` 生成表单，而不是写死 GPU 字段。

## 对比功能架构

同类型硬件对比不应该直接比较对象字段，而应该比较 metric。

建议对比流程：

1. 用户选择一个 `categoryId`。
2. 用户选择多个 `itemId`。
3. `ComparisonService` 读取 category 的 compare preset。
4. 根据 preset 取 metric values。
5. 按 metric definition 格式化。
6. 根据 `higherIsBetter` 标记优势项。

对比 preset 示例：

```ts
type ComparePreset = {
  id: string;
  categoryId: string;
  label: string;
  metricIds: string[];
};
```

GPU 对比 preset：

- 核心规格
- 显存与带宽
- 功耗与能效
- 3DMark 跑分

CPU 对比 preset：

- 核心线程
- 频率与缓存
- 平台与内存
- Cinebench / Geekbench

手机 SoC 对比 preset：

- CPU 集群
- GPU / NPU
- 制程与基带
- Geekbench / AnTuTu / 3DMark Wild Life

## 推荐迁移路线

### Phase 1：先抽象硬件平台接口，继续使用 JSON

目标：先解耦，不急着上数据库。

任务：

- 新增 `src/domain/` 放硬件通用类型和接口。
- 新增 `src/features/hardware/` 放通用过滤、排序、分组、详情 view model。
- 把 `gpus.json` 包装成 `JsonHardwareRepository`。
- 把 `/api/gpus` 逐步迁移为 `/api/hardware/gpu/items`。
- 保留旧 API 兼容一段时间。

收益：

- CPU 数据可以复用同一套 repository/service/UI。
- PostgreSQL 迁移会更平滑。

### Phase 2：引入 category schema，改造前台和后台为数据驱动

目标：让字段、表单、详情、对比列由配置生成。

任务：

- 新增 `src/data/categories/gpu.schema.json`。
- 新增 `src/data/categories/desktop-cpu.schema.json`。
- 重构 `renderDetailMarkup` 为 `renderDetail(schema, item)`.
- 重构 `renderAdminEditor` 为 `renderSchemaForm(schema, item)`.
- 将 `numberFields` 替换为 schema validation。

收益：

- 新增硬件品类主要变成新增 schema 和数据。
- UI 不再为每个品类复制一套。

### Phase 3：实现同类型硬件对比

目标：用 metric definitions 支撑 compare table。

任务：

- 新增 compare route/state。
- 新增 `ComparisonService`。
- 新增 `ComparePreset` 配置。
- 支持同品类多项硬件对比。
- 禁止跨品类直接对比，除非存在明确转换口径。

收益：

- GPU 对比、CPU 对比、手机 SoC 对比共用一个比较引擎。

### Phase 4：引入 PostgreSQL

目标：让后台进入真正的数据管理阶段。

任务：

- 新增数据库 schema migration。
- 实现 `PostgresHardwareRepository`。
- 增加 API 层：查询、保存、草稿、发布、审计日志。
- 增加字段级来源和可信度。
- 提供 JSON import/export，保证现有数据可迁移和备份。

收益：

- 支持多人维护、历史版本、审核流、复杂查询、字段级来源。

### Phase 5：后台管理平台化

目标：从“编辑一张 GPU”变成“维护硬件数据库”。

后台应逐步具备：

- 品类切换。
- 列表筛选和批量编辑。
- 字段级来源管理。
- 修改历史和回滚。
- 草稿/审核/发布。
- 导入官方参数或评测样本。
- 重算 ranking profile。
- 数据质量看板。

## 近期不建议做的事

1. **不要直接复制一套 CPU 页面**
   - 这会快速形成 GPU/CPU 两套实现，后续合并成本更高。

2. **不要先把 PostgreSQL 硬塞进当前 GPU shape**
   - 数据库不等于架构解耦。如果只是把 `gpus.json` 存成一张 `gpus` 表，CPU/SoC 扩展问题仍然存在。

3. **不要继续扩大 `specs` 对象**
   - `specs` 适合首版，但不适合作为长期跨品类 schema。

4. **不要让后台表单继续手写字段**
   - 后台复杂度会爆炸。表单必须尽早 schema-driven。

5. **不要混用不可比指标**
   - GPU Time Spy、CPU Cinebench、手机 AnTuTu 不应该进入同一个排序口径。

## 建议的下一组原子任务

### Task E：架构抽象设计文档与目录约定

- 新增 `docs/architecture/`。
- 明确硬件平台目标架构。
- 定义 category、metric、repository、ranking profile 等核心概念。

### Task F：引入硬件通用 domain 类型和 JSON repository 接口

- 新增 `src/domain/hardware.js` 或迁移到 TypeScript 后新增 `src/domain/hardware.ts`。
- 新增 `JsonHardwareRepository`。
- 保持现有前台行为不变。

### Task G：引入 GPU category schema

- 将前台详情字段、后台表单字段、排序项、过滤项迁移到 `gpu.schema.json`。
- 删除一部分 GPU 字段硬编码。

### Task H：新增 compare 基础模型

- 先支持 GPU 同类对比。
- 对比列来自 compare preset。

### Task I：数据库设计与迁移 POC

- 设计 PostgreSQL migration。
- 写 JSON -> PostgreSQL import 脚本。
- 保留 JSON export，避免被数据库锁死。

## 推荐技术栈调整

当前 vanilla JS 仍可继续推进一小段，但当进入多品类、复杂后台、数据库后，建议考虑：

- TypeScript：定义 domain/interface/schema 类型，降低跨模块重构风险。
- Zod 或 Valibot：运行时 schema validation，可同时服务 API、后台表单和导入脚本。
- PostgreSQL：长期主数据库。
- Prisma / Drizzle / node-postgres：任选其一；如果重视 SQL 可控性，Drizzle 或 node-postgres 更直接。
- Vite：前台构建、模块拆分、开发体验。
- 轻量前端框架：后台复杂后可考虑 React / Vue / Svelte；若继续 vanilla，也应建立组件和 schema renderer。

## 结论

当前架构的主要问题不是“没有数据库”，而是“抽象层级还停留在 GPU 单功能”。数据库应该在领域模型和接口边界清晰后引入，否则只是把硬编码从 JSON 搬到表结构里。

最优演进策略：

1. 先抽象 `HardwareCategory`、`MetricDefinition`、`HardwareRepository`。
2. 再把前台详情、列表、排序、后台表单改成 schema-driven。
3. 然后做同品类对比。
4. 最后引入 PostgreSQL、审计、来源、审核流。

这样项目会从“显卡天梯静态页面”自然演进为“多硬件品类性能与参数数据库”，同时保留当前静态前台和 Git 数据流的简单优势。
