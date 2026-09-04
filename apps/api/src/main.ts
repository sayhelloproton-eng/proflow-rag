/**
 * 文件职责：作为 API Composition Root 启动 NestJS + Fastify 服务。
 * 所属层：API Bootstrap。
 * 关键边界：入口只负责组装与启动，不承载领域逻辑；真实业务通过模块和 Context 进入。
 */

import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module.js';
import { loadRuntimeConfig } from './infrastructure/config/runtime-config.js';

async function bootstrap(): Promise<void> {
  const config = loadRuntimeConfig();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableShutdownHooks();
  await app.listen(config.port, config.host);
}

void bootstrap();
