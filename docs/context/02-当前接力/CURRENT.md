# CURRENT｜ProFlow RAG 当前接力

> 更新时间：2026-09-04。这里是下一 Chat 的唯一滚动执行入口；旧 handoff 与审计只进入 `90-历史记录`。

## CURRENT_STAGE

```text
SDD_ARCHITECTURE = FROZEN
DDD_CONTEXT_MAP = FROZEN
REPOSITORY_OWNERSHIP = FROZEN
CONTEXT_CONTINUITY = FROZEN
P0_IMPLEMENTATION_BASELINE = a09f9e1
P0_MECHANICAL_GATE = PASS
P0_USER_REVIEW = PASS
P0_FINAL_ACCEPTANCE = PASS
P1_IMPLEMENTATION = NOT_STARTED
CURRENT_EXECUTION_GATE = P1_SOURCE_AUTHORITY_AND_CORPUS
V0_RELEASE = NO
```

## FINAL_GOAL

以真实 ProFlow 公开源码构建一个可追溯、可评估、由本地 Mac + PostgreSQL/pgvector + iPhone 模型运行的公开 RAG，并通过 ChatGPT Sites 交付；实现过程同时形成系统化学习和面试工程证据。

## CURRENT_AUTHORITY_SNAPSHOT

```text
repo = /Users/agent/Desktop/proton-workspace/repos/proflow-rag
branch = main
HEAD = 接手时必须 git rev-parse HEAD 机械读取
repository_layout_baseline = 115e7c5
context_continuity_baseline = 7ded602
p0_implementation_baseline = a09f9e1
p0_user_acceptance = PASS（2026-09-04，经实现讲解与讨论后用户确认结项）
premature_p0_closeout_commit = 696482b（保留为流程纠偏历史，不作为验收依据）
practice_repo = /Users/agent/Desktop/proton-workspace/repos/ai-agent-platform
source_of_public_knowledge = ProFlow GitHub main @ immutable commit（P1 开始建立）
```

## LAST_COMPLETED

- P0 实现基线 `a09f9e1` 已通过 architecture/typecheck/build/config smoke/health smoke，并在用户完成学习讨论后于 2026-09-04 正式验收。
- 用户已理解并确认：Fastify 是 HTTP 服务运行层而非网关；`site-api-contract` 是 Site/API 之间极细的 wire contract 包；Architecture Gate 只守部署、领域、共享契约和数据 ownership 等“承重墙”，不锁死普通内部重构。
- P0 没有实现任何 RAG 业务；当前第一次进入 Knowledge Management。
- `696482b` 的提前 closeout 保留为流程教训；后续必须遵守“候选 → 验证 → 讲解/讨论 → 用户确认 → closeout”。

## CURRENT_BLOCKER

`NONE`。P0 已正式结项，P1 可以开始。

## NEXT_ACTION

1. 先讲清 `main`、commit、RepositorySnapshot、KnowledgeSnapshot 的区别。
2. 读取 Knowledge Management / Source Ingestion / Full Rebuild / One Corpus 的 owning Spec。
3. P1-A 只实现 `remote main → immutable commit → RepositorySnapshot`，不提前进入 Corpus/Chunk/Embedding。
4. 形成实现候选并跑机械验证后停下，向用户解释代码、问题、取舍和证据；未经用户确认不 closeout P1-A。

## DO_NOT_REPEAT

- 不重开已正式验收的 P0，除非出现新的可复现 regression。
- 不把本地 ProFlow workspace 当公开 RAG source authority。
- 不直接从“眼前目录”开始 Chunk；必须先绑定 immutable commit。
- 不提前接 PostgreSQL、Embedding 或 LLM 来制造完整 RAG 观感。
- 不跳过用户确认门自动推进 P1 子阶段。

## REQUIRED_CONTEXT

1. `docs/specs/03-domain/knowledge-management/DOMAIN-SPEC.md`
2. `docs/specs/03-domain/knowledge-management/DOMAIN-MODEL.md`
3. `docs/specs/04-capabilities/source-ingestion/SPEC.md`
4. `docs/specs/08-decisions/ADR-005-Full-Rebuild-Snapshot.md`
5. `docs/specs/08-decisions/ADR-009-One-Corpus-ProFlow-main.md`
6. `docs/specs/07-verification/06-Architecture-and-Security-Audit.md`
7. `docs/context/03-执行知识库/流程/P1-Knowledge-Management.md`
8. `/Users/agent/Desktop/proton-workspace/repos/ai-agent-platform/docs/learning/proflow-rag-engineering-practice/02_P1_Knowledge_Management知识构建.md`
