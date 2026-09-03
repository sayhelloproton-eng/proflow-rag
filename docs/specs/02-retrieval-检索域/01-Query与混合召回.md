# Retrieval｜Query 与混合召回 Spec

状态：FROZEN_V0_2026-09-03

## 1. 为什么必须 Hybrid Search
ProFlow 是工程仓库。`platform start`、类名、函数名、路径、错误码等精确字符串通常需要 lexical；“为什么需要 Runtime”“Agent 和 Harness 什么关系”更适合 semantic。V0 必须同时保留两类信号。

## 2. Lexical 分支
基线使用 PostgreSQL-native text search。对中文/CJK、路径、CLI、snake/kebab/camel case 标识符，如果标准 FTS recall 不足，可在同一 PostgreSQL 内增加 exact/prefix/`pg_trgm` 等策略；不为此引入 Elasticsearch/OpenSearch。

## 3. Vector 分支
Query 使用 Active Snapshot 绑定的 Embedding 配置生成向量，再使用 pgvector 相似度检索。Query vector 维度或模型配置与 Snapshot 不兼容时必须失败显式化，禁止自动 fallback 到错误向量空间。

## 4. 保留工程字面信号
Query rewrite/normalization 不得丢失引号内字符串、路径、CLI flag、symbol、错误码等 exact terms。可以同时产生 semantic text 与 exact-term hints，但审计必须知道实际使用了什么。

## 5. 候选数量
每路初始目标可从约 Top 20 起步，但不是冻结常数。必须通过 Eval 找到在手机 Reranker 延迟、召回率和数据库开销之间合理的 candidate bound。

## 6. Filter
V0 默认查询 Active Snapshot 全部 corpus；source_type、path 等 filter 只能来自明确 intent 或调试/评估，不应未经用户意图就过早过滤导致 recall 下降。

## 7. 失败策略
Vector endpoint 暂时不可用时是否允许 lexical-only 由在线可用性策略决定并写 trace；lexical 分支失败同理。两路均无法产出可靠候选时返回 no-evidence，不调用生成模型编造答案。

## 8. 验收样本
至少覆盖：中文概念问法、英文技术词、精确函数/类、路径、`platform start` 等 CLI、错误文本、某功能是否有 test、一个同时包含自然语言与 symbol 的 mixed query。
