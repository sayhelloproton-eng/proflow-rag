# Platform｜运行时、Dev Tunnel 与生命周期 Spec

状态：FROZEN_V0_2026-09-03

## 1. 开发期
开发阶段直接使用仓库脚本，例如 `pnpm dev`、`pnpm db:*`、`pnpm tunnel:*`、`pnpm sync:*`。暂不把 launchd 作为开发前提，方便快速迭代和显式查看日志。

## 2. 固定命名
Backend 使用项目独立固定本地端口；Microsoft Dev Tunnel 使用一个属于 `proflow-rag` 的稳定 Tunnel identity/URL，不每次创建随机 Tunnel。其生命周期由仓库脚本封装。

## 3. Tunnel 职责
Dev Tunnel 只提供公网 HTTPS → Mac RAG HTTP 的 ingress。PostgreSQL 5432、iPhone LAN model endpoint 不通过 Tunnel 暴露。

## 4. 稳定期 launchd
项目稳定后，launchd 只负责“按项目定义启动/崩溃恢复”，直接调用仓库自己的 start script。业务生命周期逻辑留在项目脚本里，便于以后迁 Linux/云环境。

## 5. 与 gptweb-mcp 隔离
不修改 gptweb-mcp 已稳定的常驻方案；Label、端口、日志、pid/service name 全部独立；所有 stop/restart 都必须针对具体项目进程，禁止全局杀 Node。

## 6. 启停闭环
脚本应形成 `start/status/stop` 闭环，status 能分别看到 API、PostgreSQL、Active Snapshot、Tunnel、Model Service 状态。启动失败必须指出卡在哪个依赖，不无限等待。

## 7. Dev Tunnel URL 变化
Site 依赖稳定 HTTPS endpoint，因此 Tunnel identity/URL 是发布配置的一部分。若服务商对长期不活跃 Tunnel 有回收/过期策略，应由 status/启动脚本检测并明确报错，不能静默换 URL 导致 Site 指向旧地址。

## 8. 验收
Mac 重启前开发流程仍可手工恢复；稳定后启用 launchd 时仅影响 proflow-rag；Tunnel 中断/恢复可诊断；stop 不伤及其他 Node/MCP 服务。
