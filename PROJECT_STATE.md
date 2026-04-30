# Project State

更新时间：2026-05-01

## 当前目标

构建一个静态 HTML 版交互式游戏显卡天梯图。首版覆盖 NVIDIA GTX 10 到 RTX 50、AMD RX 400 到 RX 9000、Intel Arc A/B，包含桌面版和移动版显卡。移动版必须独立标注。当前新增目标是本地后台编辑器优先的数据维护能力，暂不引入 PostgreSQL。

## 当前阶段

阶段：Multi-Hardware Platform Implementation Task 2.4 完成并已推送，Hardware Query Service 已新增。

当前任务：准备进入 Task 3.1: Add Schema-Driven List Renderer。

下一步：进入 Task 3.1。开始前必须读取 `SessionContextRecord.md`、`PROJECT_STATE.md`、`task_plan.md`、`findings.md`、`progress.md` 和实现计划。

## 工作规则

- 每个原子任务开始前先读取本文件。
- 每个原子任务只完成计划中的一个 Task。
- 每个原子任务完成后更新本文件。
- 每个原子任务完成后更新计划文档中的对应 checkbox。
- 每个原子任务完成后运行该任务指定的验证命令。
- 每个原子任务完成后创建 git commit。
- 每个原子任务完成后 push 到 `origin main`。
- 如果验证失败，不提交，不推送；先修复或更新本文件记录阻塞原因。

## 已完成

- 初始化 git 仓库。
- 设置远程：`https://github.com/TheLostRiver/VideoCard.git`。
- 编写并提交设计规格：`docs/superpowers/specs/2026-04-26-gpu-ladder-design.md`。
- 编写实施计划：`docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md`。
- 创建统一状态文件：`PROJECT_STATE.md`。
- 本地提交计划文档：`ae624c2 docs: add atomic implementation plan`。
- 成功推送 `main` 到 `origin/main`。
- Task 1 完成：创建 `package.json` 和 `scripts/serve.mjs`。
- Task 1 计划 checkbox 已更新。
- Task 2 完成：创建 `src/data/constants.js`、`src/utils/format.js`、`tests/format.test.mjs`。
- Task 2 计划 checkbox 已更新。
- Task 3 完成：创建 `src/data/gpus.js` 和 `scripts/validate-data.mjs`。
- Task 3 录入 12 条代表性 GPU 数据，包含桌面版和移动版。
- Task 3 计划 checkbox 已更新。
- Task 4 完成：创建 `src/utils/filters.js`、`src/utils/performance.js`、`tests/filters.test.mjs`、`tests/performance.test.mjs`。
- Task 4 计划 checkbox 已更新。
- Task 5 完成：创建 `index.html` 和 `src/styles.css`。
- Task 5 计划 checkbox 已更新。
- Task 6 完成：创建 `src/app.js`，追加组件样式，并新增 `tests/app-render.test.mjs`。
- Task 6 实现列表渲染、品牌/桌面移动/世代筛选、搜索、排序、详情面板、URL hash 和移动端详情抽屉。
- Task 6 计划 checkbox 已更新。
- Admin Task A 完成：新增 `src/data/gpus.json` 作为主数据源。
- Admin Task A 完成：新增 `scripts/gpu-data.mjs`、`scripts/sync-gpus.mjs`、`tests/data-sync.test.mjs`。
- Admin Task A 完成：`src/data/gpus.js` 改为由 JSON 同步生成，`scripts/validate-data.mjs` 校验 JSON 与 JS 同步状态。
- Admin Task A 计划 checkbox 已更新。
- Admin Task B 完成：`scripts/serve.mjs` 导出可测试请求处理器，并新增本地 `GET /api/gpus` 与 `PUT /api/gpus/:id`。
- Admin Task B 完成：`scripts/gpu-data.mjs` 新增记录替换、原子写入 JSON、同步生成 JS 的保存流程。
- Admin Task B 完成：新增 `tests/admin-api.test.mjs` 覆盖读取、保存、移动版 TGP、非法性能指数和重复 id。
- Admin Task B 计划 checkbox 已更新。
- Admin Task C 完成：新增 `admin.html` 和 `src/admin.js`，提供本地后台搜索、选择、分组编辑和保存流程。
- Admin Task C 完成：新增 `tests/admin-render.test.mjs` 覆盖后台搜索、列表选中、表单渲染、备注/来源格式化和表单解析。
- Admin Task C 完成：追加后台布局样式，并将 4070 Laptop 烟测修改保存为 `boostClockMHz: 2175`、`tgpRangeW: "45-115W"`、`timeSpyGraphics: 12345`。
- Admin Task C 计划 checkbox 已更新。
- Admin Task D 完成：新增 `README.md`，记录本地运行、后台编辑、数据同步与验证流程。
- Admin Task D 完成：完成 `rtx-4070-laptop` 后台保存与前台同步浏览器验证。
- Admin Task D 计划 checkbox 已更新。
- Architecture Review 完成：新增 `docs/architecture/2026-04-30-architecture-scalability-review-GPT-5-Codex.md`。
- Architecture Review 完成：记录当前 GPU-only 架构不足、多硬件品类目标架构、接口优先设计、schema-driven UI、PostgreSQL 建模方向和分阶段迁移路线。
- Architecture Design 完成：新增 `docs/architecture/2026-04-30-multi-hardware-platform-architecture-GPT-5-Codex.md`，详细定义多硬件平台目标、领域模型、repository 接口、schema-driven UI、后台、API、PostgreSQL 和迁移路线。
- Implementation Plan 完成：新增 `docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md`，将架构迁移拆分为多个小型原子任务。
- Session Context 完成：新增 `SessionContextRecord.md`，记录上下文压缩后的恢复规则、当前架构决策、关键文件和下一步。
- README 更新：补充多硬件平台架构演进方向、关键文档链接和编码铁律。
- Task 0.1 完成：已读取 `SessionContextRecord.md`、`PROJECT_STATE.md` 和实现计划，已将 Task 0.1 checkbox 标记为完成，并正式启用上下文恢复执行机制。
- Task 1.1 RED 完成：新增 `tests/hardware-types.test.mjs`，先运行 `npm.cmd test`，按预期因 `src/domain/hardware/types.js` 缺失失败。
- Task 1.1 GREEN 完成：新增 `src/domain/hardware/types.js`，导出 `HARDWARE_CATEGORY_IDS`、`METRIC_VALUE_TYPES` 和 `ITEM_STATUSES`。
- Task 1.1 计划 checkbox 已更新。
- Task 1.2 RED 完成：新增 `tests/hardware-schema.test.mjs`，先运行 `npm.cmd test`，按预期因 `src/domain/hardware/category-schema.js` 缺失失败。
- Task 1.2 GREEN 完成：新增 `src/domain/hardware/category-schema.js`，导出 `validateCategorySchema` 和 `assertValidCategorySchema`。
- Task 1.2 计划 checkbox 已更新。
- Workspace Tooling 完成：按上游 Codex 文档采用 workspace installation，将 planning-with-files `.codex/` 集成复制到项目根目录。
- Workspace Tooling 完成：planning-with-files 来源提交为 `9fb5529`，安装内容包括 `.codex/skills/planning-with-files/`、`.codex/hooks.json` 和 `.codex/hooks/`。
- README 已补充 planning-with-files 安装位置、用途、来源提交和 Windows hooks 限制说明。
- Planning With Files 启用：新增 `task_plan.md`、`findings.md`、`progress.md`，用于和 `SessionContextRecord.md` 共同记录长期任务上下文。
- Task 1.3 RED 完成：新增 `tests/hardware-repository-contract.test.mjs`，先运行 `npm.cmd test`，按预期因 `src/domain/hardware/repository-contract.js` 缺失失败。
- Task 1.3 GREEN 完成：新增 `src/domain/hardware/repository-contract.js`，导出 `HARDWARE_REPOSITORY_METHODS` 和 `createHardwareRepositoryContractTestSuite`。
- Task 1.3 计划 checkbox 已更新。
- Task 2.1 RED 完成：新增 `tests/gpu-category-schema.test.mjs`，先运行 `npm.cmd test`，按预期因 `src/data/categories/gpu.schema.json` 缺失失败。
- Task 2.1 GREEN 完成：新增 `src/data/categories/gpu.schema.json`，覆盖当前 GPU 列表、详情、后台表单和规格/显存/功耗/跑分对比预设。
- Task 2.1 计划 checkbox 已更新。
- Task 2.2 RED 完成：新增 `tests/legacy-gpu-import.test.mjs`，先运行 `npm.cmd test`，按预期因 `scripts/import-legacy-gpus.mjs` 缺失失败。
- Task 2.2 GREEN 完成：新增 `scripts/import-legacy-gpus.mjs`，导出 legacy GPU 到 `HardwareItem`、metric values、ranking score、source documents 的纯映射函数。
- Task 2.2 计划 checkbox 已更新。
- Task 2.3 RED 完成：新增 `tests/json-hardware-repository.test.mjs`，先运行 `npm.cmd test`，按预期因 `src/infrastructure/json/json-hardware-repository.js` 缺失失败。
- Task 2.3 GREEN 完成：新增 `src/infrastructure/json/json-hardware-repository.js`，实现基于 `src/data/gpus.json`、`gpu.schema.json` 和 legacy mapper 的只读 JSON repository。
- Task 2.3 完整验证完成：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 53 pass / 0 fail。
- Task 2.3 推送完成：`4cfb7af feat: add read-only json hardware repository` 已推送到 `origin/main`。
- Task 2.3 计划 checkbox 已更新完成。
- Task 2.3 push 记录完成：`87c96bc chore: record task2.3 push completion` 已推送到 `origin/main`。
- Task 2.4 启动检查完成：已读取 `SessionContextRecord.md`、`PROJECT_STATE.md`、`task_plan.md`、`findings.md`、`progress.md`、实现计划 Task 2.4 和 `git status -sb`。
- Task 2.4 RED 完成：新增 `tests/hardware-query-service.test.mjs`，先运行 `npm.cmd test`，按预期因 `src/application/hardware-query-service.js` 缺失失败。
- Task 2.4 GREEN 完成：新增 `src/application/hardware-query-service.js`，实现 repository-backed list/detail view model 服务，不直接导入 `gpus.js`。
- Task 2.4 Schema 更新：`src/data/categories/gpu.schema.json` 新增 `detailView.warnings`，移动版提示由 schema 规则驱动。
- Task 2.4 完整验证完成：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 57 pass / 0 fail。
- Task 2.4 推送完成：`2c18375 feat: add hardware query service` 已推送到 `origin/main`。
- Task 2.4 计划 checkbox 已更新完成。

## 最近验证

- `git status --short`
- 文档红旗扫描通过。
- `Test-NetConnection github.com -Port 443`：失败，TCP 连接到 `github.com:443` 不通。
- `ssh -T git@github.com`：失败，当前机器没有可用 GitHub SSH public key。
- `git push -u origin main`：失败，HTTPS 无法连接 GitHub。
- 重新测试 `github.com:443`：成功。
- 重新执行 `git push -u origin main`：成功。
- Task 1 验证：PowerShell 阻止 `npm.ps1`，改用等价命令 `npm.cmd run`。
- `npm.cmd run`：成功列出 `serve`、`test`、`validate:data`、`verify`。
- Task 1 推送：默认 DNS 指向的 `20.205.243.166` 不稳定；使用 `git -c http.sslBackend=schannel -c http.curloptResolve=github.com:443:140.82.112.4 push origin main` 成功推送。
- Task 2 RED：先创建 `tests/format.test.mjs` 后运行 `npm.cmd test`，按预期因 `src/utils/format.js` 缺失失败。
- Task 2 GREEN：实现格式化工具后运行 `npm.cmd test`，6 个测试全部通过。
- Task 3 RED：运行 `npm.cmd run validate:data`，按预期因 `scripts/validate-data.mjs` 缺失失败。
- Task 3 GREEN：实现数据和验证器后运行 `npm.cmd run validate:data`，输出 `Validated 12 GPU records.`。
- 当前沙箱用户与仓库拥有者不同，git 命令需临时使用 `-c safe.directory=Q:/DEV/VideoCardProj`。
- 当前沙箱用户下 `node --test` 默认隔离模式会因子进程 `spawn EPERM` 失败；已将 `package.json` 的 `test` 脚本改为 `node --test --test-isolation=none tests/*.test.mjs`。
- Task 3 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 6 pass / 0 fail。
- Task 3 之前的 push 阻塞已解除，已恢复使用正式 `.git` 提交并推送。
- Task 4 RED：先创建 `tests/filters.test.mjs` 和 `tests/performance.test.mjs` 后运行 `npm.cmd test`，按预期因 `src/utils/filters.js` 与 `src/utils/performance.js` 缺失失败。
- Task 4 GREEN：实现过滤、排序、分组和性能宽度工具后运行 `npm.cmd run verify`，数据校验 12 条记录，测试 12 pass / 0 fail。
- Task 5 验证：`Test-Path index.html; Test-Path src\styles.css` 均返回 `True`。
- Task 5 回归验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 12 pass / 0 fail。
- Task 6 RED：先新增 `tests/app-render.test.mjs` 后运行 `npm.cmd test`，按预期因 `src/app.js` 缺失失败。
- Task 6 GREEN：实现 `src/app.js` 和组件样式后运行 `npm.cmd test`，18 个测试全部通过。
- Task 6 修复：浏览器烟测发现移动端 `.mobile-drawer` 媒体查询覆盖 `hidden` 属性，已增加 `.mobile-drawer[hidden]` 并复测通过。
- Task 6 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 18 pass / 0 fail。
- Task 6 浏览器验证：`http://localhost:4173` 渲染 12 条 GPU；点击显卡更新 URL hash 和详情；Mobile chip 激活后剩 2 条移动版；搜索 `4070` 后剩 1 条；点击 `GeForce RTX 4070 Laptop GPU` 后移动抽屉显示并包含移动版警告；浏览器 console error 为空。
- Task 6 推送：默认 `github.com` 解析到 `20.205.243.166` 时 443 不通；普通 push 两次失败。改用 `git -c http.sslBackend=schannel -c http.version=HTTP/1.1 -c http.curloptResolve=github.com:443:140.82.114.4 push --no-thin --porcelain origin main` 成功推送。
- Admin Task A RED：先新增 `tests/data-sync.test.mjs` 后运行 `npm.cmd test`，按预期因 `scripts/gpu-data.mjs` 缺失失败。
- Admin Task A GREEN：新增 JSON 数据层、同步脚本和校验逻辑后运行 `npm.cmd test`，21 个测试全部通过。
- Admin Task A 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 21 pass / 0 fail。
- Admin Task B RED：先新增 `tests/admin-api.test.mjs` 后运行 `npm.cmd test`，按预期因 `scripts/serve.mjs` 未导出 `createRequestHandler` 失败。
- Admin Task B GREEN：实现本地 API 和保存流程后运行 `npm.cmd test`，26 个测试全部通过。
- Admin Task B 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 26 pass / 0 fail。
- Admin Task C RED：先新增 `tests/admin-render.test.mjs` 后运行 `npm.cmd test`，按预期因 `src/admin.js` 缺失失败。
- Admin Task C GREEN：实现后台页面和表单逻辑后运行 `npm.cmd test`，31 个测试全部通过。
- Admin Task C 浏览器验证：`http://localhost:4173/admin.html` 加载 12 条 GPU；搜索 `4070` 后列表为 2 条；选中 `GeForce RTX 4070 Laptop GPU` 后修改 boost/TGP/Time Spy 并保存成功；前台 `http://localhost:4173/#rtx-4070-laptop` 显示 `2,175 MHz`、`45-115W`、`12,345`；浏览器 console error 为空。
- Admin Task C 修复：旧测试硬编码 4070 Laptop TGP 为 `35-115W`，已改为按当前数据记录断言。
- Admin Task C 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 31 pass / 0 fail。
- Admin Task D 浏览器验证：`http://localhost:4173/admin.html` 搜索 `4070`、选择 `GeForce RTX 4070 Laptop GPU`、保存 boost/TGP/Time Spy；前台 `http://localhost:4173/#rtx-4070-laptop` 显示 `2,175 MHz`、`45-115W`、`12,345`；浏览器 console error 为空。
- Admin Task D 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 31 pass / 0 fail。
- Architecture Review 文档自检：确认新文档文件名包含 `GPT-5-Codex`，并覆盖 CPU、手机 SoC、对比功能、后台复杂化、接口抽象、数据驱动和 PostgreSQL 演进方向。
- Architecture Review 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 31 pass / 0 fail。
- Architecture Design 文档自检：确认新架构文档覆盖 GPU、CPU、手机 SoC、Apple Silicon、国产显卡、同类型对比、复杂后台、接口优先、数据驱动和 PostgreSQL。
- Implementation Plan 文档自检：确认实现文档包含 `SessionContextRecord.md` 铁律、原子任务执行循环、逐任务验证和 commit/push 要求。
- Multi-Hardware Architecture 文档验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 31 pass / 0 fail。
- Task 0.1 启动检查：`git status -sb` 显示 `main...origin/main`，工作区在任务开始前为干净状态。
- Task 0.1 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 31 pass / 0 fail。
- Task 1.1 RED 验证：`npm.cmd test` 失败，错误为 `ERR_MODULE_NOT_FOUND`，目标模块 `src/domain/hardware/types.js` 不存在，符合预期。
- Task 1.1 GREEN 验证：`npm.cmd test` 通过，测试 34 pass / 0 fail。
- Task 1.1 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 34 pass / 0 fail。
- Task 1.2 RED 验证：`npm.cmd test` 失败，错误为 `ERR_MODULE_NOT_FOUND`，目标模块 `src/domain/hardware/category-schema.js` 不存在，符合预期。
- Task 1.2 GREEN 验证：`npm.cmd test` 通过，测试 41 pass / 0 fail。
- Task 1.2 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 41 pass / 0 fail。
- Workspace Tooling 安装检查：`.codex/skills/planning-with-files/SKILL.md`、`.codex/hooks.json`、`.codex/hooks/session-start.sh` 均已存在。
- Workspace Tooling 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 41 pass / 0 fail。
- Task 1.3 RED 验证：`npm.cmd test` 失败，错误为 `ERR_MODULE_NOT_FOUND`，目标模块 `src/domain/hardware/repository-contract.js` 不存在，符合预期。
- Task 1.3 GREEN 验证：`npm.cmd test` 通过，测试 45 pass / 0 fail。
- Task 1.3 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 45 pass / 0 fail。
- Task 2.1 RED 验证：`npm.cmd test` 失败，错误为 `ENOENT`，目标文件 `src/data/categories/gpu.schema.json` 不存在，符合预期。
- Task 2.1 GREEN 验证：`npm.cmd test` 通过，测试 46 pass / 0 fail。
- Task 2.1 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 46 pass / 0 fail。
- Task 2.2 RED 验证：`npm.cmd test` 失败，错误为 `ERR_MODULE_NOT_FOUND`，目标模块 `scripts/import-legacy-gpus.mjs` 不存在，符合预期。
- Task 2.2 GREEN 验证：`npm.cmd test` 通过，测试 50 pass / 0 fail。
- Task 2.2 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 50 pass / 0 fail。
- Task 2.3 RED 验证：`npm.cmd test` 失败，错误为 `ERR_MODULE_NOT_FOUND`，目标模块 `src/infrastructure/json/json-hardware-repository.js` 不存在，符合预期。
- Task 2.3 GREEN 验证：`npm.cmd test` 通过，测试 53 pass / 0 fail。
- Task 2.3 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 53 pass / 0 fail。
- Task 2.4 RED 验证：`npm.cmd test` 失败，错误为 `ERR_MODULE_NOT_FOUND`，目标模块 `src/application/hardware-query-service.js` 不存在，符合预期。
- Task 2.4 GREEN 验证：`npm.cmd test` 通过，测试 57 pass / 0 fail。
- Task 2.4 完整验证：`npm.cmd run verify` 通过，数据校验 12 条记录，测试 57 pass / 0 fail。

## 最近提交

- `2c18375 feat: add hardware query service`
- `87c96bc chore: record task2.3 push completion`
- `4cfb7af feat: add read-only json hardware repository`
- `82be9b9 chore: record task2.2 push completion`
- `d1eba06 feat: map legacy gpu records to hardware model`
- `ddce92c chore: record task2.1 push completion`
- `12527a2 data: add gpu category schema`
- `e06b12b chore: record task1.3 push completion`
- `fa7bd57 test: add hardware repository contract`
- `cf8d52e chore: install planning-with-files codex integration`
- `b2bc3fd chore: record task1.2 push completion`
- `1aabb38 feat: add category schema validation`
- `539c486 feat: add hardware domain type constants`
- `2151325 docs: activate session context workflow`
- `c136c88 docs: design multi-hardware platform architecture`
- `dd962e7 docs: analyze multi-hardware architecture`
- `05ebf40 docs: add local admin editor workflow`
- `6b4ec18 feat: add local gpu admin editor`
- `64baf7d feat: add local gpu admin api`
- `e0b7a79 feat: add json gpu data sync pipeline`
- `b3f212e chore: mark task6 push complete`
- `a9c6b7c feat: render interactive gpu ladder`
- `c24756f feat: add static app shell`
- `4f61568 chore: mark task4 push complete`
- `6728bb7 feat: add gpu filtering and performance helpers`
- `f84e1ff chore: mark task3 push complete`
- `3f78077 feat: add seed gpu data`
- `9e34e69 feat: add data constants and format helpers`
- `81e7e7c chore: record task1 push details`
- `4d93b44 chore: add project runtime skeleton`
- `ae624c2 docs: add atomic implementation plan`
- `248bc9c Add GPU ladder design spec`

## 风险和注意事项

- 显卡性能指数是项目自定义排序字段，需要持续校准。
- 移动版显卡性能受 TGP 和散热影响，必须保留说明。
- 3DMark 不同测试项目不能混合比较。
- `.superpowers/` 是讨论草图缓存，已加入 `.gitignore`，不要提交。
