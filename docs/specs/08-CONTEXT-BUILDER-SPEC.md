# Context Builder Spec

Status: FROZEN_V0_2026-09-03

## Goal
Build a compact, grounded model context from reranked evidence without letting conversation history crowd out retrieved ProFlow facts.

## Priority
1. System instructions and answer contract.
2. Current user question.
3. Selected RAG evidence.
4. Minimal recent conversation context required for references/query rewrite.
5. Older conversation history, which is discarded first.

## Budget
FAST and THINK have separate soft budgets. Hard limits follow the real Qwen 3.6 4B service configuration. Concrete token numbers are deferred until latency/memory/quality tests.

## Selection
Start with roughly the top six reranked chunks, then adjust dynamically for chunk size, duplication and token budget. Prefer evidence diversity when multiple source types support the same answer.

## Conversation Limit
When a conversation approaches the supported budget, the UI must tell the user to start a new conversation rather than silently accumulating unlimited history.
