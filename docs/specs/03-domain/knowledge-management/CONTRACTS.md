# Knowledge Management｜Contracts

状态：FROZEN_V0_2026-09-03

## KnowledgeReadContract

Grounded Answering 可使用：

```text
getActiveSnapshot() -> ActiveKnowledgeSnapshotDescriptor
lexicalSearch(snapshotId, query, limit, filters?) -> LexicalCandidate[]
vectorSearch(snapshotId, queryVector, limit, filters?) -> VectorCandidate[]
getChunks(snapshotId, chunkIds[]) -> KnowledgeChunk[]
```

`ActiveKnowledgeSnapshotDescriptor` 至少包含 `snapshotId/sourceCommitSha/embeddingProfile/buildProfile`。

## Infrastructure Ports

Knowledge Management 还声明 `DocumentEmbeddingPort.embed(profile, inputs[])` 与 source repository/clock 等基础设施 Port。具体 iPhone HTTP、Git CLI、PostgreSQL 实现属于 Adapter，不进入 Domain Model。

## Ownership Rule

这些方法是只读查询契约，不暴露 build/activate/retire/delete。Grounded Answering 不能通过 repository adapter 或 SQL 绕过该契约。

## Consistency

每次 Grounded Answering request 先获得 descriptor，并在后续查询携带 `snapshotId`；即使后台中途激活新 Snapshot，本次请求也继续使用原 snapshot，避免一次回答混合两个知识版本。
