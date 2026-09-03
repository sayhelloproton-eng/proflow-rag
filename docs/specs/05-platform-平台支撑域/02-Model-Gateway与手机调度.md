# Platform｜Model Gateway 与手机调度 Spec

状态：FROZEN_V0_2026-09-03

## 1. 目的
所有 iPhone 模型调用统一通过 Model Gateway。Knowledge/Conversation/Retrieval 不允许直接 `fetch(http://192.168...)`，从而把模型 Provider、网络、超时、排队和能力差异收口。

## 2. Capability Contract
至少提供：`embedDocuments`、`embedQuery`、`rerank`、`generateFast`、`generateThink`、`health/capabilities`。具体 HTTP endpoint 可兼容 OpenAI 风格，但领域只依赖上述能力语义。

## 3. 单设备调度
当前 iPhone 被视为单个受限推理设备，初始 `max_inference_concurrency=1`。在线优先级：Generation/Query Embedding/Rerank 高于 full rebuild 的 Document Embedding。是否能不同模型同时驻留、模型切换成本多大，由真实服务测量决定。

## 4. 队列
每个请求记录 queue wait；后台 batch 可以在有在线请求时暂停/分批让路。公网流量不能直接一请求对应一个并行手机推理，否则会把手机作为无界并发服务器使用。

## 5. Timeout / Retry / Circuit Breaker
每类能力独立 timeout。幂等的 query embedding/rerank 在尚未产生外部副作用时可有限 retry；generation 一旦已向上游发送 token，禁止自动从头重试。连续失败后进入短时 circuit open，快速向上游返回明确模型不可用。

## 6. 模型身份
Trace/Snapshot 保存 model id/revision/quantization 或服务暴露的稳定 identity。Embedding/Reranker 与 Generation 是不同职责，不因都在手机就抽象成一个“Qwen model”。

## 7. FAST/THINK
`generateFast` / `generateThink` 暴露不同 mode contract；Conversation 负责 RoutingDecision，Gateway 不自行决定业务复杂度，只负责按 mode 调用正确参数/endpoint。

## 8. 验收
模拟手机离线、超时、慢启动和队列积压；在线 chat 在 rebuild 中仍有优先权；并发保护确实为 1；模型 identity 可在 trace 复现；已输出 token 的 stream 不发生自动 replay。
