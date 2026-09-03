# Grounded Answering｜Domain Events

状态：FROZEN_V0_2026-09-03

## RagExecutionCompleted

一次 request 达到可审计终态后发布：

`requestId, conversationId, visitorHash, question, standaloneQuery, snapshotId, retrievalTrace, evidence, contextTrace, routingDecision, modelProfile, answer, citations, timings, finalStatus`。

不得包含模型私有 chain-of-thought。

## RagExecutionFailed

用于模型/数据库/契约等非业务型失败。`NO_EVIDENCE` 是受控业务结果，不应与内部异常混为一谈。

## Event Semantics

Quality 消费事件失败不改变用户已看到的 Answer，但必须通过 health/operations 暴露 `TRACE_PERSISTENCE_DEGRADED`。
