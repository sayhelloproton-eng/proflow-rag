# Conversation｜流式回答与 Source 引用 Spec

状态：FROZEN_V0_2026-09-03

## 1. Streaming 是硬要求
`POST /api/chat` 必须以 SSE 流式输出。检索与重排完成后，一旦 Generation 有首个可展示 token，就尽快向上游传播，不能缓存完整答案后再一次返回。

## 2. SSE 事件语义
至少区分：`start`（request/model/snapshot 基本信息可选）、`delta`（正文增量）、`final`（sources、request_id、mode、completion state）、`error`（机器可读错误）。事件 schema 由 Delivery API Spec 固化。

## 3. Source 生成
SourceCitation 从最终 selected Evidence 生成，包含展示标题/文件名、GitHub URL、source type。URL 必须指向被索引 `source_commit_sha` 下的 `file_path` 和 `#Lx-Ly` 行范围，不指向移动的 `main`。

## 4. Source 展示时机
正文可以流式，Sources 在 Evidence 已确定后可准备，但 UI 默认在答案完成时稳定展示，避免边生成边出现/消失造成视觉跳动。若产品后续决定 inline citation，仍必须由 Evidence ID 驱动。

## 5. 中断与取消
用户断开连接或主动停止时，应尽可能取消下游生成并释放手机队列；已产生内容标记 `cancelled/partial`，审计知道这是未完整答案。

## 6. 错误
模型在首 token 前失败可按 safe policy retry；一旦已经发送 delta，禁止自动从头重试并拼接。超时、no-evidence、context-limit、model-unavailable 必须有不同 error code。

## 7. 性能指标
记录 retrieval_ms、rerank_ms、queue_wait_ms、model_ttft_ms、generation_ms、total_ms。用户感知的“快”优先看 TTFT 和持续输出节奏，而不只是总时长。

## 8. 验收
真实 Site → Dev Tunnel → Mac → iPhone 链路可持续流式；网络中断不造成后台长期占用；Sources 点击能打开正确 commit/line；审计能区分 complete、partial、cancelled、error。
