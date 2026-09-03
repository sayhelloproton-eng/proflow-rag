# ProFlow RAG｜SDD 规格入口

状态：FROZEN_V0_2026-09-03

本目录是 ProFlow RAG 的权威设计源。项目采用 **SDD（Spec-Driven Development）作为治理框架，DDD 作为核心业务建模方法，Capability Spec 描述 RAG 技术能力，Verification 负责证明实现符合规格**。

## 阅读顺序

1. `00-sdd-governance/`：先理解 Spec 如何产生、冻结、变更和验收。
2. `01-product/`：理解产品目标、用户场景、V0 范围和成功标准。
3. `02-system/`：理解系统边界、在线/离线/审计数据流与故障模型。
4. `03-domain/`：理解三个 Bounded Context、Context Map、统一语言与跨域契约。
5. `04-capabilities/`：理解 Source → Chunk → Embed → Retrieve → Rerank → Evidence → Generate → Cite → Eval 的完整 RAG 能力链。
6. `05-contracts/`：理解 HTTP、SSE、Model Gateway、数据库 ownership、错误和 Trace 的稳定契约。
7. `06-runtime/`：理解 Mac、PostgreSQL、iPhone、Dev Tunnel、调度与生命周期。
8. `07-verification/`：理解怎样证明系统真的正确、可靠、够快。
9. `08-decisions/`：查看重要架构裁决的理由、替代方案与重新评估条件。

## 设计主轴

```text
Requirement
   ↓
Product / System Spec
   ↓
DDD Domain Model + Context Map
   ↓
Capability / Contract / Runtime Spec
   ↓
Implementation
   ↓
Verification Evidence
   ↓
Spec Amendment（如果现实证明设计需要变化）
```

## 当前阶段

实现尚未开始。仓库目录与模块 ownership 已冻结并允许仅创建占位；下一门禁是按 SDD 顺序逐项实现基础工程与 Knowledge Management，真实实现若证明目录需要调整，先按变更流程修 Spec。
