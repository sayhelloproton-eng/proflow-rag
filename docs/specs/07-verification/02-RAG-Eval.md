# Verification｜RAG Eval Spec

状态：REVIEWED_V0_2026-09-03

## Benchmark Categories

- Natural-language architecture/product facts。
- Chinese/English mixed terminology。
- CLI/exact error string。
- file path / TypeScript symbol。
- test evidence。
- multi-source explanation。
- no-evidence/unknown project fact。
- multi-turn rewrite。
- FAST/THINK routing。

## Metrics

Retrieval 先看 expected evidence 是否被召回；Rerank 看 expected evidence rank；Grounding 看 claim 是否由 Evidence 支持；Citation 看 source exactness；Routing 看 decision correctness；Performance 看阶段 latency。

## Baseline Experiments

- Fixed-size vs structure-aware chunk。
- lexical-only / vector-only / hybrid。
- RRF-only vs RRF+reranker。
- FAST vs THINK 适配任务质量与延迟。

## Dataset Governance

每个 EvalCase 有 provenance 和 expected behavior。线上失败晋升 regression case 前需要复核，防止把用户误点反馈固化成错误 Ground Truth。

## Thresholds

首版实现得到 baseline 后再冻结具体阈值。当前不虚构“95% recall”等数字。
