# database/system

> 目录职责：跨业务域但属于系统运行的数据库资产。

## 放什么

- 仅放真正系统级 metadata。

## 边界

- 不能成为逃避 Context ownership 的 shared 表垃圾桶。
