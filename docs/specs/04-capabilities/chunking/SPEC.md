# Capability｜Parsing & Structure-aware Chunking

状态：REVIEWED_V0_2026-09-03
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

随机抽样 Chunk 可回到原 commit 文件对应行；Doc/Code/Test benchmark 比固定切片在期望 Evidence recall 上不劣，目标是明显更好。
