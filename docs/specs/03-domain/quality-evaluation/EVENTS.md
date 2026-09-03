# Quality & Evaluation｜Domain Events

状态：FROZEN_V0_2026-09-03

## FeedbackRecorded

记录极简反馈完成事实，可用于后续构建“待复盘队列”，但不自动触发模型训练或参数修改。

## EvaluationCompleted

包含 `evalRunId/snapshotId/configProfile/metricSummary/regressions/completedAt`。若关键回归超过门禁，则阻止相关参数/模型升级成为新 baseline。

## KnowledgeSnapshotActivated Consumer

Quality 记录新 Snapshot 与后续 Trace 的关系；可选择触发轻量 smoke/eval，但 V0 不要求 activation 同步等待完整 EvalRun。
