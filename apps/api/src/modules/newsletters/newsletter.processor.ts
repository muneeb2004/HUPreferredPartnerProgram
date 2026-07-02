/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import * as crypto from 'crypto';

import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job, Queue } from 'bullmq';

import { NewsletterSendingEvent, DeliveryCompletedEvent } from '../../common/events/newsletter.events';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailProvider } from '../email/email.provider';



interface DispatchJobData {
  issueId: string;
}

interface DeliveryJobData {
  issueId: string;
  subscriptionId: string;
  email: string;
}

@Processor('newsletter-dispatch')
export class NewsletterDispatchProcessor extends WorkerHost {
  private readonly logger = new Logger(NewsletterDispatchProcessor.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    @InjectQueue('newsletter-delivery') private deliveryQueue: Queue<DeliveryJobData>,
  ) {
    super();
  }

  async process(job: Job<DispatchJobData>) {
    const { issueId } = job.data;
    this.logger.log(`Processing dispatch for issue ${issueId}`);

    this.eventEmitter.emit('NewsletterSending', new NewsletterSendingEvent(issueId));

    const issue = await this.prisma.newsletterIssue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      throw new Error(`Issue ${issueId} not found`);
    }

    const batchSize = 100;
    let cursor: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const subscribers: { id: string; email: string }[] = await this.prisma.newsletterSubscription.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, email: true },
        take: batchSize,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { id: 'asc' },
      });

      if (subscribers.length === 0) {
        hasMore = false;
        break;
      }

      const jobs = subscribers.map((sub) => ({
        name: `deliver-${issueId}-${sub.id}`,
        data: {
          issueId,
          subscriptionId: sub.id,
          email: sub.email,
        },
        opts: {
          jobId: `deliver-${issueId}-${sub.id}`, // Idempotency key
        },
      }));

      await this.deliveryQueue.addBulk(jobs);

      cursor = subscribers[subscribers.length - 1].id;
      if (subscribers.length < batchSize) {
        hasMore = false;
      }
    }

    this.logger.log(`Completed enqueuing dispatch for issue ${issueId}`);
  }
}

@Processor('newsletter-delivery')
export class NewsletterDeliveryProcessor extends WorkerHost {
  private readonly logger = new Logger(NewsletterDeliveryProcessor.name);

  constructor(
    private prisma: PrismaService,
    private emailProvider: EmailProvider,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async process(job: Job<DeliveryJobData>) {
    const { issueId, subscriptionId, email } = job.data;

    // Check if delivery was already logged (additional idempotency layer)
    const existingLog = await this.prisma.deliveryLog.findFirst({
      where: { issueId, subscriptionId },
    });
    if (existingLog && existingLog.status === 'SENT') {
      this.logger.log(`Skipping already sent delivery for ${subscriptionId}`);
      return;
    }

    const issue = await this.prisma.newsletterIssue.findUnique({
      where: { id: issueId },
      include: { newsletter: true },
    });

    if (!issue) {
      throw new Error(`Issue ${issueId} not found`);
    }

    // Generate specific unsubscribe token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24 * 30); // 30 day expiry for newsletter tokens

    // Wrap in transaction to guarantee consistency
    await this.prisma.$transaction(async (tx) => {
      await tx.unsubscribeToken.deleteMany({
        where: { subscriptionId },
      });

      await tx.unsubscribeToken.create({
        data: {
          subscriptionId,
          tokenHash,
          expiresAt,
        },
      });

      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletters/unsubscribe/confirm?token=${token}`;

      try {
        const success = await this.emailProvider.sendEmail({
          to: email,
          subject: `${issue.newsletter.title}: ${issue.title}`,
          html: `<p>Newsletter Content Here</p><br/><p><a href="${unsubscribeUrl}">Unsubscribe</a></p>`,
        });

        if (!success) {
          throw new Error('Email provider returned failure');
        }

        await tx.deliveryLog.create({
          data: {
            issueId,
            subscriptionId,
            status: 'SENT',
          },
        });

        this.eventEmitter.emit(
          'DeliveryCompleted',
          new DeliveryCompletedEvent(issueId, subscriptionId, 'SENT')
        );
      } catch (error) {
        await tx.deliveryLog.create({
          data: {
            issueId,
            subscriptionId,
            status: 'BOUNCED',
          },
        });

        this.eventEmitter.emit(
          'DeliveryCompleted',
          new DeliveryCompletedEvent(issueId, subscriptionId, 'BOUNCED')
        );

        throw error; // Let BullMQ retry this job
      }
    });
  }
}
