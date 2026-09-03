# Knowledge｜Embedding 与检索数据构建 Spec

状态：FROZEN_V0_2026-09-03

## 1. 角色
Embedding 把 Chunk 变成语义向量；它不生成答案，也不做最终相关性重排。Lexical 检索数据与向量检索数据都属于 Knowledge Snapshot 的可查询派生数据。

## 2. 模型运行位置
V0 Embedding 通过 Platform 的 Model Gateway 调用 iPhone 模型服务，不接收费云 API 作为必需链路。候选模型优先选择小型 Qwen Embedding 模型，但具体 artifact、量化格式、最大 batch 与向量维度必须经过手机端 endpoint 实测后记录为 Snapshot 配置。

## 3. Snapshot 绑定
每个 Snapshot 保存 `embedding_model_id`、维度、归一化方式、instruction/template、model revision 与相关参数。在线 Query Embedding 必须使用 Active Snapshot 绑定的兼容配置。

## 4. 批处理与优先级
Full rebuild 可以批量 Embedding，但必须受 Model Gateway 调度。在线聊天的 Query Embedding、Reranker、Generation 优先级高于离线 batch，离线任务应可暂停/让步，避免网站因为 rebuild 变得不可用。

## 5. PostgreSQL 派生数据
- 向量写入 pgvector 类型列或与 Chunk 一一关联的 embedding 表。
- Lexical 检索建立 PostgreSQL-native 可查询字段/索引。
- 向量 ANN 索引（如 HNSW）不是第一天必须启用；先用真实数据量和延迟证明是否需要。
- 若采用 pg_trgm 等 PostgreSQL 扩展增强工程标识符/CJK recall，必须仍保持单 PostgreSQL 架构。

## 6. 失败规则
任何 Chunk Embedding 失败都不能被静默写成零向量。构建可以按明确策略失败或标记不完整，但“不完整 Snapshot 被激活”为禁止状态。

## 7. 变更规则
改变 Embedding 模型、向量维度或会改变向量空间的模板/归一化配置，必须创建新 Snapshot 并 full rebuild，不能原地混写旧向量。

## 8. 验收
测量全仓库 chunk 数、batch 吞吐、总 rebuild 时间、单 Query Embedding 延迟、手机资源竞争和语义召回质量；只有 endpoint 能稳定返回维度一致的向量且 Query/Document 空间一致时，Embedding 选择才可标记为已验证。
