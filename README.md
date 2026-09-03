# proflow-rag

Public RAG system and interactive site for understanding and evolving ProFlow.

## Current Stage

The public repository is established. Application implementation has not started yet; the authority is the SDD specification system under `docs/specs/`.

This project combines:

- **SDD** for design governance and traceability;
- **DDD** for bounded contexts, domain models and cross-context ownership;
- **Capability Specs** for the explicit RAG pipeline;
- **Verification** for retrieval, grounding, source, failure and latency evidence.

## Specification Entry

Start at `docs/specs/README.md`.

The core reading path is:

```text
00-sdd-governance
→ 01-product
→ 02-system
→ 03-domain
→ 04-capabilities
→ 05-contracts
→ 06-runtime
→ 07-verification
→ 08-decisions
```

Repository/module ownership is now frozen. Placeholder directories are created first; implementation proceeds capability-by-capability under the owning bounded context. Material directory/ownership changes must amend the owning Spec before migration.

## Project Continuity

Cross-chat execution context starts at `docs/context/README.md`. New Chat / Work / Agent sessions recover the project from the minimal long-term rules, `CURRENT.md`, and stage-specific `REQUIRED_CONTEXT`; full chat history is not a project authority.

## Development Method

Spec changes precede material implementation changes. V0 is not TDD-driven, but unit/integration checks, smoke paths and RAG Eval remain mandatory evidence. A feature is not accepted because it merely runs; it must satisfy the owning Spec and Verification gate.
