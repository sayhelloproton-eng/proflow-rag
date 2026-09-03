# 2026-09-04｜P1-B Corpus Policy 验收

P1-B 实现基线：`f073fee feat: build deterministic ProFlow corpus manifest`。

固定 Source：ProFlow GitHub `main @ c85e986b56eca8be3e5c016a14bc1470ee656d87`。真实 Git tree 共 873 个 tracked files；V0 Corpus Policy 接纳 807，排除 66。

Manifest SHA-256：`317cce336cd79ef93ff559443b458acbddadf1be374043cac30ebd0af20e02db`。重复构建获得完全一致的 entries/hash，满足 deterministic manifest。

Corpus 的核心语义不是“扫描整个仓库”，而是显式定义 RAG 的知识准入边界；每个文件保留 accepted/excluded 与 class/reason，可审计、可回归。

用户在讲解后确认继续，P1-B 正式 PASS。下一门进入 P1-C Structure-aware Chunking，不提前进入 PostgreSQL/Embedding。
