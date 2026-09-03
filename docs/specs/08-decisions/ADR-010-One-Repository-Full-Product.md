# ADR-010｜前端、后端与规格同一产品仓库

状态：ACCEPTED_2026-09-03

## Context
ProFlow RAG 是一个完整公开作品，不只是后端 library；Site、Backend、database migrations、eval、runtime scripts 和 SDD 需要共同演进。

## Decision
所有产品源码放在公开 `proflow-rag` 仓库。V0 不拆独立 web repo/backend repo。具体仓库目录与 ownership 已由 `02-system/06-Repository-Structure-and-Ownership.md` 和 ADR-011 冻结。

## Consequences
Site 可以独立发布到 ChatGPT Sites，Backend 独立运行在 Mac，但版本和设计仍由同一个 Git history 管理。避免 Site 关键改动只存在发布平台。

## Revisit
只有独立团队/发布权限/规模明确要求分仓时才重新评估。
