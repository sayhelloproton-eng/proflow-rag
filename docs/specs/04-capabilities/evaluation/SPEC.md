# Capability｜RAG Evaluation

状态：REVIEWED_V0_2026-09-03
Owner：Quality & Evaluation

## Purpose

建立可重复的质量闭环，而不是只根据聊天“感觉不错”调参数。

## Eval Layers

1. Retrieval Recall：正确证据是否进入候选。
2. Fusion/Rerank：正确候选是否进入前排。
3. Evidence/Context：是否选择正确且不冗余的证据。
4. Groundedness：答案事实是否由 Evidence 支撑。
5. Citation correctness：commit/path/lines 是否正确。
6. Routing：FAST/THINK 是否合理。
7. Performance：TTFT/各阶段/total latency。
8. Failure behavior：no-evidence、模型不可用、降级是否符合 Spec。

## Baselines

保留 fixed-size vs structure-aware chunking、vector-only/lexical-only vs hybrid、RRF-only vs reranker 的对照能力，帮助学习每个技术决策的真实收益。

## Dataset

第一批来自人工整理的真实 ProFlow 问题；线上 👎/典型失败经复核后加入回归集。不得直接把用户反馈当 expected answer。

## Gate

模型/参数/Chunk 策略升级必须跑相关 benchmark；关键指标倒退时不得直接替换 baseline。
