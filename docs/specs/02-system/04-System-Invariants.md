# System Invariants

状态：FROZEN_V0_2026-09-03

以下规则跨越多个 Spec，任何实现都不得破坏：

1. 一个正式 Answer 只能使用一个 Knowledge Snapshot 的 Evidence。
2. Source 必须绑定不可变 commit，而不是移动的 `main`。
3. Active Snapshot 切换必须原子；候选构建失败不影响在线旧版本。
4. Query vector 必须与 Active Snapshot 的 Embedding Profile 相容。
5. Hybrid Retrieval 与 Reranker 是 V0 正式链路，降级必须可观察。
6. No-evidence 不得被模型常识伪装成 ProFlow 事实。
7. Streaming 一旦向用户发送生成 token，不自动重放整次生成。
8. Evaluation 失败不应把已成功回答伪造成失败，但必须暴露运维问题。
9. 在线模型工作优先于离线 rebuild；默认设备推理并发为 1，直到实测证明可提升。
10. 核心 RAG Pipeline 显式实现；不得由黑盒框架决定关键检索、Context 或 Grounding 语义。
11. 公共 Delivery 不直接读写核心数据库表，不直接调用 iPhone。
12. 数据库、模型和 Tunnel 的具体地址是 Infrastructure 配置，不进入 Domain Model。
