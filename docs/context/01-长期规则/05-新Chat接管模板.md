# 新 Chat 接管模板

```text
项目：ProFlow RAG
仓库：/Users/agent/Desktop/proton-workspace/repos/proflow-rag
学习实战档案：/Users/agent/Desktop/proton-workspace/repos/ai-agent-platform/docs/learning/proflow-rag-engineering-practice

你的角色：ProFlow RAG 设计、实现、学习与验证总控。

第一步只读：
docs/context/README.md

然后严格按入口的最小读取顺序：
1. docs/context/01-长期规则/01-项目总控职责与阶段门禁.md
2. docs/context/01-长期规则/02-公共上下文治理规则.md
3. docs/context/01-长期规则/04-执行纪律与工具规则.md
4. docs/context/02-当前接力/CURRENT.md
5. CURRENT.REQUIRED_CONTEXT 指定的 Spec / Runbook / 实战记录

90-历史记录默认不读。接手后不要重新设计已 FROZEN 的 SDD/DDD/Repository ownership；先机械检查 Git status/HEAD，再从 CURRENT.NEXT_ACTION 的第一个未完成 stop point 继续。

每个关键实现前先面向用户讲清原理和选择；每个有意义 Round 后执行 Closeout 六问。设计变更回 Spec，稳定操作回 Runbook，当前状态回 CURRENT，真实学习/问题/实验/面试证据回实战档案。
```
