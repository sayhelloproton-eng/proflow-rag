# Contract｜Model Gateway

状态：REVIEWED_V0_2026-09-03

## Purpose

统一隔离 iPhone 模型端点、模型加载差异、队列、优先级、timeout 与 streaming。业务代码不散落 LAN HTTP 调用。

## Capabilities

```text
embed(profile, inputs[]) -> vectors[]
rerank(profile, query, candidates[]) -> scores/order
generateFast(profile, messages/context) -> token stream
generateThink(profile, messages/context) -> token stream
```

## Scheduling

iPhone 视为一个受限推理设备。初始全设备 inference concurrency=1；在线 query embedding/rerank/generation 高于 offline rebuild embedding。后续只有实测证明并发安全/收益后才放宽。

## Retry

Embedding/metadata 类幂等请求可受控 retry；Generation 在尚未向上游发 token 时可有限 retry，发 token 后禁止自动整流重试。

## Errors

区分 `MODEL_UNAVAILABLE / TIMEOUT / PROFILE_MISMATCH / QUEUE_FULL / INVALID_RESPONSE / STREAM_ABORTED`。

## Config

URL、model names、timeout、queue limits 来自配置，不写进 Domain/Capability 代码常量。
