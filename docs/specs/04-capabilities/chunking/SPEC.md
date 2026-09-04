# Capability｜Parsing & Structure-aware Chunking

状态：VERIFIED_V0_2026-09-05
Owner：Knowledge Management

## Purpose

把 CorpusDocument 转换为保留语义结构与源坐标的 Chunk。Chunk 是检索最小单元，不是简单 token 切片。

## Strategies

### Documentation
按 heading/section/paragraph 优先切分，保留 heading path；过长 section 才做带 overlap 的二次切分。

### Source Code
优先 file/symbol/class/function/method/interface 等结构边界；必须保留 symbol 和 line range。Parser 能力不足时允许退化为语法安全/行段切分，但 trace 标记 parser mode。

### Tests
优先 `describe/context/test/it` 等测试语义单元，关联测试名、setup 和 assertion；目标是让“有没有测试证明”能召回完整 testcase 语义。

## Baseline

固定长度 Chunker 只用于 Eval 对照，不作为正式默认策略。

## Invariants

- `CAP-CHK-001`：每个 Chunk 必须有合法 SourceCoordinate。
- `CAP-CHK-002`：不得跨两个源文件形成一个 Chunk。
- `CAP-CHK-003`：overlap 不得导致 Source line 虚构。
- `CAP-CHK-004`：超大结构单元拆分后仍保留 parent/symbol metadata。

## Tunables

max tokens/chars、overlap、最小块大小、代码 parser 实现均由真实 corpus/eval 调整。

## Acceptance

P1-C 当前验收只判断此阶段已经能够真实证明的结构正确性：所有 Chunk 必须可回到固定 repository/commit/file/lines 的原文；Doc/Code/Test parser 必须在真实 Corpus 上完成全量构建，parser fallback、尺寸分布与稳定 chunk-set hash 必须可观察。

“Structure-aware 与固定切片相比，哪一种更容易检索到真正有用证据”的 Evidence recall 对比依赖后续 Retrieval harness。该质量门不在 P1-C 伪造结论，延后到 P1-H / Retrieval Eval 使用真实查询集验证；若结果不优，必须反向修订 chunker/profile。
