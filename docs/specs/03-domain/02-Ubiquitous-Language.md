# Ubiquitous Language｜统一语言

状态：FROZEN_V0_2026-09-03

- **RepositorySnapshot**：ProFlow 一个不可变 Git commit 的本地输入视图。
- **KnowledgeSnapshot**：由一个 RepositorySnapshot 和固定构建配置形成的完整可检索知识版本。
- **Active Snapshot**：当前对正式问答可见的唯一 KnowledgeSnapshot。
- **EmbeddingProfile**：embedding 模型、维度、指令/归一化等构成的向量空间身份。
- **Chunk**：带源坐标、结构 metadata 和内容的最小检索单元。
- **Candidate**：某一路 recall/fusion/rerank 阶段的候选 Chunk。
- **Evidence**：已经满足 Grounded Answering 使用条件的候选证据。
- **EvidenceSet**：一次回答最终采用的 Evidence 集合及其 Snapshot/置信状态。
- **Grounded Answer**：明确由 EvidenceSet 支撑的项目回答。
- **Citation**：由系统从 Evidence source metadata 构造的不可变引用，不由 LLM 自由生成。
- **RagTrace**：一次 RAG 执行的可复盘事实，不包含模型私有思维链。
- **EvalCase**：可重复执行、具有期望 Evidence/行为的质量样本。
- **FAST / THINK**：同一生成能力的快速/推理路由模式，不等于两个业务领域。
- **No Evidence**：当前 Snapshot 无足够项目证据支撑事实回答的业务状态，不是模型异常。
