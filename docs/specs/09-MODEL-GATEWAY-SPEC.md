# Model Gateway Spec

Status: DRAFT_FOR_FREEZE

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
- Generation requests are queued; initial generation concurrency is one.
- Per-capability timeout, retry and circuit-breaker behavior is required.
- Model identity, mode and latency are recorded in every trace.
- Streaming output from the generation endpoint is propagated upstream as soon as available.

## Validation
Concrete context size, throughput and timeout values are frozen only after real phone measurements.
