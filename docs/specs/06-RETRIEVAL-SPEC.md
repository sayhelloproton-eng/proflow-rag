# Retrieval Spec

Status: FROZEN_V0_2026-09-03

## Strategy
V0 uses hybrid retrieval from the same PostgreSQL database:
- lexical retrieval via PostgreSQL-native text search; PostgreSQL FTS is the baseline, with PostgreSQL-native exact/trigram fallback allowed when CJK text or engineering identifiers are not recalled reliably;
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
Eval must include Chinese/English natural-language, exact-term, CLI/error-name, code-symbol/path, test-evidence and mixed-intent queries. The lexical branch is not considered complete until CJK text and exact engineering identifiers meet the benchmark without adding a second search service.
