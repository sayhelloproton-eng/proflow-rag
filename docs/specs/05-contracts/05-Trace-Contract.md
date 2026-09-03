# Contract｜RAG Trace

状态：REVIEWED_V0_2026-09-03

## Required Identity

`requestId, visitorHash, conversationId, snapshotId, sourceCommitSha, timestamp`。

## Required Stage Facts

- 原始 question 与 StandaloneQuery。
- lexical/vector candidates：chunk id、rank、必要 score。
- RRF rank、rerank rank/score 或 degradation reason。
- selected Evidence ids、immutable source metadata、content hash。
- 实际 Context 选择结果；为旧 Snapshot 清理后可复盘，应保存 selected context text 或等价 immutable payload。
- FAST/THINK decision + reasons。
- embedding/rerank/generation/prompt/config profile。
- retrieval/rerank/queue/TTFT/generation/total timings。
- final answer、citations、status/error code。

## Privacy

不保存 private chain-of-thought；raw IP 不作为长期 identity。需要网络滥用分析时只按安全 Spec 保存最小必要信息。

## Durability

旧 Snapshot 清理不能让 Trace 失去“当时用了什么证据”的审计能力。
