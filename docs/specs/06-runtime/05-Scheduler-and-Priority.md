# Runtime｜Scheduler & Priority

状态：REVIEWED_V0_2026-09-03

## Job Classes

- P0：正在进行的 generation stream。
- P1：公共 query embedding / rerank。
- P2：必要 health/probe。
- P3：offline snapshot embedding/rebuild。
- P4：非紧急 eval batch。

实际实现可用更简单队列，但必须保持“交互优先于离线”的语义。

## Backpressure

公共请求有 queue limit 和 request timeout。超过容量时返回明确 busy/timeout，而不是无限排队耗尽内存。

## Rebuild Scheduling

Sync cadence 根据 full rebuild duration、ProFlow 更新频率和手机空闲时间决定。用户活跃期间 rebuild 允许延后，不要求每个 commit 秒级同步。

## No Overengineering

V0 不引入外部 queue service。NestJS 内部 scheduler/queue + PostgreSQL state 足够；若进程恢复需求暴露出问题，再通过证据决定是否升级。
