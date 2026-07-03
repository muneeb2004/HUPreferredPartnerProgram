import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AnalyticsEventDto } from './dto/analytics-event.dto';
import { ANALYTICS_CONFIG } from './analytics.constants';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectQueue(ANALYTICS_CONFIG.QUEUE_NAME) private readonly analyticsQueue: Queue
  ) {}

  /**
   * Enqueues an analytics event for background processing.
   * Target execution: <50ms
   */
  async enqueueEvent(event: AnalyticsEventDto): Promise<void> {
    try {
      // Add to BullMQ queue
      await this.analyticsQueue.add(
        'process-event',
        event,
        {
          attempts: ANALYTICS_CONFIG.RETRY_ATTEMPTS,
          backoff: {
            type: 'exponential',
            delay: ANALYTICS_CONFIG.RETRY_DELAY_MS,
          },
          removeOnComplete: true, // Keep Redis clean
          removeOnFail: false,    // Allows inspection of DLQ
        }
      );
    } catch (error) {
      // We log but don't throw to avoid failing the 202 response for analytics (fire-and-forget)
      this.logger.error(`Failed to enqueue analytics event: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
