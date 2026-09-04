/**
 * 文件职责：提供公开 API 的最小健康检查端点。
 * 所属层：Delivery / Public HTTP。
 * 关键边界：只暴露服务存活信息，不泄露内部模型、数据库或 RAG 运行细节。
 */

import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@proflow-rag/site-api-contract';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'proflow-rag-api',
      timestamp: new Date().toISOString(),
    };
  }
}
