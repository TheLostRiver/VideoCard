# Task Plan: Multi-Hardware Platform Atomic Implementation

## Goal

Continue the multi-hardware platform implementation plan one small atomic task at a time, while keeping `SessionContextRecord.md`, `PROJECT_STATE.md`, and planning-with-files records synchronized.

## Current Phase

Task 6.3 complete. Ready for Task 7.1: Desktop CPU Category Schema

## Phases

### Phase 0: Planning Files Bootstrap

- [x] Read `planning-with-files` skill rules.
- [x] Run session catchup.
- [x] Read `SessionContextRecord.md`, `PROJECT_STATE.md`, implementation plan, and git status.
- [x] Create `task_plan.md`, `findings.md`, and `progress.md`.
- **Status:** complete

### Phase 1: Task 1.3 Repository Contract Tests

- [x] Add failing tests for `createHardwareRepositoryContractTestSuite`.
- [x] Confirm RED failure because `repository-contract.js` does not exist.
- [x] Implement `src/domain/hardware/repository-contract.js`.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 2: Task 1.3 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update `SessionContextRecord.md`, `PROJECT_STATE.md`, and `progress.md`.
- [x] Commit and push Task 1.3.
- **Status:** complete

### Phase 3: Next Task Readiness

- [x] Confirm clean git status.
- [x] Record next task as Task 2.1.
- **Status:** complete

### Phase 4: Task 2.1 GPU Category Schema

- [x] Read Task 2.1 implementation plan details.
- [x] Add failing test for `src/data/categories/gpu.schema.json`.
- [x] Confirm RED failure before schema exists.
- [x] Create GPU category schema JSON.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 5: Task 2.1 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update `SessionContextRecord.md`, `PROJECT_STATE.md`, `task_plan.md`, `findings.md`, and `progress.md`.
- [x] Commit and push Task 2.1.
- **Status:** complete

### Phase 6: Next Task Readiness

- [x] Confirm clean git status after Task 2.1 push.
- [x] Record next task as Task 2.2.
- **Status:** complete

### Phase 7: Task 2.2 Legacy GPU Import Mapper

- [x] Read Task 2.2 implementation plan details.
- [x] Add failing tests for legacy GPU import mapper.
- [x] Confirm RED failure before `scripts/import-legacy-gpus.mjs` exists.
- [x] Implement pure mapper functions.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 8: Task 2.2 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update `SessionContextRecord.md`, `PROJECT_STATE.md`, `task_plan.md`, `findings.md`, and `progress.md`.
- [x] Commit and push Task 2.2.
- **Status:** complete

### Phase 9: Next Task Readiness

- [x] Confirm clean git status after Task 2.2 push.
- [x] Record next task as Task 2.3.
- **Status:** complete

### Phase 10: Context Safety Checkpoint Before Task 2.3

- [x] Confirm Task 2.2 was pushed.
- [x] Record that Task 2.3 is next.
- [x] Record recovery files to read after compression.
- [x] Re-read recovery files before editing Task 2.3 files.
- **Status:** complete

### Phase 11: Task 2.3 JSON Hardware Repository Read Path

- [x] Read Task 2.3 implementation plan details.
- [x] Add failing repository tests.
- [x] Confirm RED failure before repository exists.
- [x] Implement read-only JSON hardware repository.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 12: Task 2.3 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update recovery records.
- [x] Commit and push Task 2.3.
- **Status:** complete

### Phase 13: Next Task Readiness After Task 2.3

- [x] Confirm clean git status after Task 2.3 push.
- [x] Record next task as Task 2.4.
- **Status:** complete

### Phase 14: Task 2.4 Hardware Query Service

- [x] Read Task 2.4 implementation plan details.
- [x] Add failing service tests.
- [x] Confirm RED failure before service exists.
- [x] Implement query service without importing `gpus.js` directly.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 15: Task 2.4 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update recovery records.
- [x] Commit and push Task 2.4.
- **Status:** complete

### Phase 16: Next Task Readiness After Task 2.4

- [x] Confirm clean git status after Task 2.4 push.
- [x] Record next task as Task 3.1.
- **Status:** complete

### Phase 17: Task 3.1 Schema-Driven List Renderer

- [x] Read Task 3.1 implementation plan details.
- [x] Add failing renderer tests.
- [x] Confirm RED failure before renderer exists.
- [x] Implement schema-driven list renderer without GPU-specific field names.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 18: Task 3.1 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update recovery records.
- [x] Commit and push Task 3.1.
- **Status:** complete

### Phase 19: Next Task Readiness After Task 3.1

- [x] Confirm clean git status after Task 3.1 push.
- [x] Record next task as Task 3.2.
- **Status:** complete

### Phase 20: Task 3.2 Schema-Driven Detail Renderer

- [x] Read Task 3.2 implementation plan details.
- [x] Add failing renderer tests.
- [x] Confirm RED failure before renderer exists.
- [x] Implement schema-driven detail renderer without GPU-specific field names.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 21: Task 3.2 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update recovery records.
- [x] Commit and push Task 3.2.
- **Status:** complete

### Phase 22: Next Task Readiness After Task 3.2

- [x] Confirm clean git status after Task 3.2 push.
- [x] Record next task as Task 3.3.
- **Status:** complete

### Phase 23: Task 3.3 Wire GPU Page To Hardware Query Service

- [x] Read Task 3.3 implementation plan details.
- [x] Add failing service-backed page behavior tests.
- [x] Confirm RED failure before app service-backed helpers exist.
- [x] Refactor app data path to use Hardware Query Service while preserving current UI.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 24: Task 3.3 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update recovery records.
- [x] Commit and push Task 3.3.
- **Status:** complete

### Phase 25: Next Task Readiness After Task 3.3

- [x] Confirm clean git status after Task 3.3 push.
- [x] Record next task as Task 4.1.
- **Status:** complete

### Phase 26: Task 4.1 Schema Form Renderer

- [x] Read Task 4.1 implementation plan details.
- [x] Add failing schema form renderer tests.
- [x] Confirm RED failure before renderer exists.
- [x] Implement schema form renderer from schema fields.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 27: Task 4.1 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update recovery records.
- [x] Commit and push Task 4.1.
- **Status:** complete

### Phase 28: Next Task Readiness After Task 4.1

- [x] Confirm clean git status after Task 4.1 push.
- [x] Record next task as Task 4.2.
- **Status:** complete

### Phase 29: Task 4.2 Hardware Mutation Service For JSON

- [x] Read Task 4.2 implementation plan details.
- [x] Add failing save tests.
- [x] Confirm RED failure before mutation service exists.
- [x] Implement JSON save adapter compatibility layer.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 30: Task 4.2 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update recovery records.
- [x] Commit and push Task 4.2.
- **Status:** complete

### Phase 31: Next Task Readiness After Task 4.2

- [x] Confirm clean git status after Task 4.2 push.
- [x] Record next task as Task 4.3.
- **Status:** complete

### Phase 32: Task 4.3 Replace Admin GPU Form With Schema Form

- [x] Read Task 4.3 implementation plan details.
- [x] Update admin renderer tests.
- [x] Refactor admin renderer to use schema form and mutation service.
- [x] Run browser smoke for admin editing flow.
- [x] Confirm `npm.cmd test` passes.
- [x] Fix `.mjs` static module MIME for browser imports.
- **Status:** complete

### Phase 33: Task 4.3 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update recovery records with verify and browser smoke results.
- [x] Commit and push Task 4.3.
- **Status:** complete

### Phase 34: Next Task Readiness After Task 4.3

- [x] Confirm Task 4.3 implementation commit is pushed.
- [x] Record next task as Task 5.1.
- [x] Confirm clean git status after push-completion record.
- **Status:** complete

### Phase 35: Task 5.1 Read-Only Hardware API Routes

- [x] Read Task 5.1 implementation plan details.
- [x] Add failing API tests for `/api/hardware/categories`, `/api/hardware/gpu/items`, `/api/hardware/gpu/items/rtx-4070-laptop`.
- [x] Confirm RED failure because routes return 404.
- [x] Implement routes in `scripts/serve.mjs` using `HardwareQueryService`.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 36: Task 5.1 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update `SessionContextRecord.md`, `PROJECT_STATE.md`, `task_plan.md`, `findings.md`, and `progress.md`.
- [x] Commit and push Task 5.1.
- **Status:** complete

### Phase 37: Next Task Readiness After Task 5.1

- [x] Confirm Task 5.1 implementation commit is pushed.
- [x] Record next task as Task 5.2.
- [x] Confirm clean git status after push.
- **Status:** complete

### Phase 38: Task 5.2 Generic Admin Save API Route

- [x] Read Task 5.2 implementation plan details.
- [x] Add failing admin save tests.
- [x] Confirm RED failure because PUT admin route does not exist.
- [x] Implement admin save route using `HardwareMutationService`.
- [x] Extend `getDetailViewModel` to expose `metricValues`/`rankingScore`/`sources` for admin round-trip.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 39: Task 5.2 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update `SessionContextRecord.md`, `PROJECT_STATE.md`, `task_plan.md`, `findings.md`, and `progress.md`.
- [x] Commit and push Task 5.2.
- **Status:** complete

### Phase 40: Next Task Readiness After Task 5.2

- [x] Confirm Task 5.2 implementation commit is pushed.
- [x] Record next task as Task 6.1.
- [x] Confirm clean git status after push.
- **Status:** complete

### Phase 41: Task 6.1 Comparison Service

- [x] Read Task 6.1 implementation plan details.
- [x] Add failing comparison tests.
- [x] Confirm RED failure because comparison service does not exist.
- [x] Implement comparison service using category compare presets.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 42: Task 6.1 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update `SessionContextRecord.md`, `PROJECT_STATE.md`, `task_plan.md`, `findings.md`, and `progress.md`.
- [x] Commit and push Task 6.1.
- **Status:** complete

### Phase 43: Next Task Readiness After Task 6.1

- [x] Confirm Task 6.1 implementation commit is pushed.
- [x] Record next task as Task 6.2.
- [x] Confirm clean git status after push.
- **Status:** complete

### Phase 44: Task 6.2 Compare Renderer

- [x] Read Task 6.2 implementation plan details.
- [x] Add failing compare renderer tests.
- [x] Confirm RED failure because renderer does not exist.
- [x] Implement compare table renderer consuming `CompareTableViewModel`.
- [x] Confirm `npm.cmd test` passes.
- **Status:** complete

### Phase 45: Task 6.2 Verification And Records

- [x] Run `npm.cmd run verify`.
- [x] Update implementation plan checkboxes.
- [x] Update `SessionContextRecord.md`, `PROJECT_STATE.md`, `task_plan.md`, `findings.md`, and `progress.md`.
- [x] Commit and push Task 6.2.
- **Status:** complete

### Phase 46: Next Task Readiness After Task 6.2

- [x] Confirm Task 6.2 implementation commit is pushed.
- [x] Record next task as Task 6.3.
- [x] Confirm clean git status after push.
- **Status:** complete

### Phase 47: Task 6.3 GPU 对比页面入口

- [x] 修改 `src/app.js`：`createInitialState` 支持 compare hash、`render()` async 处理 compare mode、`getElements` 新增 `comparePanel`
- [x] 修改 `src/styles.css`：新增对比表格样式
- [x] 运行 `npm.cmd run verify` 通过（95 tests / 0 fail）
- [x] 浏览器烟测通过
- **Status:** complete

### Phase 48: Task 6.3 验证与记录

- [x] 运行 `npm.cmd run verify` 通过
- [x] 更新实现计划 checkbox
- [x] 更新 `SessionContextRecord.md`、`PROJECT_STATE.md`、`task_plan.md`、`findings.md`、`progress.md`
- [x] 提交并推送 Task 6.3
- **Status:** complete

### Phase 49: Task 6.3 后续准备

- [x] 确认 Task 6.3 实现提交已推送
- [x] 记录下一个任务为 Task 7.1
- [x] 确认推送后 git 状态干净
- **Status:** complete

## Key Questions

1. What is the repository contract surface for future JSON and PostgreSQL adapters?
2. How small can Task 1.3 stay while still proving the contract helper works?
3. Which current GPU fields must become schema metrics in Task 2.1?
4. Which legacy GPU values should map to metric values versus ranking scores?

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Keep `SessionContextRecord.md` as the highest-priority recovery record | This is the user's explicit iron law for context recovery. |
| Use planning-with-files as complementary working memory | It adds task, finding, and progress logs without replacing existing project records. |
| Limit this coding pass to Task 1.3 only | Atomic-task rule requires one small task per cycle. |
| Start Task 2.1 as the next atomic task | Task 1.3 is complete, pushed, and `SessionContextRecord.md` points to Task 2.1. |
| Keep Task 2.1 limited to schema data and tests | Task 2.2 owns legacy mapping; mixing it here would break the atomic-task boundary. |
| Keep Task 2.2 mapper pure and side-effect free | The implementation plan says this task should not write files; it only prepares reusable adapter functions. |
| Create an explicit checkpoint before Task 2.3 | User warned the context is nearly full, so local recovery records must be sufficient before continuing. |
| Start Task 2.3 after recovery-file reread | The user required compression recovery through `SessionContextRecord.md`; the recovery files have now been read after compaction. |
| Implement JSON repository as a thin adapter over legacy mapper | Keeps Task 2.3 scoped to the read path and avoids duplicating mapping rules before the query service exists. |
| Start Task 2.4 next | Task 2.3 is implemented, verified, committed, and pushed as `4cfb7af`. |
| Correct Task 2.3 push completion state before Task 2.4 | Task 2.3 record commit `87c96bc` is already pushed, so recovery files must not say it is pending. |
| Add mobile warning as `detailView.warnings` schema data | This keeps the query service data-driven and prepares the current hardcoded UI warning for later schema-driven rendering. |
| Start Task 3.1 next | Task 2.4 is implemented, verified, committed, and pushed as `2c18375`. |
| Start Task 3.1 renderer with view-model-only input | Task 3.1 is the first frontend piece that should stop knowing GPU-specific data field names. |
| Keep list renderer as pure HTML functions | This makes it easy for Task 3.3 to wire into the existing app without coupling rendering to repository/data loading. |
| Start Task 3.2 next | Task 3.1 is implemented, verified, committed, and pushed as `9297f1a`. |
| Start Task 3.2 detail renderer with view-model-only input | It should consume `HardwareDetailViewModel` from the query service and avoid legacy GPU field assumptions. |
| Keep detail renderer as pure HTML functions | This keeps Task 3.3 wiring focused on data flow instead of mixing rendering and query logic. |
| Start Task 3.3 next | Task 3.2 is implemented, verified, committed, and pushed as `b2c9445`. |
| Use dynamic local JSON repository loading in app helpers | `JsonHardwareRepository` imports Node `fs`, so app code must not statically import it into the browser bundle. |
| Start Task 4.1 next | Task 3.3 is implemented, verified, browser-smoked, committed, and pushed as `e1b6380`. |
| Treat `afd2c66` as Task 3.3 push completion record commit | Task 4.1 starts only after the Task 3.3 record commit is also pushed. |
| Keep schema form renderer pure and schema-only | Task 4.1 should not wire the admin UI yet; it establishes a reusable renderer before mutation service/admin integration tasks. |
| Start Task 4.2 next | Task 4.1 is implemented, verified, committed, and pushed as `d5b0742`. |
| Treat `eb18068` as Task 4.1 push completion record commit | Task 4.2 starts only after the Task 4.1 record commit is also pushed. |
| Use mutation service as a thin application layer | The service exposes `saveItemDetail` and delegates persistence to the repository, keeping validation/write details inside the JSON adapter. |
| Start Task 4.3 next | Task 4.2 is implemented, verified, committed, and pushed as `22cd61c`. |
| Treat `a1fc662` as Task 4.2 push completion record commit | Task 4.3 starts only after the Task 4.2 record commit is also pushed. |
| Keep Task 4.3 API compatibility with `PUT /api/gpus/:id` | The admin form now renders schema fields, but `buildGpuFromForm` still produces the legacy GPU record expected by the existing local API. |
| Serve `.mjs` as JavaScript in the local server | The browser admin page imports the legacy mapper module from `/scripts`, so module MIME must be `text/javascript` instead of `application/octet-stream`. |
| Start Task 5.1 next | Task 4.3 is implemented, verified, browser-smoked, committed, and pushed as `2858013`. |
| Treat `4578eea` as Task 4.3 push completion record commit | Task 5.1 starts only after the Task 4.3 record commit is also pushed. |
| Hardware API routes create repository per request | Matches test pattern with temp directories and ensures correct server root. |
| Start Task 5.2 next | Task 5.1 is implemented, verified, committed, and pushed as `6fbed35`. |
| Detail view model must expose raw data for admin round-trip | `getDetailViewModel` returns `metricValues`, `rankingScore`, and `sources` so admin save can modify and send them back. |
| Start Task 6.1 next | Task 5.2 is implemented, verified, committed, and pushed. |
| Compare renderer is a pure HTML function | Consumes only `CompareTableViewModel`, no repository or service dependency. |
| Start Task 6.3 next | Task 6.2 is implemented, verified, committed, and pushed. |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| `ERR_MODULE_NOT_FOUND` for `src/domain/hardware/repository-contract.js` | 1 | Expected RED for Task 1.3; implement the contract helper next. |
| `ENOENT` for `src/data/categories/gpu.schema.json` | 1 | Expected RED for Task 2.1; create the GPU category schema next. |
| `ERR_MODULE_NOT_FOUND` for `scripts/import-legacy-gpus.mjs` | 1 | Expected RED for Task 2.2; implement the pure mapper functions next. |
| Windows sandbox `CreateProcessWithLogonW failed: 1326` during recovery reads | 1 | Re-ran the same read-only recovery commands with escalation and continued. |
| `ERR_MODULE_NOT_FOUND` for `src/infrastructure/json/json-hardware-repository.js` | 1 | Expected RED for Task 2.3; implement the read-only JSON repository next. |
| `ERR_MODULE_NOT_FOUND` for `src/application/hardware-query-service.js` | 1 | Expected RED for Task 2.4; implement the repository-backed query service next. |
| `ERR_MODULE_NOT_FOUND` for `src/features/hardware-list/render-list.js` | 1 | Expected RED for Task 3.1; implement the schema-driven list renderer next. |
| `ERR_MODULE_NOT_FOUND` for `src/features/hardware-detail/render-detail.js` | 1 | Expected RED for Task 3.2; implement the schema-driven detail renderer next. |
| Missing export `createGpuPageHardwareModel` from `src/app.js` | 1 | Expected RED for Task 3.3; add service-backed page model helpers next. |
| User-profile `planning-with-files` catchup path was missing | 1 | Reran catchup with the workspace-installed `.codex\skills\planning-with-files\scripts\session-catchup.py` path. |
| `ERR_MODULE_NOT_FOUND` for `src/features/schema-form/render-schema-form.js` | 1 | Expected RED for Task 4.1; implement the schema form renderer next. |
| `ERR_MODULE_NOT_FOUND` for `src/application/hardware-mutation-service.js` | 1 | Expected RED for Task 4.2; implement the mutation service next. |
| Admin renderer still emits hardcoded fields | 1 | Expected RED for Task 4.3; refactor `src/admin.js` to render schema form fields next. |
| Admin browser smoke stayed at loading state because `.mjs` modules were served as `application/octet-stream` | 1 | Added `.mjs` MIME support to `scripts/serve.mjs` and a static server regression test. |
