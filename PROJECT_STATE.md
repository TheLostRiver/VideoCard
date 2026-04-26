# Project State

更新时间：2026-04-26

## 当前目标

构建一个静态 HTML 版交互式游戏显卡天梯图。首版覆盖 NVIDIA GTX 10 到 RTX 50、AMD RX 400 到 RX 9000、Intel Arc A/B，包含桌面版和移动版显卡。移动版必须独立标注。

## 当前阶段

阶段：Task 1 完成，项目运行骨架已创建。

当前任务：Task 1: Project Runtime Skeleton。

下一步：从 Task 2: Data Constants and Formatting Utilities 开始。

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

## 最近提交

- `4d93b44 chore: add project runtime skeleton`
- `ae624c2 docs: add atomic implementation plan`
- `248bc9c Add GPU ladder design spec`

## 风险和注意事项

- 显卡性能指数是项目自定义排序字段，需要持续校准。
- 移动版显卡性能受 TGP 和散热影响，必须保留说明。
- 3DMark 不同测试项目不能混合比较。
- `.superpowers/` 是讨论草图缓存，已加入 `.gitignore`，不要提交。
