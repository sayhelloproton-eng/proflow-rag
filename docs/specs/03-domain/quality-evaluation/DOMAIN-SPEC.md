# Quality & Evaluation｜Domain Spec

状态：FROZEN_V0_2026-09-03

## Mission

把真实问答质量沉淀为可以解释、比较、回归的事实；回答“哪里错、为什么错、改动后是否变好”。

## Responsibilities

拥有 RagTrace、Feedback、EvalCase、EvalDataset、EvalRun、MetricResult。负责在线 trace persistence、反馈关联、benchmark 管理、离线 Eval 和 regression。它不参与在线 Evidence 选择或生成决策。

## Invariants

- `DOM-QE-001`：历史 Trace 在旧 Snapshot 清理后仍能复盘当时实际 Evidence/Context。
- `DOM-QE-002`：用户反馈是信号，不自动视作 Ground Truth。
- `DOM-QE-003`：不保存模型私有 chain-of-thought。
- `DOM-QE-004`：Eval 必须分阶段测 Retrieval、Rerank、Evidence/Context、Grounding、Citation、Routing、Latency。
- `DOM-QE-005`：真实负反馈可以晋升为 EvalCase，但必须经过人工/规则确认期望行为。
