import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OfferSchedulerService {
  private readonly logger = new Logger(OfferSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  // Run every hour to check for expired offers
  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredOffers(): Promise<void> {
    this.logger.log('Running expired offers check...');
    const now = new Date();

    try {
      const result = await this.prisma.offer.updateMany({
        where: {
          status: 'PUBLISHED',
          endDate: { lte: now },
          deletedAt: null,
        },
        data: {
          status: 'EXPIRED',
        },
      });

      if (result.count > 0) {
        this.logger.log(`Successfully expired ${result.count} offers.`);
        this.eventEmitter.emit('offers.expired', { count: result.count });
      }
    } catch (error) {
      this.logger.error('Failed to update expired offers', error);
    }
  }

  // Run every day at 00:00 to notify admins about offers expiring in 7 days
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async notifyUpcomingExpirations(): Promise<void> {
    this.logger.log('Checking for offers expiring in 7 days...');
    
    const sevenDaysFromNowStart = new Date();
    sevenDaysFromNowStart.setDate(sevenDaysFromNowStart.getDate() + 7);
    sevenDaysFromNowStart.setHours(0, 0, 0, 0);

    const sevenDaysFromNowEnd = new Date(sevenDaysFromNowStart);
    sevenDaysFromNowEnd.setHours(23, 59, 59, 999);

    try {
      const expiringOffers = await this.prisma.offer.findMany({
        where: {
          status: 'PUBLISHED',
          endDate: {
            gte: sevenDaysFromNowStart,
            lte: sevenDaysFromNowEnd,
          },
          deletedAt: null,
        },
        include: {
          partner: true,
        },
      });

      if (expiringOffers.length > 0) {
        this.logger.log(`Found ${expiringOffers.length} offers expiring in 7 days.`);
        
        for (const offer of expiringOffers) {
          this.eventEmitter.emit('offer.expiring_soon', {
            offerId: offer.id,
            title: offer.title,
            partnerName: offer.partner?.name,
            endDate: offer.endDate,
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to check upcoming expirations', error);
    }
  }
}
