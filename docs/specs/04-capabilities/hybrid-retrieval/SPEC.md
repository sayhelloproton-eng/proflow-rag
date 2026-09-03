# Capability｜Hybrid Retrieval

状态：REVIEWED_V0_2026-09-03
Owner：Grounded Answering

## Purpose

同时保留语义召回与工程精确词召回，解决源码/测试场景下纯 Vector Search 对 CLI、path、symbol、error string 不稳定的问题。

## Input

`RetrievalQuery + ActiveKnowledgeSnapshotDescriptor`。

## Branches

1. Lexical branch：PostgreSQL-native text search；FTS 为 baseline，CJK 或工程 identifier 召回不足时允许 exact/trigram 等 PostgreSQL-native 补充，不增加 Elasticsearch。
2. Vector branch：使用 active EmbeddingProfile 生成 query vector，通过 pgvector recall。

## Query Preservation

Query Rewrite 不得丢失原问题中的路径、命令、symbol、error code、版本串等 exact terms。可同时保留 normalized natural-language query 与 exact term list。

## Initial Candidate Policy

V0 可从每路 Top 20 左右开始，但数字不是冻结要求；Eval 决定合理 candidate depth。

## Invariants

- `CAP-RET-001`：两路候选都绑定本次 request 的 snapshotId。
- `CAP-RET-002`：原始 lexical/vector score 不直接线性相加。
- `CAP-RET-003`：branch rank/score 保留进入 trace。

## Degradation

Vector embedding 不可用时是否 lexical-only 回答必须显式标记 `retrieval_degraded=true`；如果 Evidence 仍不足则 No Evidence。

## Acceptance

benchmark 必须覆盖中英自然语言、CLI、路径、symbol、错误串、测试证据和混合问题。
