# Trust Boundaries

状态：FROZEN_V0_2026-09-03

## Boundary A：Browser ↔ Site Server

浏览器不可信。匿名 visitor_id 可由客户端生成，但服务端只保存 hash；不能把 Backend Secret 下发浏览器。

## Boundary B：Site Server ↔ Dev Tunnel Backend

业务 API 使用 `Authorization: Bearer <PROFLOW_RAG_API_KEY>`。公开 `/health` 只能返回最小状态，不泄露拓扑、凭据、LAN 地址或内部错误细节。

## Boundary C：Backend ↔ PostgreSQL

只使用本机/受控网络连接；不经 Dev Tunnel 暴露。跨领域不得通过“直接 SQL 对方表”绕过 ownership。

## Boundary D：Backend ↔ iPhone

模型服务是 LAN-only。Model Gateway 负责超时、队列、优先级和 capability 适配；公共客户端不能直接访问手机。

## Corpus Boundary

进入公开 Knowledge Snapshot 的内容必须先过语料安全过滤。`.env`、secret、凭据、机器私有日志、缓存、生成目录和不应公开资产不得进入可引用 Corpus。
