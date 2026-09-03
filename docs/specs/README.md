# ProFlow RAG SDD 规格导航

状态：FROZEN_V0_2026-09-03

本目录采用 **DDD（领域驱动设计）确定边界 + SDD（规格驱动开发）定义行为** 的组织方式。DDD 回答“谁负责什么、领域之间如何协作”，SDD 回答“这个领域必须怎样工作、如何验收”。

## 阅读顺序
1. `00-总纲/00-产品总规格.md`：先理解产品目标与非目标。
2. `00-总纲/01-系统上下文.md`：理解公网 Site、Mac、PostgreSQL、iPhone 模型和 GitHub 的关系。
3. `00-总纲/02-领域地图.md`：理解六个边界以及它们之间的依赖方向。
4. `00-总纲/03-架构裁决.md`：查看已经冻结的关键技术与产品裁决。
5. 再按 Knowledge → Retrieval → Conversation → Evaluation → Platform → Delivery 阅读各领域规格。

## 领域划分
- `01-knowledge-知识构建域`：把 ProFlow `main` 的确定版本构造成可检索知识快照。
- `02-retrieval-检索域`：把问题转换成有来源、有排序、有置信依据的 EvidenceSet（证据集）。
- `03-conversation-会话问答域`：把用户问题与 EvidenceSet 组织成可流式、可引用、可多轮的回答。
- `04-evaluation-评估审计域`：记录 RAG Trace、用户反馈和 Eval，回答“效果到底怎么样、哪里坏了”。
- `05-platform-平台支撑域`：提供数据库、模型网关、安全、隧道、调度和运行时支撑。
- `06-delivery-交付界面`：HTTP API 与 ChatGPT Sites，只负责交付，不拥有核心 RAG 业务规则。

## SDD 规则
所有规格先处于 `DRAFT_REVIEW`。完成跨领域一致性审计后才能统一进入 `FROZEN_V0`。实现不得绕过规格做重大设计变更；确需改变边界、权威来源、公共契约或安全边界时，必须先修改拥有该决策的 Spec。
