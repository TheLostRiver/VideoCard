# 游戏显卡天梯图

一个正在从静态 HTML 显卡天梯图演进为多硬件品类性能与参数数据库的项目。当前可用版本覆盖 NVIDIA、AMD、Intel 的桌面版和移动版显卡；下一代架构会扩展到 CPU、手机 SoC、Apple Silicon、国产显卡和同类型硬件参数对比。

## 功能

- 按综合性能指数展示天梯排序。
- 支持搜索、品牌筛选、桌面/移动筛选、世代筛选和排序。
- 点击显卡查看架构、核心、显存、带宽、功耗、TGP、跑分参考和备注。
- 移动版显卡独立标注，避免与桌面同名卡混淆。
- 本地后台编辑器可维护 GPU 参数并保存回项目数据文件。

## 架构演进

项目的长期方向是从 GPU-only 静态工具升级为 schema-driven 的多硬件平台：

- `HardwareCategory` 抽象 GPU、桌面 CPU、移动 CPU、手机 SoC、Apple Silicon 等品类。
- `MetricDefinition` 抽象规格、跑分、功耗、平台能力和对比字段。
- `RankingProfile` 抽象不同天梯口径，例如 GPU 游戏综合、CPU 单核、多核、手机 SoC 综合性能。
- 前台列表、详情、后台表单和对比表由 category schema 驱动，减少硬编码。
- 短期保留 JSON 数据源和静态导出；长期引入 PostgreSQL 作为主数据库。
- 业务层面向 `HardwareRepository` 等接口编程，JSON 与 PostgreSQL 都只是 adapter。

关键文档：

- [多硬件平台架构设计](docs/architecture/2026-04-30-multi-hardware-platform-architecture-GPT-5-Codex.md)
- [多硬件平台实现计划](docs/superpowers/plans/2026-04-30-multi-hardware-platform-implementation-GPT-5-Codex.md)
- [架构扩展性审计](docs/architecture/2026-04-30-architecture-scalability-review-GPT-5-Codex.md)
- [上下文恢复记录](SessionContextRecord.md)

## 编码铁律

后续架构迁移和功能实现必须遵守 `SessionContextRecord.md` 机制：

1. 每个原子任务开始前读取 `PROJECT_STATE.md` 和 `SessionContextRecord.md`。
2. 每个原子任务必须足够小，能在一次上下文中完成、验证、记录、提交和 push。
3. 每个原子任务结束前必须更新 `SessionContextRecord.md`。
4. 如果上下文接近爆满或任务状态变复杂，必须先把当前状态写入 `SessionContextRecord.md`。
5. 上下文压缩或恢复后，第一步必须读取 `SessionContextRecord.md`，再继续执行。

## 本地运行

```powershell
npm.cmd run serve
```

打开前台：

```txt
http://localhost:4173
```

打开本地后台：

```txt
http://localhost:4173/admin.html
```

## 后台编辑流程

后台编辑器只面向本地维护者使用，不做登录和公网权限控制。不要把本地保存 API 直接暴露到公网。

1. 运行 `npm.cmd run serve`。
2. 打开 `http://localhost:4173/admin.html`。
3. 搜索显卡，例如 `4070`。
4. 选择 `GeForce RTX 4070 Laptop GPU`。
5. 编辑性能指数、频率、显存、功耗/TGP、跑分、备注或来源。
6. 点击保存。
7. 打开或刷新前台详情页，例如 `http://localhost:4173/#rtx-4070-laptop`，确认数据更新。
8. 运行 `npm.cmd run verify`。
9. 提交并 push 变更。

## 数据维护

`src/data/gpus.json` 是主数据源。`src/data/gpus.js` 是前台静态页面使用的生成文件。

手动改 JSON 后运行：

```powershell
npm.cmd run sync:data
npm.cmd run verify
```

移动版显卡必须保留 `segment: "mobile"` 和 `specs.tgpRangeW`，因为同一移动版 GPU 的实际表现会受 TGP、散热和厂商调校影响。

## 验证

```powershell
npm.cmd run verify
```

验证内容包括：

- JSON 数据合法性。
- `src/data/gpus.json` 和生成的 `src/data/gpus.js` 是否同步。
- 前台渲染、筛选、格式化和性能工具测试。
- 本地后台 API 保存测试。
- 后台表单渲染和表单解析测试。

## 数据说明

综合性能指数以 `GeForce RTX 4060 desktop = 100` 为基准。指数用于玩家快速比较，不等同于单一 3DMark 分数。移动版显卡性能受 TGP、散热和厂商调校影响，页面会单独标注。
