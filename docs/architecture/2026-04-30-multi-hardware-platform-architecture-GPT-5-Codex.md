# 多硬件天梯与参数数据库架构设计（GPT-5-Codex）

日期：2026-04-30

## 设计目标

本项目要从“静态 HTML 显卡天梯图”演进为“多硬件品类性能、参数、跑分、来源与对比数据库”。未来需要支持：

- GPU：NVIDIA、AMD、Intel、国产显卡、桌面版、移动版、工作站版。
- CPU：Intel、AMD、苹果芯片、国产 CPU、桌面版、移动版、服务器/工作站可作为后续扩展。
- 手机 CPU / SoC：Apple A/M 系列移动芯片、高通、联发科、三星、华为麒麟、紫光展锐等。
- 同类型硬件参数对比：GPU 对 GPU、桌面 CPU 对桌面 CPU、手机 SoC 对手机 SoC。
- 多天梯口径：综合性能、游戏性能、生产力、多核、单核、光追、能效、移动端持续性能等。
- 更复杂后台：品类切换、字段级来源、审核、草稿、发布、审计、批量编辑、导入导出。
- 数据库：PostgreSQL 作为长期主数据源，同时保留 JSON import/export 能力。

核心架构要求：

- 高扩展性：新增硬件品类时尽量新增 schema 和数据，而不是复制页面、API 和表单。
- 高可维护性：每个模块职责明确，文件小而聚焦。
- 解耦：UI、应用服务、领域模型、数据存储分离。
- 面向接口编程：业务层依赖 repository/service interface，而不是直接依赖 JSON 或 PostgreSQL。
- 数据驱动：列表、详情、表单、对比、排序和校验尽量由 category schema 和 metric definition 驱动。
- 可渐进迁移：当前静态 GPU 页面不能被一次性推翻，要分阶段替换。

## 非目标

当前设计不追求一次性完成全部数据库后台和多品类数据录入。第一阶段目标是把架构边界打出来，让后续 CPU、手机 SoC、国产 GPU 和对比功能能自然接入。

短期不做：

- 公网登录、权限、账号体系。
- 自动爬取第三方数据。
- 跨硬件品类直接混排，例如 GPU 与 CPU 混排。
- 复杂价格追踪。
- 电商购买推荐。

## 总体架构

采用分层 + 端口适配器架构。UI 和业务逻辑依赖稳定接口，数据来源通过 adapter 切换。

```txt
apps/
  web/
    pages/
    components/
    styles/
  admin/
    pages/
    components/
    schema-form/

src/
  domain/
    hardware/
      models
      interfaces
      category-schema
      metric-definition
      ranking-profile
      comparison
  application/
    hardware-query-service
    hardware-mutation-service
    ranking-service
    comparison-service
    validation-service
    import-export-service
  infrastructure/
    repositories/
      json
      postgres
    http/
    database/
    static-export/
  features/
    ladder/
    detail/
    compare/
    admin-editor/
  data/
    seed/
    generated/
```

当前项目可以不立刻移动所有目录。实现时应先在现有 `src/` 下增量创建 `src/domain`、`src/application`、`src/infrastructure`、`src/features`，等模块稳定后再考虑 `apps/` 拆分。

## 架构原则

### 1. 品类是第一公民

GPU、桌面 CPU、移动 CPU、手机 SoC、苹果芯片、国产 GPU 都不是硬编码页面，而是 `HardwareCategory`。

每个 category 定义：

- 叫什么。
- 有哪些字段。
- 哪些字段用于列表。
- 哪些字段用于详情。
- 哪些字段用于后台表单。
- 哪些字段用于比较。
- 有哪些排序方式。
- 默认天梯口径是什么。

### 2. 参数是 metric，不是对象字段

不要让长期模型变成：

```json
{
  "specs": {
    "memorySizeGB": 12,
    "threads": 16,
    "npuTops": 35
  }
}
```

应改成：

```txt
MetricDefinition: gpu.memory.size
MetricValue: item rtx-4070-desktop -> 12 GB

MetricDefinition: cpu.threads
MetricValue: item ryzen-7-7800x3d -> 16

MetricDefinition: soc.npu.tops
MetricValue: item apple-a18-pro -> 35 TOPS
```

好处：

- 新品类可以扩展 metric，不改核心 item 表。
- 字段级来源和可信度更自然。
- 对比页可以按 metric definition 生成列。
- 后台表单可以按 metric definition 生成控件。

### 3. 天梯分数是 ranking score，不是硬件本体字段

当前 `performanceIndex` 是 GPU 首版的实用字段，但长期应拆成：

- `RankingProfile`：定义评分口径。
- `RankingScore`：某个硬件在某个口径下的分数。

例子：

- `gpu.gaming.overall`
- `gpu.raytracing`
- `gpu.efficiency`
- `desktop-cpu.gaming`
- `desktop-cpu.productivity`
- `desktop-cpu.single-core`
- `mobile-soc.overall`
- `mobile-soc.sustained-performance`

同一硬件可以有多个排名分数。

### 4. UI 只消费 view model

前台列表和详情不应该直接读数据库 shape，也不应该直接读当前 JSON shape。它们消费 `HardwareListItemViewModel` 和 `HardwareDetailViewModel`。

这样后端从 JSON 切到 PostgreSQL、字段从对象字段切到 metric value 时，UI 不需要大改。

### 5. 后台表单由 schema 生成

后台不应写死 GPU 字段，例如 `specs.tgpRangeW` 或 `benchmarks.timeSpyGraphics`。

后台应读取：

- `CategorySchema`
- `FieldGroup`
- `MetricDefinition`
- `ValidationRule`

然后生成表单。新增 CPU 后台字段时，应优先改 schema，而不是写新页面。

### 6. 数据库是实现细节，不是业务边界

PostgreSQL 是长期主数据源，但业务层不直接写 SQL。业务层依赖：

- `HardwareRepository`
- `MetricRepository`
- `RankingRepository`
- `SourceRepository`
- `AuditRepository`

JSON 和 PostgreSQL 都是 repository adapter。

## 推荐技术栈

### 前端

建议中期迁移到：

- TypeScript
- Vite
- React 或 Vue

理由：

- 后台表单、对比表、复杂筛选、审核流会让 vanilla DOM 操作快速膨胀。
- TypeScript 可以把 schema、metric、repository contract 固化下来。
- Vite 可以继续保留静态部署能力。

如果希望最小迁移成本，可以先保持 vanilla JS，并逐步引入 JSDoc/TypeScript 类型检查。但当后台复杂化时，React/Vue 的组件化收益会明显超过迁移成本。

### 后端

建议中期引入：

- Node.js
- TypeScript
- Fastify 或 Hono
- PostgreSQL
- Drizzle ORM 或 node-postgres

推荐优先级：

1. 如果想保持 SQL 可控：Drizzle。
2. 如果想极简：node-postgres。
3. 如果想快速 CRUD 和类型生成：Prisma。

本项目强调数据模型、迁移和查询可控性，推荐 Drizzle 或 node-postgres。

### 数据校验

推荐：

- Zod 或 Valibot

用途：

- API 请求校验。
- JSON seed/import 校验。
- Category schema 校验。
- 后台表单字段校验。
- 测试夹具校验。

### 数据库

PostgreSQL 作为长期主库。建议：

- 本地开发用 Docker Compose。
- 生产可用 Supabase、Neon、Railway、Render、云服务器自建 PostgreSQL。
- 保留 `json export` 作为静态站点发布输入。

## 领域模型

### HardwareCategory

```ts
export type HardwareCategoryId =
  | "gpu"
  | "desktop-cpu"
  | "mobile-cpu"
  | "mobile-soc"
  | "apple-silicon";

export interface HardwareCategory {
  id: HardwareCategoryId;
  label: string;
  itemLabel: string;
  description: string;
  defaultRankingProfileId: string;
  listView: ListViewSchema;
  detailView: DetailViewSchema;
  adminForm: AdminFormSchema;
  filters: FilterDefinition[];
  sorts: SortDefinition[];
  comparePresets: ComparePreset[];
}
```

说明：

- 国产显卡属于 `gpu` category，通过 manufacturer 区分。
- 苹果桌面/笔记本芯片可先归入 `apple-silicon`，也可在后续拆成 `desktop-cpu` + `mobile-soc`。考虑到苹果 M 系列是 SoC，建议单独建 `apple-silicon`，但 comparison 默认只和同 category 比。

### HardwareItem

```ts
export interface HardwareItem {
  id: string;
  categoryId: HardwareCategoryId;
  name: string;
  manufacturerId: string;
  familyId?: string;
  generation?: string;
  architecture?: string;
  releaseDate?: string;
  marketSegmentIds: string[];
  status: "draft" | "published" | "archived";
  summary?: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}
```

例子：

- `rtx-4070-laptop`
- `rx-9070-xt-desktop`
- `intel-core-i7-14700k`
- `ryzen-7-7800x3d`
- `apple-m3-max`
- `apple-a18-pro`
- `kirin-9000s`
- `moore-threads-mtt-s80`

### HardwareVariant

用于表达同一硬件的形态或配置差异。

```ts
export interface HardwareVariant {
  id: string;
  itemId: string;
  label: string;
  variantType: "desktop" | "mobile" | "laptop" | "server" | "soc-device" | "board-partner";
  powerProfile?: string;
  deviceName?: string;
  notes: string[];
}
```

移动 GPU 和手机 SoC 很需要 variant：

- RTX 4070 Laptop 45W
- RTX 4070 Laptop 115W
- A18 Pro in iPhone 16 Pro
- A18 Pro in iPhone 16 Pro Max

首版可以先不把 variant 展示出来，但数据模型要留口。

### Manufacturer

```ts
export interface Manufacturer {
  id: string;
  label: string;
  countryOrRegion?: string;
  websiteUrl?: string;
  color?: string;
}
```

国产显卡、国产 CPU、手机 SoC 厂商都用 manufacturer 表表达，不应写死在品牌常量里。

### MetricDefinition

```ts
export interface MetricDefinition {
  id: string;
  categoryId: HardwareCategoryId;
  label: string;
  description?: string;
  groupId: string;
  valueType: "number" | "text" | "boolean" | "enum" | "range" | "date";
  unit?: string;
  enumValues?: Array<{ value: string; label: string }>;
  higherIsBetter?: boolean;
  comparable: boolean;
  filterable: boolean;
  sortable: boolean;
  formatterId: string;
  displayOrder: number;
  validation: MetricValidationRule[];
}
```

GPU metric 示例：

- `gpu.core.count`
- `gpu.memory.size`
- `gpu.memory.type`
- `gpu.memory.bus_width`
- `gpu.memory.bandwidth`
- `gpu.power.board_power`
- `gpu.power.tgp_range`
- `gpu.benchmark.time_spy_graphics`
- `gpu.benchmark.steel_nomad_graphics`

CPU metric 示例：

- `cpu.core.total`
- `cpu.thread.total`
- `cpu.core.performance`
- `cpu.core.efficient`
- `cpu.frequency.base`
- `cpu.frequency.boost`
- `cpu.cache.l3`
- `cpu.power.tdp`
- `cpu.socket`
- `cpu.memory.support`
- `cpu.benchmark.cinebench_r23_single`
- `cpu.benchmark.cinebench_r23_multi`

手机 SoC metric 示例：

- `soc.cpu.cluster`
- `soc.gpu.name`
- `soc.npu.tops`
- `soc.process.node`
- `soc.modem`
- `soc.benchmark.geekbench_single`
- `soc.benchmark.geekbench_multi`
- `soc.benchmark.antutu_total`
- `soc.benchmark.wild_life_extreme`
- `soc.sustained.performance_note`

### MetricValue

```ts
export interface MetricValue {
  id: string;
  itemId: string;
  variantId?: string;
  metricId: string;
  valueNumber?: number;
  valueText?: string;
  valueBoolean?: boolean;
  valueMin?: number;
  valueMax?: number;
  confidence: "official" | "aggregate" | "estimated" | "unknown";
  sourceIds: string[];
  note?: string;
  updatedAt: string;
}
```

范围字段示例：

- `gpu.power.tgp_range` -> `valueMin: 45`, `valueMax: 115`, `unit: W`

### BenchmarkDefinition

```ts
export interface BenchmarkDefinition {
  id: string;
  label: string;
  categoryIds: HardwareCategoryId[];
  scoreUnit: "points" | "fps" | "seconds" | "watts" | "ratio";
  higherIsBetter: boolean;
  version?: string;
  description?: string;
}
```

Benchmark 不是 category 专属字段，而是可复用定义。GPU 的 3DMark、CPU 的 Cinebench、手机 SoC 的 Geekbench 都进入统一 benchmark 模型。

### RankingProfile

```ts
export interface RankingProfile {
  id: string;
  categoryId: HardwareCategoryId;
  label: string;
  description: string;
  baselineItemId?: string;
  baselineScore?: number;
  formulaVersion: string;
  inputs: Array<{
    metricOrBenchmarkId: string;
    weight: number;
    transform: "linear" | "log" | "inverse" | "normalized";
  }>;
  caveats: string[];
}
```

### RankingScore

```ts
export interface RankingScore {
  id: string;
  itemId: string;
  variantId?: string;
  rankingProfileId: string;
  score: number;
  tierId: string;
  confidence: "aggregate" | "estimated" | "manual";
  formulaVersion: string;
  updatedAt: string;
}
```

### SourceDocument

```ts
export interface SourceDocument {
  id: string;
  label: string;
  url?: string;
  sourceType: "official" | "review" | "database" | "manual" | "community";
  publisher?: string;
  retrievedAt?: string;
  note?: string;
}
```

### AuditLog

```ts
export interface AuditLog {
  id: string;
  actorId: string;
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete" | "publish" | "archive" | "import";
  beforeJson?: unknown;
  afterJson?: unknown;
  createdAt: string;
}
```

## Repository Interfaces

### HardwareRepository

```ts
export interface HardwareRepository {
  listCategories(): Promise<HardwareCategory[]>;
  getCategory(categoryId: string): Promise<HardwareCategory | null>;
  listItems(query: HardwareQuery): Promise<HardwareItemSummary[]>;
  getItemDetail(itemId: string): Promise<HardwareItemDetail | null>;
  saveItem(input: SaveHardwareItemInput): Promise<HardwareItemDetail>;
}
```

### MetricRepository

```ts
export interface MetricRepository {
  listMetricDefinitions(categoryId: string): Promise<MetricDefinition[]>;
  listMetricValues(itemIds: string[]): Promise<MetricValue[]>;
  saveMetricValues(input: SaveMetricValuesInput): Promise<MetricValue[]>;
}
```

### RankingRepository

```ts
export interface RankingRepository {
  listRankingProfiles(categoryId: string): Promise<RankingProfile[]>;
  listRankingScores(profileId: string): Promise<RankingScore[]>;
  saveRankingScore(input: SaveRankingScoreInput): Promise<RankingScore>;
}
```

### SourceRepository

```ts
export interface SourceRepository {
  listSources(query: SourceQuery): Promise<SourceDocument[]>;
  saveSource(input: SaveSourceInput): Promise<SourceDocument>;
}
```

### AuditRepository

```ts
export interface AuditRepository {
  append(entry: CreateAuditLogInput): Promise<AuditLog>;
  listForEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
}
```

## Application Services

### HardwareQueryService

职责：

- 聚合 item、metric、ranking、source。
- 输出 UI 可直接消费的 view model。
- 屏蔽 JSON/PostgreSQL 差异。

输出：

```ts
export interface HardwareListItemViewModel {
  id: string;
  categoryId: string;
  name: string;
  manufacturerLabel: string;
  badges: string[];
  primaryScore: string;
  primaryScoreNumber: number;
  secondaryFacts: Array<{ label: string; value: string }>;
  tierId: string;
  warning?: string;
}
```

### HardwareMutationService

职责：

- 保存 item 基础信息。
- 保存 metric values。
- 执行 category schema validation。
- 写 audit log。
- 可选触发 static export。

### RankingService

职责：

- 根据 ranking profile 计算或读取排名。
- 支持手动校准分数。
- 维护 formula version。

### ComparisonService

职责：

- 限制同 category 对比。
- 根据 compare preset 选取 metric。
- 格式化值。
- 标记优势项。

输出：

```ts
export interface CompareTableViewModel {
  categoryId: string;
  itemIds: string[];
  columns: Array<{ itemId: string; label: string }>;
  groups: Array<{
    title: string;
    rows: Array<{
      metricId: string;
      label: string;
      values: Array<{
        itemId: string;
        displayValue: string;
        rawComparableValue?: number;
        isBest?: boolean;
      }>;
    }>;
  }>;
}
```

### ValidationService

职责：

- 校验 category schema。
- 校验 item 必填字段。
- 校验 metric value 类型、范围、单位。
- 校验 ranking score。
- 校验 compare preset。

## 数据驱动 UI

### Category Schema 文件

短期使用 JSON 或 JS module：

```txt
src/data/categories/gpu.schema.json
src/data/categories/desktop-cpu.schema.json
src/data/categories/mobile-soc.schema.json
src/data/categories/apple-silicon.schema.json
```

中期可以从 PostgreSQL 读取，但推荐仍导出静态 schema 给前台使用。

### ListViewSchema

```ts
export interface ListViewSchema {
  titleField: "name";
  subtitleMetricIds: string[];
  badgeMetricIds: string[];
  primaryRankingProfileId: string;
  secondaryMetricIds: string[];
}
```

### DetailViewSchema

```ts
export interface DetailViewSchema {
  groups: Array<{
    id: string;
    title: string;
    metricIds: string[];
  }>;
  warningRules: Array<{
    when: MetricCondition;
    message: string;
  }>;
}
```

### AdminFormSchema

```ts
export interface AdminFormSchema {
  groups: Array<{
    id: string;
    title: string;
    fields: Array<{
      kind: "core-field" | "metric";
      key: string;
      inputType: "text" | "number" | "select" | "textarea" | "range";
      required: boolean;
      helpText?: string;
    }>;
  }>;
}
```

### ComparePreset

```ts
export interface ComparePreset {
  id: string;
  label: string;
  metricGroups: Array<{
    title: string;
    metricIds: string[];
  }>;
}
```

## 前台页面设计

### 路由

短期可继续 hash：

- `#/gpu`
- `#/gpu/rtx-4070-laptop`
- `#/desktop-cpu`
- `#/mobile-soc`
- `#/compare/gpu?ids=rtx-4070-desktop,rtx-4070-laptop`

中期迁移到 Vite SPA history route：

- `/hardware/gpu`
- `/hardware/gpu/:itemId`
- `/hardware/desktop-cpu`
- `/compare/gpu?ids=...`

### 页面

1. `HardwareLadderPage`
   - category tabs。
   - filter bar。
   - ranking profile selector。
   - ladder list。
   - detail panel / mobile drawer。

2. `HardwareDetailPage`
   - full detail groups。
   - source list。
   - confidence display。
   - add-to-compare。

3. `HardwareComparePage`
   - item picker。
   - compare preset selector。
   - sticky compare table。
   - best-value highlighting。

4. `AdminHardwareListPage`
   - category selector。
   - status filter。
   - search。
   - bulk actions。

5. `AdminHardwareEditorPage`
   - schema form。
   - metric source editor。
   - save draft。
   - publish。
   - audit log.

## 后台管理设计

### 后台功能分层

1. 数据编辑
   - item 基础信息。
   - metric values。
   - ranking scores。
   - sources。

2. 数据治理
   - 字段级来源。
   - 可信度。
   - 修改历史。
   - 审核发布。

3. 数据导入
   - JSON import。
   - CSV import。
   - 手工粘贴导入。

4. 数据导出
   - static export for frontend。
   - JSON backup。
   - category schema export。

### 审核流

推荐状态：

```txt
draft -> review -> published -> archived
```

首版后台可以只实现：

- draft
- published

但数据库 schema 要预留 review。

## PostgreSQL 设计

### 表结构

```sql
hardware_categories
manufacturers
product_families
hardware_items
hardware_variants
metric_groups
metric_definitions
metric_values
benchmark_definitions
benchmark_scores
ranking_profiles
ranking_scores
source_documents
metric_value_sources
item_sources
change_sets
audit_logs
admin_users
```

### hardware_items

```sql
id text primary key
category_id text not null references hardware_categories(id)
manufacturer_id text not null references manufacturers(id)
family_id text null references product_families(id)
name text not null
generation text null
architecture text null
release_date text null
status text not null
summary text null
notes jsonb not null default '[]'
extra jsonb not null default '{}'
created_at timestamptz not null
updated_at timestamptz not null
```

### metric_definitions

```sql
id text primary key
category_id text not null references hardware_categories(id)
group_id text not null
label text not null
description text null
value_type text not null
unit text null
higher_is_better boolean null
comparable boolean not null default false
filterable boolean not null default false
sortable boolean not null default false
formatter_id text not null
display_order integer not null
validation jsonb not null default '[]'
```

### metric_values

```sql
id uuid primary key
item_id text not null references hardware_items(id)
variant_id text null references hardware_variants(id)
metric_id text not null references metric_definitions(id)
value_number numeric null
value_text text null
value_boolean boolean null
value_min numeric null
value_max numeric null
confidence text not null
note text null
updated_at timestamptz not null
unique(item_id, variant_id, metric_id)
```

### ranking_scores

```sql
id uuid primary key
item_id text not null references hardware_items(id)
variant_id text null references hardware_variants(id)
ranking_profile_id text not null references ranking_profiles(id)
score numeric not null
tier_id text not null
confidence text not null
formula_version text not null
updated_at timestamptz not null
unique(item_id, variant_id, ranking_profile_id)
```

### audit_logs

```sql
id uuid primary key
actor_id text not null
entity_type text not null
entity_id text not null
action text not null
before_json jsonb null
after_json jsonb null
created_at timestamptz not null
```

## API 设计

短期 REST API 足够。

### Public API

```txt
GET /api/hardware/categories
GET /api/hardware/:categoryId/items
GET /api/hardware/:categoryId/items/:itemId
GET /api/hardware/:categoryId/ranking-profiles
GET /api/hardware/:categoryId/compare?ids=a,b,c&preset=basic
```

### Admin API

```txt
GET /api/admin/hardware/:categoryId/items
GET /api/admin/hardware/:categoryId/items/:itemId
PUT /api/admin/hardware/:categoryId/items/:itemId
POST /api/admin/hardware/:categoryId/items
POST /api/admin/hardware/:categoryId/items/:itemId/publish
GET /api/admin/hardware/:categoryId/items/:itemId/audit
GET /api/admin/sources
POST /api/admin/sources
POST /api/admin/import/json
GET /api/admin/export/json
```

### 兼容 API

现有接口保留一段时间：

```txt
GET /api/gpus
PUT /api/gpus/:id
```

内部转发到：

```txt
GET /api/admin/hardware/gpu/items
PUT /api/admin/hardware/gpu/items/:id
```

## 静态导出策略

即使引入 PostgreSQL，前台仍可支持静态部署。

流程：

```txt
PostgreSQL -> StaticExportService -> src/data/generated/*.json -> Vite build -> GitHub Pages/static hosting
```

导出文件：

```txt
src/data/generated/categories.json
src/data/generated/manufacturers.json
src/data/generated/gpu.items.json
src/data/generated/gpu.metrics.json
src/data/generated/gpu.rankings.json
src/data/generated/desktop-cpu.items.json
src/data/generated/mobile-soc.items.json
```

开发期可以继续用 JSON repository，生产管理期切 PostgreSQL repository。

## 从当前架构迁移

### 当前字段映射

| 当前字段 | 新模型 |
| --- | --- |
| `id` | `HardwareItem.id` |
| `name` | `HardwareItem.name` |
| `brand` | `manufacturerId` |
| `segment` | `HardwareVariant.variantType` 或 `marketSegmentIds` |
| `generation` | `HardwareItem.generation` |
| `architecture` | `HardwareItem.architecture` |
| `performanceIndex` | `RankingScore.score` |
| `tier` | `RankingScore.tierId` |
| `specs.cores` | `MetricValue(metricId=gpu.core.count)` |
| `specs.memorySizeGB` | `MetricValue(metricId=gpu.memory.size)` |
| `specs.tgpRangeW` | `MetricValue(metricId=gpu.power.tgp_range)` |
| `benchmarks.timeSpyGraphics` | `BenchmarkScore(benchmarkId=3dmark.time_spy_graphics)` |
| `gaming.recommendedResolution` | `MetricValue(metricId=gpu.gaming.recommended_resolution)` |
| `notes` | `HardwareItem.notes` |
| `sources` | `SourceDocument` + relation |
| `confidence` | item-level fallback confidence；长期迁移到 field-level |

### 迁移原则

1. 保持当前功能可用。
2. 每一步都运行 `npm.cmd run verify`。
3. 旧 GPU 数据先由 adapter 包装，不立刻删除。
4. 新 schema-driven UI 先复刻现有 GPU 页面。
5. 复刻稳定后再新增 CPU/SoC。
6. PostgreSQL 在 repository interface 稳定后接入。

## 测试策略

### Unit Tests

- category schema validation。
- metric definition validation。
- metric value formatting。
- ranking score sorting。
- compare table generation。
- repository adapter contract。

### Contract Tests

同一套 repository contract tests 应同时跑：

- JSON repository。
- PostgreSQL repository。

确保业务层不会依赖具体存储实现。

### Integration Tests

- API list/detail/compare。
- admin save item。
- admin save metric values。
- import/export。

### Browser Smoke Tests

- GPU 天梯仍然可用。
- CPU 天梯可切换。
- 手机 SoC 天梯可切换。
- 同品类对比可用。
- 后台 schema 表单可保存。

## UI 设计原则

### 前台

- 工具型界面，优先扫描效率。
- 避免营销式大 hero。
- 重点信息密度适中：列表行显示名称、品牌、世代、核心排名分数、2-3 个关键参数。
- 对比页使用固定列头和分组行。
- 移动端以抽屉/底部详情为主。

### 后台

- 信息密集但不拥挤。
- 左侧：品类和列表。
- 中间：schema 表单。
- 右侧：来源、审计、发布状态。
- 支持保存草稿和发布。
- 校验错误定位到具体字段。

## 安全与权限

短期本地后台仍可无登录，但一旦接 PostgreSQL 或公网部署，必须加入：

- 登录。
- 角色权限。
- CSRF 防护。
- API 输入校验。
- 审计日志。
- 备份和导出。

首批角色：

- viewer：只读。
- editor：编辑草稿。
- reviewer：审核发布。
- admin：管理 schema、用户和导入导出。

## 关键设计决策

1. **先接口，后数据库**
   - 先定义 repository/service contract，再接 PostgreSQL。

2. **先 schema-driven，后新增大量数据**
   - 否则 CPU/SoC 数据越多，后续迁移越痛。

3. **同品类对比优先**
   - GPU 对 GPU、CPU 对 CPU、手机 SoC 对手机 SoC。
   - 跨品类比较必须有明确 ranking profile，不默认支持。

4. **保留静态导出**
   - 数据库用于管理，静态数据用于前台部署。

5. **字段级来源是长期必需**
   - 硬件参数可靠性取决于来源和可信度，不应只有整条记录来源。

## 风险

1. **过早大重构**
   - 解决：每个原子任务必须小，且保持现有功能可验证。

2. **schema 过度抽象**
   - 解决：先用 GPU 复刻现有功能，再加 CPU 和 SoC 检验抽象。

3. **数据库模型过复杂**
   - 解决：第一版 PostgreSQL 只覆盖 item、metric、ranking、source、audit 五个核心域。

4. **后台 UI 过早平台化**
   - 解决：先做 schema form 和单 item 编辑，再做审核、批量、导入。

5. **跑分口径争议**
   - 解决：ranking profile 必须带 formula version、caveats 和 confidence。

## 推荐实施顺序

1. 建立 `SessionContextRecord.md` 和原子任务执行铁律。
2. 引入 TypeScript 类型检查或 JSDoc contract。
3. 新增 domain model 和 repository interface。
4. 建立 GPU category schema，复刻当前字段。
5. 建立 JSON repository adapter，保持现有 JSON 数据可读写。
6. 把前台列表/详情改为 schema-driven view model。
7. 把后台表单改为 schema-driven form。
8. 新增同品类对比基础能力，先支持 GPU。
9. 新增 CPU category schema 和少量种子数据。
10. 新增 mobile SoC / apple-silicon schema 和少量种子数据。
11. 引入 PostgreSQL schema 和 migration。
12. 实现 PostgreSQL repository adapter。
13. 实现 JSON import/export 和 static export。
14. 增加后台审计、来源、草稿/发布。

## 结论

优秀的下一代架构不是“把当前 GPU JSON 放进数据库”，而是把项目升级为 category + metric + ranking + repository + schema UI 的平台。

数据库会成为长期主数据源，但真正的扩展性来自：

- `HardwareCategory` 抽象品类。
- `MetricDefinition` 抽象参数。
- `RankingProfile` 抽象天梯口径。
- `HardwareRepository` 抽象存储。
- `CategorySchema` 驱动前台详情、后台表单和对比表。

按这个方向推进，项目可以稳地覆盖显卡、CPU、手机 SoC、苹果芯片、国产硬件和同品类对比，而不会每新增一个品类就复制一整套页面、API 和校验逻辑。
