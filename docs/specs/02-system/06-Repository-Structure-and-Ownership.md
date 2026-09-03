# Repository Structure & Ownership｜仓库目录与模块归属

状态：FROZEN_V0_2026-09-03

## 1. 目标

仓库目录必须把已冻结的 SDD、DDD 与部署边界落实为可见 ownership，同时保持 V0 简洁。目录是当前设计的实现映射，不是不可变真理；真实实现证明需要调整时，必须先按 SDD 变更流程修订本规格。

## 2. 一级结构

```text
proflow-rag/
├── apps/
│   ├── api/                     # Mac 上的 NestJS + Fastify 可部署应用
│   └── site/                    # ChatGPT Sites 可部署站点源码
├── packages/
│   └── site-api-contract/       # Site 与 API 共享的 wire contract
├── database/                    # PostgreSQL schema/migration/index 资产
├── evals/                       # 数据集、benchmark、fixture、报告
├── scripts/                     # repo-owned 生命周期/运维入口
└── docs/specs/                  # SDD 权威规格
```

## 3. API 内部 ownership

`apps/api/src/contexts/` 只包含三个 Bounded Context：`knowledge-management`、`grounded-answering`、`quality-evaluation`。每个 Context 预留 `domain/`、`application/`、`contracts/`；Capability 必须归属于 owning Context，不在根级复制一个 `capabilities/` 运行时代码目录。

`apps/api/src/infrastructure/` 预留 PostgreSQL、Model Gateway、Git、进程内事件、配置/时钟等 Adapter；`delivery/http/` 预留 public/internal HTTP 适配。Infrastructure 实现 Port，不拥有核心业务规则。

## 4. 跨 Context import 规则

Context 对外最终只通过自己的公开入口暴露 Contract/Event/必要 DTO。实现完成后，其他 Context 不得深层 import 对方 `domain/`、`application/`、repository 或内部 service；架构 Gate 必须能够静态验证。

## 5. 公共 package 规则

V0 只预留 `packages/site-api-contract`。它只能承载 HTTP/SSE wire protocol、公开 ErrorCode、Source/Feedback payload 等跨部署单元协议，不得承载 Domain Aggregate、KnowledgeSnapshot、EvidenceSet、RagTrace repository entity 或万能 shared/common/utils。新增第二个 shared package 必须先说明独立 ownership 和复用边界。

## 6. 数据库 ownership

单一物理数据库 `proflow_rag` 下逻辑 schema 与 DDD ownership 对齐：`knowledge`、`answering`、`quality`、`system`。根 `database/` 的结构资产也按该 ownership 组织；共享物理 PostgreSQL 不代表 Context 可以跨 schema 随意写数据。

## 7. Eval 与 Script 边界

`evals/` 只保存评估数据资产和报告，Evaluation 业务代码属于 `quality-evaluation` Context。`scripts/` 只做 repo-owned 入口与编排，不重新实现 Domain/Application 业务逻辑。未来 launchd 也只能调用 repo script。

## 8. Site 边界

V0 只冻结 `apps/site/` 这个独立部署单元及其职责，不提前冻结内部 pages/components/hooks 结构；具体形态以 ChatGPT Sites 的真实工程能力为依据。Site 不持有 Backend Secret，不直接访问 PostgreSQL/iPhone。

## 9. 占位与演进

当前只创建目录占位，不生成 NestJS/Site/database 业务实现。后续按实现顺序逐层填充；若真实代码让某一目录边界变得不自然，应先判断是局部结构调整还是领域/契约变化，再决定是否修订本 Spec/ADR。

## 10. System Requirements

- `SYS-007`：两个可部署单元固定为 `apps/api` 与 `apps/site`，同属一个产品仓库。
- `SYS-008`：API 运行时代码以三个 Bounded Context 为一级业务 ownership，Capability 必须有明确 owner。
- `SYS-009`：Infrastructure 只实现 Port/Adapter；跨 Context 不得深层 import 或跨 ownership 写表。
- `SYS-010`：V0 唯一共享 package 为 `site-api-contract`，只共享 wire contract，不共享 Domain。
- `SYS-011`：数据库 schema/资产按 `knowledge/answering/quality/system` ownership 对齐。

## 11. 验收

占位阶段验证实际 Git tree 与本规格一致且没有业务实现文件；实现阶段通过架构静态检查、SQL ownership 审计和 package dependency 审计持续证明 `SYS-007~011`。
