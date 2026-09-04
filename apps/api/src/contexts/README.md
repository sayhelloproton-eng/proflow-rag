# apps/api/src/contexts

> 目录职责：DDD Bounded Context 的代码边界。

## 放什么

- knowledge-management、grounded-answering、quality-evaluation 三个上下文。

## 边界

- 上下文之间不得深 import 对方 domain/application 内部实现。
