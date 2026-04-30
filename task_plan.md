# Task Plan: Multi-Hardware Platform Atomic Implementation

## Goal

Continue the multi-hardware platform implementation plan one small atomic task at a time, while keeping `SessionContextRecord.md`, `PROJECT_STATE.md`, and planning-with-files records synchronized.

## Current Phase

Phase 17: Task 3.1 Schema-Driven List Renderer

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
- [ ] Commit and push Task 3.1.
- **Status:** in_progress

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
