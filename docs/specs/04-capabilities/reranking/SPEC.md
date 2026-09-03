# Capability｜RRF Fusion & Reranking

状态：REVIEWED_V0_2026-09-03
Owner：Grounded Answering

## Purpose

把 lexical/vector 两路不同量纲的候选稳定融合，并用独立 Reranker 提升最终 Evidence 排序质量。

## RRF

先按 chunk identity 去重，再使用 Reciprocal Rank Fusion。RRF 的价值是基于 rank 而非强行比较 FTS score 与 cosine similarity。`k` 与 branch depth 由 Eval 调整。

## Reranker

RRF 后的 bounded candidate set 输入 iPhone 专用 Reranker。候选模型优先小型独立 reranker；具体 artifact 以端点兼容、质量收益、延迟为准。

## Failure

Reranker timeout/unavailable → 保留 RRF 顺序并标记降级，不让整次 Chat 失败。不得虚构 rerank score。

## Invariants

- `CAP-RRK-001`：Reranker 是 V0 正式阶段，不可无声绕过。
- `CAP-RRK-002`：只对 bounded candidates 执行，保护手机在线延迟。
- `CAP-RRK-003`：trace 同时保留 RRF rank 与 rerank rank/score。

## Acceptance

同一 EvalCase 集比较 RRF-only vs RRF+Rerank。Reranker 必须产生有意义排序收益且延迟在可接受预算内；否则应通过 Spec Amendment 调整模型/候选数，而不是隐藏结果。
