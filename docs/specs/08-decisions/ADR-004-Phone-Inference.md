# ADR-004｜iPhone 作为模型推理设备

状态：ACCEPTED_2026-09-03

## Decision
Generation、Embedding、Rerank 优先由 LAN iPhone 提供，不使用收费云 API 作为核心依赖。Qwen 3.6 4B 是当前生成基线。

## Consequences
Backend 必须建立 Model Gateway、queue、priority、timeout；在线与离线任务共享受限设备。具体 embedding/rerank artifact 通过实测选择。

## Revisit
只有手机不能满足可用性/质量目标，才比较 Mac/local cloud 等替代，Domain/Capability Contract 应保持稳定。
