/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/explicit-function-return-type */
import * as crypto from 'crypto';

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { 
  SubscriptionVerifiedEvent, 
  SubscriptionUnsubscribedEvent 
} from '../../common/events/newsletter.events';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailProvider } from '../email/email.provider';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private emailProvider: EmailProvider,
  ) {}

  async subscribe(email: string) {
    // Upsert to handle re-subscriptions or existing pending
    const subscription = await this.prisma.newsletterSubscription.upsert({
      where: { email },
      update: { status: 'PENDING' },
      create: { email, status: 'PENDING' },
    });

    if (subscription.status === 'ACTIVE') {
      return { message: 'Already subscribed' };
    }

    // Generate high entropy token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    // Delete existing tokens for this subscription if any
    await this.prisma.emailVerificationToken.deleteMany({
      where: { subscriptionId: subscription.id },
    });

    await this.prisma.emailVerificationToken.create({
      data: {
        subscriptionId: subscription.id,
        tokenHash,
        expiresAt,
      },
    });

    // Send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletters/verify?token=${token}`;
    await this.emailProvider.sendEmail({
      to: email,
      subject: 'Verify your Newsletter Subscription',
      html: `<p>Please verify your subscription by clicking <a href="${verifyUrl}">here</a>.</p>`,
    });

    return { message: 'Verification email sent' };
  }

  async verify(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const verificationRecord = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { subscription: true },
    });

    if (!verificationRecord || verificationRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.$transaction([
      this.prisma.newsletterSubscription.update({
        where: { id: verificationRecord.subscriptionId },
        data: { status: 'ACTIVE', verifiedAt: new Date() },
      }),
      this.prisma.emailVerificationToken.delete({
        where: { id: verificationRecord.id },
      }),
    ]);

    this.eventEmitter.emit(
      'SubscriptionVerified',
      new SubscriptionVerifiedEvent(verificationRecord.subscriptionId)
    );

    return { success: true };
  }

  async requestUnsubscribe(email: string) {
    const subscription = await this.prisma.newsletterSubscription.findUnique({
      where: { email },
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      // Idempotent/silent success for security
      return { message: 'If you are subscribed, you will receive an unsubscribe email shortly.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    // Ensure we delete any existing unsubscribe tokens for this subscription
    await this.prisma.unsubscribeToken.deleteMany({
      where: { subscriptionId: subscription.id },
    });

    await this.prisma.unsubscribeToken.create({
      data: {
        subscriptionId: subscription.id,
        tokenHash,
        expiresAt,
      },
    });

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/newsletters/unsubscribe/confirm?token=${token}`;
    await this.emailProvider.sendEmail({
      to: email,
      subject: 'Unsubscribe from Newsletter',
      html: `<p>Please confirm your unsubscription by clicking <a href="${unsubscribeUrl}">here</a>.</p>`,
    });

    return { message: 'If you are subscribed, you will receive an unsubscribe email shortly.' };
  }

  async unsubscribe(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await this.prisma.unsubscribeToken.findUnique({
      where: { tokenHash },
      include: { subscription: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired unsubscribe token');
    }

    await this.prisma.$transaction([
      this.prisma.newsletterSubscription.update({
        where: { id: tokenRecord.subscriptionId },
        data: { status: 'UNSUBSCRIBED' },
      }),
      this.prisma.unsubscribeToken.delete({
        where: { id: tokenRecord.id },
      }),
    ]);

    this.eventEmitter.emit(
      'SubscriptionUnsubscribed',
      new SubscriptionUnsubscribedEvent(tokenRecord.subscriptionId)
    );

    return { success: true };
  }
}
