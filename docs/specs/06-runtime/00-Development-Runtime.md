# Runtime｜Development

状态：REVIEWED_V0_2026-09-03

## Baseline

开发期使用仓库自有 `pnpm` scripts 管理 NestJS、数据库迁移、知识 rebuild、eval 和 Dev Tunnel 辅助操作。开发期不引入 launchd 作为必要依赖。

## Repository Ownership

项目脚本必须是生命周期真相；未来 launchd 只能调用这些脚本，不复制业务启动逻辑。禁止依赖个人 shell 历史或手工步骤才能恢复服务。

## Isolation

ProFlow RAG 使用独立 backend port、database `proflow_rag`、Dev Tunnel identity、logs/config/scripts。不得修改现有 `gptweb-mcp` 生命周期；禁止 `killall node`、`pkill node` 等广域进程命令。

## Config

`.env.example` 只描述键名和安全默认，不包含真实 secret/LAN 地址。运行时至少需要数据库连接、phone model endpoint/profile、API key、source repo 和 tunnel 配置。

## Development Gate

仓库目录 ownership 已冻结并完成空目录占位；下一步创建正式应用骨架时先通过 build/typecheck/health smoke，再进入 Knowledge Management 实现。
