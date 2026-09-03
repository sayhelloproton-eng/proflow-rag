# Knowledge Management｜Domain Events

状态：FROZEN_V0_2026-09-03

## KnowledgeSnapshotActivated

在数据库原子 activation 成功后发布：

```text
snapshotId
sourceCommitSha
embeddingProfileId
buildProfileId
activatedAt
previousSnapshotId?
```

Event 表达“事实已经发生”，消费者失败不能反向撤销 activation。

## KnowledgeBuildFailed

用于内部 observability/Quality 关联：`runId/sourceCommitSha/stage/errorCode/failedAt`。不把原始 secret 或大段异常对象传播到公共层。

## V0 Delivery

使用 NestJS 应用内显式 event dispatcher/port 即可；不引入 Kafka/RabbitMQ。未来若拆服务，可在保持事件语义不变的前提下替换 transport。
