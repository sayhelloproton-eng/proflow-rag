# Contract｜Error Model

状态：REVIEWED_V0_2026-09-03

## Business Outcomes

- `NO_EVIDENCE`：知识不足，不是基础设施异常。
- `CONTEXT_LIMIT`：当前会话接近/超过支持预算。
- `RETRIEVAL_DEGRADED`：部分召回能力降级但仍可形成受控答案。

## Technical Errors

- `SERVICE_UNAVAILABLE`
- `DATABASE_UNAVAILABLE`
- `MODEL_UNAVAILABLE`
- `MODEL_TIMEOUT`
- `RERANK_TIMEOUT`
- `STREAM_ABORTED`
- `INVALID_SOURCE`
- `INTERNAL_ERROR`

## Public vs Internal

Public error 不带 stack、SQL、LAN 地址、token/secret。详细 cause 进入 trace/log，以 request_id 关联。

## Partial Stream

已经输出 token 后发生技术失败，Answer 状态为 partial/failed，不对用户假装 complete，也不自动从头重试。
