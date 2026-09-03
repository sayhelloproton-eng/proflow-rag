# 2026-09-04｜P1-C Structure-aware Chunking 实现候选

状态：`IMPLEMENTATION_CANDIDATE_READY / MECHANICAL_GATE_PASS / USER_REVIEW_PENDING`。本记录不是 P1-C 用户验收证据。

## 候选

- implementation candidate：`73b2450`
- source commit：`c85e986b56eca8be3e5c016a14bc1470ee656d87`
- Corpus Policy：`proflow-public-v0.2`
- Corpus：873 Git tree entries → 806 accepted / 67 excluded；其中 `SYMLINK_ALIAS=1`
- manifest hash：`66e5c6adee6ffd7cfb8f8c3fb6070e75fe2f7e30d03c42e361c12b094077e7b2`

## 全量 Chunk Evidence

`pnpm verify:p1c` PASS。806 documents → 7,624 chunks。

- parser：Markdown heading 4,089；TypeScript AST 2,008；Test AST 1,131；text fallback 396
- kinds：document section 4,089；code symbol 1,858；code block 150；test case 664；test setup 467；text block 396
- TypeScript parser fallback files：0
- chunk chars：p50=296；p95=4,281；max=6,000
- chunk set hash：`9eebf18021540313177ce67806e2caa01842a530d84e4be7f7c7c98cf1c55dce`
- SourceCoordinate 全量 round-trip：PASS；每个 Chunk 的 repository/commit/path/lines 都能重建原始内容。

## 实现中发现的真实问题

P1-B 仅按 path 枚举时把 `packages/agent-product/custom-gpt.openapi.yaml` 视作普通文本；P1-C 实际读取发现它是 symlink，指向已入库的 `actions/custom-gpt.openapi.yaml`。处理方式不是跟随读取或静默跳过，而是让 Git tree entry type 进入 Corpus Policy，显式记录 `SYMLINK_ALIAS`，避免重复知识与路径逃逸。

TypeScript 7 默认包入口不再提供旧 compiler parser API，`@typescript-eslint/typescript-estree` 当前 peer range 又不覆盖 TS7，因此 ingestion parser 使用 Babel Parser 仅承担 TypeScript AST 结构识别；工程编译仍由 TypeScript 7 负责。

## 待用户审阅

重点不是 Gate 是否绿，而是当前切块质量是否合理：Markdown heading、code symbol、test case/setup 的语义完整性；p50=296 是否过碎；p95/max 是否过大；6,000 chars 与 overlap=4 lines 只作为 V0 baseline，后续必须由 Retrieval/Eval 校准。未经用户确认，不进入 P1-D。
