# Delivery｜HTTP API 与 SSE 协议 Spec

状态：FROZEN_V0_2026-09-03

## 1. Public API
- `GET /health`：最小公开 readiness/liveness，不要求业务密钥。
- `POST /api/chat`：Site Server 到 RAG 的主要流式入口，需要 Bearer service auth。
- `GET /api/sources/:id`：必要时读取已批准 Source metadata；不得成为任意文件读取接口，并通过 Site Server 的 Bearer service auth。
- `POST /api/feedback`：写入当前 request 的 up/down，通过 Site Server 的 Bearer service auth，并符合匿名幂等策略。

除 `/health` 外，V0 Site 使用的 Backend 业务 API 默认都由 Site Server 代调并携带服务端 Bearer Secret；浏览器不直接持有或拼装该 Secret。

`/api/search` 仅在 Site 真实需要独立搜索体验时再公开；调试检索不应天然成为公网 API。

## 2. Internal API
`/internal/health`、rebuild/status/ops 等独立保护，不复用“知道公开 Site key 就可管理系统”的权限模型。具体 admin auth 在实现前补最小方案。

## 3. Chat Request
至少包含 `conversation_id`、`visitor_id`（客户端随机 ID）、`message` 和必要客户端协议版本。服务端自己生成权威 `request_id`；客户端不得指定 Snapshot 或模型绕过业务路由。

## 4. SSE Events
- `start`：request_id、可公开的运行信息。
- `delta`：回答正文增量。
- `final`：completion state、Sources、mode、必要 usage/latency 摘要。
- `error`：标准 error code + 用户安全信息。

## 5. Error Codes
至少区分 `UNAUTHORIZED`、`RATE_LIMITED`、`NO_EVIDENCE`、`MODEL_UNAVAILABLE`、`CONTEXT_LIMIT`、`BACKEND_NOT_READY`、`INTERNAL_ERROR`、`CANCELLED`。HTTP status 与 SSE error 语义一致。

## 6. Streaming 细节
响应开始后要及时 flush；Site Server 不能缓冲完整响应。客户端断连需传播 cancellation。`final` 只能发送一次；已经发 delta 后不允许隐藏错误并重新开始第二份答案。

## 7. Source Schema
每个 Source 至少有 `id`、display label、source_type、GitHub immutable URL。内部 commit/path/lines 可按产品需要透出，但 URL 必须准确定位证据。

## 8. 验收
通过 curl/真实 Site 验证 SSE 顺序、断连、错误、鉴权和 Sources；没有 secret 的 browser request 不能调用 `/api/chat`；API 不接受用户指定任意本机文件 path。
