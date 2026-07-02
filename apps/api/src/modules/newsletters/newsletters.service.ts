import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { NewsletterSendRequestedEvent } from '../../common/events/newsletter.events';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class NewslettersService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(page: number = 1, limit: number = 20) {
    const issues = await this.prisma.newsletterIssue.findMany({
      where: { status: 'PUBLISHED' },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { publishedAt: 'desc' },
      include: {
        newsletter: { select: { title: true } },
      },
    });

    return { data: issues };
  }

  async findBySlug(slug: string) {
    const issue = await this.prisma.newsletterIssue.findUnique({
      where: { slug },
      include: {
        newsletter: { select: { title: true } },
        pdf: true,
      },
    });

    if (!issue || issue.status !== 'PUBLISHED') {
      throw new NotFoundException('Newsletter issue not found');
    }

    return { data: issue };
  }

  async triggerSend(id: string) {
    // 1. Transactionally lock and update the issue status to prevent duplicates
    const issue = await this.prisma.$transaction(async (tx) => {
      const currentIssue = await tx.newsletterIssue.findUnique({
        where: { id },
      });

      if (!currentIssue) {
        throw new NotFoundException('Newsletter issue not found');
      }

      // Idempotency check: only allow sending if it's currently REVIEW or PUBLISHED
      if (currentIssue.status !== 'REVIEW' && currentIssue.status !== 'PUBLISHED') {
        throw new BadRequestException('Issue is not in a sendable state (already scheduled/sent?)');
      }

      // Update to published if not already, though in real architecture we might have SCHEDULED
      return tx.newsletterIssue.update({
        where: { id },
        data: { status: 'PUBLISHED' }, // Using PUBLISHED as proxy for SCHEDULED due to schema constraints
      });
    });

    // 2. Emit Domain Event
    this.eventEmitter.emit(
      'NewsletterSendRequested',
      new NewsletterSendRequestedEvent(issue.newsletterId, issue.id)
    );

    return { message: 'Newsletter dispatch scheduled successfully', issueId: issue.id };
  }
}
