# apps/api/src/delivery/http/internal

> 目录职责：内部 HTTP 接口预留目录。

## 放什么

- 未来只放需要内部调用的管理/运维端点。

## 边界

- 不把公共问答接口放进这里，也不绕过 Context ownership。
