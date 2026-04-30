# Findings & Decisions

## Requirements

- User explicitly invoked `planning-with-files` and asked to continue according to the implementation document.
- Continue the existing multi-hardware implementation plan, not a new unrelated plan.
- Preserve the project's atomic-task workflow: read records first, keep tasks small, verify, update records, commit, and push.
- Task 1.3 must add repository contract tests and a contract helper.
- Continue next with Task 2.1: Add GPU Category Schema.
- Continue next with Task 2.2: Add Legacy GPU Import Mapper.

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

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| planning-with-files project files were absent | Created `task_plan.md`, `findings.md`, and `progress.md` in the project root. |
| Repository contract helper was absent | Added it after confirming the RED failure. |
| session-catchup reported unsynced conversation text | Verified clean git status and updated planning files before continuing. |
| GPU schema file was absent | Added `src/data/categories/gpu.schema.json` after the expected RED failure. |
| session-catchup reported unsynced Task 2.1 final response | Verified clean git status and updated planning records before starting Task 2.2. |
| Legacy GPU mapper module was absent | Added it after confirming the expected RED failure. |

## Resources

- `SessionContextRecord.md`
- `PROJECT_STATE.md`
- `docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md`
- `.codex/skills/planning-with-files/SKILL.md`
- `src/data/categories/gpu.schema.json`
- `tests/gpu-category-schema.test.mjs`
- `scripts/import-legacy-gpus.mjs`
- `tests/legacy-gpu-import.test.mjs`

## Visual/Browser Findings

- No browser or image findings in this phase.
