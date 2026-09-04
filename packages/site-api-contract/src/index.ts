/**
 * 文件职责：提供 site-api-contract 的唯一公开导出入口。
 * 所属层：site-api-contract。
 * 关键边界：只重新导出稳定 wire contract，避免 Site 深入依赖 API 内部目录。
 */

export type { HealthResponse } from './health.js';
