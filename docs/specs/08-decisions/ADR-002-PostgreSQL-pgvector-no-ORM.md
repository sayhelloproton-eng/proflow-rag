# ADR-002｜Native PostgreSQL + pgvector + No ORM

状态：ACCEPTED_2026-09-03

## Decision
Mac 原生 PostgreSQL，数据库 `proflow_rag`，pgvector 承载 vector，PostgreSQL-native text search 承载 lexical；NestJS 用 `pg` + raw SQL，无 ORM、无 Docker 前提。

## Rationale
一个数据库覆盖事务、FTS、vector、trace，降低本地运维；学习索引与 SQL 真实行为；避免 ORM 对 vector/FTS 和 migration 语义产生额外抽象。

## Revisit
当数据规模/并发证明 PostgreSQL 已成为瓶颈，才评估专用 search/vector service。
