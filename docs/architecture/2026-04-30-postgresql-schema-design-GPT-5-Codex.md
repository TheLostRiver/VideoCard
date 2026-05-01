# PostgreSQL Schema Design

日期：2026-04-30

## 概述

本文档定义多硬件平台的 PostgreSQL 数据库表结构。设计目标是支持 GPU、桌面 CPU、手机 SoC、Apple Silicon 等多个硬件品类，同时保留 JSON import/export 能力。

## 设计原则

1. **品类无关**：核心表（`hardware_items`、`metric_values`）不包含品类特定字段，通过 `category_id` 区分。
2. **Schema-driven**：`metric_definitions` 存储在数据库中，与 `src/data/categories/*.schema.json` 对应。
3. **来源可追溯**：每条 metric value 可关联 source document。
4. **审计友好**：关键表有 `created_at`、`updated_at`，重要变更写入 `audit_logs`。
5. **渐进迁移**：JSON repository 继续作为短期适配器，PostgreSQL 作为长期主数据源。

## 表结构

### 1. hardware_categories

硬件品类定义，对应 `src/data/categories/*.schema.json`。

```sql
CREATE TABLE hardware_categories (
  id              TEXT PRIMARY KEY,              -- e.g. 'gpu', 'desktop-cpu', 'mobile-soc', 'apple-silicon'
  label           TEXT NOT NULL,                 -- e.g. 'GPU', 'Desktop CPU'
  description     TEXT,
  item_name_singular TEXT,                       -- e.g. 'GPU', 'CPU'
  item_name_plural   TEXT,                       -- e.g. 'GPUs', 'CPUs'
  list_view_config   JSONB,                      -- listView schema
  detail_view_config JSONB,                      -- detailView schema
  admin_form_config  JSONB,                      -- adminForm schema
  compare_presets    JSONB,                      -- comparePresets schema
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. manufacturers

制造商信息。

```sql
CREATE TABLE manufacturers (
  id              TEXT PRIMARY KEY,              -- e.g. 'nvidia', 'amd', 'intel', 'apple', 'qualcomm'
  label           TEXT NOT NULL,                 -- e.g. 'NVIDIA', 'AMD'
  country         TEXT,
  website_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. product_families

产品系列/世代。

```sql
CREATE TABLE product_families (
  id              TEXT PRIMARY KEY,              -- e.g. 'rtx-40', 'ryzen-7000', 'snapdragon-8'
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  manufacturer_id TEXT NOT NULL REFERENCES manufacturers(id),
  label           TEXT NOT NULL,                 -- e.g. 'RTX 40', 'Ryzen 7000'
  generation      TEXT,                          -- e.g. 'RTX 40', 'Ryzen 7000'
  architecture    TEXT,                          -- e.g. 'Ada Lovelace', 'Zen 4'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_families_category ON product_families(category_id);
CREATE INDEX idx_product_families_manufacturer ON product_families(manufacturer_id);
```

### 4. hardware_items

硬件条目，核心表。

```sql
CREATE TABLE hardware_items (
  id              TEXT PRIMARY KEY,              -- e.g. 'rtx-4070-desktop', 'ryzen-7-7800x3d'
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  family_id       TEXT REFERENCES product_families(id),
  manufacturer_id TEXT NOT NULL REFERENCES manufacturers(id),
  name            TEXT NOT NULL,                 -- e.g. 'GeForce RTX 4070'
  generation      TEXT,                          -- 冗余，便于查询
  architecture    TEXT,                          -- 冗余，便于查询
  release_date    TEXT,                          -- ISO date or 'YYYY-MM'
  market_segment_ids TEXT[] NOT NULL DEFAULT '{}', -- e.g. {'desktop'}, {'mobile'}
  status          TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  notes           TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hardware_items_category ON hardware_items(category_id);
CREATE INDEX idx_hardware_items_family ON hardware_items(family_id);
CREATE INDEX idx_hardware_items_manufacturer ON hardware_items(manufacturer_id);
CREATE INDEX idx_hardware_items_status ON hardware_items(status);
```

### 5. hardware_variants

硬件变体（如不同 TGP 的移动版、不同显存配置等）。

```sql
CREATE TABLE hardware_variants (
  id              TEXT PRIMARY KEY,              -- e.g. 'rtx-4070-laptop-115w'
  item_id         TEXT NOT NULL REFERENCES hardware_items(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,                 -- e.g. '115W TGP Variant'
  variant_config  JSONB,                         -- 变体特定配置
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hardware_variants_item ON hardware_variants(item_id);
```

### 6. metric_definitions

指标定义，对应 schema 中的 metrics。

```sql
CREATE TABLE metric_definitions (
  id              TEXT PRIMARY KEY,              -- e.g. 'gpu.core.count', 'cpu.clock.boost'
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  label           TEXT NOT NULL,                 -- e.g. 'Core Count'
  value_type      TEXT NOT NULL,                 -- number, text, date, enum, range, boolean
  formatter_id    TEXT NOT NULL,                 -- e.g. 'number', 'clock-mhz', 'benchmark-score'
  unit            TEXT,                          -- e.g. 'MHz', 'GB', 'W'
  higher_is_better BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metric_definitions_category ON metric_definitions(category_id);
```

### 7. metric_values

指标值，每个硬件条目的具体参数。

```sql
CREATE TABLE metric_values (
  id              TEXT PRIMARY KEY,              -- e.g. 'rtx-4070-desktop:gpu.core.count'
  item_id         TEXT NOT NULL REFERENCES hardware_items(id) ON DELETE CASCADE,
  variant_id      TEXT REFERENCES hardware_variants(id) ON DELETE CASCADE,
  metric_id       TEXT NOT NULL REFERENCES metric_definitions(id),
  value_number    DOUBLE PRECISION,              -- 数值型指标
  value_text      TEXT,                          -- 文本型指标
  value_min       DOUBLE PRECISION,              -- range 型最小值
  value_max       DOUBLE PRECISION,              -- range 型最大值
  value_boolean   BOOLEAN,                       -- 布尔型指标
  unit            TEXT,                          -- 覆盖 metric_definitions.unit
  confidence      TEXT NOT NULL DEFAULT 'estimated', -- confirmed, estimated, rumored
  note            TEXT,
  source_ids      TEXT[] NOT NULL DEFAULT '{}',  -- 关联 source_documents.id
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(item_id, variant_id, metric_id)
);

CREATE INDEX idx_metric_values_item ON metric_values(item_id);
CREATE INDEX idx_metric_values_metric ON metric_values(metric_id);
CREATE INDEX idx_metric_values_item_metric ON metric_values(item_id, metric_id);
```

### 8. benchmark_definitions

跑分基准定义。

```sql
CREATE TABLE benchmark_definitions (
  id              TEXT PRIMARY KEY,              -- e.g. 'time-spy-graphics', 'cinebench-r23-single'
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  label           TEXT NOT NULL,                 -- e.g. 'Time Spy Graphics'
  benchmark_type  TEXT NOT NULL,                 -- gpu, cpu, soc, general
  source_url      TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_benchmark_definitions_category ON benchmark_definitions(category_id);
```

### 9. benchmark_scores

跑分成绩。

```sql
CREATE TABLE benchmark_scores (
  id              TEXT PRIMARY KEY,              -- e.g. 'rtx-4070-desktop:time-spy-graphics'
  item_id         TEXT NOT NULL REFERENCES hardware_items(id) ON DELETE CASCADE,
  variant_id      TEXT REFERENCES hardware_variants(id) ON DELETE CASCADE,
  benchmark_id    TEXT NOT NULL REFERENCES benchmark_definitions(id),
  score           DOUBLE PRECISION NOT NULL,
  confidence      TEXT NOT NULL DEFAULT 'estimated',
  note            TEXT,
  source_ids      TEXT[] NOT NULL DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(item_id, variant_id, benchmark_id)
);

CREATE INDEX idx_benchmark_scores_item ON benchmark_scores(item_id);
CREATE INDEX idx_benchmark_scores_benchmark ON benchmark_scores(benchmark_id);
```

### 10. ranking_profiles

天梯排名口径。

```sql
CREATE TABLE ranking_profiles (
  id              TEXT PRIMARY KEY,              -- e.g. 'gpu-gaming-performance', 'desktop-cpu-performance'
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  label           TEXT NOT NULL,                 -- e.g. 'GPU Gaming Performance'
  formula_version TEXT NOT NULL,                 -- e.g. 'legacy-performance-index-v1'
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ranking_profiles_category ON ranking_profiles(category_id);
```

### 11. ranking_scores

每个硬件条目的天梯分数。

```sql
CREATE TABLE ranking_scores (
  id              TEXT PRIMARY KEY,              -- e.g. 'rtx-4070-desktop:ranking:gpu-gaming-performance'
  item_id         TEXT NOT NULL REFERENCES hardware_items(id) ON DELETE CASCADE,
  profile_id      TEXT NOT NULL REFERENCES ranking_profiles(id),
  score           DOUBLE PRECISION NOT NULL,
  tier_id         TEXT,                          -- e.g. 'high-end', 'mid-range', 'flagship'
  confidence      TEXT NOT NULL DEFAULT 'estimated',
  formula_version TEXT NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(item_id, profile_id)
);

CREATE INDEX idx_ranking_scores_item ON ranking_scores(item_id);
CREATE INDEX idx_ranking_scores_profile ON ranking_scores(profile_id);
```

### 12. source_documents

数据来源文档。

```sql
CREATE TABLE source_documents (
  id              TEXT PRIMARY KEY,              -- e.g. 'rtx-4070-desktop:source:1'
  item_id         TEXT REFERENCES hardware_items(id) ON DELETE SET NULL,
  label           TEXT NOT NULL,                 -- e.g. 'NVIDIA Official'
  url             TEXT NOT NULL,
  source_type     TEXT NOT NULL DEFAULT 'other', -- official, review, benchmark, leak, other
  publisher       TEXT,
  retrieval_date  TEXT,                          -- ISO date
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_source_documents_item ON source_documents(item_id);
```

### 13. audit_logs

审计日志。

```sql
CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  table_name      TEXT NOT NULL,
  record_id       TEXT NOT NULL,
  action          TEXT NOT NULL,                 -- INSERT, UPDATE, DELETE
  old_values      JSONB,
  new_values      JSONB,
  user_id         TEXT,
  ip_address      INET,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

## ER 关系

```
hardware_categories 1──N metric_definitions
hardware_categories 1──N product_families
hardware_categories 1──N benchmark_definitions
hardware_categories 1──N ranking_profiles

manufacturers 1──N product_families
manufacturers 1──N hardware_items

product_families 1──N hardware_items

hardware_items 1──N hardware_variants
hardware_items 1──N metric_values
hardware_items 1──N benchmark_scores
hardware_items 1──N ranking_scores
hardware_items 1──N source_documents

hardware_variants 1──N metric_values
hardware_variants 1──N benchmark_scores

metric_definitions 1──N metric_values
benchmark_definitions 1──N benchmark_scores
ranking_profiles 1──N ranking_scores
```

## 与 JSON repository 的关系

| JSON 文件 | PostgreSQL 表 |
|-----------|--------------|
| `src/data/categories/*.schema.json` | `hardware_categories` + `metric_definitions` |
| `src/data/gpus.json` | `hardware_items` + `metric_values` + `ranking_scores` + `source_documents` |
| `src/data/hardware/*.items.json` | `hardware_items` + `metric_values` + `ranking_scores` + `source_documents` |

JSON repository 适配器在短期内继续使用，PostgreSQL 适配器实现相同的 `HardwareRepository` 接口。

## 迁移策略

1. 先创建表结构（Phase 8 Task 8.2）。
2. 编写 JSON → PostgreSQL 迁移脚本。
3. 实现 PostgreSQL repository 适配器。
4. 切换 API 和 admin 使用 PostgreSQL。
5. JSON 保留为 import/export 格式。
