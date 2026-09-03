# RAG Eval Spec

Status: DRAFT_FOR_FREEZE

## Purpose
Eval is the primary quality gate for this SDD project. Unit-test coverage is not used as a proxy for RAG quality.

## Required Dimensions
- Retrieval recall for natural-language, exact-term, symbol/path and test-evidence questions.
- Reranker ordering quality versus RRF-only baseline.
- Groundedness: answer claims must be supported by selected evidence.
- Source correctness: file, commit and line range must match the indexed snapshot.
- FAST/THINK routing correctness.
- Time to first token, retrieval latency, rerank latency, generation latency and total latency.

## Corpus
Start with a curated benchmark of real ProFlow questions and expected evidence. Add anonymized real-site failures/negative feedback as regression cases over time.

## Comparisons
Keep baseline experiments for fixed-size versus structure-aware chunking and RRF-only versus RRF+reranker.

## Gate
A feature is not considered production-ready because it runs; it must pass the relevant eval and real smoke path without breaking source grounding or latency targets.
