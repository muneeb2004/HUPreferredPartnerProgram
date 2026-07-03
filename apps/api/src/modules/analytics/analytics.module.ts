import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsWorker } from './analytics.worker';
import { AnalyticsAggregationService } from './analytics-aggregation.service';
import { AnalyticsReportingService } from './analytics-reporting.service';
import { ANALYTICS_CONFIG } from './analytics.constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ANALYTICS_CONFIG.QUEUE_NAME,
    }),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsWorker, AnalyticsAggregationService, AnalyticsReportingService],
  exports: [AnalyticsService, AnalyticsReportingService],
})
export class AnalyticsModule {}
