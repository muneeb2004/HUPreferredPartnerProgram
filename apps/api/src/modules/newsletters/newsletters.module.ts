import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';
import { NewsletterDispatchProcessor, NewsletterDeliveryProcessor } from './newsletter.processor';
import { NewsletterListener } from './newsletter.listener';
import { EmailDeliveryModule } from '../email/email.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'newsletter-dispatch',
    }),
    BullModule.registerQueue({
      name: 'newsletter-delivery',
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 30000, // Strategy: immediate, 30s, 2m...
        },
      },
    }),
    EmailDeliveryModule,
  ],
  controllers: [NewslettersController],
  providers: [
    NewslettersService,
    NewsletterDispatchProcessor,
    NewsletterDeliveryProcessor,
    NewsletterListener,
  ],
})
export class NewslettersModule {}
