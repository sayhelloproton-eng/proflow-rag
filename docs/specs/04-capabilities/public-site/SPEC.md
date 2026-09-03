# Capability｜Public Site Delivery

状态：REVIEWED_V0_2026-09-03
Owner：Delivery Adapter

## Purpose

把 ProFlow RAG 作为公开能力展示和可用 ChatWeb 交付给用户，同时保持 Site 只是适配层，不拥有 RAG 业务规则。

## V0 Experience

- 首页快速解释 ProFlow 定位、能力与架构入口。
- `Ask ProFlow` 提供匿名多轮 Chat。
- 回答必须逐 token/增量流式展示。
- 完成后展示可点击 Source。
- 只提供 👍 / 👎 极简反馈，不增加文字问卷。
- Context 接近上限时显示“新建会话”提示。

## Server Boundary

浏览器不直接携带 `PROFLOW_RAG_API_KEY` 调 Dev Tunnel。ChatGPT Site Server 从 Site Secrets 读取 secret，再向 Backend 发 Bearer 请求。Browser ↔ Site 和 Site Server ↔ Backend 是两个不同信任边界。

## Source of Truth

Site 源码、配置模板和与产品相关的静态资产必须版本化在 `proflow-rag` 仓库；ChatGPT Sites 是发布/托管环境，不是唯一代码真相。不得只在网页编辑器中存在无法回溯的关键实现。

## Invariants

- `CAP-SITE-001`：Site 不直连 PostgreSQL/iPhone。
- `CAP-SITE-002`：Site 不决定 FAST/THINK、Evidence 或 Snapshot。
- `CAP-SITE-003`：SSE error/done/source 使用协议事件，不靠自然语言猜状态。
- `CAP-SITE-004`：匿名 visitor 机制不得升级为侵入式浏览器指纹。

## Acceptance

真实公网路径 Site → Site Server → Dev Tunnel → Backend 可用；secret 不出现在 browser bundle/network request；断线、模型不可用、No Evidence 有清晰 UI 状态；Source 可跳转固定 commit。
