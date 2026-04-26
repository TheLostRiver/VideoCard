# 游戏显卡天梯图

一个静态 HTML 版交互式游戏显卡天梯图，覆盖 NVIDIA、AMD、Intel 的桌面版和移动版显卡。

## 功能

- 按综合性能指数展示天梯排序。
- 支持搜索、品牌筛选、桌面/移动筛选、世代筛选和排序。
- 点击显卡查看架构、核心、显存、带宽、功耗、TGP、跑分参考和备注。
- 移动版显卡独立标注，避免与桌面同名卡混淆。
- 本地后台编辑器可维护 GPU 参数并保存回项目数据文件。

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
