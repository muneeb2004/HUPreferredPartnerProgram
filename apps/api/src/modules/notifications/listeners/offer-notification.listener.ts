import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../notification.service';
import { OfferExpiringSoonEvent } from '../interfaces';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class OfferNotificationListener {
  private readonly logger = new Logger(OfferNotificationListener.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('offer.expiring_soon')
  async handleOfferExpiringSoonEvent(payload: OfferExpiringSoonEvent) {
    this.logger.log(`Received offer.expiring_soon event for offer ${payload.offerId}`);
    
    // Find all active users for this partner to notify
    const users = await this.prisma.user.findMany({
      where: {
        partnerId: payload.partnerId,
        deletedAt: null,
      }
    });

    for (const user of users) {
      await this.notificationService.send({
        recipientId: user.id,
        type: 'OFFER_EXPIRING_SOON',
        template: 'offer_expiring',
        channels: ['email', 'in_app'],
        data: {
          offerId: payload.offerId,
          title: payload.title,
          endDate: payload.endDate,
          userName: user.name,
        },
      });
    }
  }
}
