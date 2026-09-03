# Conversation｜多轮上下文与 Query Rewrite Spec

状态：FROZEN_V0_2026-09-03

## 1. 多轮目标
用户可以自然追问“那它和 Harness 什么关系？”这类依赖前文的问题，但系统不把整段历史无上限塞进每次 Prompt。

## 2. 会话标识
每个请求携带匿名 `visitor_id`、`conversation_id`、`request_id`。Conversation 只关心 conversation 内有序 Turn，不把 visitor 当成登录身份或长期画像。

## 3. Bounded History
只读取为当前指代、上下文消歧和连续任务必要的最近若干 Turn，并受 token soft budget 限制。更早 history 是第一优先淘汰项。

## 4. Standalone Query
Rewrite 的结果必须能独立表达本轮检索意图，同时保留用户原始 exact terms：代码 symbol、路径、CLI、error string、版本号等不能因为语言改写而消失。

## 5. Rewrite 实现策略
V0 优先简单、确定、低延迟策略。若需要模型辅助，也必须计入模型调度与 TTFT，并证明收益；不能为了 Query Rewrite 再无条件调用一次大模型，使每个简单问题都多一次推理。

## 6. 上下文极限
硬上限来自当前 Qwen 3.6 4B 服务真实配置；产品自身设置更保守的软预算。FAST/THINK 可有不同预算，但具体 token 数必须由手机延迟、内存和质量实测后冻结。

## 7. 用户提示
当剩余可用会话上下文明显不足、继续聊天可能影响质量时，Site 应提示“当前会话较长，建议新建会话”，而不是静默截断到用户完全不知情。

## 8. 验收
覆盖代词指代、连续架构讨论、从概念转源码、从源码追问测试等多轮案例；Rewrite 后 exact identifier 不丢；长会话下 RAG Evidence 仍优先保留。
