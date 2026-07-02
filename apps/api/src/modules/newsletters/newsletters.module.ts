import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { EmailDeliveryModule } from '../email/email.module';

import { NewsletterListener } from './newsletter.listener';
import { NewsletterDispatchProcessor, NewsletterDeliveryProcessor } from './newsletter.processor';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';


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
