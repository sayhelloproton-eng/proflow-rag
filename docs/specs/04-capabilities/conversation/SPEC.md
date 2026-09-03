# Capability｜Anonymous Multi-turn Conversation

状态：REVIEWED_V0_2026-09-03
Owner：Grounded Answering

## Purpose

支持匿名连续追问，同时避免历史无限增长和旧回答替代新 Evidence。

## Identity

客户端生成随机 visitor UUID；服务端存 hash。`conversationId` 标识线程，`requestId` 标识一轮 RAG 执行。禁止 Canvas/WebGL 等侵入式指纹。

## Query Rewrite

仅使用解决指代/省略所需的 bounded recent context。输出 `StandaloneQuery` 时必须保留 exact engineering terms。Rewrite 失败退回原始 question。

## Context Limit

历史先被压缩/丢弃；接近 hard limit 时向用户明确提示开启新会话。系统不承诺无限长期记忆。

## Persistence

Conversation/Turn 用于产品连续性与审计关联，不把完整历史每轮无脑注入模型。

## Invariants

- `CAP-CONV-001`：每个 Turn 新检索。
- `CAP-CONV-002`：visitor hash 不作为跨设备真实身份。
- `CAP-CONV-003`：Conversation 状态不能改变 KnowledgeSnapshot ownership。
