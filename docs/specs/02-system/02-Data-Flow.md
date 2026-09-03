# System Data Flow

状态：FROZEN_V0_2026-09-03

## 1. Online Answer Flow

```text
Question
→ bounded conversation understanding
→ StandaloneQuery
→ ActiveSnapshot descriptor
→ query embedding + lexical/vector recall
→ RRF
→ Reranker
→ EvidenceSet
→ ContextPlan
→ FAST/THINK generation
→ SSE tokens
→ final Sources/status
→ RagExecutionCompleted
```

## 2. Offline Knowledge Flow

```text
Resolve ProFlow main SHA
→ fetch exact commit
→ corpus filter
→ parse
→ structure-aware chunk
→ embedding
→ lexical/vector index
→ validate
→ READY snapshot
→ atomic activate
→ retire previous snapshot
```

## 3. Audit Flow

`RagExecutionCompleted → Trace persistence → Feedback/EvalCase → EvalRun → MetricResult → tuning/amendment decision`。

## 4. Control Flow

Scheduler 只触发“检查是否需要 rebuild”；只有 ProFlow `main` SHA 变化或索引构建规则/Embedding profile 明确变化才构建新 Snapshot。`proflow-rag` 自身普通代码提交不触发知识 rebuild。
