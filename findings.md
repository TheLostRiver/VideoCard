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
- Architecture model fields read from the architecture document:
  - `HardwareItem` includes `id`, `categoryId`, `name`, `manufacturerId`, `generation`, `architecture`, `releaseDate`, `marketSegmentIds`, `status`, `notes`, `createdAt`, and `updatedAt`.
  - `MetricValue` includes `id`, `itemId`, `metricId`, value fields, `confidence`, `sourceIds`, optional `note`, and `updatedAt`.
  - `RankingScore` includes `rankingProfileId`, `score`, `tierId`, `confidence`, `formulaVersion`, and `updatedAt`.
  - `SourceDocument` includes `id`, `label`, `url`, `sourceType`, and optional publisher/retrieval metadata.

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

## Visual/Browser Findings

- No browser or image findings in this phase.
