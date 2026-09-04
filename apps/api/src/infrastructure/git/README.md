# apps/api/src/infrastructure/git

> 目录职责：Git SourceRepositoryPort 的 adapter。

## 放什么

- 访问公开远端、解析 immutable commit、读取固定 commit tree/content。

## 边界

- 不得把本地 working tree 当公共知识真源。
