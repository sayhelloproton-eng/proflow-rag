# CURRENT｜ProFlow RAG 当前接力

> 更新时间：2026-09-04。这里是下一 Chat 的唯一滚动执行入口；旧 handoff 与审计只进入 `90-历史记录`。

## CURRENT_STAGE

```text
SDD_ARCHITECTURE = FROZEN
DDD_CONTEXT_MAP = FROZEN
REPOSITORY_OWNERSHIP = FROZEN
CONTEXT_CONTINUITY = FROZEN
P0_IMPLEMENTATION_CANDIDATE = READY
P0_MECHANICAL_GATE = PASS
P0_USER_REVIEW = PENDING
P0_FINAL_ACCEPTANCE = NOT_YET
P1_IMPLEMENTATION = NOT_STARTED
CURRENT_EXECUTION_GATE = P0_REVIEW_AND_ACCEPTANCE
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
p0_implementation_candidate = a09f9e1
premature_p0_closeout_commit = 696482b（仅记录已发生的文档推进，不代表用户验收）
practice_repo = /Users/agent/Desktop/proton-workspace/repos/ai-agent-platform
```

## LAST_COMPLETED

- `a09f9e1` 已实现 P0 工程候选：pnpm Workspace、NestJS 12 + Fastify 5 API、NodeNext/ESM TypeScript 基线、Runtime Config、公开 `/health`、`site-api-contract`、architecture/config/health gates。
- 在精确 `a09f9e1` 上机械执行 `pnpm verify:p0` 已通过：`ARCHITECTURE_GATE=PASS / typecheck=PASS / build=PASS / CONFIG_SMOKE=PASS / HEALTH_SMOKE=PASS`，无残留 API 进程。
- 实现过程暴露 TypeScript 7 module resolution、NestJS 12 ESM 边界与 Registry `ECONNRESET` 等真实问题，均已形成实现证据。
- 之后曾过早执行 `696482b` 文档 closeout 并把 CURRENT 推进 P1；用户明确指出：实现过程必须先沟通学习，确认后才能封板/更新阶段文档。因此该“P0 PASS → P1”推进不视为用户确认事实。

## CURRENT_BLOCKER

没有技术 blocker。当前唯一门禁是 `P0_USER_REVIEW=PENDING`：先把 P0 做了什么、为什么这样做、问题与取舍讲清楚，完成讨论和用户确认。

## NEXT_ACTION

1. 停止 P1 实现，不因 `696482b` 的旧文档状态继续向前。
2. 围绕 `a09f9e1` 与用户继续讨论 P0：pnpm Workspace、Nest/Fastify、ESM/NodeNext、Runtime Config、`site-api-contract`、Architecture Gate、Config/Health Smoke 各自解决什么问题。
3. 对用户提出的质疑逐项解释；必要时只修改 P0 实现候选并重新跑 `pnpm verify:p0`，但不提前封板。
4. 只有用户明确确认“P0 可以封板/进入 P1”后，才更新正式阶段状态、Verification closeout、实战档案和 P1 CURRENT/Runbook。
5. 用户确认后，再从 Knowledge Management 的 Source Authority 开始 P1 教学与实现。

## DO_NOT_REPEAT

- 不把机械 Gate PASS 自动等价为用户已经理解/验收阶段。
- 不在实现后直接后台执行 `更新 CURRENT → 写实战档案 → 标 PASS → 切下一阶段`。
- 不把 `696482b` 作为 P0 用户验收证据；它只是一次过早 closeout 的历史事实。
- 不开始 P1 Source/Chunk/Embedding/PostgreSQL/LLM 实现，直到用户确认 P0。
- 不长时间后台写完关键能力后只汇报结果；实现过程必须是教学过程。
- 不漏掉真实失败、取舍与问题，但正式沉淀应发生在讨论形成结论之后。

## REQUIRED_CONTEXT

1. `docs/context/01-长期规则/04-执行纪律与工具规则.md`
2. `docs/context/03-执行知识库/基础动作/Stage-Closeout-and-Writeback.md`
3. `docs/specs/02-system/06-Repository-Structure-and-Ownership.md`
4. `docs/specs/08-decisions/ADR-001-NestJS-Fastify.md`
5. `docs/specs/08-decisions/ADR-011-Repository-Layout-and-Ownership.md`
6. commit `a09f9e1` 的 P0 实现代码与 `pnpm verify:p0` 机械结果
7. `/Users/agent/Desktop/proton-workspace/repos/ai-agent-platform/docs/learning/proflow-rag-engineering-practice/01_P0_工程与SDD执行骨架.md`（仅作为已记录材料，不代表用户已确认其中结论）
