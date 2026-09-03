# Knowledge Management｜Domain Spec

状态：FROZEN_V0_2026-09-03

## Mission

把 ProFlow GitHub `main` 的确定 commit 转换成可重现、可检索、可验证、可原子激活的 KnowledgeSnapshot。

## Boundary

负责 source authority、corpus policy、parse/chunk、embedding/index build、snapshot state/activation/rollback。它不理解用户会话、Prompt、FAST/THINK、Reranker 策略或用户反馈。

## Core Invariants

- `DOM-KM-001`：每个 Snapshot 必须绑定一个且仅一个 source commit。
- `DOM-KM-002`：Chunk 必须可定位 `commit + path + lines`。
- `DOM-KM-003`：一个 Snapshot 只能使用一个确定 EmbeddingProfile。
- `DOM-KM-004`：candidate build 不可修改 Active Snapshot 的可见数据。
- `DOM-KM-005`：activation 是原子状态切换。
- `DOM-KM-006`：构建失败必须留下 IngestionRun 证据，不得静默跳过关键文件。

## Published Contract

向 Grounded Answering 发布只读 `KnowledgeReadContract`；向 Quality 发布 `KnowledgeSnapshotActivated`。管理命令只属于内部 control path。
