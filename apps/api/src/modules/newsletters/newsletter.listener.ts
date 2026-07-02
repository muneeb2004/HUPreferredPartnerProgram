import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';

import { 
  NewsletterSendRequestedEvent, 
  NewsletterSendingEvent,
  DeliveryCompletedEvent,
  NewsletterQueuedEvent
} from '../../common/events/newsletter.events';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class NewsletterListener {
  private readonly logger = new Logger(NewsletterListener.name);

  constructor(
    @InjectQueue('newsletter-dispatch') private dispatchQueue: Queue,
    private prisma: PrismaService,
  ) {}

  @OnEvent('NewsletterSendRequested')
  async handleNewsletterSendRequested(event: NewsletterSendRequestedEvent) {
    this.logger.log(`Received send request for issue: ${event.issueId}`);
    
    // Count subscribers for metrics
    const subscriberCount = await this.prisma.newsletterSubscription.count({
      where: { status: 'ACTIVE' },
    });

    // Add to BullMQ with retry strategies
    await this.dispatchQueue.add('send-issue', {
      issueId: event.issueId,
    }, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 30000, // 30s, then exponentially (2m, etc.)
      },
    });

    // We can emit another event that it's queued
    // this.eventEmitter.emit(...) if we injected EventEmitter2
    this.logger.log(`Queued issue ${event.issueId} for ${subscriberCount} subscribers`);
  }

  @OnEvent('NewsletterSending')
  async handleNewsletterSending(event: NewsletterSendingEvent) {
    this.logger.log(`Status update: Sending issue ${event.issueId}`);
    // In a full implementation, update the issue status to SENDING in DB
  }

  @OnEvent('DeliveryCompleted')
  async handleDeliveryCompleted(event: DeliveryCompletedEvent) {
    this.logger.debug(`Delivery logged: Issue ${event.issueId} to Sub ${event.subscriptionId} - ${event.status}`);
  }
}
