# 2026-09-05｜P1-C Structure-aware Chunking 验收

## 结论

`P1_C_STRUCTURE_AWARE_CHUNKING=PASS`。实现基线：`73b2450 feat: build structure-aware corpus chunks`。用户已理解“按文件/内容结构选择切分策略，目标是尽量保持语义完整、信息密度与可检索性”，并选择把更细的 Chunk 参数与样本复盘留到最终总结；随后明确继续下一阶段。

## Evidence

固定 ProFlow `c85e986b56eca8be3e5c016a14bc1470ee656d87`：873 Git tree entries → 806 Corpus documents → 7,624 chunks。Markdown heading 4,089；TypeScript AST 2,008；Test AST 1,131；text fallback 396；TypeScript parser fallback files=0。

Chunk chars：p50=296 / p95=4,281 / max=6,000；chunk set hash=`9eebf18021540313177ce67806e2caa01842a530d84e4be7f7c7c98cf1c55dce`。所有 Chunk 的 `SourceCoordinate(repository, commitSha, filePath, startLine, endLine)` 均通过原始内容 round-trip。

## 保留到最终复盘的问题

`6,000 chars / overlap=4 lines` 仍是 V0 baseline，不宣称最佳值；源码小 symbol 可能过碎、较大 Chunk 可能混入过多语义，这些都要由后续 Retrieval/Eval 反向校准。P1-C 不因为这些可调参数而阻塞进入持久化阶段。

下一 Gate：P1-D PostgreSQL / pgvector。
