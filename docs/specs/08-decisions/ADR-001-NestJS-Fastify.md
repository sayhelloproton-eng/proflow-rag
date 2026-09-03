# ADR-001｜NestJS + Fastify Modular Monolith

状态：ACCEPTED_2026-09-03

## Context
需要 TypeScript 后端承载 API、RAG orchestration、scheduler、database 和 SSE，同时保持领域/能力边界但不引入微服务复杂度。

## Decision
使用 NestJS，底层 HTTP engine 使用 Fastify adapter；V0 采用 modular monolith。

## Alternatives
Express-only：更轻但大型结构治理弱；微服务：当前部署和运维成本过高。

## Consequences
可以利用 Nest module/DI/guard/interceptor，但不得把 Nest 模块等同 DDD Bounded Context。未来真实 scaling 证据出现后才考虑拆服务。
