# Verification｜End-to-End Scenarios

状态：REVIEWED_V0_2026-09-03

## VER-E2E-001 首次匿名问答

打开 Site → 创建匿名 visitor/conversation → 问“ProFlow 是什么” → backend 完成 retrieval/rerank/generation → 流式正文 → Sources → trace 可按 request_id 查询。

## VER-E2E-002 Streaming

验证首 token 在完整回答前到达；SSE event ordering 正确；最终 sources/done 不与 token 混淆。

## VER-E2E-003 精确工程问题

询问 CLI、文件路径、symbol/error name；检查 lexical branch 有召回并通过 hybrid/rerank 进入 Evidence。

## VER-E2E-004 多轮追问

第一轮问组件，第二轮“它为什么这么设计？”；StandaloneQuery 能正确指代，但第二轮重新 retrieval，不仅复述第一轮。

## VER-E2E-005 Feedback

对已完成 request 点 👎；Quality 保存 feedback 并能关联 trace；不修改原 Answer。

## VER-E2E-006 Snapshot 更新

ProFlow main 变化 → full rebuild → validate → activate → 新问答绑定新 commit；activation 前的 in-flight request 仍使用旧 snapshot 完成。
