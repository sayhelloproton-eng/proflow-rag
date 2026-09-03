# ADR-007｜SDD + DDD + Capability + Verification 四层设计

状态：ACCEPTED_2026-09-03

## Context
只按 RAG 技术流水线组织会丢失业务 ownership；只按 DDD 组织会把技术学习细节藏进 Bounded Context；只写架构文档又无法形成实现/验收闭环。

## Decision
SDD 是治理框架；DDD 建模核心业务状态和 Context 协作；Capability Spec 显式描述 RAG 技术链；Verification 建立 Requirement → Implementation → Evidence 闭环。

## Consequences
文档不会机械映射代码目录。代码目录应在 Spec 边界稳定后单独讨论，优先反映 ownership，再考虑工程便利。
