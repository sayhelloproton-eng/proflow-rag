import { Module } from '@nestjs/common';

import { HealthController } from './delivery/http/public/health.controller.js';

@Module({
  controllers: [HealthController],
})
export class AppModule {}
