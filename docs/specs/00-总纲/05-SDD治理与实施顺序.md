# ProFlow RAG｜SDD 治理与实施顺序

状态：FROZEN_V0_2026-09-03

## 1. Spec 状态
- `DRAFT_REVIEW`：内容可调整，禁止以其为依据大规模实现。
- `FROZEN_V0`：V0 边界、契约与不变量已审计通过，实现必须遵守。
- `AMENDED_V0`：实现或真实实验发现设计问题后，先修 Spec 并记录原因，再继续实现。

## 2. 什么必须先改 Spec
以下变化属于设计变化：增加/删除一级领域；改变知识权威来源；改变公网/内网安全边界；改变主要数据所有权；改变公共 API 契约；绕过 Reranker/Source Grounding 等已冻结 Pipeline 阶段；引入新的外部数据库或搜索服务。

## 3. 什么可以通过 Eval 调参
Top-N/Top-K、RRF 参数、向量维度、具体 Embedding/Reranker artifact、Context soft budget、timeout、rate limit、同步周期等只要不改变领域边界与公共契约，可以通过实验更新参数记录，不需要重新设计系统。

## 4. 实施顺序
1. 完成所有 DDD/SDD Spec 的中文重写与交叉审计。
2. 冻结 Domain Map 与领域公开契约。
3. 再讨论并冻结代码仓库目录和模块 ownership；目录应映射领域，不按技术组件随意平铺。
4. 建立 NestJS/Fastify 最小骨架、配置和 PostgreSQL 连接。
5. 先完成 Knowledge Domain：Source Sync → Corpus → Parse/Chunk → Embed → Snapshot。
6. 再完成 Retrieval Domain：Hybrid → RRF → Rerank → EvidenceSet。
7. 再完成 Conversation：多轮 → Context → FAST/THINK → Streaming → Sources。
8. 同步接入 Evaluation Trace/Eval 与 Delivery Site/API。
9. 用真实 ProFlow 问题与手机延迟数据调参，最后再决定同步周期、上下文上限等运行参数。

## 5. 测试策略
项目暂不采用 TDD 驱动。实现仍必须有目标明确的单元/集成测试，但验收以真实链路、RAG Eval、Grounding、Source correctness、失败降级和延迟指标为主。测试文件不是产品规格，不能反向替代 Domain Spec。
