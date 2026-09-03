# Verification｜Latency Budget

状态：REVIEWED_V0_2026-09-03

## Principle

“必须快”是产品要求，但具体数字必须来自真实旧 Mac + LAN + iPhone 链路，不在设计阶段拍脑袋。

## Must Measure

- request admission/queue wait；
- query rewrite（若发生）；
- query embedding；
- lexical/vector retrieval；
- RRF；
- rerank；
- context building；
- model queue；
- TTFT；
- generation tokens/s + total；
- Site ↔ Tunnel overhead。

## FAST/THINK

分别建立分布，不用 THINK 的慢吞吐污染 FAST baseline。Router Eval 同时考虑质量收益与新增 latency。

## Rebuild

记录每阶段时间与总 full rebuild duration，据此裁决 sync cadence 和未来是否值得增量索引。

## Freeze Trigger

有至少一轮稳定实测数据后，把 p50/p95 目标和 timeout/queue budget 作为 amendment 冻结。
