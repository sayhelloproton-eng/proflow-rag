# System Architecture Spec

Status: FROZEN_V0_2026-09-03

## Public Path
`Internet -> ChatGPT Site -> Site server -> Microsoft Dev Tunnel -> Mac NestJS API -> RAG -> iPhone model service`.

## Local Components
- NestJS application with Fastify HTTP engine.
- PostgreSQL database `proflow_rag` with pgvector extension.
- RAG retrieval, rerank, context construction and generation orchestration.
- Source sync and full rebuild jobs.
- Model Gateway for all iPhone model calls.

## Boundaries
- The browser never receives the backend service secret.
- PostgreSQL is never exposed through the tunnel.
- The iPhone model service is LAN-only and never exposed publicly.
- Dev Tunnel exposes only the ProFlow RAG HTTP service.
- MCP is a future adapter, not part of the public V0 critical path.

## Shape
Use a modular monolith. Do not introduce microservices, Docker, an ORM, a second database or a dedicated vector database in V0.
