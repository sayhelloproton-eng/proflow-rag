# 2026-09-04｜P1-A Source Authority 验收

## 结论

`P1_A_SOURCE_AUTHORITY=PASS`。实现基线：`f853aea feat: resolve immutable ProFlow repository snapshot`。用户在实现讲解与讨论后明确确认进入下一批。

## RAG 价值

RAG 的知识构建不能从“当前目录”直接开始；第一步先把移动的 GitHub `main` 解析为不可变 commit。RepositorySnapshot 只回答“本次知识构建的源码输入是谁”，不等于最终可检索的 KnowledgeSnapshot。

公开 source authority 使用 `https://github.com/sayhelloproton-eng/proflow.git`，通过 `git ls-remote ... refs/heads/main` 查询远端，不依赖本地 ProFlow workspace 或开发者 SSH 凭据。

## Evidence

真实验证：`ARCHITECTURE_GATE=PASS / typecheck=PASS / build=PASS / REPOSITORY_SNAPSHOT_SMOKE=PASS`。验证窗口连续两次远端解析得到 `c85e986b56eca8be3e5c016a14bc1470ee656d87`。

下一 Gate：P1-B Corpus Policy。
