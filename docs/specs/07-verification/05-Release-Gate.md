# Verification｜V0 Release Gate

状态：REVIEWED_V0_2026-09-03

V0 对外认为“可用”至少满足：

1. Spec Traceability 无关键断链。
2. Fresh setup 能建立 PostgreSQL schema/pgvector 并构建首个 Active Snapshot。
3. Hybrid + RRF + Reranker 真正在 trace 中执行，不是文档功能。
4. Site → Tunnel → NestJS → RAG → phone 真实流式闭环通过。
5. Sources 指向 indexed commit/path/lines，可抽样验证内容一致。
6. 关键 RAG Eval 类别建立 baseline，无明显系统性错误。
7. No-evidence、reranker timeout、phone offline、rebuild failure 等 failure scenarios 通过。
8. 匿名 Trace/Feedback 可用且隐私边界符合 Spec。
9. 公共服务不暴露 PostgreSQL/phone/internal health/secret。
10. gptweb-mcp 与其他现有服务未被 ProFlow RAG 生命周期脚本破坏。

Release Gate 不以“测试数量”或“代码覆盖率百分比”替代真实链路证据。
