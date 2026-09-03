# Runtime｜Microsoft Dev Tunnel

状态：REVIEWED_V0_2026-09-03

## Purpose

为 ChatGPT Site Server 提供到 Mac NestJS API 的公网 HTTPS ingress。它是网络入口，不承载认证、业务逻辑或数据库访问。

## Ownership

项目拥有一个稳定 Dev Tunnel identity 与一个稳定 backend port。相关 create/start/status/stop 脚本属于 `proflow-rag`，不与 ProFlow 或 gptweb-mcp 共用进程/端口管理。

## Exposure

只暴露 NestJS RAG HTTP 服务；PostgreSQL、phone model、internal OS services 不映射。Site Server 业务请求仍需 Bearer secret，Tunnel URL 本身不是安全边界。

## Lifecycle

开发时按需启动；稳定后由项目脚本 + 可选 launchd 恢复。Tunnel 不可用时 Site 应显示后端暂不可用，而不是绕过到手机/数据库。

## Health

内部 health 区分 API local readiness 与 public tunnel reachability；公共 `/health` 不泄露 tunnel diagnostics。
