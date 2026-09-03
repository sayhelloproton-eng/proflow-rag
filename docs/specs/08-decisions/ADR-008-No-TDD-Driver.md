# ADR-008｜V0 不以 TDD 为开发驱动

状态：ACCEPTED_2026-09-03

## Decision
采用 SDD-first，不要求 test-first。仍必须写必要单元/集成/smoke tests，并以 RAG Eval、Grounding、Source correctness、failure path 和真实 latency 作为核心验收。

## Rationale
RAG 质量的关键问题常在数据、检索、排序、Context 和模型行为，单元测试覆盖率无法代理这些指标。

## Risk
“不 TDD”不能演变成“不测试”。Verification Spec 是强制门禁。
