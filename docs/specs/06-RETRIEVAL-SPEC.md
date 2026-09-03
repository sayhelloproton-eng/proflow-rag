# Retrieval Spec

Status: DRAFT_FOR_FREEZE

## Strategy
V0 uses hybrid retrieval from the same PostgreSQL database:
- lexical retrieval via PostgreSQL full-text search;
- semantic retrieval via pgvector similarity search.

## Fusion
- Each branch returns a bounded candidate list.
- Candidates are deduplicated by chunk identity.
- RRF is the default fusion method; do not directly add incomparable raw FTS/vector scores.
- Initial candidate target is approximately Top 20 per branch and remains tunable by eval.

## Query Handling
- Multi-turn references may be rewritten into a standalone query using bounded recent context.
- Exact engineering identifiers such as CLI commands, symbols, paths and error names must retain lexical signal.

## Output
Retrieval produces ranked candidates plus branch ranks/scores and trace metadata for reranking and later audit.

## Acceptance
Eval must include natural-language, exact-term, code-symbol, test-evidence and mixed-intent queries.
