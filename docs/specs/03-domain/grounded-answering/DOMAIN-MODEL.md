# Grounded Answering｜Domain Model

状态：FROZEN_V0_2026-09-03

## Aggregate：Conversation

`Conversation(conversationId, visitorHash, turns, contextState)` 管理匿名会话语义连续性，但不保存无限历史到每次 prompt。

## Entity：Turn

`Turn(requestId, question, standaloneQuery, snapshotId, routingDecision, evidenceSet, answerStatus, citations)` 是一次 RAG 业务执行的主实体。

## Value Objects

- `RetrievalQuery(text, exactTerms, optionalHints)`。
- `Candidate(chunkId, branch, branchRank, branchScore?)`。
- `Evidence(chunkId, content, source, relevance, reason?)`。
- `EvidenceSet(snapshotId, evidences, confidence, status)`。
- `RoutingDecision(mode, reasons[])`。
- `ContextPlan(systemBudget, evidenceBudget, historyBudget, selectedEvidenceIds)`。
- `Citation(sourceCoordinate, githubUrl, label)`。

## Answer Status

`STREAMING → COMPLETED`；或在可安全结束时进入 `NO_EVIDENCE / MODEL_UNAVAILABLE / CONTEXT_LIMIT / FAILED`。Partial stream 与完整失败必须区分。
