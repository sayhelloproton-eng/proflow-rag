/**
 * 文件职责：定义 NestJS API 的根模块，当前只组装对外 HTTP Delivery。
 * 所属层：API Composition。
 * 关键边界：这里只做模块装配，不承载 RAG 领域规则或基础设施实现。
 */

import { Module } from '@nestjs/common';

import { HealthController } from './delivery/http/public/health.controller.js';

@Module({
  controllers: [HealthController],
})
export class AppModule {}
