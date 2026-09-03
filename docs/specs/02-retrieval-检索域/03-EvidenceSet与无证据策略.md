# Retrieval｜EvidenceSet 与无证据策略

状态：FROZEN_V0_2026-09-03

## 1. 为什么需要 EvidenceSet
Conversation 不应拿到一个无语义的 `Chunk[]`。Retrieval 的业务价值是交付“这批内容为什么足以支持回答”的 EvidenceSet，从而把检索边界和生成边界分开。

## 2. Evidence 结构
每条 Evidence 至少包含：`chunk_id`、`source_type`、`content` 或稳定内容引用、`source_commit_sha`、`file_path`、`start_line/end_line`、lexical/vector 命中信息、RRF rank、rerank score/rank、content hash。

## 3. EvidenceSet 结构
包含：`query`、`snapshot_id`、`evidences[]`、`candidate_count`、`selection_reason`、`confidence/no_evidence_reason`、完整 retrieval trace reference。

## 4. 选择规则
最终 Evidence 数量不是机械固定 6 条。先根据 Rerank 相关性选高质量候选，再抑制同一文件/相邻 Chunk 的过度重复，并保留多种来源类型在确有价值时的证据多样性。

## 5. No Evidence
出现以下情况应允许 no-evidence：候选均低相关；只有精确词重合但语义无关；Source 坐标无效；所有候选来自失败/不完整 Snapshot；模型/数据库故障导致无法建立可信证据。

## 6. 置信度边界
V0 不要求一开始就训练概率校准模型。可以使用可解释规则/阈值形成 `confidence_band`，但它必须通过 benchmark 调优，并避免把 reranker score 直接伪装成绝对真值概率。

## 7. 对 Conversation 的契约
Conversation 可以从 EvidenceSet 选择更紧凑的 Context，但不得修改 Evidence 的 Source 事实。若 EvidenceSet 明确 no-evidence，Conversation 默认回答“当前索引中没有足够依据”，除非产品另有显式非 RAG fallback（V0 不设置）。

## 8. 验收
每个回答可反查到 EvidenceSet；删除旧 Snapshot 后历史 Trace 仍能复盘当时实际 selected Evidence；故意提出与 ProFlow 无关的问题不会被相似度强行拉回某些无关 Chunk 后生成自信答案。
