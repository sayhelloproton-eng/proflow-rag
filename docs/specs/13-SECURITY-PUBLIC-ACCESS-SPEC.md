# Security & Public Access Spec

Status: DRAFT_FOR_FREEZE

## Service Authentication
ChatGPT Site server calls the backend with `Authorization: Bearer <PROFLOW_RAG_API_KEY>`. The same secret is stored in Site Secrets and the Mac `.env`; it is never shipped to browser JavaScript.

## Public Surface
- Public users are anonymous; no login/account system in V0.
- Dev Tunnel exposes only the NestJS RAG HTTP service.
- PostgreSQL and the iPhone model endpoint remain LAN/local-only.
- Internal admin/rebuild APIs require separate protection and are not Site-facing.

## Abuse Protection
Apply per-visitor/IP rate limits, request-size limits, generation queue limits and timeouts. Protect the phone by enforcing backend concurrency rather than allowing direct model access.

## Corpus Safety
Secrets, env files, credentials, irrelevant logs and machine-private artifacts are excluded before ingestion. Public answer/source rendering must not expose data outside the approved corpus.

## CORS
Restrict browser-origin access where applicable, but do not treat CORS as authentication.
