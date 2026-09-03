# ProFlow RAG Master Spec

Status: DRAFT_FOR_FREEZE

## Product Goal
ProFlow RAG is a public, real project showcase that explains what ProFlow is, exposes its architecture/code/tests through grounded RAG, and later serves as context infrastructure for continued ProFlow iteration.

## Frozen Scope
- Public ChatWeb is the priority path; Chat/Codex MCP integration is deferred.
- One public corpus/index; development-stage ProFlow knowledge is allowed if it is safe and useful to expose.
- Source of truth is the ProFlow GitHub `main` branch only.
- Repository is public and independent: `sayhelloproton-eng/proflow-rag`.
- Frontend, backend, database schema, RAG engine, evals and Site source live in one repository.

## Runtime Baseline
- ChatGPT Sites: public presentation and chat UI.
- Microsoft Dev Tunnel: public HTTPS ingress to the Mac backend.
- NestJS + Fastify: backend framework/runtime.
- Native PostgreSQL + pgvector on Mac; no Docker and no ORM.
- iPhone model service provides generation, embedding and reranking compute.

## Development Method
SDD is authoritative. Implementation follows frozen specs. TDD is not the driver; integration checks, smoke tests and RAG evals remain mandatory acceptance evidence.
