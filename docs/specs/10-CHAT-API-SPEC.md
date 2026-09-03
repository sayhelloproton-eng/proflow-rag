# Chat API Spec

Status: FROZEN_V0_2026-09-03

## Public API
- `GET /health`: minimal public liveness/readiness result with no internal topology or secret-bearing diagnostics.
- `POST /api/chat`: authenticated Site-to-RAG chat entry.
- `POST /api/search`: optional authenticated retrieval entry for Site features; it is not a browser-debug backdoor.
- `GET /api/sources/:id`: source metadata for rendered citations.

## Internal API
Administrative rebuild/status endpoints and detailed dependency health live under `/internal/*`, require separate protection, and are not public Site APIs.

## Streaming
Chat answers use SSE streaming. Text is emitted as generated; final metadata carries `request_id`, sources and completion status. Every rendered source is immutable evidence identified by `source_commit_sha + file_path + start_line/end_line`; GitHub links target that commit, never a moving `main` URL.

## Conversation
Anonymous multi-turn chat is supported. Each request carries a visitor/session/conversation identity and bounded recent context. Every turn performs fresh retrieval.

## Error Contract
Timeouts, model unavailability, no-evidence states and context-limit states must be explicit machine-readable outcomes; partial failures must not fabricate a grounded answer.
