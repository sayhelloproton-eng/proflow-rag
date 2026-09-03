# ADR-009｜One Corpus + ProFlow main Authority

状态：ACCEPTED_2026-09-03

## Decision
V0 只有一套公开 Corpus/Active Snapshot，知识权威源是 ProFlow 远程 GitHub `main`。不拆 Public/Dev corpus，不索引 feature branch/local workspace。

## Rationale
当前站点也是个人/项目能力展示，开发阶段公开事实有价值；双 corpus 会增加同步、授权、解释和 Eval 复杂度。

## Safety
进入 corpus 仍需过滤 secret、env、machine-private、generated/no-value 文件。公开不等于“所有文件无条件公开”。

## Revisit
未来出现真正私有开发资料、权限用户或内部 MCP 场景时再评估多 corpus/ACL。
