# Knowledge｜Snapshot 构建、激活与回滚 Spec

状态：FROZEN_V0_2026-09-03

## 1. 为什么需要 Snapshot
V0 使用 full rebuild。如果直接删除线上 Chunk 再重建，任何中途失败都会让公网 RAG 处于残缺状态。因此构建与在线读取必须版本隔离。

## 2. 生命周期
`CREATED → FETCHED → PARSED → EMBEDDED → INDEXED → VALIDATED → ACTIVE`。任意阶段失败进入 `FAILED`。历史 Active 被新版本替换后进入 `PREVIOUS/RETIRED`，但保留最近一版可快速回滚。

## 3. 候选构建
候选 Snapshot 在独立 `snapshot_id` 下写入 documents/chunks/embeddings/检索派生数据，不覆盖当前 Active 的记录。构建任务记录阶段耗时、计数、失败文件和模型配置。

## 4. 激活门
至少验证：文档/Chunk 数非异常；所有 Chunk 均有 source coordinates；Embedding 维度一致；关键 benchmark 可检索；无未处理 fatal parser/embed error；目标 `source_commit_sha` 与构建输入一致。

## 5. 原子切换
Active Snapshot 的指针更新必须发生在一个明确事务/原子操作中。Retrieval 只根据 Active 指针读，不同时混查两个 Snapshot。

## 6. 回滚
保留 immediately previous successful Snapshot。新版本上线后若发现严重检索或数据问题，可以把 Active 指针切回 previous，不需要重新 Embedding。回滚动作写入 audit/event。

## 7. 清理与审计
旧 Snapshot 数据可按策略删除，但 Evaluation Domain 的历史 RAG Trace 必须保留当时使用的 source coordinates、content hash 以及实际 selected context（或等价不可变 payload），不能因 Chunk 被清理而无法复盘旧答案。

## 8. 验收
人为注入 parse/embed/index 失败，Active 仍保持可用；成功构建时切换瞬间无半成品窗口；回滚能恢复上一版；所有在线请求 trace 可指出它读取的 `snapshot_id` 和 `source_commit_sha`。
