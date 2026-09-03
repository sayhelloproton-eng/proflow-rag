# Spec 生命周期与冻结规则

状态：FROZEN_V0_2026-09-03

## 1. 状态机

```text
PROPOSED → REVIEWED → FROZEN → IMPLEMENTED → VERIFIED
                    ↘ AMENDED → REVIEWED → FROZEN ...
```

- `PROPOSED`：正在设计，不可作为稳定实现依据。
- `REVIEWED`：已完成交叉审计，但仍可能因上层设计变化而调整。
- `FROZEN`：边界、契约和不变量可用于实现。
- `IMPLEMENTED`：存在与 Spec 对应的实现，但尚未完成全部验收。
- `VERIFIED`：实现通过对应 Verification Gate。
- `AMENDED`：真实实现/实验证明原 Spec 需变更，正在修订。

## 2. 分层冻结

禁止再次“一次性冻结所有文件”。冻结顺序为：Governance/Product → System → Domain/Context Map → 稳定 Contract → 单个 Capability → Runtime 参数 → Verification Gate。

## 3. 必须重新 Review 的变化

以下变化必须先更新 Spec：新增/删除 Bounded Context；改变知识权威源；改变公网信任边界；改变数据 ownership；改变 HTTP/SSE 公共协议；绕过 Hybrid/RRF/Rerank/Citation 等已冻结阶段；引入第二数据库、搜索服务或新的公共入口。

## 4. Eval 可调参数

Top-N/Top-K、RRF `k`、Embedding 具体 artifact/维度、Reranker artifact、Context soft budget、timeout、rate limit、同步频率等允许通过 Eval 调参。若参数变化导致数据库不可兼容、公共协议变化或新的系统组件，则升级为 Spec 变更。

## 5. Freeze 证据

每次 Freeze 至少需要：依赖 Spec 已稳定；跨文件术语一致；无相互矛盾的不变量；有对应验收项；未把待实测参数伪装成事实。
