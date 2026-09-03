# Verification｜Architecture & Security Audit

状态：REVIEWED_V0_2026-09-03

## VER-ARCH-001 Context Boundary

静态检查/Code Review 证明 Delivery 不直接访问 Knowledge/Quality 数据库表或 iPhone；Context 间只通过已定义 Contract/Event/Port 协作。禁止跨 Context 内部 service import 和万能 common service 绕边界。

## VER-SEC-001 Browser Secret Exposure

构建/运行 Site 后检查 browser bundle、HTML、local storage、browser request headers：不得出现 `PROFLOW_RAG_API_KEY`。Bearer 只存在 Site Server → Backend 请求。

## VER-SEC-002 Public Port Exposure

从公网验证只可访问 Dev Tunnel 映射的 Backend HTTP；PostgreSQL 与 iPhone inference endpoint 不可从公网访问。Public `/health` 不返回 LAN/database/tunnel secret 细节。

## VER-SEC-003 Trace Privacy

抽样 RagTrace：允许 question、Evidence、Context payload、answer、route、timing；禁止 private chain-of-thought、raw credential、长期 raw IP、secret headers。

## VER-KM-001 Snapshot Authority

检查 active snapshot 的 `sourceCommitSha` 唯一，所有 document/chunk source coordinate commit 与其一致。

## VER-KM-002 Embedding Compatibility

构造不同 dimension/profile 的 query vector，系统必须拒绝跨 profile vector search；正常 query embedding 必须读取 active descriptor 的 profile。

## VER-KM-003 Atomic Activation

在并发问答期间激活 candidate snapshot：已有 request 固定旧 snapshot，新 request 使用新 snapshot，不出现混合 Evidence；失败 transaction 保持旧 active。

## VER-TRACE-002 Build Auditability

注入 fetch/parse/embed/index validation failure，IngestionRun 能定位 stage、commit、profile、error code，不记录 secret。

## VER-RUN-001 Phone Capability

在真实 LAN iPhone 上验证 embed/rerank/generateFast/generateThink contract，记录 profile 与 latency。

## VER-RUN-003 Interactive Priority

运行 offline embedding batch 时发公共问题，确认 scheduler 让出设备并优先完成 query embedding/rerank/generation；不要求并行推理。

## VER-QE-001 Feedback Semantics

Feedback 只改变质量数据，不自动修改 expected answer、模型参数或原 Answer。

## VER-QE-002 Regression Promotion

把真实 👎 转成 EvalCase 前要求显式复核 expected Evidence/behavior，并记录 provenance。

## VER-ARCH-004 Deployable Layout

检查 Git tree：产品源码的两个部署单元只能是 `apps/api` 与 `apps/site`；二者同仓版本化。占位阶段不得出现未经 Spec 的第三个 `apps/*`。

## VER-ARCH-005 Context & Capability Ownership

静态依赖检查证明 API 业务能力归属 `knowledge-management`、`grounded-answering`、`quality-evaluation` 三个 Context；不存在根级业务 `capabilities/` 逃逸 ownership。跨 Context 仅使用公开 Contract/Event，禁止深层 import。

## VER-ARCH-006 Shared Package Boundary

V0 检查 `packages/` 只存在 `site-api-contract`；其导出只属于 HTTP/SSE wire protocol 与公开 payload/error，不导出 Aggregate、Repository Entity、EvidenceSet、KnowledgeSnapshot 或 RagTrace 内部模型。

## VER-ARCH-007 Database Ownership Layout

检查 migration/schema SQL 与 repository：数据库逻辑 schema/资产按 `knowledge`、`answering`、`quality`、`system` 划分；Context 不直接写对方 ownership schema。
