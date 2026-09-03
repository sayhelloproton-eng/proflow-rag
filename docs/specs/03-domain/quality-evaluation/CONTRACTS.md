# Quality & Evaluation｜Contracts

状态：FROZEN_V0_2026-09-03

## RecordTrace

消费 `RagExecutionCompleted`，异步/非关键路径持久化完整可审计事实。

## RecordFeedback

输入 `requestId + visitorId + UP|DOWN`。服务端验证 request 存在及匿名身份约束后保存；不允许反馈修改原 Answer。

## RunEvaluation

内部命令，输入 dataset、snapshot/config profile，输出 EvalRun。V0 不作为公开 Site API。

## Read Audit

管理/学习用途可以按 request_id 读取详细 trace；公开用户只看到回答和 Source，不暴露内部候选分数、LAN 信息或安全配置。
