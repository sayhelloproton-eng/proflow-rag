# Verification｜Failure Scenarios

状态：REVIEWED_V0_2026-09-03

## VER-FAIL-001 Candidate Build Failure

在 parse/embed/index 任一阶段注入失败；Active Snapshot 不变、在线查询继续、run 标记失败且可诊断。

## VER-FAIL-002 Reranker Timeout

Reranker 超时 → RRF fallback → trace 标记 degraded；若 Evidence 足够仍可回答。

## VER-FAIL-003 Phone Offline

Model Gateway 快速识别 unavailable/circuit open；公共请求返回明确错误，不长时间堆积 queue。

## VER-FAIL-004 Database Unavailable

无法读取 Active Snapshot 时不生成项目事实答案；公开错误无数据库细节。

## VER-FAIL-005 Trace Persistence Failure

主回答已完成时 trace write failure 不改成用户业务失败，但 internal health 进入 degraded 并留下可恢复告警。

## VER-FAIL-006 Partial Stream Failure

已发送部分 token 后 generation abort；发送 partial failure/done，不自动重复前文。

## VER-FAIL-007 No Evidence

问仓库中不存在的虚构功能；系统明确证据不足，不让模型补全一个看似真实实现。
