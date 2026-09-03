# Dependency & Failure Model

状态：REVIEWED_V0_2026-09-03

## 1. 在线强依赖

Grounded Answering 强依赖 Active Knowledge Snapshot、PostgreSQL 基本读取与 Generation 能力。Query Embedding 不可用时语义召回受损；是否允许 lexical-only 降级由 Retrieval Spec 控制并必须标记 trace。

## 2. 可降级依赖

- Reranker timeout → 回退 RRF 顺序。
- Evaluation persistence failure → 回答可完成，但产生内部健康异常。
- Query rewrite failure → 保留原问题和 exact terms 检索。

## 3. 不可伪装的失败

没有 Active Snapshot、Generation 不可用、Evidence 明显不足、Source 坐标无效时必须返回明确状态，禁止生成看似正常的 Grounded Answer。

## 4. 离线失败

Fetch/parse/embed/index/validate 任一失败只影响 candidate build；Active Snapshot 不变。失败 run 必须记录 stage、error、commit 和配置。

## 5. 恢复原则

优先恢复权威状态后再重试非幂等操作。Snapshot activation、migration、发布等操作在超时/结果未知时不得盲目重复执行。
