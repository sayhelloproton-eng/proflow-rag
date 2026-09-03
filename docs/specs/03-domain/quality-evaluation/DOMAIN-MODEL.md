# Quality & Evaluation｜Domain Model

状态：FROZEN_V0_2026-09-03

## RagTrace

以 `requestId` 为主身份，保存 immutable source coordinates/content hash、候选 rank/score、selected Evidence、实际 Context payload 或等价不可变表示、model/prompt/config version、timings 和 final status。

## Feedback

`Feedback(requestId, visitorHash, value=UP|DOWN, createdAt)`。V0 不收集自由文本反馈。

## EvalCase

`EvalCase(caseId, question, expectedEvidence?, expectedBehavior, category, provenance, status)`。类别至少覆盖 natural language、exact term、code symbol/path、test evidence、no-evidence、multi-turn、routing、failure。

## EvalRun

绑定 `snapshotId + retrieval/rerank/context/model configuration`，输出 MetricResult 和 per-case result，允许 before/after 比较。
