# System Context

状态：FROZEN_V0_2026-09-03

## 1. 外部参与者与系统

```text
Public User
    │
    ▼
ChatGPT Sites
    │ Site Server / HTTPS / service secret
    ▼
Microsoft Dev Tunnel
    │
    ▼
ProFlow RAG @ Mac
    ├── PostgreSQL + pgvector
    ├── Grounded Answering
    ├── Knowledge Management
    ├── Quality & Evaluation
    └── Model Gateway ──LAN──> iPhone Model Service

GitHub ProFlow main ──fetch exact commit──> Knowledge Management
```

## 2. 系统责任

Mac RAG 服务是控制平面和 RAG 编排中心；PostgreSQL 是持久状态和索引；iPhone 是受限推理设备；GitHub 是公开知识事实源；ChatGPT Sites 是交付环境，不拥有核心 RAG 规则。

## 3. 关键系统约束

- `SYS-001`：浏览器不得获得 Backend Service Secret。
- `SYS-002`：PostgreSQL 与手机模型不得暴露公网。
- `SYS-003`：一次 Grounded Answer 绑定一个确定 Active Knowledge Snapshot。
- `SYS-004`：离线 rebuild 不得阻塞/破坏当前 Active Snapshot。
- `SYS-005`：手机在线请求优先于离线 Embedding 批处理。
- `SYS-006`：Site/CLI/MCP 等 Delivery Adapter 不拥有核心领域规则。
- `SYS-007`：两个可部署单元固定为 `apps/api` 与 `apps/site`，同属一个产品仓库。
- `SYS-008`：API 运行时代码以三个 Bounded Context 为一级业务 ownership，Capability 必须有明确 owner。
- `SYS-009`：Infrastructure 只实现 Port/Adapter；跨 Context 不得深层 import 或跨 ownership 写表。
- `SYS-010`：V0 唯一共享 package 为 `site-api-contract`，只共享 wire contract，不共享 Domain。
- `SYS-011`：数据库 schema/资产按 `knowledge/answering/quality/system` ownership 对齐。
