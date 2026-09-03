# Conversation｜Context 与 FAST/THINK 生成 Spec

状态：FROZEN_V0_2026-09-03

## 1. Context Plan 优先级
1. System/回答契约与安全要求。
2. 当前用户问题。
3. Retrieval 选出的高质量 Evidence。
4. 解释指代所需的最少近期 history。
5. 其他旧 history，最先删除。

## 2. Evidence 装载
初始可以从约 6 条高质量 Evidence 作为经验起点，但不是固定常数。Context Builder 根据 Chunk 大小、重复、来源多样性与 token budget 动态选择。不能简单“Top 6 全塞”。

## 3. Prompt Grounding
Prompt 必须明确：ProFlow 事实优先依据 Evidence；若 Evidence 不足，直接说明不足；禁止编造文件、接口、测试或当前状态。SourceCitation 由系统根据 Evidence 生成，不让模型自由输出 URL。

## 4. FAST 路由
FAST 是默认路径，适合项目介绍、单事实、源码定位、术语解释、简单关系、已存在明确单证据答案等。目标是低 TTFT、快速流式响应。

## 5. THINK 路由
只有确定性复杂度规则命中才进入 THINK，例如：多证据综合、架构权衡、冲突证据解释、复杂诊断、需要跨多个模块建立因果链。Router 本身不再调用 LLM 判断，避免为路由增加一次模型延迟。

## 6. RoutingDecision
记录 `mode`, `matched_rules[]`, `input_features`, `routing_version`。后续 Eval 必须能分析“本该 FAST 却进 THINK”与“本该 THINK 却走 FAST”的误路由。

## 7. 生成模型
当前手机 Generation baseline 为 Qwen 3.6 4B。应用不直接知道 LAN URL，通过 Platform Model Gateway 的 `generateFast/generateThink` 能力调用。具体 temperature、max output、think 控制参数属于 Eval 调参。

## 8. 验收
建立 FAST/THINK 标注集；简单问题 TTFT 不被额外路由模型拖慢；THINK 只在复杂案例产生可解释命中；Evidence 不足时两种模式都必须拒绝伪造事实。
