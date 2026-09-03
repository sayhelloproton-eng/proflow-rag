# Capability / Contract Spec 模板

状态：FROZEN_V0_2026-09-03

正式 Capability Spec 至少回答以下问题：

1. **Purpose**：为什么存在，解决哪条需求。
2. **Scope / Non-goals**：负责什么、明确不负责什么。
3. **Inputs / Outputs**：稳定输入输出及重要字段语义。
4. **Ownership**：谁拥有状态，谁只能读取。
5. **Main Flow**：正常路径的阶段与顺序。
6. **Invariants**：任何实现都不能破坏的规则。
7. **Failure / Degradation**：失败、超时、部分失败如何处理。
8. **Observability**：必须记录哪些 trace/metric。
9. **Security / Privacy**：是否跨信任边界，哪些数据不能暴露。
10. **Tunable Parameters**：哪些参数可由 Eval 调整。
11. **Acceptance**：如何证明功能正确而不是“能跑”。
12. **Dependencies**：依赖哪些 Spec、Contract、Port。

Domain Spec 额外需要 Aggregate/Entity/Value Object、状态机、Domain Event 和 Context Map 关系。ADR 额外需要 Context、Decision、Alternatives、Consequences、Revisit Trigger。
