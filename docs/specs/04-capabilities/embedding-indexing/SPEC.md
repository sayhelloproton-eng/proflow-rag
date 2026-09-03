# Capability｜Embedding & Index Build

状态：REVIEWED_V0_2026-09-03
Owner：Knowledge Management

## Purpose

为 Snapshot 生成与 `EmbeddingProfile` 一致的向量，并构建 PostgreSQL lexical/vector 可检索数据。

## Runtime Baseline

Embedding 通过 iPhone Model Gateway 执行，不使用收费云 API。首选候选为小型专用 embedding 模型；具体 artifact、维度与 endpoint 能力必须实测后从 Candidate 升级为 Baseline。

## Build

Chunk 内容与必要检索 metadata 形成 embedding input；批量请求应支持 checkpoint/失败定位，但 V0 逻辑上仍是 full snapshot rebuild，不做跨 snapshot 增量复用前提。

## Query Compatibility

Active Snapshot descriptor 暴露 EmbeddingProfile。在线 Query Embedding 必须使用相同 profile；维度/model/instruction 不匹配时禁止 vector search。

## Indexes

- PostgreSQL lexical index/辅助 exact-term capability。
- pgvector vector column + 合适索引。索引类型和参数在 corpus size 实测后选择。

## Invariants

- `CAP-EMB-001`：向量空间身份是 Snapshot 的组成部分。
- `CAP-EMB-002`：不能把不同 embedding profile 的 vector 混查。
- `CAP-EMB-003`：模型切换需要新 Snapshot/full rebuild。

## Metrics

batch throughput、per-chunk latency、failure rate、full rebuild duration、vector storage、query embedding latency。
