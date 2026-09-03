# Capability｜Source Citation

状态：REVIEWED_V0_2026-09-03
Owner：Grounded Answering / Delivery

## Purpose

让每个项目事实回答可回到当时真正被索引的 GitHub 证据，而不是“看起来像引用”。

## Source Identity

`SourceCoordinate = repository + commitSha + filePath + startLine + endLine`。GitHub URL 必须以 commit SHA 构建，不使用 moving `main`。

## Assembly

Evidence 进入 Context 时带内部 evidence id；Answer 完成后系统根据实际 selected/used Evidence 组装 SourceCitation。LLM 可以引用 evidence id，但不拥有 URL/line truth。

## UX

Site 展示简单 Source 列表/引用；内部 candidate scores、prompt、LAN 信息不公开。Source 点击应进入对应 commit 文件附近行。

## Invariants

- `CAP-CIT-001`：不存在有效 SourceCoordinate 的 chunk 不可成为正式 Evidence。
- `CAP-CIT-002`：Citation 不可指向不同 snapshot commit。
- `CAP-CIT-003`：旧回答的 Source 在 `main` 后续变化后仍可复现。

## Acceptance

自动校验 URL 由 trace commit/path/lines 构造；抽样比对 GitHub 文件内容与 indexed content hash。
