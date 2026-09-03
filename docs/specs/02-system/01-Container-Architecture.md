# Container Architecture

状态：FROZEN_V0_2026-09-03

## 1. V0 Containers

### ChatGPT Site
公开 UI 与 Site Server 代理。负责展示、匿名 visitor cookie、SSE 消费、Source/反馈交互；不直接访问数据库或手机。

### NestJS RAG Application
单体后端，Fastify 作为 HTTP engine。内部使用模块化边界承载三个 Bounded Context、Capabilities、Adapters 与控制路径；V0 不拆微服务。

### PostgreSQL
数据库 `proflow_rag`，启用 pgvector。保存 Knowledge Snapshot/Chunk/索引、Conversation/Trace/Feedback/Eval 和系统迁移数据。逻辑 ownership 必须隔离。

### iPhone Model Service
提供 Embedding、Reranker、FAST Generation、THINK Generation 能力。模型 artifact 可迭代，但通过 Model Gateway Contract 隔离。

### Git Working Snapshot
Knowledge rebuild 使用的临时 exact-commit 工作目录，不作为长期权威数据库。

## 2. Deployment 关系

Site 在 ChatGPT Sites；NestJS/PostgreSQL 在旧 Mac；iPhone 在 LAN；Dev Tunnel 只公开 NestJS 指定端口。
