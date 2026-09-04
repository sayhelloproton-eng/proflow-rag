/**
 * 文件职责：定义 Site 与 API 共享的 health wire contract。
 * 所属层：site-api-contract。
 * 关键边界：这里只允许跨进程 DTO，不放 Domain Model 或内部服务类型。
 */

export interface HealthResponse {
  status: 'ok';
  service: 'proflow-rag-api';
  timestamp: string;
}
