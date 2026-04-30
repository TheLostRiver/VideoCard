# Multi-Hardware Platform Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current GPU-only static tool into a schema-driven, interface-first, multi-hardware platform that can later use PostgreSQL as the primary data source.

**Architecture:** Implement the migration incrementally. First add domain contracts, category schemas, repository interfaces, JSON adapters, and schema-driven UI while preserving the current GPU behavior. Add compare and additional categories only after the generic architecture proves it can reproduce the existing GPU ladder. Introduce PostgreSQL only after repository contracts and static export are stable.

**Tech Stack:** JavaScript now, TypeScript-ready JSDoc/types during the first migration, Node built-in tests, vanilla frontend during early refactor, optional Vite/TypeScript/React migration after schema-driven behavior is stable, PostgreSQL + Drizzle or node-postgres in the database phase.

---

## Context Iron Law

The following rule is mandatory for every future coding session:

1. Before starting any atomic task, read `PROJECT_STATE.md`, `SessionContextRecord.md`, and this implementation plan.
2. Every atomic task must be small enough to finish, verify, document, commit, and push in one session.
3. Every atomic task must update `SessionContextRecord.md` before the final commit.
4. If context is becoming large, confusing, or likely to be compacted, stop coding and update `SessionContextRecord.md` with:
   - current task id,
   - exact files changed,
   - verification status,
   - unfinished decisions,
   - next command to run,
   - known risks.
5. After context compression, the first action must be reading `SessionContextRecord.md`; do not rely on memory or summary alone.
6. Do not start a new atomic task until the previous task has passed verification, updated docs, committed, and pushed.

## Execution Loop For Every Task

Run this loop exactly:

1. Read:
   ```powershell
   Get-Content -Encoding UTF8 PROJECT_STATE.md
   Get-Content -Encoding UTF8 SessionContextRecord.md
   ```
2. Complete only the selected task.
3. Run the task-specific test command.
4. Run:
   ```powershell
   npm.cmd run verify
   ```
5. Update:
   - `PROJECT_STATE.md`
   - `SessionContextRecord.md`
   - this plan checkbox for the completed task
6. Commit only files touched by the task.
7. Push to `origin main`.

## Architecture References

- Main design: `docs/architecture/2026-04-30-multi-hardware-platform-architecture-GPT-5-Codex.md`
- Previous audit: `docs/architecture/2026-04-30-architecture-scalability-review-GPT-5-Codex.md`
- Current first-release plan: `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`

## File Map

New architecture files will be introduced gradually:

```txt
SessionContextRecord.md
src/domain/hardware/types.js
src/domain/hardware/category-schema.js
src/domain/hardware/metric-definition.js
src/domain/hardware/repository-contract.js
src/domain/hardware/validation.js
src/data/categories/gpu.schema.json
src/data/hardware/gpu.items.json
src/infrastructure/json/json-hardware-repository.js
src/application/hardware-query-service.js
src/application/hardware-mutation-service.js
src/application/comparison-service.js
src/features/hardware-list/render-list.js
src/features/hardware-detail/render-detail.js
src/features/schema-form/render-schema-form.js
src/features/compare/render-compare.js
scripts/export-static-data.mjs
scripts/import-legacy-gpus.mjs
scripts/validate-hardware-data.mjs
tests/hardware-schema.test.mjs
tests/json-hardware-repository.test.mjs
tests/hardware-query-service.test.mjs
tests/schema-render.test.mjs
tests/comparison-service.test.mjs
```

Database-phase files will be added later:

```txt
db/schema.sql
db/migrations/0001_initial_hardware_platform.sql
src/infrastructure/postgres/postgres-hardware-repository.js
scripts/import-json-to-postgres.mjs
scripts/export-postgres-to-json.mjs
```

## Phase 0: Documentation And Safety Rails

### Task 0.1: Create Session Context Record

**Files:**

- Create or modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Read project state**

Run:

```powershell
Get-Content -Encoding UTF8 PROJECT_STATE.md
```

Expected: It mentions the multi-hardware architecture design work.

- [x] **Step 2: Create `SessionContextRecord.md`**

Content must include:

```markdown
# Session Context Record

## Mandatory Continuation Rule

After any context compression or session resume, read this file before making decisions or editing files.

## Current Task

Task: Task 0.1 - Create Session Context Record
Status: in progress

## Active Architecture Decision

The project is migrating from a GPU-only static ladder to a multi-hardware platform built around HardwareCategory, MetricDefinition, RankingProfile, schema-driven UI, repository interfaces, JSON adapters, and future PostgreSQL adapters.

## Current Files Of Interest

- PROJECT_STATE.md
- docs/architecture/2026-04-30-multi-hardware-platform-architecture-GPT-5-Codex.md
- docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md

## Last Verification

No code changes in this task yet.

## Next Step

Finish Task 0.1, run npm.cmd run verify, update PROJECT_STATE.md, commit, and push.
```

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd run verify
```

Expected: data validation passes and all tests pass.

- [x] **Step 4: Update records and commit**

Update `PROJECT_STATE.md` and `SessionContextRecord.md`.

Run:

```powershell
git add SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "docs: add session context workflow"
git push origin main
```

## Phase 1: Domain Contracts Without Behavior Change

### Task 1.1: Add Hardware Domain Types

**Files:**

- Create: `src/domain/hardware/types.js`
- Create: `tests/hardware-types.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing tests**

Create tests that import constants/factory helpers from `src/domain/hardware/types.js` and assert:

- category ids include `gpu`, `desktop-cpu`, `mobile-soc`, `apple-silicon`;
- value types include `number`, `text`, `boolean`, `enum`, `range`, `date`;
- item statuses include `draft`, `published`, `archived`.

Run:

```powershell
npm.cmd test
```

Expected: fails because `src/domain/hardware/types.js` does not exist.

- [x] **Step 2: Implement minimal type constants**

Create `src/domain/hardware/types.js` with exported frozen constants:

```js
export const HARDWARE_CATEGORY_IDS = Object.freeze([
  "gpu",
  "desktop-cpu",
  "mobile-cpu",
  "mobile-soc",
  "apple-silicon"
]);

export const METRIC_VALUE_TYPES = Object.freeze([
  "number",
  "text",
  "boolean",
  "enum",
  "range",
  "date"
]);

export const ITEM_STATUSES = Object.freeze(["draft", "published", "archived"]);
```

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Update `SessionContextRecord.md`, `PROJECT_STATE.md`, and this checkbox.

Commit:

```powershell
git add src/domain/hardware/types.js tests/hardware-types.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add hardware domain type constants"
git push origin main
```

### Task 1.2: Add Category Schema Validation

**Files:**

- Create: `src/domain/hardware/category-schema.js`
- Create: `tests/hardware-schema.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing tests**

Test `validateCategorySchema(schema)` with:

- a valid GPU schema;
- missing `id`;
- missing `listView`;
- metric field missing `metricId`;
- duplicate metric id inside one schema.

Run:

```powershell
npm.cmd test
```

Expected: fails because `category-schema.js` does not exist.

- [x] **Step 2: Implement validation**

Implement:

```js
export function validateCategorySchema(schema) {
  const errors = [];
  if (!schema?.id) errors.push("category schema missing id");
  if (!schema?.label) errors.push(`${schema?.id || "category"} missing label`);
  if (!schema?.listView) errors.push(`${schema?.id || "category"} missing listView`);
  if (!schema?.detailView?.groups?.length) errors.push(`${schema?.id || "category"} missing detailView groups`);
  if (!schema?.adminForm?.groups?.length) errors.push(`${schema?.id || "category"} missing adminForm groups`);

  const metricIds = new Set();
  for (const metric of schema?.metrics || []) {
    if (!metric.id) errors.push(`${schema.id} metric missing id`);
    if (metric.id && metricIds.has(metric.id)) errors.push(`${schema.id} duplicate metric id: ${metric.id}`);
    if (metric.id) metricIds.add(metric.id);
    if (!metric.label) errors.push(`${metric.id || "metric"} missing label`);
    if (!metric.valueType) errors.push(`${metric.id || "metric"} missing valueType`);
    if (!metric.formatterId) errors.push(`${metric.id || "metric"} missing formatterId`);
  }

  return errors;
}

export function assertValidCategorySchema(schema) {
  const errors = validateCategorySchema(schema);
  if (errors.length) {
    const error = new Error(errors.join("\n"));
    error.errors = errors;
    throw error;
  }
}
```

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/domain/hardware/category-schema.js tests/hardware-schema.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add category schema validation"
git push origin main
```

### Task 1.3: Add Repository Contract Tests

**Files:**

- Create: `src/domain/hardware/repository-contract.js`
- Create: `tests/hardware-repository-contract.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing tests**

Test that `createHardwareRepositoryContractTestSuite` can run against a fake repository with these methods:

- `listCategories`
- `getCategory`
- `listItems`
- `getItemDetail`
- `saveItem`

Expected: fails because the contract helper does not exist.

- [x] **Step 2: Implement contract helper**

Implement a helper that accepts `{ name, createRepository }` and defines tests for method presence and basic list/detail behavior.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/domain/hardware/repository-contract.js tests/hardware-repository-contract.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "test: add hardware repository contract"
git push origin main
```

## Phase 2: GPU Schema And JSON Repository

### Task 2.1: Add GPU Category Schema

**Files:**

- Create: `src/data/categories/gpu.schema.json`
- Create: `tests/gpu-category-schema.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing test**

Test that `gpu.schema.json` passes `assertValidCategorySchema`.

Expected: fails before the schema exists.

- [x] **Step 2: Create GPU schema**

Include:

- category id `gpu`;
- metrics for core count, clocks, memory size/type/bus/bandwidth, board power, TGP range, Time Spy, Steel Nomad, PassMark, recommended resolution, ray tracing level;
- list view matching current row information;
- detail view matching current detail panel;
- admin form matching current admin form groups;
- compare presets for specs, memory, power, benchmarks.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/data/categories/gpu.schema.json tests/gpu-category-schema.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "data: add gpu category schema"
git push origin main
```

### Task 2.2: Add Legacy GPU Import Mapper

**Files:**

- Create: `scripts/import-legacy-gpus.mjs`
- Create: `tests/legacy-gpu-import.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing tests**

Test that one current GPU record maps to:

- `HardwareItem`;
- metric values;
- ranking score;
- source documents.

Expected: fails because mapper does not exist.

- [x] **Step 2: Implement mapper functions**

Export pure functions:

- `mapLegacyGpuToHardwareItem(gpu)`
- `mapLegacyGpuToMetricValues(gpu)`
- `mapLegacyGpuToRankingScore(gpu)`
- `mapLegacyGpuToSources(gpu)`

Do not write files in this task.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add scripts/import-legacy-gpus.mjs tests/legacy-gpu-import.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: map legacy gpu records to hardware model"
git push origin main
```

### Task 2.3: Add JSON Hardware Repository Read Path

**Files:**

- Create: `src/infrastructure/json/json-hardware-repository.js`
- Create: `tests/json-hardware-repository.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing repository tests**

Test:

- `listCategories()` includes `gpu`;
- `listItems({ categoryId: "gpu" })` returns current GPU count;
- `getItemDetail("rtx-4070-laptop")` returns item + metric values + ranking score.

Expected: fails before repository exists.

- [x] **Step 2: Implement read-only JSON repository**

Use current `src/data/gpus.json` and `gpu.schema.json`. Internally call legacy mapper from Task 2.2.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/infrastructure/json/json-hardware-repository.js tests/json-hardware-repository.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add read-only json hardware repository"
git push origin main
```

### Task 2.4: Add Hardware Query Service

**Files:**

- Create: `src/application/hardware-query-service.js`
- Create: `tests/hardware-query-service.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing service tests**

Test:

- list view model for `gpu` includes `rtx-4070-laptop`;
- detail view model contains grouped metric display values;
- mobile GPU warning appears from schema rule.

- [x] **Step 2: Implement query service**

The service accepts a repository object and returns view models. It must not import `gpus.js` directly.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/application/hardware-query-service.js tests/hardware-query-service.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add hardware query service"
git push origin main
```

## Phase 3: Schema-Driven Frontend While Preserving GPU UI

### Task 3.1: Add Schema-Driven List Renderer

**Files:**

- Create: `src/features/hardware-list/render-list.js`
- Create: `tests/hardware-list-render.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing render tests**

Test that a `HardwareListItemViewModel` renders:

- title;
- badges;
- primary score;
- secondary facts;
- selected state.

- [x] **Step 2: Implement renderer**

Renderer must not mention GPU-specific field names.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/features/hardware-list/render-list.js tests/hardware-list-render.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add schema-driven hardware list renderer"
git push origin main
```

### Task 3.2: Add Schema-Driven Detail Renderer

**Files:**

- Create: `src/features/hardware-detail/render-detail.js`
- Create: `tests/hardware-detail-render.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing render tests**

Test:

- grouped detail sections render;
- warning renders when provided;
- missing metric displays `待补充`;
- renderer contains no GPU-only assumptions.

- [x] **Step 2: Implement renderer**

Use `HardwareDetailViewModel` only.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/features/hardware-detail/render-detail.js tests/hardware-detail-render.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add schema-driven hardware detail renderer"
git push origin main
```

### Task 3.3: Wire GPU Page To Hardware Query Service

**Files:**

- Modify: `src/app.js`
- Modify: `tests/app-render.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add behavior tests**

Update tests to assert current GPU page behavior still works through the new service:

- search `4070`;
- render mobile badge;
- render mobile warning;
- render Time Spy value.

- [x] **Step 2: Refactor app data path**

Use `JsonHardwareRepository` and `HardwareQueryService` internally while preserving current UI.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass, current browser UI still renders.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/app.js tests/app-render.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "refactor: route gpu page through hardware query service"
git push origin main
```

## Phase 4: Schema-Driven Admin

### Task 4.1: Add Schema Form Renderer

**Files:**

- Create: `src/features/schema-form/render-schema-form.js`
- Create: `tests/schema-form-render.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing tests**

Test:

- text, number, select, textarea, and range fields render from schema;
- required marker renders;
- field names use stable keys.

- [x] **Step 2: Implement renderer**

Renderer must accept `{ schema, detail }` and return HTML.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [x] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/features/schema-form/render-schema-form.js tests/schema-form-render.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add schema-driven admin form renderer"
git push origin main
```

### Task 4.2: Add Hardware Mutation Service For JSON

**Files:**

- Create: `src/application/hardware-mutation-service.js`
- Modify: `src/infrastructure/json/json-hardware-repository.js`
- Create: `tests/hardware-mutation-service.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [x] **Step 1: Add failing save tests**

Test:

- saving GPU metric value updates legacy `gpus.json`;
- mobile GPU without TGP range fails validation;
- invalid ranking score fails validation.

- [x] **Step 2: Implement JSON save adapter**

Keep compatibility with `scripts/gpu-data.mjs`. Do not introduce PostgreSQL yet.

- [x] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/application/hardware-mutation-service.js src/infrastructure/json/json-hardware-repository.js tests/hardware-mutation-service.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add hardware mutation service for json data"
git push origin main
```

### Task 4.3: Replace Admin GPU Form With Schema Form

**Files:**

- Modify: `src/admin.js`
- Modify: `tests/admin-render.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Update tests**

Tests must still assert:

- search finds `4070 laptop`;
- selected GPU renders mobile TGP field;
- form parses boost/TGP/Time Spy correctly;
- save success message appears.

- [ ] **Step 2: Refactor admin renderer**

Use schema form renderer and hardware mutation service. Keep `GET /api/gpus` and `PUT /api/gpus/:id` working.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Browser smoke**

Run local server and verify:

- open `http://localhost:4173/admin.html`;
- search `4070`;
- select `GeForce RTX 4070 Laptop GPU`;
- save current values;
- open `http://localhost:4173/#rtx-4070-laptop`;
- verify values remain visible.

- [ ] **Step 5: Update records, commit, push**

Commit:

```powershell
git add src/admin.js tests/admin-render.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "refactor: render admin editor from category schema"
git push origin main
```

## Phase 5: Generic Hardware API

### Task 5.1: Add Read-Only Hardware API Routes

**Files:**

- Modify: `scripts/serve.mjs`
- Create: `tests/hardware-api.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing API tests**

Test:

- `GET /api/hardware/categories`;
- `GET /api/hardware/gpu/items`;
- `GET /api/hardware/gpu/items/rtx-4070-laptop`.

- [ ] **Step 2: Implement routes**

Routes must call `HardwareQueryService`, not `readGpuData` directly.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add scripts/serve.mjs tests/hardware-api.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add generic hardware api read routes"
git push origin main
```

### Task 5.2: Add Generic Admin Save API Route

**Files:**

- Modify: `scripts/serve.mjs`
- Modify: `tests/hardware-api.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing API save tests**

Test:

- `PUT /api/admin/hardware/gpu/items/rtx-4070-laptop`;
- invalid metric value returns 400;
- missing item returns 404.

- [ ] **Step 2: Implement route**

Route must call `HardwareMutationService`.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add scripts/serve.mjs tests/hardware-api.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add generic hardware admin save route"
git push origin main
```

## Phase 6: Compare Foundation

### Task 6.1: Add Comparison Service

**Files:**

- Create: `src/application/comparison-service.js`
- Create: `tests/comparison-service.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing comparison tests**

Test:

- comparing two GPU items returns grouped rows;
- best numeric value is marked;
- missing values display `待补充`;
- cross-category comparison is rejected.

- [ ] **Step 2: Implement comparison service**

Use category compare preset and metric definitions.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/application/comparison-service.js tests/comparison-service.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add hardware comparison service"
git push origin main
```

### Task 6.2: Add Compare Renderer

**Files:**

- Create: `src/features/compare/render-compare.js`
- Create: `tests/compare-render.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing render tests**

Test:

- table headers render item names;
- metric groups render;
- best values get an `is-best` class;
- missing values render `待补充`.

- [ ] **Step 2: Implement renderer**

Renderer consumes `CompareTableViewModel` only.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/features/compare/render-compare.js tests/compare-render.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add hardware compare renderer"
git push origin main
```

### Task 6.3: Add GPU Compare Page Entry

**Files:**

- Modify: `index.html`
- Modify: `src/app.js`
- Modify: `src/styles.css`
- Modify: `tests/app-render.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add tests**

Test that a compare URL state can render a compare table for two GPU ids.

- [ ] **Step 2: Implement minimal compare mode**

Support hash format:

```txt
#compare/gpu?ids=rtx-4070-desktop,rtx-4070-laptop
```

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Browser smoke**

Open compare hash and verify the table renders without overlap.

- [ ] **Step 5: Update records, commit, push**

Commit:

```powershell
git add index.html src/app.js src/styles.css tests/app-render.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add gpu compare page mode"
git push origin main
```

## Phase 7: Add New Categories After Generic GPU Works

### Task 7.1: Add Desktop CPU Category Schema

**Files:**

- Create: `src/data/categories/desktop-cpu.schema.json`
- Create: `tests/desktop-cpu-schema.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing schema test**

Test that desktop CPU schema passes category validation and includes metrics:

- cores;
- threads;
- base clock;
- boost clock;
- L3 cache;
- TDP;
- socket;
- Cinebench single;
- Cinebench multi;
- Geekbench single;
- Geekbench multi.

- [ ] **Step 2: Create schema**

Do not add CPU items yet.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/data/categories/desktop-cpu.schema.json tests/desktop-cpu-schema.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "data: add desktop cpu category schema"
git push origin main
```

### Task 7.2: Add Desktop CPU Seed Data

**Files:**

- Create: `src/data/hardware/desktop-cpu.items.json`
- Modify: `src/infrastructure/json/json-hardware-repository.js`
- Create: `tests/desktop-cpu-data.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing tests**

Test repository returns at least three desktop CPU items:

- one AMD Ryzen;
- one Intel Core;
- one Apple Silicon item is not included here because Apple gets its own category.

- [ ] **Step 2: Add seed data**

Use conservative estimated values and mark confidence as `estimated` where needed.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/data/hardware/desktop-cpu.items.json src/infrastructure/json/json-hardware-repository.js tests/desktop-cpu-data.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "data: add desktop cpu seed records"
git push origin main
```

### Task 7.3: Add Mobile SoC Category Schema

**Files:**

- Create: `src/data/categories/mobile-soc.schema.json`
- Create: `tests/mobile-soc-schema.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing schema test**

Test schema includes:

- process node;
- CPU cluster;
- GPU name;
- NPU/AI metric;
- modem;
- Geekbench single;
- Geekbench multi;
- AnTuTu total;
- 3DMark Wild Life.

- [ ] **Step 2: Create schema**

Do not add SoC items yet.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/data/categories/mobile-soc.schema.json tests/mobile-soc-schema.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "data: add mobile soc category schema"
git push origin main
```

### Task 7.4: Add Apple Silicon Category Schema

**Files:**

- Create: `src/data/categories/apple-silicon.schema.json`
- Create: `tests/apple-silicon-schema.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing schema test**

Test schema includes:

- CPU core split;
- GPU core count;
- Neural Engine;
- unified memory;
- memory bandwidth;
- Geekbench;
- Metal benchmark.

- [ ] **Step 2: Create schema**

Apple chips are separate because M/A series are SoC-like and do not map cleanly to desktop CPU only.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/data/categories/apple-silicon.schema.json tests/apple-silicon-schema.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "data: add apple silicon category schema"
git push origin main
```

## Phase 8: PostgreSQL Preparation

### Task 8.1: Add Database Schema Document

**Files:**

- Create: `docs/architecture/2026-04-30-postgresql-schema-design-GPT-5-Codex.md`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Write database design**

Document exact tables:

- hardware_categories;
- manufacturers;
- product_families;
- hardware_items;
- hardware_variants;
- metric_definitions;
- metric_values;
- benchmark_definitions;
- benchmark_scores;
- ranking_profiles;
- ranking_scores;
- source_documents;
- audit_logs.

- [ ] **Step 2: Verify docs and app**

Run:

```powershell
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 3: Update records, commit, push**

Commit:

```powershell
git add docs/architecture/2026-04-30-postgresql-schema-design-GPT-5-Codex.md SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "docs: add postgres schema design"
git push origin main
```

### Task 8.2: Add Initial SQL Migration

**Files:**

- Create: `db/migrations/0001_initial_hardware_platform.sql`
- Create: `tests/database-migration-file.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add migration file test**

Test that migration file contains all required table names and primary keys.

- [ ] **Step 2: Write SQL migration**

Use PostgreSQL SQL only. Do not require a running database in this task.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add db/migrations/0001_initial_hardware_platform.sql tests/database-migration-file.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "db: add initial hardware platform migration"
git push origin main
```

### Task 8.3: Add PostgreSQL Repository Skeleton

**Files:**

- Create: `src/infrastructure/postgres/postgres-hardware-repository.js`
- Create: `tests/postgres-repository-contract.test.mjs`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add contract test with mocked query client**

Use a fake query client. Do not require a real database.

- [ ] **Step 2: Implement skeleton repository**

Expose same methods as `HardwareRepository`. Return data from injected query client.

- [ ] **Step 3: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 4: Update records, commit, push**

Commit:

```powershell
git add src/infrastructure/postgres/postgres-hardware-repository.js tests/postgres-repository-contract.test.mjs SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add postgres hardware repository skeleton"
git push origin main
```

## Phase 9: Import, Export, And Static Build

### Task 9.1: Add Static Export Script

**Files:**

- Create: `scripts/export-static-data.mjs`
- Create: `tests/static-export.test.mjs`
- Modify: `package.json`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing export test**

Test that export script writes generated category and item JSON files into a temp directory.

- [ ] **Step 2: Implement export script**

Use repository interface. Default to JSON repository.

- [ ] **Step 3: Add script**

Add:

```json
"export:static": "node scripts/export-static-data.mjs"
```

- [ ] **Step 4: Verify**

Run:

```powershell
npm.cmd test
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 5: Update records, commit, push**

Commit:

```powershell
git add scripts/export-static-data.mjs tests/static-export.test.mjs package.json SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add static hardware data export"
git push origin main
```

### Task 9.2: Add JSON Import Validation Script

**Files:**

- Create: `scripts/validate-hardware-data.mjs`
- Create: `tests/validate-hardware-data.test.mjs`
- Modify: `package.json`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Add failing validation test**

Test that invalid category schema and invalid item metric value are reported.

- [ ] **Step 2: Implement validation script**

Validate:

- all category schemas;
- all item files;
- all metric definitions;
- all ranking scores.

- [ ] **Step 3: Add script**

Add:

```json
"validate:hardware": "node scripts/validate-hardware-data.mjs"
```

Update verify only after this script is stable:

```json
"verify": "npm run validate:data && npm run validate:hardware && npm test"
```

- [ ] **Step 4: Verify**

Run:

```powershell
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 5: Update records, commit, push**

Commit:

```powershell
git add scripts/validate-hardware-data.mjs tests/validate-hardware-data.test.mjs package.json SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "feat: add generic hardware data validation"
git push origin main
```

## Phase 10: Documentation And Release Checkpoints

### Task 10.1: Update README For Multi-Hardware Architecture

**Files:**

- Modify: `README.md`
- Modify: `SessionContextRecord.md`
- Modify: `PROJECT_STATE.md`

- [ ] **Step 1: Update README sections**

README must mention:

- multi-hardware roadmap;
- architecture docs;
- implementation plan;
- SessionContextRecord rule;
- JSON now, PostgreSQL later;
- schema-driven UI direction.

- [ ] **Step 2: Verify**

Run:

```powershell
npm.cmd run verify
```

Expected: all tests pass.

- [ ] **Step 3: Update records, commit, push**

Commit:

```powershell
git add README.md SessionContextRecord.md PROJECT_STATE.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "docs: document multi-hardware architecture roadmap"
git push origin main
```

### Task 10.2: First Architecture Migration Checkpoint

**Files:**

- Modify: `PROJECT_STATE.md`
- Modify: `SessionContextRecord.md`
- Modify: `docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md`

- [ ] **Step 1: Run full verification**

Run:

```powershell
npm.cmd run verify
git status --short
```

Expected:

- data validation passes;
- hardware validation passes if added;
- tests pass;
- working tree only has planned documentation updates.

- [ ] **Step 2: Review architecture checklist**

Confirm:

- old GPU ladder still works;
- generic repository exists;
- schema-driven detail/list/admin renderers exist;
- compare service exists;
- CPU/SoC schemas exist if Phase 7 is complete;
- PostgreSQL design exists if Phase 8 is complete.

- [ ] **Step 3: Update records, commit, push**

Commit:

```powershell
git add PROJECT_STATE.md SessionContextRecord.md docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md
git commit -m "chore: record architecture migration checkpoint"
git push origin main
```

## Self-Review Checklist

Spec coverage:

- Multi-hardware support: Tasks 1 through 7.
- CPU and mobile SoC: Tasks 7.1 through 7.4.
- Apple CPU/SoC support: Task 7.4.
- 国产显卡: covered by manufacturer model and GPU category schema.
- Same-type comparison: Phase 6.
- Complex admin: Phase 4 and later audit/source tasks.
- Interface-first architecture: Phase 1 and Phase 2.
- Data-driven UI: Phase 2 through Phase 4.
- PostgreSQL: Phase 8.
- Context overflow protection: Context Iron Law and Task 0.1.

Placeholder scan:

- This plan intentionally avoids vague deferred-work instructions.
- Each task has files, test expectation, verification command, commit command, and context record requirement.

Type consistency:

- `HardwareCategory`, `MetricDefinition`, `MetricValue`, `RankingProfile`, `RankingScore`, and repository names match the architecture design document.

## Execution Handoff

Start with Task 0.1. Do not skip `SessionContextRecord.md`. After Task 0.1, proceed sequentially. If a future task feels too large, split it into `Task N.a` and `Task N.b` before coding, update this plan, then continue.
