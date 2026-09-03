# Delivery｜ChatGPT Sites 产品界面 Spec

状态：FROZEN_V0_2026-09-03

## 1. Site 的产品定位
站点首先是 ProFlow 与个人工程能力的公开展示入口，其次才是聊天框。用户应在不聊天的情况下也能理解“ProFlow 是什么、核心能力有哪些、为什么值得看”。

## 2. V0 页面能力
- Hero/项目简介：一句话定位与当前开发状态。
- 核心能力/架构入口：让用户快速浏览 Agent、Runtime、Tool、部署/验证等 ProFlow 关键点。
- `Ask ProFlow`：自然语言问答。
- 推荐问题：帮助第一次访问者快速体验 RAG，而不是面对空白输入框。
- Sources：每个有事实断言的回答可查看 GitHub 证据。
- 👍 / 👎：回答下方极简反馈，不弹问卷。

## 3. 匿名会话
首次访问生成随机 visitor UUID 并本地保存；新建 Chat 创建 conversation_id。它只用于会话连续性、限流与审计关联，不显示成账号、不采集浏览器指纹画像。

## 4. 多轮与上限 UX
会话支持追问。接近 Context Budget 时展示明确提示并引导“新建会话”，而不是突然忘掉前文。新建会话不影响 visitor_id，但产生新 conversation_id。

## 5. Streaming UX
提交问题后立即进入等待/检索状态，Backend 开始生成后逐字/逐块显示。要区分“正在检索/排队/生成”与网络卡死；具体状态文案可简洁，不暴露内部敏感拓扑。

## 6. Source UX
Sources 默认在回答完成后稳定出现，可展示文件名、类型和简短位置。点击新窗口打开 GitHub 对应 commit + lines。不要把内部 retrieval score、RRF、Reranker debug 数据塞给普通用户。

## 7. 错误 UX
no-evidence 应说“当前 ProFlow 索引中没有足够依据”；model unavailable/queue busy/timeout 要区别于 no-evidence；rate limit 给出稍后重试。不能把后端 stack trace 或 LAN 地址展示给用户。

## 8. Source Ownership 与发布
Site 源码/配置在 Git 仓库中是权威资产。若 ChatGPT Sites 当前发布机制存在网页端配置步骤，需要把步骤与不可代码化配置写入项目运行文档，避免“线上只有一份手工版本”。

## 9. 验收
陌生访问者五秒内能理解项目大意；不登录即可聊天；首个 token 到达后持续流式；Sources 可点击；feedback 只需一次点击；手机模型或 Backend 不可用时页面不会无限 loading。
