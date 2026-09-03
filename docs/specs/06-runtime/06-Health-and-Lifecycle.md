# Runtime｜Health & Lifecycle

状态：REVIEWED_V0_2026-09-03

## Health Dimensions

内部状态至少区分：API process、PostgreSQL、active snapshot、phone model capability、rebuild state、trace persistence、Dev Tunnel reachability。

## Public Health

`GET /health` 仅返回必要 liveness/readiness 与 requestable 状态，例如 `ok/degraded/unavailable`，不显示数据库 host、model IP、tunnel identity、stack 或 secret。

## Startup

应用启动不要求立即 rebuild；但没有 Active Snapshot 时 Chat readiness 应明确为不可提供 grounded answer。数据库 migration/version 不兼容时 fail fast。

## Stable Hosting

项目稳定后可添加 macOS launchd wrapper 调用 repository-owned scripts；launchd 不写业务参数、不管理其他 Node 服务、不自动进行危险 migration。

## Shutdown

优雅停止应停止接收新请求、允许短窗口完成/终止 stream、停止 scheduler、释放 DB pool；不要广域 kill 其他项目进程。
