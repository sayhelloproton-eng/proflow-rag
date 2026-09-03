# Audit & Observability Spec

Status: DRAFT_FOR_FREEZE

## Anonymous Identity
- `visitor_id`: random UUID stored client-side; server stores a hash.
- `conversation_id`: identifies one chat thread.
- `request_id`: identifies one user turn and complete RAG execution.
- Do not use invasive canvas/WebGL fingerprinting.

## RAG Trace
Persist question, answer, retrieved chunk ids/scores, selected context ids, snapshot/commit, embedding/rerank/generation model identities, FAST/THINK mode, prompt version, timings and success/error state.

## Feedback
V0 feedback is only thumbs up/down linked to `request_id`; no text survey.

## Privacy
Raw IP is not a long-term identity. It may be used transiently for rate limiting; any retained network identifier should be reduced/hashed according to the final security implementation.

## Purpose
Trace data exists to diagnose retrieval, reranking, context, model-routing and answer failures and to create a real eval corpus from observed usage.
