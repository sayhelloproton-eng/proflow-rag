# Contract｜HTTP API

状态：REVIEWED_V0_2026-09-03

## Public/Authenticated Surface

- `GET /health`：最小 liveness/readiness，不泄露内部拓扑。
- `POST /api/chat`：Site Server → Grounded Answering 主入口，Bearer 鉴权，返回 SSE。
- `POST /api/search`：可选 Site 功能/学习调试入口，同样鉴权；不能成为浏览器绕过服务端秘密的 debug backdoor。
- `GET /api/sources/:id`：返回允许公开的 Source metadata。
- `POST /api/feedback`：提交 `request_id + up/down`。

## Internal Surface

`/internal/*` 承载 rebuild/status/eval/详细 health，使用独立保护策略，不作为公开 Site API。

## Request Identity

服务端生成/确认 `request_id`；conversation/visitor 输入必须校验长度和格式，不信任客户端自报模型、snapshot、Evidence。

## Stability

公共字段变化需 Contract Review。内部 NestJS service/class 不属于 API contract。
