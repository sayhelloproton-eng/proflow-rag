# SDD 治理总则

状态：FROZEN_V0_2026-09-03

## 1. 目标

SDD 是 ProFlow RAG 的项目治理主轴。Spec 不是实现后的说明文档，而是实现前的权威契约：产品边界、系统结构、领域语义、接口、失败策略和验收方法都必须先进入 Spec。

## 2. 四类设计资产

- **Product/System Spec**：回答为什么做、系统如何成立、边界在哪里。
- **DDD Spec**：回答谁拥有事实、对象如何变化、Bounded Context 如何协作。
- **Capability/Contract/Runtime Spec**：回答 RAG 能力怎样运行、外部契约怎样稳定、真实设备怎样承载。
- **Verification Spec**：回答如何证明需求、设计和实现之间没有断链。

## 3. 权威关系

当聊天讨论、README、代码注释和 Spec 冲突时，已冻结且未被后续 ADR/Amendment 替代的 Spec 为设计权威。真实运行事实可以证明 Spec 错误，但不能被代码偷偷改写；必须先修 Spec，再接受新的实现。

## 4. SDD 不等于 Big Design Up Front

V0 只冻结已经有足够证据的边界、不变量和契约。模型 artifact、Top-K、token budget、timeout、rate limit、同步周期等实验参数保持可调。禁止为了“完整”预测未来所有能力。

## 5. 与 DDD 的关系

DDD 不与 SDD 竞争。SDD 管设计生命周期；DDD 管核心业务语义。DDD 的 Context Map、Aggregate、Value Object、Domain Event 和 Port 都是 Spec 的一部分。

## 6. 与测试的关系

项目暂不以 TDD 驱动。测试仍然必须存在，但 Test 不替代 Spec。RAG 的关键验收以 Retrieval/Rerank/Grounding/Source/Latency/Failure Eval 为主，而不是单测覆盖率。

## 7. 实现学习与面试沉淀职责

ProFlow RAG 的实现过程同时承担学习与求职证据沉淀。独立实战档案位于 `ai-agent-platform/docs/learning/proflow-rag-engineering-practice/`；它不替代本仓库 Spec，但属于阶段闭环产物。

每个实现阶段至少记录：阶段目标与原始假设、设计取舍、实际实现过程、真实问题与排查根因、修复或设计调整、Verification/Eval 数据、阶段结论，以及可用于面试的工程事实和 Git 证据。不得只记录最终成功方案，也不得把未验证猜测包装成项目经历。

一个阶段只有在“实现/验证证据”和“对应实战记录”都更新后才视为学习闭环。真实实现若改变设计，仍必须先按本仓库 SDD Amendment 流程修 Spec；学习文档只负责记录过程和复盘。

## 8. 禁止事项

- 先写实现再补核心 Spec。
- 为了代码方便绕过已冻结领域 ownership。
- 把 LangChain/LlamaIndex 等框架的默认行为当成业务规格。
- 把模型输出当成事实源。
- 用“测试通过”替代端到端 Grounding 验收。
