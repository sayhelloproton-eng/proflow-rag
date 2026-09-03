# Platform｜PostgreSQL 与 pgvector Spec

状态：FROZEN_V0_2026-09-03

## 1. 部署方式
Mac 本机原生安装 PostgreSQL，不以 Docker Compose 作为主运行方式。数据库名固定为 `proflow_rag`，与其他本机项目隔离。

## 2. pgvector 的角色
pgvector 是 PostgreSQL Extension，提供 `vector` 数据类型、距离运算与可选 ANN index。NestJS 仍然只连接 PostgreSQL，不存在独立“pgvector 服务”。

## 3. Node 访问层
使用 `pg` / `Pool` 直接 SQL，V0 不引入 ORM；明确不使用 Prisma、TypeORM、Drizzle 等 ORM。项目仍需封装 Database Port/Repository，避免业务代码到处拼连接信息与事务。

## 4. Schema 命名空间
- `rag`：documents、chunks、embeddings、lexical/vector retrieval 数据。
- `ingestion`：snapshots、runs、active pointer、failure/state。
- `app`：visitors、conversations、messages、feedback、rag traces。
- `system`：migration、runtime/settings 等项目级元数据。

## 5. 事务边界
Snapshot 激活、feedback 幂等更新等需要明确事务。在线查询只读取 active snapshot。Migration 必须可审计并进入 Git，不把真实 PostgreSQL data dir、vector 数据或聊天记录提交仓库。

## 6. 索引策略
先用实际数据量验证 exact vector search 与 PostgreSQL lexical 查询延迟；HNSW/IVFFlat、GIN、pg_trgm 等属于数据库内可选索引能力，按 Eval/Explain Analyze 结果增加，不为“看起来生产化”提前堆索引。

## 7. 备份/恢复
V0 的核心知识索引可从 GitHub 源重新构建；不可重建的 app trace/feedback 才是真正需要备份的数据。上线前定义最小备份脚本与恢复 smoke，不需要引入外部托管数据库。

## 8. 验收
本机 PostgreSQL + pgvector 可通过项目脚本检查；四个 schema 隔离清楚；NestJS 连接池可恢复；向量维度不一致写入失败显式；Active Snapshot 原子切换验证通过。
