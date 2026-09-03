# Runtime｜Source Sync & Full Rebuild

状态：REVIEWED_V0_2026-09-03

## Trigger

定时检查 ProFlow remote `main` SHA。相同且 build/embedding profile 未变化时 no-op；不同则创建 candidate KnowledgeSnapshot。同步频率在首次 full rebuild 计时后确定。

## V0 Strategy

使用 full rebuild，而不是增量 update。原因：优先保证实现可理解、Snapshot 一致和清理语义简单，再用真实 rebuild 成本决定何时值得做 incremental indexing。

## Mutual Exclusion

同一时间最多一个 rebuild。新 trigger 在已有 run 进行时合并/跳过，不启动第二个并行全量 embedding。

## Online Priority

rebuild embedding 必须可暂停/让出手机资源；公共 query embedding、rerank、generation 优先。

## Activation

build → validate → READY 后执行数据库原子 activation。保留前一 successful snapshot；更老版本清理由策略任务处理，不能破坏历史 RagTrace 的 immutable evidence payload。
