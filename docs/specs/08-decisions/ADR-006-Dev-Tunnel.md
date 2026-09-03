# ADR-006｜Microsoft Dev Tunnel 作为公网入口

状态：ACCEPTED_2026-09-03

## Decision
ChatGPT Site Server 经 HTTPS 调用 Microsoft Dev Tunnel，再到 Mac NestJS Backend。

## Alternatives
OpenAI Secure MCP Tunnel 不作为 Site 通用 HTTP ingress；Responses API 路由会引入 API 成本；云后端不符合当前近零成本基线。

## Consequences
项目需要独立 tunnel lifecycle、service secret、public health 与恢复策略。Tunnel 只暴露 backend port。
