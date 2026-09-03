# P1｜Knowledge Management 实现流程

> 当前阶段流程。目标是先把“某个确定版本的 ProFlow”变成可重现 KnowledgeSnapshot，再谈检索。

## 学习与实现顺序

```text
P1-A Source Authority：remote main → immutable commit → RepositorySnapshot
→ P1-B Corpus Policy：文件枚举 → include/exclude → deterministic manifest
→ P1-C Parse / Structure-aware Chunk：Doc / Code / Test + SourceCoordinate
→ P1-D PostgreSQL / pgvector：Knowledge ownership schema + repository adapter
→ P1-E Embedding Profile：真实 iPhone capability / dimension / latency baseline
→ P1-F Candidate Index Build：lexical + vector 派生索引
→ P1-G Validate / Atomic Activate / Rollback
→ P1-H Knowledge Management Eval + Stage Closeout
```

## 当前只允许 P1-A

输入：远程 ProFlow GitHub `main`。输出：确定 `commitSha`、source identity 与后续 manifest 可消费的 RepositorySnapshot。失败必须 fail-closed；不得退回本地 workspace 当 source truth。

## 阶段原则

- Source of Truth 与 Derived Index 永远分离。
- 当前 main 是移动引用；KnowledgeSnapshot 必须绑定不可变 commit。
- Chunk/Embedding/Index 都是这个 commit 的派生物，不能反过来定义 source truth。
- P1 每个子阶段先讲原理，再实现，再用真实数据验证；参数只有经过 corpus/eval 后才固化。
