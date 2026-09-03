# DDD Domain Map

状态：FROZEN_V0_2026-09-03

ProFlow RAG V0 有三个真正的 Bounded Context。Embedding、Retrieval、Rerank、Context、Database、Model Gateway 等不是独立业务领域；它们分别是领域内部 Capability 或 Infrastructure Adapter。

## 1. Knowledge Management｜知识管理（核心域）

使命：把 ProFlow `main` 的一个确定 commit 变成可信、可检索、可激活和可回滚的 `KnowledgeSnapshot`。

拥有：RepositorySnapshot、CorpusDocument、Chunk、EmbeddingProfile、KnowledgeSnapshot、IngestionRun。

## 2. Grounded Answering｜有依据问答（核心域）

使命：针对匿名用户问题，在一个确定 KnowledgeSnapshot 上检索 Evidence，并生成可引用、可流式、可解释路由的回答。

拥有：Conversation、Turn、Question、RetrievalQuery、Candidate、EvidenceSet、RoutingDecision、ContextPlan、Answer、Citation。

## 3. Quality & Evaluation｜质量评估（支撑域）

使命：把 RAG 质量从主观感觉变成可复盘、可比较、可回归的数据事实。

拥有：RagTrace、Feedback、EvalCase、EvalDataset、EvalRun、MetricResult。

## 4. 外层

Delivery（HTTP/Site）、PostgreSQL、Model Gateway、Dev Tunnel、Scheduler 是 Adapter/Infrastructure，不作为 Bounded Context。
