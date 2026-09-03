# Implementation Plan

Status: DRAFT_FOR_FREEZE

## SDD Sequence
1. Freeze Master, Architecture, Source Sync and Database specs.
2. Create NestJS/Fastify modular-monolith skeleton and repository scripts.
3. Provision native PostgreSQL/pgvector and migrations.
4. Implement repository snapshot acquisition and corpus filtering.
5. Implement doc/code/test parsing and structure-aware chunking plus fixed-size baseline.
6. Integrate iPhone embedding endpoint and build first full snapshot.
7. Implement PostgreSQL FTS + pgvector hybrid retrieval and RRF fusion.
8. Integrate iPhone reranker with fallback to RRF order.
9. Implement Context Builder, bounded multi-turn handling and Model Gateway FAST/THINK generation.
10. Implement SSE Chat API, traces, sources, anonymous identity and minimal feedback.
11. Publish Site UI and connect Site server to Dev Tunnel with service secret.
12. Build eval corpus, run quality/latency gates and tune budgets/routing/sync cadence from evidence.
13. After stability, add launchd wrappers that call repository-owned runtime scripts.

## Rule
Do not skip ahead by adding frameworks or infrastructure not required by the current frozen spec. Any material design change updates the owning spec before implementation.
