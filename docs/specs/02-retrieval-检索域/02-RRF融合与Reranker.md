# Retrieval｜RRF 融合与 Reranker Spec

状态：FROZEN_V0_2026-09-03

## 1. RRF 的职责
Lexical rank 与 Vector similarity 量纲不同，因此 V0 采用 RRF（Reciprocal Rank Fusion，倒数排名融合）按“各路排名”融合，而不是把原始 score 做随意加权。

## 2. 去重
同一 `chunk_id` 被多路命中时合并为一个 Candidate，保留各分支 rank/score 与命中原因。Source 不同但内容高度重复的 Chunk 可在后续 Evidence Selection 做近重复抑制。

## 3. RRF 参数
RRF 常数与每路 Top-N 属于 Eval 可调参数，不是领域不变量。每次 trace 必须记录本轮实际参数，确保效果可复现。

## 4. Reranker 是必经学习阶段
V0 必须实际接入独立 Reranker 模型，而不是只预留接口。候选优先小型 Qwen Reranker，由 iPhone Model Gateway 提供；具体 artifact/量化与延迟需实测。

## 5. Reranker 输入与输出
输入为 user/standalone query + bounded fused candidates；输出为 candidate relevance order/score。Reranker 不负责生成答案、不改变 Chunk Source、不引入仓库外知识。

## 6. 失败降级
Reranker timeout、模型切换失败或响应无效时，在线请求可退化到 RRF order，并在 trace 标记 `rerank_degraded=true`。如果已生成部分流式答案后发生模型错误，不允许自动重放整个生成流程造成重复内容。

## 7. 设备调度
Reranker 与 Generation/Embedding 共用手机算力。Model Gateway 应限制 candidate 文本规模与并发；在线 Rerank 优先于离线 batch embedding。

## 8. 验收
同一 Eval 集比较 RRF-only 与 RRF+Reranker 的 Evidence rank、Recall@K/排序指标和额外 latency；虽然 Reranker 是学习必经环节，但若某次在线失败必须有可靠降级路径。
