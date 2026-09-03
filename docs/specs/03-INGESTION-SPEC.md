# Ingestion Spec

Status: FROZEN_V0_2026-09-03

## Pipeline
`Repository Snapshot -> Filter -> Parse -> Chunk -> Embed -> Store -> Validate -> Activate`.

## Parsers
- Documentation parser preserves headings, sections and source line ranges.
- Code parser preserves file, symbol and structural boundaries where practical.
- Test parser preserves describe/test blocks, names, setup context and assertions.

## Chunking
- Doc, code and test use separate structure-aware chunkers.
- A fixed-size chunker is retained only as an evaluation baseline.
- Chunks must preserve `file_path`, `start_line`, `end_line`, source type and snapshot identity.
- Oversized structural units may be split with overlap while retaining parent metadata.

## Output Contract
Every accepted chunk becomes one normalized RAG chunk record with content, metadata, embedding linkage and immutable source coordinates.

## Acceptance
No generated/excluded files enter the corpus, source coordinates remain valid, and every active chunk belongs to exactly one active snapshot.
