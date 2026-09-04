# Knowledge Management｜Domain Model

状态：FROZEN_V0_2026-09-05（P1-C closeout amendment）

## Aggregate：KnowledgeSnapshot

字段语义：`snapshotId`、`sourceCommitSha`、`buildProfile`、`embeddingProfile`、`status`、`createdAt`、`activatedAt?`、`validationSummary`。

状态机：

```text
BUILDING → VALIDATING → READY → ACTIVE → RETIRED
    └─────────────── failure ───────────────► FAILED
```

只有 `READY` 可以尝试 activation；同一时刻只能有一个 ACTIVE。旧 ACTIVE 在新版本成功激活后进入 RETIRED，并至少保留上一成功版本用于快速回滚。

## Source / Build Records

- `RepositorySnapshot(repositoryUrl, ref, commitSha)`：一次知识构建使用的不可变源码输入身份；`ref` 记录来源，真正稳定身份由 repository + commitSha 决定。
- `CorpusManifest(policyVersion, repositoryUrl, sourceCommitSha, entries, manifestHash)`：对固定 RepositorySnapshot 应用 Corpus Policy 后得到的确定性准入清单；同一 source + policy 必须得到稳定 entries/hash。

这两个对象描述 KnowledgeSnapshot 构建前的 source/build truth，不与最终可查询的 KnowledgeSnapshot 合并。

## Entities

- `CorpusDocument`：snapshot 内被接纳的源文件逻辑实体。
- `Chunk`：document 的结构化检索单元。
- `IngestionRun`：一次构建执行，拥有 stage/error/timing 事实。

## Value Objects

- `SourceCoordinate(repository, commitSha, filePath, startLine, endLine)`。
- `EmbeddingProfile(modelId, dimensions, instructionProfile, normalization, version)`。
- `BuildProfile(parserVersion, chunkerVersion, corpusPolicyVersion)`。

这些 Value Object 相等性用于判断旧 index 是否可以安全复用；V0 仍以 full rebuild 为更新策略。
