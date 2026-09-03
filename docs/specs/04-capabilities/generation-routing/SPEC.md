# Capability｜FAST / THINK Routing & Generation

状态：REVIEWED_V0_2026-09-03
Owner：Grounded Answering

## Purpose

在“必须快”和“复杂问题需要推理”之间做可解释选择，并把手机生成流尽快透传到 Site。

## Routing

FAST 是默认。THINK 只对确定性规则命中的场景启用，例如多证据综合、架构比较、冲突证据、复杂诊断、需要多步解释的问题。Router 本身不额外调用一个 LLM。

## Generation

通过 `GenerationPort.generateFast/generateThink` 获取 stream。Prompt 版本进入 RagTrace。生成模型当前基线为手机 Qwen 3.6 4B；模型端具体 URL 不进入 Domain。

## Streaming Rule

尽早发 token。生成开始前可安全 retry 的网络错误可按 Contract 处理；一旦 token 已发给用户，不自动从头重放。

## No Evidence

需要项目事实且 EvidenceSet 为 NO_EVIDENCE 时，返回明确不足，不允许单纯让模型“试着回答”。一般性解释如被允许，必须清晰区分“通用知识”与“ProFlow 项目事实”。

## Invariants

- `CAP-GEN-001`：每次 RoutingDecision 记录 mode + reasons。
- `CAP-GEN-002`：Sources 不由模型生成。
- `CAP-GEN-003`：模型私有 reasoning 不进入 trace/public response。

## Metrics

route hit rate、route correctness、TTFT、tokens/s、generation total latency、abort/error rate。
