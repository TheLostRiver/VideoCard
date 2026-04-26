# Project State

更新时间：2026-04-26

## 当前目标

构建一个静态 HTML 版交互式游戏显卡天梯图。首版覆盖 NVIDIA GTX 10 到 RTX 50、AMD RX 400 到 RX 9000、Intel Arc A/B，包含桌面版和移动版显卡。移动版必须独立标注。

## 当前阶段

阶段：实施计划已准备，本地已提交，远程推送受网络/认证阻塞。

当前任务：推送计划文档到 `origin main`。

下一步：恢复 GitHub HTTPS 连接或配置 GitHub SSH key 后，推送本地提交；推送成功后再按 `docs/superpowers/plans/2026-04-26-gpu-ladder-implementation.md` 选择执行方式并从 Task 1 开始。

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

## 最近验证

- `git status --short`
- 文档红旗扫描通过。
- `Test-NetConnection github.com -Port 443`：失败，TCP 连接到 `github.com:443` 不通。
- `ssh -T git@github.com`：失败，当前机器没有可用 GitHub SSH public key。
- `git push -u origin main`：失败，HTTPS 无法连接 GitHub。

## 最近提交

- `ae624c2 docs: add atomic implementation plan`
- `248bc9c Add GPU ladder design spec`

## 风险和注意事项

- 当前本地提交尚未推送到 GitHub。不要开始实施 Task 1，除非远程推送成功或用户明确允许暂时跳过每步 push。
- 显卡性能指数是项目自定义排序字段，需要持续校准。
- 移动版显卡性能受 TGP 和散热影响，必须保留说明。
- 3DMark 不同测试项目不能混合比较。
- `.superpowers/` 是讨论草图缓存，已加入 `.gitignore`，不要提交。
