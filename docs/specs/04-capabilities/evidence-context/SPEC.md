# Capability｜Evidence Selection & Context Building

状态：REVIEWED_V0_2026-09-03
Owner：Grounded Answering

## Purpose

把 reranked candidates 变成有限、可信、去重的 EvidenceSet，并在模型 Context Budget 内优先保留项目证据。

## Evidence Selection

不机械凑满 Top-K。根据相关性、重复度、source diversity、chunk size 和 no-evidence threshold 选择。初始可从约 6 个 evidence 作为实验起点，但由 Eval 调整。

## Context Priority

1. System / answer contract。
2. Current question。
3. Selected Evidence。
4. 指代消解真正需要的近期 history。
5. 旧 history 最先被丢弃。

## Grounding Contract

Context 中 Evidence 必须带机器生成的 evidence id/source metadata，Prompt 要求模型仅对 ProFlow 项目事实使用给定 Evidence。Citation 最终由系统映射 evidence id，而不是相信模型自由拼 GitHub URL。

## Invariants

- `CAP-CTX-001`：Evidence 不因保留历史对话而被挤出。
- `CAP-CTX-002`：不同 Snapshot Evidence 不混装。
- `CAP-CTX-003`：No Evidence 状态可直接阻止项目事实型 generation。

## Budget

FAST/THINK 可有不同 soft budget；hard context 以上游 Qwen 3.6 4B 服务实测为准。
