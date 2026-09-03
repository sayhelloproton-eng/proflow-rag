# Verification｜RAG Quality Cases

状态：REVIEWED_V0_2026-09-03

## VER-RAG-001 Groundedness

对 benchmark Answer 拆 claim，检查 ProFlow 项目事实是否能由 selected Evidence 支撑；不允许只因为最终文字“听起来对”就通过。No-evidence case 单独判定。

## VER-RAG-002 Stage-by-stage Eval

同一个 EvalRun 必须能分别观察 Retrieval recall、RRF/rerank ordering、Evidence selection、Context、Generation grounding、Citation 和 latency，避免最终答案掩盖前序缺陷。

## VER-RAG-003 Single Snapshot Consistency

每个 request 的 candidates、Evidence、Citation、trace `snapshotId/sourceCommitSha` 必须一致；并发 activation 场景也不能混合两个 Snapshot。

## VER-RET-002 Exact Engineering Recall

使用 CLI、路径、TypeScript symbol、错误串、测试名等 case，检查 lexical branch 能保留 exact signal，Hybrid 召回 expected evidence；对比 vector-only baseline。

## VER-CIT-001 Immutable Citation Correctness

对 selected Evidence 校验 `commit + path + lines`，构建 GitHub fixed-commit URL，并抽样比对目标行内容/hash。禁止使用移动 `main` 作为最终 Source。

## VER-ROUTE-001 FAST / THINK Routing

简单事实、定位类问题应默认 FAST；多证据综合、架构比较、冲突诊断等已定义复杂 case 应命中 THINK。每个 decision 必须有 deterministic reason。

## VER-CTX-001 Evidence Priority

构造长会话历史 + 新项目问题，确认 Context Builder 优先保留当前 Evidence，先裁剪旧 history；不能因历史过长导致正确 Evidence 被挤出。

## VER-TRACE-001 Trace Durability

完成 request 后清理非 active 旧 Snapshot 的可清理索引数据，再确认历史 RagTrace 仍可复盘当时 selected Evidence source/content hash、实际 Context、模型/路由和最终 Answer。
