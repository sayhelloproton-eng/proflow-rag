# Contract｜Database Ownership

状态：FROZEN_V0_2026-09-03

## Physical Database

V0 使用单一 PostgreSQL database：`proflow_rag`，启用 pgvector，NestJS 使用 `pg` + raw SQL，无 ORM。

## Logical Ownership

V0 PostgreSQL schema 必须体现 ownership：

- `knowledge`：snapshot/document/chunk/index/build run。
- `answering`：conversation/turn 及必要请求状态。
- `quality`：trace/feedback/eval dataset/run/result。
- `system`：migration/config bookkeeping。

具体表名与索引仍在数据库实现阶段逐步确定，但 schema ownership 已冻结；调整表名不等于改变领域边界。

## Cross-context Rule

一个 Context 可以通过明确 read contract 使用对方数据，但不能在自己的 repository 中直接 UPDATE 对方 ownership 表。复杂跨域 transaction 应优先重新审视边界，而不是偷偷扩大 SQL 权限。

## Migration

Git 只保存 schema/migration/index definition/setup script；真实 PostgreSQL data/vector/trace 不提交仓库。
