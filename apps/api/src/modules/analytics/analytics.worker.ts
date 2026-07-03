import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AnalyticsEventDto } from './dto/analytics-event.dto';
import { ANALYTICS_CONFIG } from './analytics.constants';

@Processor(ANALYTICS_CONFIG.QUEUE_NAME, {
  concurrency: ANALYTICS_CONFIG.WORKER_CONCURRENCY,
})
export class AnalyticsWorker extends WorkerHost {
  private readonly logger = new Logger(AnalyticsWorker.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<AnalyticsEventDto, void, string>): Promise<void> {
    const { eventId, version, eventType, entityId, entityType, metadata, sessionId, timestamp } = job.data;
    const startTime = performance.now();

    try {
      // Append-only write. Idempotent by eventId
      await this.prisma.analyticsEvent.create({
        data: {
          id: eventId,
          version: version ?? 1,
          eventType,
          entityId,
          entityType,
          metadata: metadata || {},
          sessionId,
          createdAt: timestamp ? new Date(timestamp) : new Date(),
        },
      });
      
      const duration = performance.now() - startTime;
      this.logger.debug(`[AnalyticsEvent] Enqueued -> Processed ${eventType} in ${duration.toFixed(2)}ms`);
    } catch (error: any) {
      // P2002 is Prisma's unique constraint failed error code
      if (error.code === 'P2002') {
        this.logger.debug(`Ignored duplicate analytics event: ${eventId}`);
        return; // Success (duplicate handled)
      }
      this.logger.error(`Failed to process event ${eventId}: ${error.message}`);
      throw error; // Will trigger BullMQ retry policy
    }
  }
}
