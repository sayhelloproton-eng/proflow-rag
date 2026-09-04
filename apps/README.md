# apps

> 目录职责：可部署应用集合。

## 放什么

- 只放独立启动或独立交付的应用，例如 API 与 Site。

## 边界

- 不放跨应用共享领域模型；共享 wire contract 进入 packages。
