# CURRENT｜ProFlow RAG 当前接力

> 更新时间：2026-09-04。这里是下一 Chat 的唯一滚动执行入口；旧 handoff 与审计只进入 `90-历史记录`。

## CURRENT_STAGE

```text
SDD_ARCHITECTURE = FROZEN
DDD_CONTEXT_MAP = FROZEN
REPOSITORY_OWNERSHIP = FROZEN
CONTEXT_CONTINUITY = FROZEN
IMPLEMENTATION = NOT_STARTED
CURRENT_EXECUTION_GATE = P0_ENGINEERING_SKELETON
V0_RELEASE = NO
```

## FINAL_GOAL

以真实 ProFlow 公开源码构建一个可追溯、可评估、由本地 Mac + PostgreSQL/pgvector + iPhone 模型运行的公开 RAG，并通过 ChatGPT Sites 交付；实现过程同时形成系统化学习和面试工程证据。

## CURRENT_AUTHORITY_SNAPSHOT

```text
repo = /Users/agent/Desktop/proton-workspace/repos/proflow-rag
branch = main
HEAD = 接手时必须 git rev-parse HEAD 机械读取
last_completed_design_commit = bd74dbb
practice_repo = /Users/agent/Desktop/proton-workspace/repos/ai-agent-platform
source_of_public_knowledge = ProFlow GitHub main @ immutable commit（P1 实现后启用）
```

## LAST_COMPLETED

- 已建立公开 `proflow-rag` 仓库、中文 SDD 体系、DDD Context Map、Capability/Contract/Runtime/Verification/ADR 结构。
- 三个 Bounded Context 已冻结：Knowledge Management、Grounded Answering、Quality & Evaluation；跨 Context 只允许显式 Contract/Event/Port。
- Repository layout 与数据 ownership 已冻结并创建纯 `.gitkeep` 占位；尚未创建 NestJS、Site、SQL 或业务脚本实现。
- 独立实战档案已建立在 `ai-agent-platform/docs/learning/proflow-rag-engineering-practice/`。
- 公共上下文四层机制已建立，P0 开始前具备跨 Chat 连续接管入口。

## CURRENT_BLOCKER

`NONE`。当前不是排障阶段；下一动作是 P0 第一轮教学与最小工程骨架实现。

## NEXT_ACTION

1. 面向用户讲清 P0 第一实现单元：pnpm workspace + NestJS/Fastify 最小 API 为什么是后续 RAG 的承载边界，哪些内容本轮明确不实现。
2. 读取 P0 owning Spec/ADR/Repository ownership，确定最小文件集合与 Gate。
3. 小步创建基础工程骨架；先让 API build/typecheck/health smoke 成立。
4. 再建立唯一共享 `site-api-contract` 和 architecture boundary gate；不提前进入 Knowledge 业务逻辑。
5. P0 Round 结束更新 Verification Evidence、CURRENT 和实战档案，再决定是否进入 P1。

## DO_NOT_REPEAT

- 不重新讨论 SDD vs DDD；当前二者是互补关系。
- 不重开已冻结的三个 Bounded Context、Repository ownership 和单仓决策，除非真实实现产生新证据。
- 不提前实现 Retrieval/LLM/Site 业务功能来制造“看起来能跑”的 Demo。
- 不把待实测模型、Top-K、timeout、context budget 写成冻结数字。
- 不把聊天历史当项目真源，不默认全读 `90-历史记录`。
- 不漏掉 `ai-agent-platform` 实战档案写回。

## REQUIRED_CONTEXT

1. `docs/specs/README.md`
2. `docs/specs/00-sdd-governance/00-SDD治理.md`
3. `docs/specs/02-system/06-Repository-Structure-and-Ownership.md`
4. `docs/specs/08-decisions/ADR-001-NestJS-Fastify.md`
5. `docs/specs/08-decisions/ADR-011-Repository-Layout-and-Ownership.md`
6. `docs/context/03-执行知识库/流程/P0-工程骨架.md`
7. `/Users/agent/Desktop/proton-workspace/repos/ai-agent-platform/docs/learning/proflow-rag-engineering-practice/01_P0_工程与SDD执行骨架.md`
