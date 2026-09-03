# Stage Closeout & Writeback

## 目的

保证“代码做完”不等于“阶段闭环”。每个有意义 Round/阶段都要把当前状态、稳定经验、设计变化、验证和学习证据写回正确 owner。

## 固定顺序

```text
实现 / 实验形成候选
→ 机械读取 Git + test/eval/runtime evidence
→ 向用户解释做了什么 / 为什么 / 问题 / 取舍 / 证据
→ 讨论、质疑、必要时继续修改候选
→ 用户明确确认该阶段/子 Gate 可以 closeout
→ 判断 Spec 是否仍成立
→ 更新 Verification Evidence / CURRENT / Runbook
→ 原始事故证据按需归档
→ 更新 ai-agent-platform ProFlow RAG 实战档案
→ git diff/status 审计
```

## Fail-closed

- 不能用聊天里的“我记得通过了”替代机械证据。
- 机械证据通过也不能替代用户对学习过程和阶段结论的确认；确认前只称“实现候选 / Gate PASS”。
- Spec 需要改变时先 Amendment，不允许先改代码后补解释。
- 实战档案必须保留失败和根因，不只记录最终成功。
- CURRENT 只保存下一位执行者继续工作必须知道的事实，不复制长日志。

## Closeout 输出

至少能回答：`STAGE / CHECKPOINT / PASS_OR_FAIL / EVIDENCE / NEXT_ACTION / DO_NOT_REPEAT / PRACTICE_JOURNAL_UPDATED`。