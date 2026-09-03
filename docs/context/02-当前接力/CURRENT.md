# CURRENT｜ProFlow RAG 当前接力

> 更新时间：2026-09-04。这里是下一 Chat 的唯一滚动执行入口；旧 handoff 与审计只进入 `90-历史记录`。

## CURRENT_STAGE

```text
SDD_ARCHITECTURE = FROZEN
DDD_CONTEXT_MAP = FROZEN
REPOSITORY_OWNERSHIP = FROZEN
CONTEXT_CONTINUITY = FROZEN
P0_ENGINEERING_SKELETON = PASS
IMPLEMENTATION = P0_BASELINE
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
p0_practice_baseline = 3381713
practice_repo = /Users/agent/Desktop/proton-workspace/repos/ai-agent-platform
source_of_public_knowledge = ProFlow GitHub main @ immutable commit（P1 开始实现）
```

## LAST_COMPLETED

- P0 已在 `a09f9e1` 建立 pnpm Workspace、NestJS 12 + Fastify 5 API、NodeNext/ESM TypeScript 基线、运行时 Config、公开 `/health`、唯一 `site-api-contract` 与 repo-owned architecture/config/health gates。
- `a09f9e1` 精确 HEAD 上重新执行 `pnpm verify:p0`：`ARCHITECTURE_GATE=PASS / typecheck=PASS / build=PASS / CONFIG_SMOKE=PASS / HEALTH_SMOKE=PASS`，执行后无残留 API 进程且工作树 clean。
- P0 真实暴露 TypeScript 7 移除旧 Node resolution、NestJS 12 ESM 边界、Registry ECONNRESET 三类工程事实；前两项通过 NodeNext/ESM 最小修复，网络抖动由 pnpm 正常重试后闭环。
- P0 没有连接 PostgreSQL、iPhone 模型，也没有实现 Source/Chunk/Embedding/Retrieval/Generation/Site 业务，阶段边界保持完整。

## CURRENT_BLOCKER

`NONE`。P0 已 PASS；当前进入 Knowledge Management 的第一实现单元。

## NEXT_ACTION

1. 先向用户解释为什么 Knowledge 构建必须从 `remote main → immutable commit → RepositorySnapshot` 开始，以及“源码目录”与“可重现知识输入”为什么不是同一个概念。
2. 读取 Knowledge Management Domain、Source Ingestion、One Corpus 与 Full Rebuild ADR，冻结 P1-A 最小输入/输出/失败条件。
3. P1-A 只实现远程 `main` authority resolve、exact commit identity 与可审计 RepositorySnapshot/manifest 起点；不提前写 Chunk/Embedding。
4. 用固定 commit 重放证明输入确定性，再进入 corpus include/exclude policy。
5. 每个 P1 子 Gate 都同步 Verification Evidence、CURRENT 和实战档案。

## DO_NOT_REPEAT

- 不重开 P0 工程骨架；只有 `pnpm verify:p0` 新 regression 才回修。
- 不重新讨论 SDD vs DDD、三个 Bounded Context 或 Repository ownership，除非真实实现出现冲突证据。
- 不把本地 ProFlow workspace 当公开 RAG source authority；只认远程 GitHub `main` 的确定 commit。
- 不直接从当前文件系统开始 Chunk，必须先形成 immutable source identity。
- 不提前接 PostgreSQL/Embedding/LLM 来制造“完整 RAG”观感。
- 不漏掉 `ai-agent-platform` 实战档案写回。

## REQUIRED_CONTEXT

1. `docs/specs/03-domain/knowledge-management/DOMAIN-SPEC.md`
2. `docs/specs/03-domain/knowledge-management/DOMAIN-MODEL.md`
3. `docs/specs/04-capabilities/source-ingestion/SPEC.md`
4. `docs/specs/08-decisions/ADR-005-Full-Rebuild-Snapshot.md`
5. `docs/specs/08-decisions/ADR-009-One-Corpus-ProFlow-main.md`
6. `docs/specs/07-verification/06-Architecture-and-Security-Audit.md`
7. `docs/context/03-执行知识库/流程/P1-Knowledge-Management.md`
8. `/Users/agent/Desktop/proton-workspace/repos/ai-agent-platform/docs/learning/proflow-rag-engineering-practice/02_P1_Knowledge_Management知识构建.md`
