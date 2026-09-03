# Runtime｜PostgreSQL + pgvector

状态：REVIEWED_V0_2026-09-03

## Deployment

Mac 本机原生 PostgreSQL，不使用 Docker。数据库名固定 `proflow_rag`，启用 pgvector extension。NestJS 通过 `pg` 直连，明确 **无 ORM**。

## Namespace

逻辑 ownership 使用 schema 隔离：`knowledge / answering / quality / system`。Migration SQL 进入 Git；data directory 和运行数据不进入仓库。

## Indexing

Knowledge schema 同时维护 lexical 与 vector retrieval data。FTS/trigram/pgvector 索引的最终类型和参数由实际 corpus size、CJK/exact recall 与 latency benchmark 决定。

## Connection

连接池必须有明确上限；公共请求不能创建无界连接。Migration 使用独立脚本/事务并留下 schema version。

## Backup/Recovery

V0 至少保证 schema 可从 Git 重建，Knowledge 可从 ProFlow commit 重新构建；Trace/Feedback 是不可从源代码重建的运营数据，应在稳定运行前定义轻量备份策略。
