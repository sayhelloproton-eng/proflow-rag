# 2026-09-04｜P1-B Corpus Policy 验收

P1-B 实现基线：`f073fee feat: build deterministic ProFlow corpus manifest`。

固定 Source：ProFlow GitHub `main @ c85e986b56eca8be3e5c016a14bc1470ee656d87`。初次验收时按 path 统计为 873 entries → 807 accepted / 66 excluded；P1-C 真实内容读取识别出其中 1 个 Git symlink alias 后，Corpus Policy amendment 为 `proflow-public-v0.2`，最终权威基线为 806 accepted / 67 excluded。

当前 Manifest SHA-256：`66e5c6adee6ffd7cfb8f8c3fb6070e75fe2f7e30d03c42e361c12b094077e7b2`。重复构建获得完全一致的 entries/hash，满足 deterministic manifest；旧 hash `317cce336cd79ef93ff559443b458acbddadf1be374043cac30ebd0af20e02db` 仅保留为 amendment 前历史证据。

Corpus 的核心语义不是“扫描整个仓库”，而是显式定义 RAG 的知识准入边界；每个文件保留 accepted/excluded 与 class/reason，可审计、可回归。

用户在讲解后确认继续，P1-B 正式 PASS。下一门进入 P1-C Structure-aware Chunking，不提前进入 PostgreSQL/Embedding。
