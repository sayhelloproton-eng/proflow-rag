# Capability｜Source Ingestion

状态：REVIEWED_V0_2026-09-03
Owner：Knowledge Management

## Purpose

把 GitHub ProFlow `main` 的远程状态解析为一个不可变 RepositorySnapshot，并应用公开语料准入策略，为后续 Parse/Chunk 提供确定输入。

## Scope

负责 remote SHA resolve、exact commit fetch/checkout、文件枚举、include/exclude policy、安全过滤、文档记录。V0 只处理 ProFlow `main`，不处理 PR、feature branch、用户上传或多仓库。

## Main Flow

`resolve main SHA → compare active source SHA/build trigger → fetch exact commit → enumerate → filter → create CorpusDocument manifests`。

## Corpus Rules

优先包含 README/docs/spec、真实 `packages/**/src` 与测试；排除 `.env*`、secret/credential、`node_modules`、dist/build、coverage、cache、logs、temp、机器私有文件和明显生成资产。过滤必须按 path + pattern + Git entry type + 可选内容安全检查共同执行。symlink 不作为独立 CorpusDocument 跟随读取；V0 将其作为 alias 显式排除并记录 reason，避免重复知识与路径逃逸。

## Invariants

- `CAP-ING-001`：source authority 只认远程公开 `main`。
- `CAP-ING-002`：本地 ProFlow 工作区不是公开 RAG 的事实源。
- `CAP-ING-003`：Corpus filter 结果必须可审计，不静默包含敏感文件。
- `CAP-ING-004`：同一 commit/build profile 的 manifest 应确定。

## Failure

Fetch 失败、本地 checkout 不完整或安全扫描异常时停止 candidate build；不触碰 Active Snapshot。

## Observability

记录 commit、文件总数、accepted/excluded counts、exclude reason 分布、fetch duration、manifest hash。

## Acceptance

对固定 commit 重复执行获得相同 accepted manifest；已知敏感/生成路径 0 泄漏；删除文件不会在新 manifest 残留。
