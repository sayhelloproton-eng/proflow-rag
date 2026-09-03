# Evaluation｜极简反馈与 RAG Eval Spec

状态：FROZEN_V0_2026-09-03

## 1. 用户反馈
V0 只提供 👍 / 👎，不弹文字问卷。Feedback 绑定 `request_id + visitor_hash + rating + created_at`。同一 visitor 对同一 request 的重复点击应幂等更新而不是堆多条冲突记录。

## 2. Feedback 的用途
👍/👎 用于排序审计优先级、发现真实失败和构造候选回归样本，不直接用来自动调模型或把所有 👎 都视作系统错误。

## 3. 基准集类型
- 中文/英文项目概念问题。
- 精确 CLI、error、symbol、path 查询。
- 源码实现与测试证据问题。
- 多证据架构关系/诊断问题。
- 明确无答案、与 ProFlow 无关的问题。
- 多轮指代与上下文上限问题。

## 4. Retrieval 指标
至少关注 Recall@K / expected evidence hit、exact identifier recall、source correctness。RRF-only 与 RRF+Reranker 必须在同一集上比较。

## 5. Answer 指标
关注 groundedness、关键 claim 是否有 Evidence 支持、Source 是否正确、是否在 no-evidence 情况拒答、是否引入索引外“当前 ProFlow 事实”。固定长度 Chunk 与结构化 Chunk 也必须做同集对比。

## 6. Routing 指标
FAST/THINK 需要人工标注或规则预期集，统计 false THINK（浪费延迟）和 missed THINK（复杂任务能力不足）。Router 规则修改必须有回归结果。

## 7. 性能指标
TTFT 是最高优先级体验指标之一；同时记录 retrieval、rerank、queue wait、generation、total latency、手机模型切换/加载开销、full rebuild 时对在线请求的影响。

## 8. Gate
功能“能运行”不等于通过。上线关键路径至少必须：正确召回代表性 Evidence、Sources 可验证、no-evidence 不幻觉、手机并发保护有效、流式 TTFT 达到可接受范围。具体阈值由第一次真实 baseline 后填入 Eval 记录，而不是 Spec 中拍脑袋固定。
