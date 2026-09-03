# DDD Context Map 与跨域协作

状态：FROZEN_V0_2026-09-03

## 1. 总图

```text
GitHub ProFlow main
        │
        ▼
┌────────────────────────┐
│ Knowledge Management   │
└───────┬─────────┬──────┘
        │         │ KnowledgeSnapshotActivated
        │         └──────────────────────────────────────────►┐
        │ KnowledgeReadContract                              │
        ▼                                                    │
┌────────────────────────┐       RagExecutionCompleted       │  ┌──────────────────────┐
│ Grounded Answering     │ ──────────────────────────────────┼─►│ Quality & Evaluation │
└───────────▲────────────┘                                   │  └──────────▲───────────┘
            │ AskQuestionCommand / AnswerStream              │             │
            │                                                └─────────────┘
       Delivery Adapter ───────── RecordFeedback ─────────────────────────►
```

## 2. Knowledge → Grounded Answering

Knowledge 拥有 Snapshot/Chunk/index 的生命周期；Grounded Answering 拥有“怎么检索和选择 Evidence”的策略。两者通过 `KnowledgeReadContract` 协作：读取 active descriptor、执行 lexical/vector index read、按 id 取得不可变 Chunk/Source。Grounded Answering 不能调用 activate/delete/build。

## 3. Grounded Answering → Quality

一次请求完成后发布 `RagExecutionCompleted`。Quality 记录候选、融合、rerank、Evidence、Context、模式、答案、Source、timing 和状态。在线回答不等待复杂 Eval 计算。

## 4. Knowledge → Quality

`KnowledgeSnapshotActivated` 是领域事件。Quality 用于建立新 Snapshot 的 Eval 基线或关联后续 Trace，但事件消费失败不回滚已经成功的 Snapshot activation。

## 5. Delivery → Quality

👍/👎 通过 `RecordFeedback(request_id, value)` 直接进入 Quality，不绕 Grounded Answering 修改历史 Answer。

## 6. 禁止的跨域通信

- 直接 import 对方内部 service/aggregate。
- 直接 UPDATE 对方 ownership 的表。
- 把一个万能 `CommonService` 作为隐形跨域总线。
- 为了“解耦”在 V0 引入 Kafka；模块化单体使用显式 application contract + 进程内 event 即可。
