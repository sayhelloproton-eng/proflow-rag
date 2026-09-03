# Model Gateway Spec

Status: FROZEN_V0_2026-09-03

## Purpose
All iPhone model calls go through one Model Gateway; application code must not scatter direct LAN endpoint calls.

## Capabilities
- `embed`: embedding model endpoint.
- `rerank`: reranker model endpoint.
- `generateFast`: Qwen 3.6 4B fast path.
- `generateThink`: Qwen 3.6 4B think/reason path.

## Routing
FAST is the default. THINK is selected only by deterministic complexity rules such as multi-evidence reasoning, architecture comparison, conflict resolution or diagnostic tasks. The router itself must not require another LLM call.

## Runtime Protection
- The iPhone is treated as one constrained inference device. Model Gateway owns scheduling across generation, query embedding, reranking and offline embedding batches; interactive chat work has priority over rebuild work. Initial inference concurrency is one until real device measurements justify otherwise.
- Per-capability timeout and circuit-breaker behavior is required. Retry is allowed only when the operation is safe to repeat; a generation stream must never be automatically replayed after response tokens have been emitted.
- Model identity, mode and latency are recorded in every trace.
- Streaming output from the generation endpoint is propagated upstream as soon as available.

## Validation
Concrete context size, throughput and timeout values are frozen only after real phone measurements.
