# Chat API Spec

Status: DRAFT_FOR_FREEZE

## Public API
- `GET /health`: service readiness.
- `POST /api/chat`: authenticated Site-to-RAG chat entry.
- `POST /api/search`: optional direct retrieval/debug entry for Site features.
- `GET /api/sources/:id`: source metadata for rendered citations.

## Internal API
Administrative rebuild/status endpoints live under `/internal/*` and are not public Site APIs.

## Streaming
Chat answers use SSE streaming. Text is emitted as generated; final metadata carries `request_id`, sources and completion status.

## Conversation
Anonymous multi-turn chat is supported. Each request carries a visitor/session/conversation identity and bounded recent context. Every turn performs fresh retrieval.

## Error Contract
Timeouts, model unavailability, no-evidence states and context-limit states must be explicit machine-readable outcomes; partial failures must not fabricate a grounded answer.
