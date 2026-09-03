# ADR-005｜Full Rebuild + Versioned Snapshot

状态：ACCEPTED_2026-09-03

## Decision
V0 每次知识更新构建完整 candidate Snapshot，验证通过后原子激活；不在首版实现增量索引。

## Rationale
优先获得清晰、可验证的一致性模型，避免 delete/rename/profile change 的增量边界复杂度。真实 full rebuild 时间将决定何时引入 incremental。

## Consequences
Embedding 成本较高，需要手机离线任务让步在线请求，并通过 cadence 控制更新频率。
