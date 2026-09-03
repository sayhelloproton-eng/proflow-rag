# Grounded Answering｜Domain Spec

状态：FROZEN_V0_2026-09-03

## Mission

把匿名用户问题转换成基于当前 ProFlow KnowledgeSnapshot 的可流式 Grounded Answer，同时保留对检索、路由、Context 和 Source 的可解释事实。

## Boundary

内部拥有 Query Rewrite、Hybrid Retrieval strategy、RRF、Reranker、Evidence Selection、Conversation budget、FAST/THINK routing、Context Plan、Generation 与 Citation assembly。它不拥有 Snapshot 生命周期、模型 HTTP 实现或 Eval 数据治理。

## Invariants

- `DOM-GA-001`：每个 Turn 新执行 Retrieval。
- `DOM-GA-002`：一次 Answer 的全部 Evidence 来自同一 snapshot。
- `DOM-GA-003`：Citation 只能从 Evidence source metadata 产生。
- `DOM-GA-004`：No Evidence 时不把模型常识包装成 ProFlow 事实。
- `DOM-GA-005`：FAST 是默认模式；THINK 必须有可记录路由理由。
- `DOM-GA-006`：Evidence 在 Context Budget 中优先于旧 conversation history。
- `DOM-GA-007`：生成 token 已发送后不自动从头重试。
