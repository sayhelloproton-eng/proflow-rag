# Verification｜Acceptance Matrix

状态：REVIEWED_V0_2026-09-03

本矩阵把已经冻结的产品/系统/领域硬约束映射到验证证据。实现后继续补充实际 module/symbol/test/eval-run 链接。

## 1. Product Requirements

| Requirement | Owning Spec | Verification |
|---|---|---|
| PRD-001 匿名问答 | Product / Conversation | VER-E2E-001 |
| PRD-002 Grounded ProFlow 事实 | Grounded Answering / Evidence | VER-RAG-001 |
| PRD-003 SSE Streaming | SSE Contract | VER-E2E-002 |
| PRD-004 immutable Source | Citation | VER-CIT-001 |
| PRD-005 工程精确词检索 | Hybrid Retrieval | VER-RET-002 |
| PRD-006 FAST-first | Generation Routing | VER-ROUTE-001 |
| PRD-007 👍/👎 | Quality / HTTP | VER-E2E-005 |
| PRD-008 可审计 Trace | Trace Contract | VER-TRACE-001 |
| PRD-009 rebuild 失败不破坏线上 | Knowledge Snapshot | VER-FAIL-001 |
| PRD-010 手机推理 | Model Gateway / Runtime | VER-RUN-001 |

## 2. System Requirements

| Requirement | Verification |
|---|---|
| SYS-001 Browser 不得获得 Backend Secret | VER-SEC-001 |
| SYS-002 PostgreSQL/iPhone 不暴露公网 | VER-SEC-002 |
| SYS-003 单 Answer 单 Snapshot | VER-RAG-003 / VER-E2E-006 |
| SYS-004 Offline rebuild 不破坏 Active | VER-FAIL-001 |
| SYS-005 在线推理优先 | VER-RUN-003 |
| SYS-006 Delivery 不拥有核心规则 | VER-ARCH-001 |

## 3. Knowledge Management Invariants

| Requirement | Verification |
|---|---|
| DOM-KM-001 Snapshot 单 commit | VER-KM-001 |
| DOM-KM-002 Chunk source 可定位 | VER-CIT-001 |
| DOM-KM-003 Snapshot 单 EmbeddingProfile | VER-KM-002 |
| DOM-KM-004 Candidate 不污染 Active | VER-FAIL-001 |
| DOM-KM-005 Activation 原子 | VER-E2E-006 / VER-KM-003 |
| DOM-KM-006 Build failure 可审计 | VER-FAIL-001 / VER-TRACE-002 |

## 4. Grounded Answering Invariants

| Requirement | Verification |
|---|---|
| DOM-GA-001 每 Turn 新 Retrieval | VER-E2E-004 |
| DOM-GA-002 Evidence 同 Snapshot | VER-RAG-003 |
| DOM-GA-003 Citation 来自 Evidence | VER-CIT-001 |
| DOM-GA-004 No Evidence 不伪造事实 | VER-FAIL-007 |
| DOM-GA-005 FAST 默认/THINK 有理由 | VER-ROUTE-001 |
| DOM-GA-006 Evidence 优先 history | VER-CTX-001 |
| DOM-GA-007 token 后不自动重播 | VER-FAIL-006 |

## 5. Quality & Evaluation Invariants

| Requirement | Verification |
|---|---|
| DOM-QE-001 旧 Snapshot 清理后 Trace 可复盘 | VER-TRACE-001 |
| DOM-QE-002 Feedback 非 Ground Truth | VER-QE-001 |
| DOM-QE-003 不存私有 CoT | VER-SEC-003 |
| DOM-QE-004 分阶段 Eval | VER-RAG-002 |
| DOM-QE-005 线上失败需复核再晋升 EvalCase | VER-QE-002 |

## 6. Gate Rule

冻结 Requirement 没有 Verification 映射视为规格缺口。实现功能没有 Requirement/Spec ownership 时，不能因为“代码已经写了”自动进入 V0 范围。
