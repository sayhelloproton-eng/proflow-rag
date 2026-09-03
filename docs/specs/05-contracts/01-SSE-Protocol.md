# Contract｜SSE Streaming Protocol

状态：REVIEWED_V0_2026-09-03

## Event Types

建议 V0 固定语义：

- `meta`：request_id、conversation_id、可选 mode/snapshot 已确定信息。
- `token`：增量文本。
- `sources`：最终 SourceCitation 列表。
- `done`：final status/timing summary。
- `error`：可公开的 machine-readable error code + human message。

## Ordering

`meta? → token* → sources? → done`；若在 token 前失败可直接 `error → done`。token 已发后发生异常，发送 partial failure 状态，不从头重播。

## Client Behavior

Site 必须按 event type 处理，不能通过解析自然语言猜状态。网络中断时可以提示重试新 request，但不能把两个 request 的 token 拼成一个 Answer。

## Source Timing

Sources 可以在生成完成后一次发出，以保证绑定最终 Evidence/answer state；不要求和每个 token 同步。
