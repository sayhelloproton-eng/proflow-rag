# Knowledge Management｜Domain Model

状态：FROZEN_V0_2026-09-03

## Aggregate：KnowledgeSnapshot

字段语义：`snapshotId`、`sourceCommitSha`、`buildProfile`、`embeddingProfile`、`status`、`createdAt`、`activatedAt?`、`validationSummary`。

状态机：

```text
BUILDING → VALIDATING → READY → ACTIVE → RETIRED
    └─────────────── failure ───────────────► FAILED
```

只有 `READY` 可以尝试 activation；同一时刻只能有一个 ACTIVE。旧 ACTIVE 在新版本成功激活后进入 RETIRED，并至少保留上一成功版本用于快速回滚。

## Entities

- `CorpusDocument`：snapshot 内被接纳的源文件逻辑实体。
- `Chunk`：document 的结构化检索单元。
- `IngestionRun`：一次构建执行，拥有 stage/error/timing 事实。

## Value Objects

- `SourceCoordinate(repository, commitSha, filePath, startLine, endLine)`。
- `EmbeddingProfile(modelId, dimensions, instructionProfile, normalization, version)`。
- `BuildProfile(parserVersion, chunkerVersion, corpusPolicyVersion)`。

这些 Value Object 相等性用于判断旧 index 是否可以安全复用；V0 仍以 full rebuild 为更新策略。
