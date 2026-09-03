# Rerank Spec

Status: DRAFT_FOR_FREEZE

## Role
Reranking is a required V0 learning and production stage between hybrid retrieval and context construction.

## Runtime
- Reranker compute runs on the iPhone through Model Gateway.
- Initial candidate model: Qwen3-Reranker-0.6B, subject to endpoint and latency validation.
- The reranker receives the user query plus fused candidate chunks and returns relevance ordering/scores.

## Behavior
- Reranking must operate on a bounded candidate set.
- Timeout/failure degrades to RRF order instead of failing the whole chat request.
- Reranker model/config identity is recorded in the request trace.
- Reranking does not generate the final answer.

## Acceptance
Compare RRF-only and RRF+reranker on the same eval set; keep the reranker enabled only when quality gain is meaningful and latency remains acceptable for streaming chat.
