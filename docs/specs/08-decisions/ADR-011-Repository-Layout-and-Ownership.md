# ADR-011｜仓库目录以部署边界 + DDD ownership 组织

状态：ACCEPTED_2026-09-03

## Context
产品有 Mac API 与 ChatGPT Sites 两个独立部署单元，同时存在三个 Bounded Context、基础设施 Adapter、数据库 ownership、Eval 数据资产和 repo-owned 运维脚本。纯 `src/site` 平铺会隐藏部署边界，按 Embedding/Rerank 等技术组件平铺又会破坏 DDD ownership。

## Decision
采用 `apps/api` + `apps/site` 两个应用；API 内部先按 Bounded Context，再按 domain/application/contracts 与 infrastructure/delivery 组织。V0 仅允许一个共享 package：`site-api-contract`。数据库 schema/资产按 `knowledge/answering/quality/system` 对齐。先创建占位目录，按 SDD 顺序逐步实现。

## Consequences
目录直接反映部署边界和业务 ownership，Capability 有明确 owner，Site/API 不共享 Domain。代价是比单一 `src/` 多一层 `apps/`，但这层对应真实部署事实，不是形式主义 Monorepo。

## Evolution Rule
目录不是永远不可变。真实实现若证明某处边界不自然，先判断是否仅为局部结构调整；若涉及 ownership、跨 Context Contract、部署单元或共享包边界，则先修 Spec/ADR 再迁移。
