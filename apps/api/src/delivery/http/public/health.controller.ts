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
