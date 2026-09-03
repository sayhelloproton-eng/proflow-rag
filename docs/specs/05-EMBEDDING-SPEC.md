# Embedding Spec

Status: FROZEN_V0_2026-09-03

## Role
Embedding converts normalized chunks and user queries into vectors for semantic retrieval. It is distinct from generation and reranking.

## Runtime
- Embedding compute runs on the iPhone model service through Model Gateway.
- No paid cloud embedding API is part of V0.
- Initial candidate model: Qwen3-Embedding-0.6B.
- Initial vector dimension target: 1024, subject to real endpoint capability validation before schema freeze.

## Indexing
- Document embeddings are produced during snapshot rebuild.
- Query embeddings are produced online per request using the embedding model/config bound to the active snapshot.
- Embedding model identity, dimension and config are stored with each snapshot.
- Changing embedding model/dimension creates a new snapshot/index and requires a full rebuild; an incompatible query embedding must never be compared against the active vector index.

## Acceptance
Embedding endpoint compatibility, batch throughput, rebuild time, vector dimension and retrieval quality must be measured before the model choice becomes FINAL.
