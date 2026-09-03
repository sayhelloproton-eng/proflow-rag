# ProFlow RAG｜DDD + SDD 交叉审计与冻结

状态：PASS_FROZEN_V0_2026-09-03

## 1. 审计范围
审计覆盖 `00-总纲`、Knowledge、Retrieval、Conversation、Evaluation、Platform、Delivery 全部当前规格，检查 DDD ownership、领域依赖方向、已裁决事项覆盖、跨域契约、运行可行性、安全边界、失败降级、审计可追溯性和端到端验收场景。

## 2. 组织方式结论
旧版 `00~16` 平铺文件是技术流水线提纲，不足以作为正式 SDD；已从当前目录删除并保留在 Git 历史。新版由 DDD 决定一级责任边界，SDD 在领域内部定义可实现、可验收的行为与不变量。

当前边界：Knowledge（知识构建核心域）、Retrieval（检索核心域）、Conversation（会话问答核心域）、Evaluation（评估审计支撑域）、Platform（平台支撑域）、Delivery（交付接口上下文）。

## 3. 跨域契约审计
- Knowledge 发布唯一 Active Knowledge Snapshot，不知道 Chat/Visitor/Prompt。
- Retrieval 只读 Active Snapshot，输出正式 `EvidenceSet`，不控制 Snapshot 生命周期。
- Conversation 每轮重新 Retrieval，Evidence 优先于聊天历史，并拥有 FAST/THINK 与 Context 规则。
- Evaluation 观察 RAG 执行而不成为在线回答的强依赖，并保留旧 Snapshot 清理后的复盘证据。
- Platform 提供 DB/Model/Tunnel/调度能力，核心域不依赖 LAN/IP/launchd 等实现细节。
- Delivery 只做 HTTP/Site 适配，不直接 SQL、不直接访问手机模型。

## 4. 已冻结裁决覆盖
已确认：独立公开仓库、单 Corpus/Active Snapshot、只认 ProFlow 远程 `main`、本地 Native PostgreSQL + pgvector、schema 命名空间、`pg` 直连无 ORM、NestJS + Fastify、ChatGPT Sites + Microsoft Dev Tunnel、手机模型算力、Hybrid Search、RRF + 独立 Reranker、结构化 Doc/Code/Test Chunk、SSE、FAST-first/THINK 按需、上下文预算、匿名审计、极简 👍/👎、immutable GitHub Sources、full Snapshot rebuild/atomic activation、稳定后 launchd 调项目脚本、与 gptweb-mcp 生命周期隔离。

## 5. 实现前保留为证据驱动参数
具体 Embedding/Reranker artifact、向量维度、Top-N/Top-K、RRF 参数、Context soft budget、timeout、rate limit、手机模型切换策略、同步周期和是否启用 ANN index 均需真实手机/仓库 baseline 后确定。这些参数可调，但不得破坏已冻结领域边界或公共契约。

## 6. 学习项目约束
RAG 核心 pipeline 必须显式实现和可审计，不允许用 LangChain/LlamaIndex 等高层编排把 Parse/Chunk/Embed/Retrieve/Fuse/Rerank/Context/Generate/Eval 黑盒化。允许使用基础解析、tokenizer、数据库、模型客户端等库。

## 7. 质量 Gate
自动结构审计结果：`AUDIT_PROBLEMS=0`。33 份重构规格与导航全部通过关键裁决覆盖检查；另补 10 个跨域端到端验收场景。当前没有阻塞仓库目录设计讨论的 Spec 冲突。

## 8. 冻结规则
V0 冻结的是领域边界、数据 ownership、权威来源、公共/安全边界、Pipeline 必经阶段和公共契约。后续若实现发现这些设计需要改变，必须先把 owning Spec 更新为 amendment，再动代码。

## 9. 下一 Gate
讨论并冻结 **代码仓库目录与模块 ownership**。在此之前不创建 NestJS 应用骨架和业务代码目录。
