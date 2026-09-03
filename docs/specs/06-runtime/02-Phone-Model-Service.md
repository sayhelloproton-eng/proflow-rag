# Runtime｜iPhone Model Service

状态：REVIEWED_V0_2026-09-03

## Role

iPhone 是 ProFlow RAG 的专用推理设备，提供 Generation、Embedding、Rerank。当前生成基线是 Qwen 3.6 4B；Embedding/Reranker 使用专用小模型候选，最终 artifact 需真实 endpoint 测试。

## Network

手机只通过 LAN 对 Mac 可达，不公开到 Dev Tunnel/Internet。Backend 只通过 Model Gateway 访问。

## Resource Model

V0 视为一个共享、受限 inference device；初始 inference concurrency=1。不能假设不同模型可以同时常驻/并行。在线请求优先级高于 offline rebuild。

## Required Measurements

- model load/switch cost；
- query embedding latency；
- rerank latency vs candidate count；
- FAST/THINK TTFT 与 tokens/s；
- context size 对延迟/内存影响；
- 连续请求稳定性；
- 模型切换是否导致 409/资源冲突等真实行为。

## Failure

手机在线探测失败应快速失败/熔断，不让每个公共请求都等待长超时。恢复后 Gateway 自动重新健康探测。
