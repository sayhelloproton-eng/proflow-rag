# Cross-Context Communication｜跨领域通信规格

状态：FROZEN_V0_2026-09-03

## 1. 目标

Bounded Context 的边界只有在通信规则明确时才有意义。本规格定义 Knowledge Management、Grounded Answering、Quality & Evaluation 之间允许的通信方式、数据 ownership 与一致性语义。

## 2. 允许的三种通信

### A. Application Contract：同步请求/响应
适用于调用方必须立即获得结果才能继续的场景。例如 Grounded Answering 通过 `KnowledgeReadContract` 固定本次 request 的 Active Snapshot 并读取 lexical/vector candidates。

### B. Domain/Application Event：已发生事实通知
适用于事实已经完成、消费者不应改变原事务结果的场景。例如 `KnowledgeSnapshotActivated`、`RagExecutionCompleted`。V0 使用进程内显式 event dispatcher；event 语义不能依赖 Kafka 才成立。

### C. Port：Context 对外部能力的依赖
适用于模型、数据库、时钟、Git、队列等基础设施。例如 `QueryEmbeddingPort`、`GenerationPort`。Port 在 owning Context/Capability 定义，Adapter 在 Infrastructure 实现。

## 3. Consistency Rules

- Grounded Answering 在一轮开始时读取 `ActiveKnowledgeSnapshotDescriptor`，之后所有 lexical/vector/chunk read 都携带该 `snapshotId`；中途 activation 不影响本轮。
- Snapshot activation 的数据库事务完成后才发布 `KnowledgeSnapshotActivated`。
- `RagExecutionCompleted` 代表 Answer 已达到业务终态；Quality 消费失败不反写 Answer 状态。
- `RecordFeedback` 只引用既有 `requestId`，不修改历史 Answer/Evidence。

## 4. Ownership Rules

Knowledge Management 独占 Snapshot/Chunk/index 的写生命周期；Grounded Answering 独占 Conversation/Turn/Answer 业务状态；Quality 独占 Trace/Feedback/Eval 状态。共享 PostgreSQL 不等于共享写权限。

## 5. 禁止模式

- Context A 直接 import Context B 的内部 service/repository/aggregate。
- 为了方便直接 SQL UPDATE 对方 schema。
- 把跨域行为塞进 `common` / `utils` 逃避 ownership。
- 通过公共 DTO 暴露内部 Aggregate 的全部字段。
- 为“事件驱动”提前增加外部消息中间件。

## 6. Failure Semantics

同步 Contract 失败由调用方按 owning capability 的 failure/degradation 策略处理；Event consumer 失败进入 retry/health/operations，不回滚已经完成的上游领域事实，除非未来某个明确 Spec 定义强一致 Saga（V0 没有）。

## 7. Verification

架构审计必须能够从代码 import、repository ownership 和 SQL migration 证明上述依赖方向；E2E 需要验证 in-flight request 在 Snapshot activation 时仍保持单 snapshot 一致性。
