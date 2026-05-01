# Findings & Decisions

## Requirements

- User explicitly invoked `planning-with-files` and asked to continue according to the implementation document.
- Continue the existing multi-hardware implementation plan, not a new unrelated plan.
- Preserve the project's atomic-task workflow: read records first, keep tasks small, verify, update records, commit, and push.
- Task 1.3 must add repository contract tests and a contract helper.
- Continue next with Task 2.1: Add GPU Category Schema.
- Continue next with Task 2.2: Add Legacy GPU Import Mapper.
- Continue next with Task 2.3: Add JSON Hardware Repository Read Path.
- User explicitly warned that context is nearly full and asked to record task information before continuing.

## Research Findings

- `planning-with-files` requires project-root `task_plan.md`, `findings.md`, and `progress.md`.
- `session-catchup.py` ran without reporting unsynced context.
- `git status -sb` reported `main...origin/main`, so the workspace started clean.
- Implementation plan Task 1.3 requires:
  - create `src/domain/hardware/repository-contract.js`;
  - create `tests/hardware-repository-contract.test.mjs`;
  - test a fake repository exposing `listCategories`, `getCategory`, `listItems`, `getItemDetail`, and `saveItem`;
  - first RED should fail because the contract helper does not exist;
  - commit message should be `test: add hardware repository contract`.
- On 2026-05-01, `session-catchup.py` reported unsynced previous-session context, but `git status -sb` showed `main...origin/main`, so there were no uncommitted code changes to reconcile.
- `SessionContextRecord.md` points to Task 2.1 as the next task after Task 1.3.
- Implementation plan Task 2.1 requires:
  - create `src/data/categories/gpu.schema.json`;
  - create `tests/gpu-category-schema.test.mjs`;
  - test that `gpu.schema.json` passes `assertValidCategorySchema`;
  - include category id `gpu`;
  - include metrics for core count, clocks, memory size/type/bus/bandwidth, board power, TGP range, Time Spy, Steel Nomad, PassMark, recommended resolution, ray tracing level;
  - include list view, detail view, admin form, and compare presets for specs, memory, power, and benchmarks;
  - commit message should be `data: add gpu category schema`.
- Implementation plan Task 2.2 requires:
  - create `scripts/import-legacy-gpus.mjs`;
  - create `tests/legacy-gpu-import.test.mjs`;
  - test that one current GPU maps to `HardwareItem`, metric values, ranking score, and source documents;
  - export `mapLegacyGpuToHardwareItem(gpu)`, `mapLegacyGpuToMetricValues(gpu)`, `mapLegacyGpuToRankingScore(gpu)`, and `mapLegacyGpuToSources(gpu)`;
  - keep this task pure and do not write generated files;
  - commit message should be `feat: map legacy gpu records to hardware model`.
- Implementation plan Task 2.3 requires:
  - create `src/infrastructure/json/json-hardware-repository.js`;
  - create `tests/json-hardware-repository.test.mjs`;
  - test that `listCategories()` includes `gpu`;
  - test that `listItems({ categoryId: "gpu" })` returns the current GPU count;
  - test that `getItemDetail("rtx-4070-laptop")` returns mapped item, metric values, sources, and ranking score;
  - implement a read-only JSON repository using `src/data/gpus.json`, `src/data/categories/gpu.schema.json`, and the legacy GPU mapper;
  - commit message should be `feat: add read-only json hardware repository`.
- Implementation plan Task 2.4 requires:
  - create `src/application/hardware-query-service.js`;
  - create `tests/hardware-query-service.test.mjs`;
  - test that the list view model for `gpu` includes `rtx-4070-laptop`;
  - test that the detail view model contains grouped metric display values;
  - test that the mobile GPU warning appears from schema-driven behavior;
  - ensure the service accepts a repository object and does not import `gpus.js` directly;
  - commit message should be `feat: add hardware query service`.
- Implementation plan Task 3.1 requires:
  - create `src/features/hardware-list/render-list.js`;
  - create `tests/hardware-list-render.test.mjs`;
  - test that a `HardwareListItemViewModel` renders title, badges, primary score, secondary facts, and selected state;
  - ensure the renderer contains no GPU-specific field names;
  - commit message should be `feat: add schema-driven hardware list renderer`.
- Implementation plan Task 3.2 requires:
  - create `src/features/hardware-detail/render-detail.js`;
  - create `tests/hardware-detail-render.test.mjs`;
  - test grouped detail sections render;
  - test warnings render when provided;
  - test missing metrics display `待补充`;
  - ensure the renderer contains no GPU-only assumptions;
  - commit message should be `feat: add schema-driven hardware detail renderer`.
- Implementation plan Task 3.3 requires:
  - modify `src/app.js`;
  - modify `tests/app-render.test.mjs`;
  - update tests to assert current GPU page behavior still works through the new service: search `4070`, mobile badge, mobile warning, Time Spy value;
  - use `JsonHardwareRepository` and `HardwareQueryService` internally while preserving current UI;
  - commit message should be `refactor: route gpu page through hardware query service`.
- Architecture model fields read from the architecture document:
  - `HardwareItem` includes `id`, `categoryId`, `name`, `manufacturerId`, `generation`, `architecture`, `releaseDate`, `marketSegmentIds`, `status`, `notes`, `createdAt`, and `updatedAt`.
  - `MetricValue` includes `id`, `itemId`, `metricId`, value fields, `confidence`, `sourceIds`, optional `note`, and `updatedAt`.
  - `RankingScore` includes `rankingProfileId`, `score`, `tierId`, `confidence`, `formulaVersion`, and `updatedAt`.
  - `SourceDocument` includes `id`, `label`, `url`, `sourceType`, and optional publisher/retrieval metadata.

- Implementation plan Task 5.1 requires:
  - modify `scripts/serve.mjs`;
  - create `tests/hardware-api.test.mjs`;
  - test `GET /api/hardware/categories`, `GET /api/hardware/gpu/items`, `GET /api/hardware/gpu/items/rtx-4070-laptop`;
  - routes must call `HardwareQueryService`, not `readGpuData` directly;
  - commit message should be `feat: add generic hardware api read routes`.
- Implementation plan Task 5.2 requires:
  - modify `scripts/serve.mjs`;
  - modify `tests/hardware-api.test.mjs`;
  - test `PUT /api/admin/hardware/gpu/items/rtx-4070-laptop` success, invalid metric value returns 400, missing item returns 404;
  - route must call `HardwareMutationService`;
  - commit message should be `feat: add generic hardware admin save route`.
- Implementation plan Task 8.1 requires:
  - create `docs/architecture/2026-04-30-postgresql-schema-design-GPT-5-Codex.md`;
  - document 13 tables: hardware_categories, manufacturers, product_families, hardware_items, hardware_variants, metric_definitions, metric_values, benchmark_definitions, benchmark_scores, ranking_profiles, ranking_scores, source_documents, audit_logs;
  - include ER relationships, JSON-to-PostgreSQL mapping, and migration strategy;
  - commit message should be `docs: add postgres schema design`.

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Contract helper accepts `{ name, createRepository }` | Matches the implementation plan and keeps future adapter tests reusable. |
| Contract tests should use a fake in-memory repository first | Keeps Task 1.3 independent from the future JSON/PostgreSQL adapters. |
| Contract helper should define tests using `node:test` | Existing test suite already uses Node's built-in test runner. |
| `listItems` contract uses `{ categoryId }` input | Keeps category filtering explicit and leaves room for future pagination/filter options. |
| Treat Task 2.1 as one atomic task | It has a clear RED/GREEN/verify/record/commit loop and should not be mixed with legacy import mapping. |
| Keep GPU schema close to current UI groups | Task 2.1 exists to make the current row/detail/admin structure data-driven before later migration work. |
| Use `src/data/categories/gpu.schema.json` as data, not executable code | Keeps category definitions portable for the future JSON repository and PostgreSQL-backed admin UI. |
| Use schema metric IDs from `gpu.schema.json` for mapper outputs | Keeps the mapper aligned with Task 2.1 and the future JSON repository. |
| Treat `performanceIndex` as `RankingScore.score` | Architecture mapping explicitly separates ranking score from general metric values. |
| Treat benchmarks as metric values for now | Task 2.1 modeled Time Spy, Steel Nomad, and PassMark as GPU metrics; dedicated benchmark entities can come later. |
| Use deterministic `legacy-import` timestamps | Keeps tests stable until a real migration/audit timestamp strategy exists. |
| Treat `SessionContextRecord.md` plus planning files as the compression recovery source | There is no exposed manual context-compression tool, so recovery must rely on local files. |
| Keep Task 2.3 repository read-only | The task exists to establish the adapter read path; write/edit behavior remains in the existing local admin API until later migration tasks. |
| Use closure functions inside `createJsonHardwareRepository` | Avoids coupling method behavior to `this`, so repository methods still work if destructured by future services or tests. |
| Treat `4cfb7af` as Task 2.3 implementation commit | The read-only JSON repository task is implemented, verified, and pushed; the following commit only records push completion. |
| Treat `87c96bc` as Task 2.3 push completion record commit | Task 2.4 starts only after the Task 2.3 record commit is also pushed. |
| Represent mobile warnings as schema rules | `gpu.schema.json` now exposes `detailView.warnings`, and the query service applies matching rules from repository category data. |
| Treat `2c18375` as Task 2.4 implementation commit | The hardware query service task is implemented, verified, and pushed; the next implementation task is Task 3.1. |
| Treat `b442252` as Task 2.4 push completion record commit | Task 3.1 starts only after the Task 2.4 record commit is also pushed. |
| Keep schema-driven list renderer view-model-only | `render-list.js` renders only generic title, badges, score, facts, and selected state fields; it does not read legacy GPU data fields. |
| Treat `9297f1a` as Task 3.1 implementation commit | The schema-driven hardware list renderer task is implemented, verified, and pushed; the next task is Task 3.2. |
| Treat `a6ca841` as Task 3.1 push completion record commit | Task 3.2 starts only after the Task 3.1 record commit is also pushed. |
| Keep schema-driven detail renderer view-model-only | `render-detail.js` renders only generic item, warnings, groups, rows, and display values; it does not read legacy GPU data fields. |
| Treat `b2c9445` as Task 3.2 implementation commit | The schema-driven hardware detail renderer task is implemented, verified, and pushed; the next task is Task 3.3. |
| Treat `7ccefa2` as Task 3.2 push completion record commit | Task 3.3 starts only after the Task 3.2 record commit is also pushed. |
| Avoid static `JsonHardwareRepository` import in browser app code | The repository uses Node `fs`, so Task 3.3 should load it dynamically only for local/service-backed data helpers. |
| Keep Task 3.3 browser UI path conservative for now | `initApp()` still uses the existing static GPU array while the new exported page model proves the service-backed path; later browser repository work can replace the runtime UI data path without importing Node `fs`. |
| Treat `e1b6380` as Task 3.3 implementation commit | The GPU page service-backed helper task is implemented, verified, browser-smoked, and pushed; the next task is Task 4.1. |
| Treat `afd2c66` as Task 3.3 push completion record commit | Task 4.1 starts only after the Task 3.3 record commit is also pushed. |
| Task 4.1 renderer should accept richer synthetic schema fields | Current `gpu.schema.json` has minimal admin fields, so tests should prove generic support for text, number, select, textarea, range, required markers, and stable names without mutating the production schema in this atomic task. |
| Task 4.1 renderer remains a pure HTML renderer | It reads only `{ schema, detail }`, maps property and metric fields to controls, and does not depend on the legacy GPU admin implementation. |
| Treat `d5b0742` as Task 4.1 implementation commit | The schema-driven admin form renderer task is implemented, verified, and pushed; the next task is Task 4.2. |
| Treat `eb18068` as Task 4.1 push completion record commit | Task 4.2 starts only after the Task 4.1 record commit is also pushed. |
| Task 4.2 should reuse `scripts/gpu-data.mjs` for physical writes | Existing admin save already validates, atomically writes `gpus.json`, and regenerates `gpus.js`; JSON repository save should adapt hardware details to a legacy GPU record and delegate the actual write. |
| Hardware mutation service is intentionally thin | It exposes `saveItemDetail(detail)` and lets the repository perform category-specific persistence, which keeps future PostgreSQL and JSON adapters interchangeable behind the same application use case. |
| Treat `22cd61c` as Task 4.2 implementation commit | The hardware mutation service for JSON data is implemented, verified, and pushed; the next task is Task 4.3. |
| Treat `a1fc662` as Task 4.2 push completion record commit | Task 4.3 starts only after the Task 4.2 record commit is also pushed. |
| Task 4.3 should keep the existing legacy GPU API stable | The admin UI can render and parse schema-form fields while still sending a legacy GPU record to `PUT /api/gpus/:id`; generic API routes come later in Phase 5. |
| Schema range values should preserve units in form controls | TGP ranges mapped from `valueMin`/`valueMax` need their unit appended so saving the current admin form does not degrade `45-115W` to `45-115`. |
| Local static service must serve `.mjs` as JavaScript | The browser admin page imports `/scripts/import-legacy-gpus.mjs`; without `text/javascript`, Chrome refuses the module and the admin UI stays in the loading state. |
| Treat `2858013` as Task 4.3 implementation commit | The schema-form admin editor task is implemented, verified, browser-smoked, and pushed; the next task is Task 5.1. |
| Treat `4578eea` as Task 4.3 push completion record commit | Task 5.1 starts only after the Task 4.3 record commit is also pushed. |
| Hardware API routes use regex matching for category/item path extraction | Avoids adding a routing framework; pattern `^/api/hardware/([^/]+)/items(?:/(.*))?$` captures categoryId and optional itemId. |
| Hardware API creates repository per request | `createJsonHardwareRepository({ root: serverRoot })` ensures each request reads from the correct server root, matching the test pattern with temp directories. |
| Treat `6fbed35` as Task 5.1 implementation commit | The read-only hardware API routes task is implemented, verified, and pushed; the next task is Task 5.2. |
| Detail view model must expose raw metric values for admin round-trip | `getDetailViewModel` now returns `metricValues`, `rankingScore`, and `sources` alongside the display groups, so admin save can send the full detail back. |
| Admin save test must modify `metricValues` not display `value` | The view model's `groups[].rows[].value` is a display primitive; the repository's save path reads `metricValues[].valueText`/`valueMin`/`valueMax`, so the TGP rejection test must clear the metric value fields. |
| Treat `6fbed35..959fcff` as Task 5.1 record commits | Task 5.2 starts only after both the implementation and planning record commits are pushed. |
| Comparison service uses `higherIsBetter !== false` as default | Most numeric metrics benefit from higher values; only explicitly `higherIsBetter: false` metrics (like power) invert the best-value logic. |
| Treat `e395e5b` as Task 5.2 implementation commit | The generic admin save route task is implemented, verified, and pushed; the next task is Task 6.1. |
| Compare renderer uses `escapeHtml` for XSS safety | All user-visible values are escaped before HTML insertion. |
| Treat `c391843` as Task 6.1 implementation commit | The comparison service task is implemented, verified, and pushed; the next task is Task 6.2. |
| `render()` 改为 async 以支持对比页面 | `renderComparePage` 是 async 函数，需要 await 才能正确渲染对比表格；所有事件处理中的 `render()` 调用需加 `.catch(console.error)`。 |
| `createInitialState` 需解析 compare hash | 浏览器初始加载时可能直接访问 `#compare/gpu?ids=...` URL，状态初始化必须设置 `compareMode`/`compareParams`。 |
| 对比模式下隐藏 content-grid 并显示 comparePanel | 对比页面与天梯列表/详情面板互斥，需切换 DOM 可见性。 |
| Treat Task 6.3 as the final Phase 6 task | GPU 对比功能完整闭环：对比服务（6.1）→ 对比渲染器（6.2）→ 对比页面入口（6.3）。 |
| Desktop CPU schema 遵循 GPU schema 结构 | 使用相同的 listView/detailView/adminForm/comparePresets/metrics 模式，保持跨品类一致性。 |
| Desktop CPU metrics 使用 `cpu.` 前缀 | 与 `gpu.` 前缀区分，支持未来跨品类查询和对比。 |
| Desktop CPU 暂无 warnings | 桌面 CPU 没有类似移动版 TGP 的变异性问题，warnings 为空数组。 |
| Desktop CPU 种子数据直接使用 hardware model 格式 | 无 legacy 格式需要迁移，数据直接存储为 `{ item, metricValues, rankingScore, sources }` 结构。 |
| JSON repository 按品类分别加载数据 | GPU 使用 legacy mapper，desktop-cpu 直接读取 hardware model 格式；`listCategories` 返回所有已注册品类。 |
| Mobile SoC schema 包含手机特有 metrics | 进程节点、CPU 集群配置、GPU 名称、NPU/AI 引擎、基带、AnTuTu、3DMark Wild Life 等手机 SoC 专属字段。 |
| Apple Silicon schema 独立于 desktop-cpu 和 mobile-soc | Apple M/A 系列是 SoC 架构，不适合归入桌面 CPU 或手机 SoC 品类；包含统一内存、Neural Engine、Metal 跑分等 Apple 专属字段。 |
| PostgreSQL schema 使用 13 个核心表 | hardware_categories、manufacturers、product_families、hardware_items、hardware_variants、metric_definitions、metric_values、benchmark_definitions、benchmark_scores、ranking_profiles、ranking_scores、source_documents、audit_logs 覆盖完整领域模型。 |
| PostgreSQL 表设计遵循品类无关原则 | 核心表不包含品类特定字段，通过 category_id 区分；metric_definitions 存储在数据库中，与 category schema 对应。 |
| PostgreSQL 采用渐进迁移策略 | JSON repository 继续作为短期适配器，PostgreSQL 作为长期主数据源；JSON 保留为 import/export 格式。 |

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| planning-with-files project files were absent | Created `task_plan.md`, `findings.md`, and `progress.md` in the project root. |
| Repository contract helper was absent | Added it after confirming the RED failure. |
| session-catchup reported unsynced conversation text | Verified clean git status and updated planning files before continuing. |
| GPU schema file was absent | Added `src/data/categories/gpu.schema.json` after the expected RED failure. |
| session-catchup reported unsynced Task 2.1 final response | Verified clean git status and updated planning records before starting Task 2.2. |
| Legacy GPU mapper module was absent | Added it after confirming the expected RED failure. |
| Context nearing full before Task 2.3 | Wrote this checkpoint before editing Task 2.3 files. |
| Windows sandbox blocked recovery reads with `CreateProcessWithLogonW failed: 1326` | Re-ran the same read-only commands with escalation and completed the required recovery-file reread. |
| Task 2.3 recovery files still said record commit was pending after `87c96bc` was pushed | Corrected the recovery files at Task 2.4 startup before adding Task 2.4 code. |
| User-profile `planning-with-files` catchup script path was absent | Reran catchup with the workspace-installed `.codex\skills\planning-with-files\scripts\session-catchup.py` path and continued. |
| Task 4.3 browser smoke initially stayed at `正在加载数据...` | Added `.mjs` MIME support to `scripts/serve.mjs`, covered it in `tests/admin-api.test.mjs`, restarted the local server, and reran the smoke successfully. |
| TGP rejection test expected 400 but got 200 | View model `value` is a display primitive; must modify `metricValues[].valueText` instead. Extended `getDetailViewModel` to expose raw `metricValues`. |

## Resources

- `SessionContextRecord.md`
- `PROJECT_STATE.md`
- `docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md`
- `.codex/skills/planning-with-files/SKILL.md`
- `src/data/categories/gpu.schema.json`
- `tests/gpu-category-schema.test.mjs`
- `scripts/import-legacy-gpus.mjs`
- `tests/legacy-gpu-import.test.mjs`
- `src/infrastructure/json/json-hardware-repository.js`
- `tests/json-hardware-repository.test.mjs`
- `src/application/hardware-query-service.js`
- `tests/hardware-query-service.test.mjs`
- `src/features/hardware-list/render-list.js`
- `tests/hardware-list-render.test.mjs`
- `src/features/hardware-detail/render-detail.js`
- `tests/hardware-detail-render.test.mjs`
- `src/features/schema-form/render-schema-form.js`
- `tests/schema-form-render.test.mjs`
- `scripts/serve.mjs`
- `tests/admin-api.test.mjs`
- `tests/hardware-api.test.mjs`

## Visual/Browser Findings

- Task 3.3 browser smoke passed on `http://localhost:4173/#rtx-4070-laptop`: page title was `游戏显卡天梯图`, the DOM contained `GeForce RTX 4070 Laptop GPU`, the mobile warning, and the `12,345` Time Spy value, with 0 browser console errors.
- Task 4.3 browser smoke passed on `http://localhost:4173/admin.html`: searched `4070`, selected `GeForce RTX 4070 Laptop GPU`, saved current schema-form values `45-115W`, `2175`, and `12345`, then confirmed `http://localhost:4173/#rtx-4070-laptop` still showed `45-115W`, `2,175 MHz`, and `12,345` with 0 browser console errors.
