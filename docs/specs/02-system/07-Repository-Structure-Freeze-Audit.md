# Repository Structure Freeze Audit｜仓库目录冻结审计

状态：FROZEN_V0_2026-09-03

## 审计结论

`PASS`。仓库目录与模块 ownership 可以作为 V0 实现基线。

## 已冻结边界

- 产品仍为单一公开 `proflow-rag` 仓库。
- 可部署应用只有 `apps/api` 与 `apps/site`。
- API 业务 ownership 只有三个 Bounded Context：Knowledge Management、Grounded Answering、Quality & Evaluation。
- Capability 必须属于 owning Context；Infrastructure 只实现 Port/Adapter；Delivery 不拥有核心规则。
- V0 唯一共享 package 是 `packages/site-api-contract`，只承载 wire protocol。
- PostgreSQL schema/数据库资产按 `knowledge / answering / quality / system` 对齐。
- `evals/` 只保存评估数据资产；`scripts/` 只做 repo-owned 入口与编排。

## 占位验证

实际 Git tree 已创建 33 个叶子目录占位；`apps/`、`packages/`、`database/`、`evals/`、`scripts/` 当前仅包含 `.gitkeep`，没有 NestJS、Site、SQL、脚本或其他业务实现文件。

## Traceability

新增 `SYS-007 ~ SYS-011`，并映射到 `VER-ARCH-004 ~ VER-ARCH-007`。`Database Ownership` 已从 REVIEWED 提升为 FROZEN。

## 演进规则

目录不是永久不可改。后续按 SDD 依次实现；若真实实现只需要局部移动，可走普通 Spec Amendment；若改变部署单元、Bounded Context ownership、跨域契约、共享 package 或数据 ownership，则必须先重新 Review 对应 System/Domain/ADR。