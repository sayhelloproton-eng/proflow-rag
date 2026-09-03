# Embedding Spec

Status: DRAFT_FOR_FREEZE

## Role
Embedding converts normalized chunks and user queries into vectors for semantic retrieval. It is distinct from generation and reranking.

## Runtime
- Embedding compute runs on the iPhone model service through Model Gateway.
- No paid cloud embedding API is part of V0.
- Initial candidate model: Qwen3-Embedding-0.6B.
- Initial vector dimension target: 1024, subject to real endpoint capability validation before schema freeze.

## Indexing
- Document embeddings are produced during snapshot rebuild.
- Query embeddings are produced online per request.
- Embedding model identity, dimension and config are stored with each snapshot.
- Changing embedding model/dimension invalidates the current vector index and requires a full rebuild.

## Acceptance
Embedding endpoint compatibility, batch throughput, rebuild time, vector dimension and retrieval quality must be measured before the model choice becomes FINAL.
