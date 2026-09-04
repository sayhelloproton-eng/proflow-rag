# database/migrations

> 目录职责：数据库迁移执行序列。

## 放什么

- 按版本保存可重复执行的 schema migration。

## 边界

- 不把临时手工 SQL 当成正式迁移。
