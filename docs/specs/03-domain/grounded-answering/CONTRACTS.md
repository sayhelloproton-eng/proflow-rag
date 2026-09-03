# Grounded Answering｜Contracts

状态：FROZEN_V0_2026-09-03

## AskQuestionCommand

输入包含：`visitorId/conversationId/question/requestMetadata`。Delivery 不传入自造 Evidence、snapshot 或模型选择。

## AnswerStream

输出是有序事件流：`accepted? → token* → sources? → completed|error`。最终事件必须给出 `requestId/status/mode/snapshotId/sources`。

## Ports

Grounded Answering 依赖能力 Port，而不是基础设施实现：

- `KnowledgeReadPort`：读取 active descriptor 与 lexical/vector index。
- `QueryEmbeddingPort`：按 snapshot EmbeddingProfile 生成 query vector。
- `RerankPort`：对 bounded candidate/evidence 对重排。
- `GenerationPort`：FAST/THINK 流式生成。
- `TraceSinkPort`：非阻塞提交 RagExecutionCompleted 事实。

Adapter 可以使用 PostgreSQL/iPhone，但 Domain/Application 不知道 LAN IP、SQL connection string 或 Dev Tunnel。
