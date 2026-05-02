-- 0001_initial_hardware_platform.sql
-- 多硬件平台 PostgreSQL 初始表结构
-- 日期：2026-05-02

BEGIN;

-- 1. hardware_categories
CREATE TABLE hardware_categories (
  id              TEXT PRIMARY KEY,
  label           TEXT NOT NULL,
  description     TEXT,
  item_name_singular TEXT,
  item_name_plural   TEXT,
  list_view_config   JSONB,
  detail_view_config JSONB,
  admin_form_config  JSONB,
  compare_presets    JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. manufacturers
CREATE TABLE manufacturers (
  id              TEXT PRIMARY KEY,
  label           TEXT NOT NULL,
  country         TEXT,
  website_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. product_families
CREATE TABLE product_families (
  id              TEXT PRIMARY KEY,
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  manufacturer_id TEXT NOT NULL REFERENCES manufacturers(id),
  label           TEXT NOT NULL,
  generation      TEXT,
  architecture    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_families_category ON product_families(category_id);
CREATE INDEX idx_product_families_manufacturer ON product_families(manufacturer_id);

-- 4. hardware_items
CREATE TABLE hardware_items (
  id              TEXT PRIMARY KEY,
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  family_id       TEXT REFERENCES product_families(id),
  manufacturer_id TEXT NOT NULL REFERENCES manufacturers(id),
  name            TEXT NOT NULL,
  generation      TEXT,
  architecture    TEXT,
  release_date    TEXT,
  market_segment_ids TEXT[] NOT NULL DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'draft',
  notes           TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hardware_items_category ON hardware_items(category_id);
CREATE INDEX idx_hardware_items_family ON hardware_items(family_id);
CREATE INDEX idx_hardware_items_manufacturer ON hardware_items(manufacturer_id);
CREATE INDEX idx_hardware_items_status ON hardware_items(status);

-- 5. hardware_variants
CREATE TABLE hardware_variants (
  id              TEXT PRIMARY KEY,
  item_id         TEXT NOT NULL REFERENCES hardware_items(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,
  variant_config  JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hardware_variants_item ON hardware_variants(item_id);

-- 6. metric_definitions
CREATE TABLE metric_definitions (
  id              TEXT PRIMARY KEY,
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  label           TEXT NOT NULL,
  value_type      TEXT NOT NULL,
  formatter_id    TEXT NOT NULL,
  unit            TEXT,
  higher_is_better BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metric_definitions_category ON metric_definitions(category_id);

-- 7. metric_values
CREATE TABLE metric_values (
  id              TEXT PRIMARY KEY,
  item_id         TEXT NOT NULL REFERENCES hardware_items(id) ON DELETE CASCADE,
  variant_id      TEXT REFERENCES hardware_variants(id) ON DELETE CASCADE,
  metric_id       TEXT NOT NULL REFERENCES metric_definitions(id),
  value_number    DOUBLE PRECISION,
  value_text      TEXT,
  value_min       DOUBLE PRECISION,
  value_max       DOUBLE PRECISION,
  value_boolean   BOOLEAN,
  unit            TEXT,
  confidence      TEXT NOT NULL DEFAULT 'estimated',
  note            TEXT,
  source_ids      TEXT[] NOT NULL DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(item_id, variant_id, metric_id)
);

CREATE INDEX idx_metric_values_item ON metric_values(item_id);
CREATE INDEX idx_metric_values_metric ON metric_values(metric_id);
CREATE INDEX idx_metric_values_item_metric ON metric_values(item_id, metric_id);

-- 8. benchmark_definitions
CREATE TABLE benchmark_definitions (
  id              TEXT PRIMARY KEY,
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  label           TEXT NOT NULL,
  benchmark_type  TEXT NOT NULL,
  source_url      TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_benchmark_definitions_category ON benchmark_definitions(category_id);

-- 9. benchmark_scores
CREATE TABLE benchmark_scores (
  id              TEXT PRIMARY KEY,
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

-- 10. ranking_profiles
CREATE TABLE ranking_profiles (
  id              TEXT PRIMARY KEY,
  category_id     TEXT NOT NULL REFERENCES hardware_categories(id),
  label           TEXT NOT NULL,
  formula_version TEXT NOT NULL,
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ranking_profiles_category ON ranking_profiles(category_id);

-- 11. ranking_scores
CREATE TABLE ranking_scores (
  id              TEXT PRIMARY KEY,
  item_id         TEXT NOT NULL REFERENCES hardware_items(id) ON DELETE CASCADE,
  profile_id      TEXT NOT NULL REFERENCES ranking_profiles(id),
  score           DOUBLE PRECISION NOT NULL,
  tier_id         TEXT,
  confidence      TEXT NOT NULL DEFAULT 'estimated',
  formula_version TEXT NOT NULL,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(item_id, profile_id)
);

CREATE INDEX idx_ranking_scores_item ON ranking_scores(item_id);
CREATE INDEX idx_ranking_scores_profile ON ranking_scores(profile_id);

-- 12. source_documents
CREATE TABLE source_documents (
  id              TEXT PRIMARY KEY,
  item_id         TEXT REFERENCES hardware_items(id) ON DELETE SET NULL,
  label           TEXT NOT NULL,
  url             TEXT NOT NULL,
  source_type     TEXT NOT NULL DEFAULT 'other',
  publisher       TEXT,
  retrieval_date  TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_source_documents_item ON source_documents(item_id);

-- 13. audit_logs
CREATE TABLE audit_logs (
  id              BIGSERIAL PRIMARY KEY,
  table_name      TEXT NOT NULL,
  record_id       TEXT NOT NULL,
  action          TEXT NOT NULL,
  old_values      JSONB,
  new_values      JSONB,
  user_id         TEXT,
  ip_address      INET,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

COMMIT;
