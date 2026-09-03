# Evaluation｜RAG Trace 与匿名审计 Spec

状态：FROZEN_V0_2026-09-03

## 1. 匿名标识
`visitor_id` 由 Site 首次访问生成随机 UUID，浏览器保存，Backend 只持久化不可逆 hash；`conversation_id` 标识聊天线程；`request_id` 标识一次完整 RAG turn。禁止 Canvas/WebGL 等侵入式浏览器指纹。

## 2. Trace 必须记录
- 原始 question 与实际 standalone query。
- snapshot_id / source_commit_sha。
- lexical/vector candidates、各路 rank/score、RRF 结果。
- rerank 输入范围、score/order、是否 degraded。
- 最终 selected Evidence 与实际送入模型的 context text（或等价不可变 payload）。
- FAST/THINK mode、routing rules/version、prompt/config version。
- generation answer、completion state、sources。
- retrieval/rerank/queue/TTFT/generation/total timings 与 error code。

## 3. 为什么要保存实际 Context
旧 Snapshot 只保留上一版，长期 Chunk 会清理。如果 Trace 只保存 chunk_id，未来无法知道旧答案当时到底看到了什么。因此 selected context 必须有不可变快照副本或可验证内容哈希 + 持久 payload。

## 4. 隐私
不把 raw IP 当长期用户身份。IP 只可短期参与 abuse/rate limit；如确需审计网络维度，使用最小化、加盐 hash/短期 retention，并在 Site 隐私说明中披露。

## 5. 保留策略
聊天记录与 Trace 的具体 retention 在上线前裁定；删除策略必须保证 Eval/审计价值与隐私最小化之间平衡。公开站点展示能力不等于无限期积累访客数据。

## 6. 查询能力
后台至少能按 request_id、conversation_id、feedback、mode、error、snapshot、latency 区间筛选，方便快速查看“所有 👎”“所有 THINK 慢请求”“某次 Snapshot 上线后的 no-evidence”。

## 7. 验收
随机选一个历史 request 可完整复盘；删除旧知识快照后仍可复盘；数据库中不出现原始 API key、模型密钥或不必要 raw IP。
