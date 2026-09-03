# ADR-003｜Hybrid Search + RRF + Reranker

状态：ACCEPTED_2026-09-03

## Context
ProFlow corpus 同时包含自然语言和大量 CLI/path/symbol/error/test exact terms。纯 vector 不足以覆盖工程检索。

## Decision
V0 正式链路使用 PostgreSQL lexical + pgvector semantic 两路召回，RRF 融合，再使用独立 Reranker。

## Consequences
多一次模型调用增加 latency，但这是学习项目的关键 RAG 环节；Reranker failure 可降级为 RRF，不能静默绕过。

## Revisit
若 Eval 显示 reranker 无质量收益或手机 latency 不可接受，调整模型/candidate depth；是否删除该阶段需要 Spec Amendment。
