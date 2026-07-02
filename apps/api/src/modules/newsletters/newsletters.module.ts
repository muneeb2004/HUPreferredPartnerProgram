/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
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
