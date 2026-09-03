# Stage Closeout & Writeback

## 目的

保证“代码做完”不等于“阶段闭环”。每个有意义 Round/阶段都要把当前状态、稳定经验、设计变化、验证和学习证据写回正确 owner。

## 固定顺序

```text
实现 / 实验结束
→ 机械读取 Git + test/eval/runtime evidence
→ 判断 Spec 是否仍成立
→ 更新 Verification Evidence
→ 更新 CURRENT
→ 稳定执行经验写 Runbook
→ 原始事故证据按需归档
→ 更新 ai-agent-platform ProFlow RAG 实战档案
→ git diff/status 审计
```

## Fail-closed

- 不能用聊天里的“我记得通过了”替代机械证据。
- Spec 需要改变时先 Amendment，不允许先改代码后补解释。
- 实战档案必须保留失败和根因，不只记录最终成功。
- CURRENT 只保存下一位执行者继续工作必须知道的事实，不复制长日志。

## Closeout 输出

至少能回答：`STAGE / CHECKPOINT / PASS_OR_FAIL / EVIDENCE / NEXT_ACTION / DO_NOT_REPEAT / PRACTICE_JOURNAL_UPDATED`。